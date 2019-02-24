
const mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;
var nodemailer = require('nodemailer');
var handlebars = require('handlebars');

var fs = require('fs')
var path = require('path')
var Canvas = require('canvas')

function fontFile (name) {
  return path.join(__dirname, '/', name)
}
Canvas.registerFont(fontFile('font.ttf'), {family: 'Hanzel Wide Normal'})
Canvas.registerFont(fontFile('arial.ttf'), {family: 'Arial'})

Image = Canvas.Image;
img = new Image();
img.src = './particerti-min.jpg';


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

var sendmail=async (filepath,email,subject,replacements,attachments)=>{
    return new Promise(async (resolve, reject) =>{
    await readHTMLFile(__dirname + filepath,async function(err, html) {
        var template = handlebars.compile(html);
        var htmlToSend = template(replacements);
        var mailOptions = {
            from: 'spectrum@adit.ac.in',
            to : email,
            subject : subject,
            html : htmlToSend,
            // attachments:[{   // file on disk as an attachmen
            //     filename: 'Spectrum19.png',
            //     path: '../public/partiqr/'+path // stream this file
            // },{   // file on disk as an attachment
            //     filename: 'Spectrum19-Schedule.pdf',
            //     path: './Spectrum-Schedule.pdf' // stream this file
            // }]
            attachments:attachments
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

var {Participants,Events} = require('./middlewares/schemas/schema');
var {getManyDataWithPopulate} = require('./utils/helpers/general_one_helper');

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
    participants = await getManyDataWithPopulate(Participants,{createby:{$ne:ObjectId("5c4032db44dcf010af3c8cf6")}},'events','_id firstname lastname email events','name');
    nt2();
}


var nt2 =async()=>{
    var attachments = [];


    for(let j=0;j<participants[i].events.length;j++){

let canvas = Canvas.createCanvas(3508, 2480)
let ctx = canvas.getContext('2d')


ctx.clearRect(0, 0, canvas.width, canvas.height);
ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

ctx.fillStyle = 'black';
ctx.textAlign = 'center';
        let ctr = ctx;
        await generateCerti(ctr,canvas,participants[i].firstname + " " +participants[i].lastname,participants[i].events[j].name,participants[i]._id,j);
        attachments.push({
            filename:participants[i].events[j].name +'.jpg',
            path: '../public/particert/'+participants[i]._id + '_'+j+'.jpg'
        })
    }
    try{
    let replacement = {
        name: participants[i].firstname + " " + participants[i].lastname,
        // qr: participants[i]._id.toString()
    }
    let mail = await sendmail('/certi.html',participants[i].email,"Spectrum'19 Certificates",replacement,attachments);
    console.log("Certificates sended to "+ participants[i].email);
    } catch(e) {
        console.log("Certificates send failed to " + participants[i].email);
    }
    console.log(i);
    
// doc.end()
    i++;
    if(i<4){
        setTimeout(nt2,5000);
    }
}

nt3();

var generateCerti = (ctr,canvas,parti_name,event_name,id,number)=>{
    return new Promise(async (resolve,reject)=>{
        
ctr.font = '80pt Hanzel Wide Normal'
ctr.fillText(parti_name,2200, 1200)

ctr.font = '60pt Hanzel Wide Normal'
ctr.fillText(event_name,2110, 1505)

// ObjectId("5c401610c63da006f5e3336e")

ctr.font = '40pt Arial'
ctr.fillText(id,2260, 65)

// canvas.createPNGStream().pipe(fs.createWriteStream(path.join(__dirname, '../public/particert/image1.png')))
canvas.createJPEGStream().pipe(fs.createWriteStream(path.join(__dirname, '../public/particert/'+id+'_'+number+'.jpg')))
   resolve()

    })
}
