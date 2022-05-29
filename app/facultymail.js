const mongoose = require('mongoose');
var nodemailer = require('nodemailer');
var handlebars = require('handlebars');
var {a} = require('./falculty');
const fs = require('fs');
var config={
    service: 'gmail',
        auth:
        {

        user: 'random@adit.ac.in',
        pass: 'random'
    }
}

//Include below line at mailer file
var transporter = nodemailer.createTransport(config);


var readHTMLFile = function(path, callback) {
    fs.readFile(path, {encoding: 'utf-8'}, function (err, html) {
        if (err) {
            throw err;
            callback(err);
        }
        else {
            callback(null, html);
        }
    });
};

var sendmail=async (filepath,email,subject,replacements)=>{
    return new Promise(async (resolve, reject) =>{
    await readHTMLFile(__dirname + filepath,async function(err, html) {
        var template = handlebars.compile(html);
        var htmlToSend = template(replacements);
        var mailOptions = {
            from: 'spectrum@adit.ac.in',
            to : email,
            subject : subject,
            html : htmlToSend,
            attachments:[{   // file on disk as an attachment
                filename: 'Spectrum19-Schedule.pdf',
                path: './spectrum-schedule_2.pdf' // stream this file
            }]
        };
        await transporter.sendMail(mailOptions, function (error, response) {
            if (error) {
                console.log(error);
            } else{
        (error? reject(error) : resolve(response));
            }
        });
    });
})
}

var i=0;
var nt3=async()=>{

    nt2();
}

var nt2 =async()=>{
    let replacement = {
        name: a[i][0] + ' '+ a[i][1],
    }
    try{
    let mail = await sendmail('/faculty-schedule.html',a[i][3],"Spectrum'19 Schedule",replacement);
    console.log("Faculty Schedule Mail sended to "+ a[i][3]);
    } catch(e) {
        console.log("Mail send failed to " + a[i][3]);
    }
    console.log(i);
    i++;
    if(i<a.length){
        setTimeout(nt2,5000);
    }
}




nt3();

console.log("done");
