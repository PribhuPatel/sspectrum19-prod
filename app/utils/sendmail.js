var nodemailer = require('nodemailer');

//const config = require('../utils/config');
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

module.exports = {
    // readHTMLFile,
    transporter,config
//     sendMail : async(toMail,subject,bodyHtml)=>
//     {
//     var mailOptions = {
//         from: 'markhentony@gmail.com',
//         to: toMail,
//         subject: subject,
//        // text: 'That was easy!',
//         html: 'Hello World'
//     };

//     transporter.sendMail(mailOptions, function (error, info) {
//         if (error) {
//             console.log(error);
//         } else {
//             console.log('Email sent: ' + info.response);
//         }
//     })
// }
}
