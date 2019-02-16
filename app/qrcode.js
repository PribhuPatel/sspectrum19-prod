const fs = require('fs');
const QRCode = require('qrcode');
const mongoose = require('mongoose');
var nodemailer = require('nodemailer');
var handlebars = require('handlebars');

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

var sendmail=async (filepath,email,subject,replacements,path)=>{
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
                filename: 'spectrum.png',
                path: '../public/partiqr/'+path // stream this file
            },{   // file on disk as an attachment
                filename: 'spectrum-schedule.pdf',
                path: 'schedule.pdf' // stream this file
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
var config2= {mongoDB : {
    user: 'admin',
    password: 'shreeji1',
    // host : '34.73.92.20',
    host:'ds135003.mlab.com',
    port:35003,
    // host:'localhost',
    // port : 27017,
    database : 'spectrum'
}
}
const url = `mongodb://${config2.mongoDB.user}:${config2.mongoDB.password}@${config2.mongoDB.host}:${config2.mongoDB.port}/${config2.mongoDB.database}`;

var {Participants} = require('./middlewares/schemas/schema');
var {getSingleData, getManyDataWithPopulate, getManyData} = require('./utils/helpers/general_one_helper');

var mongocon = async ()=>{
    if (mongoose.connection.readyState === 1) return 1;
  /* Get Mongoose to use the global promise library */
  mongoose.Promise = global.Promise;
  /* connecting to MongoDB */
 await mongoose.connect(url,{ useCreateIndex: true,useNewUrlParser: true });
  const db = mongoose.connection;
//   console.log(db);
  
  // Bind connection to error event (to get notification of connection errors)
  db.on('error', (error) => { next(error); });
  db.on('open', () => {
      return 1
  });
}

var i=0;
var participants;
var nt3=async()=>{
    await mongocon();
console.log(await mongocon());
    participants = await getManyData(Participants,{},'_id firstname lastname email');
    // nt();
    nt2();
}


var nt2 =async()=>{

    try{
    await generateQr('../public/partiqr/'+(participants[i]._id)+'.png',participants[i]._id.toString());
    // await generateQr('partiqr/'+(participants[i].firstname+'-'+participants[i].lastname)+'.png',participants[i]._id.toString());
    let replacement = {
        name: participants[i].firstname + " " + participants[i].lastname,
        qr: participants[i]._id.toString()
    }
    let mail = await sendmail('/qr-code.html',participants[i].email,"Spectrum'19 QR Code",replacement,participants[i]._id.toString()+'.png');
    console.log("QR Mail sended to "+ participants[i].email);
    } catch(e) {
        console.log("QR Mail send failed to " + participants[i].email);
    }
    console.log(i);
    i++;
    if(i<3){
        setTimeout(nt2,5000);
    }
}

nt3();

console.log("done");





























var generateQr =  (path,text)=>{
    return new Promise(async (resolve,reject)=>{
        await QRCode.toFile(path,text, {
        }, function (err) {
          if (err) throw reject(err)
          resolve()
        })
    })
}
