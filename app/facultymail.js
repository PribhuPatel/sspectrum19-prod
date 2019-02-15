const mongoose = require('mongoose');
var nodemailer = require('nodemailer');
var handlebars = require('handlebars');
var {a} = require('./falculty');
const fs = require('fs');
var config={
    service: 'gmail',
        auth:
        {
        user: 'spectrum@adit.ac.in',
        // user:'np9532788@gmail.com',
        // pass:'mnbvcxz@987654321'
      pass: 'Spec1700@adit2019'
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
            html : htmlToSend
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
    let mail = await sendmail('/faculty-mail.html',a[i][2],"Invitation for Inauguration Ceremony of Spectrum'19",replacement);
    console.log("Faculty Mail sended to "+ a[i][2]);
    } catch(e) {
        console.log("Mail send failed to " + a[i][2]);
    }
    console.log(i);
    i++;
    if(i<a.length){
        setTimeout(nt2,5000);
    }
}




nt3();

console.log("done");