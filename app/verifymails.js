const mongoose = require('mongoose');
var nodemailer = require('nodemailer');
var handlebars = require('handlebars');
const fs = require('fs');
var config={
    service: 'gmail',
        auth:
        {
        // user: 'spectrum@adit.ac.in',
        user:'np9532788@gmail.com',
        pass:'mnbvcxz@987654321'
    //   pass: 'Spec1700@adit2019'
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

var {Events, Entries, Users, Participants,Colleges, SingleEntries} = require('./middlewares/schemas/schema');
var {getSingleData, getManyDataWithPopulate} = require('./utils/helpers/general_one_helper');
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
var entries;
var packages;

var i=30;
var nt3=async()=>{
    await mongocon();
console.log(await mongocon());

 entries = await getManyDataWithPopulate(SingleEntries,{$and:[{verify:false},{package:null}]},'participant event','participant event','firstname lastname name price email phone');
 packages = await populateentry(SingleEntries,{$and:[{verify:false},{entry:null}]},'package participant');
//  packages = packages[0];
//  console.log(packages[0].package.tech1);
//  console.log(entries);
    
    nt();
    
}
// var i=0;
var nt =async()=>{
    // return new Promise(async(resolve, reject) =>{
        // for(let i=0;i<entries.length;i++){
        // console.log(entries[i]);
        
let replacements = {
    name: entries[i].participant.firstname + " " + entries[i].participant.lastname,
    event: entries[i].event.name,
    price: entries[i].event.price,
    token: entries[i]._id
}
            try{
                let mail = await sendmail('/utils/helpers/single-event.html',entries[i].participant.email,"Spectrum'19 Event Verification",replacements);
            console.log(entries[i].participant.phone +":"+entries[i].participant.firstname + " event entry has been");
            resolve("sended")
                } catch(e) {
                    console.log("Mail send failed to " + entries[i].participant.email);
                }
                i++;
    if(i<entries.length){
        setTimeout(nt,2500);
    }
            // }
// })
}

// var packages = await SingleEntries.aggregate($match}SingleEntries,{$and:[{verify:false},{entry:null}]},'participant','participant','firstname lastname email phone');
// i=0;
var nt2 =async()=>{
    // return new Promise(async(resolve, reject) =>{
        // for(let i=0;i<packages.length;i++){
            // console.log(packages[i].package);
            
    let replacement = {
        name: packages[i].participant.firstname + " " + packages[i].participant.lastname,
        tech1: packages[i].package.tech1.event.name,
        tech2: packages[i].package.tech2.event.name,
        nontech: packages[i].package.nontech.event.name,
        token: packages[i]._id
    }
    // console.log(participant.phone +":"+participant.firstname + " package created by "+user.phone+":"+user.name + " at "+date);
    try{
    let mail = await sendmail('/utils/helpers/package-mail.html',packages[i].participant.email,"Spectrum'19 Package Verification",replacement);
    console.log("Package Mail sended to "+ packages[i].participant.email);
    resolve("sended");
    } catch(e) {
        console.log("Mail send failed to " + packages[i].participant.email);
    }
    // i++;
    // if(i<packages.length){
    //     setTimeout(await nt2,2500);
    // }
// }
// })
}

// var populateEntries = async(Collection, query,fields)=>{
//     return new Promise(async (resolve, reject) =>{
//   await Collection.
//     find(query,fields).
//     populate([{
//     path: 'entry',
//     select:'team_leader participants',
//     populate:[{path:'event',select:'name'},{path:'participants',select:'firstname lastname'}] 

//     }]).exec((err,result)=>{
//         (err ? reject(err) : resolve(result))
//     });
//     })
// }

var populateentry = async(Collection, query,fields)=>{
    return new Promise((resolve, reject) =>{
  Collection.
    find(query,fields).
    populate([{
    path: 'package',
    populate: [{ path: 'tech1',select:'event',populate:[{path:'event',select:'name'}] },
    { path: 'tech2',select:'event',populate:[{path:'event',select:'name'}] },
    { path: 'nontech',select:'event',populate:[{path:'event',select:'name'}] }]
    },{
        path:'participant',select:'firstname lastname phone email'
    }]).exec((err,result)=>{
        (err ? reject(err) : resolve(result))
    });
    })
}



nt3();

console.log("done");