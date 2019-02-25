var {Participants, Entries, Events, Colleges, GlobalVars,Users,Revenue,SingleEntries,Packages} = require('../../../middlewares/schemas/schema');
var {getSingleData,getManyData, getManyDataWithPopulate,getCount,getDateWiseCount,localDate,getSingleDataWithPopulate, sendmail} = require('../../../utils/helpers/general_one_helper');


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
  Canvas.registerFont(fontFile('../../../font.ttf'), {family: 'Hanzel Wide Normal'})
  Canvas.registerFont(fontFile('../../../arial.ttf'), {family: 'Arial'})
  
    
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
  
  
module.exports = {
    changeEmail: async (req, res,next) => {
    var phone = req.body.phone;
    let email = req.body.email;
    let replacements;
    var error=false;
    // await Participants.updateOne({phone:phone}, {$set:{email:email}}, {new: false}, (err, doc) => {
    //     if (err) {
    //         console.log("Something wrong when updating data!");
    //         return res.json({status:true, error:true})
    //     }
    //     console.log(doc);
    //     if(doc.n==1){
    //     // return res.json({status:true, changed:true})

    //     } else {
    //         // return res.json({status:true, changed:false})           
    //     }
    // });
    
    let participant = await participantData(Participants,{phone: phone},'email phone package firstname lastname')
    participant[0]["email"] = email;
    participant[0].save((err)=>{
        if(err){
            error = true
        }
    });
    // let participant[0] = await getSingleDataWithPopulate(Participants,{phone: phone},'college','email firstname lastname phone college','name');
   if(error ==false){
    replacements = {
        name: participant[0].firstname + " " + participant[0].lastname,
        email: participant[0].email,
        mobile: participant[0].phone,
        college: participant[0].college.name
    }
    try{
    let mail = await sendmail('/participant.html',participant[0].email,"You have Registered for Spectrum\'19",replacements);
    console.log("Create participant Mail sended to "+ participant[0].email);
    } catch(e) {
        
        error = true
    console.log("Mail send failed to " + participant[0].email);
    }
  
    let events = await getManyDataWithPopulate(SingleEntries,{participant:participant[0]._id},'event','event package','name price');
    for(let i=0;i<events.length;i++){
        let replacements = {}
        if(events[i].package ==null){
        replacements = {
            name: participant[0].firstname + " " + participant[0].lastname,
            event:events[i].event.name,
            price: events[i].event.price,
            token: events[i]._id
        }
        //    console.log("event mail send to correct email of" + participant[0].firstname + " "+ participant[0].lastname);
           try{
            let mail = await sendmail('/single-event.html',participant[0].email,"Spectrum'19 Event Verification",replacements);
            console.log("Event Entry Mail sended to correct email "+ participant[0].email);
            } catch (e){
                
            error = true
                console.log("Mail send failed to correct email " + participant[0].email);
            }
    
} else {
    replacements = {
        name: participant[0].firstname + " " + participant[0].lastname,
        tech1: participant[0].package.tech1.event.name,
        tech2: participant[0].package.tech2.event.name,
        nontech: participant[0].package.nontech.event.name,
        token: events[i]._id
    }
    // console.log("package mail send to correct email of" + participant[0].firstname + " "+ participant[0].lastname);
    try{
    mail = await sendmail('/package-mail.html',participant[0].email,"Spectrum'19 Package Verification",replacements);
    console.log("package Mail sended to correct email "+ participant[0].email);
    } catch(e) {
        
        error = true
        console.log("Mail send failed to correct email " + participant[0].email);
    }
}
    }
}
return res.json({status:true,error:error})
}
,
    sendParticipantMail: async(req,res)=>{
        let phone = req.body.phone;
        let participant = await getSingleDataWithPopulate(Participants,{phone: phone},'college','email firstname lastname phone college','name');
        let replacements = {
            name: participant[0].firstname + " " + participant[0].lastname,
            email: participant[0].email,
            mobile: participant[0].phone,
            college: participant[0].college.name
        }
        try{
        let mail = await sendmail('/participant.html',participant[0].email,"You have Registered for Spectrum\'19",replacements);
        console.log("Create participant Mail sended to "+ participant[0].email);
        } catch(e) {
            
        console.log("Mail send failed to " + participant[0].email);
        }
        return res.json({status: true, addParticipant: true, alreadyAdded:false});
    },
    sendAddEventAndPackageMail: async(req,res)=>{
        let phone = req.body.phone;
        let participant = await participantData(Participants,{phone: phone},'email phone package firstname lastname')
        // let participant = await getSingleDataWithPopulate(Participants,{phone: phone},'package','email phone package firstname lastname','tech1 nontech tech2');
        // if(package!=null){
        //     let packageevent = await getManyDataWithPopulate(Entries,{$or:[{_id:tech1},{_id:tech2},{_id:nontech}]},'event','name')
        //     replacements = {
        //                 name: participant.firstname + " " + participant.lastname,
        //                 tech1:packageevent.name,
        //                 tech2:event2event.name,
        //                 nontech:event3event.name,
        //                 token: singleEntry._id
        //             }
        //             console.log(participant.phone +":"+participant.firstname + " package created by "+user.phone+":"+user.name + " at "+date);
        //             try{
        //             let mail = await sendmail('/package-mail.html',participant.email,"Spectrum'19 Package Verification",replacements);
        //             console.log("Event Entry Mail sended to "+ participant.email);
        //             } catch(e) {
        //                 console.log("Mail send failed to " + participant.email);
        //             }
        //         }
        // }
        let events = await getManyDataWithPopulate(SingleEntries,{participant:participant[0]._id},'event','name');
        for(let i=0;i<events.length;i++){
            let replacements = {}
            if(events[i].package ==null){
            replacements = {
                name: participant[0].firstname + " " + participant[0].lastname,
                event:events[i].event.name,
                price: events[i].event.price,
                token: events[i]._id
            }
               console.log("event mail send to correct email of" + participant[0].firstname + " "+ participant[0].lastname);
               try{
                let mail = await sendmail('/single-event.html',participant[0].email,"Spectrum'19 Event Verification",replacements);
                console.log("Event Entry Mail sended to correct email "+ participant[0].email);
                } catch (e){
                    console.log("Mail send failed to correct email " + participant[0].email);
                }
        
    } else {
        // let packageevent= await getSingleDataWithPopulate(Packages,{participant:participant._id},'tech1 tech2 nontech');
        // let packageevent = await getManyDataWithPopulate(Packages,{participant:participant[0]._id},'tech','name')
        replacements = {
            name: participant[0].firstname + " " + participant[0].lastname,
            tech1: participant[0].package.tech1.event.name,
            tech2: participant[0].package.tech2.event.name,
            nontech: participant[0].package.nontech.event.name,
            token: events[i]._id
        }
        console.log("package mail send to correct email of" + participant[0].firstname + " "+ participant[0].lastname);
        try{
        let mail = await sendmail('/package-mail.html',participant[0].email,"Spectrum'19 Package Verification",replacements);
        console.log("package Mail sended to correct email "+ participant[0].email);
        } catch(e) {
            console.log("Mail send failed to correct email " + participant[0].email);
        }
    }

    }
},
    changeNameAndSendCerti: async(req,res)=>{

        var phone = req.body.phone;
        let email = req.body.email;
        let firstname = req.body.firstname;
        let lastname = req.body.lastname;
        let replacements;
      var error=false;

        let participant = await getSingleDataWithPopulate(Participants,{phone: phone},'events','email firstname lastname events','name');
        participant["email"] = email;
        participant["firstname"]=firstname;
        participant["lastname"]=lastname;
        participant.save((err)=>{
        if(err){
            console.log(err);
            error = true
        }
        });
        if(error ==false){
            
    var attachments = [];


    for(let j=0;j<participant.events.length;j++){

    let canvas = Canvas.createCanvas(3508, 2480)
    let ctx = canvas.getContext('2d')


    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
        // img.onload =async function() { 
           let img = await loadImage();
            console.log("asd");
            
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            ctx.fillStyle = 'black';
    ctx.textAlign = 'center';
        let ctr = ctx;
        await generateCerti(ctr,canvas,participant.firstname + " " +participant.lastname,participant.events[j].name,participant._id,j);
        
    attachments.push({
            filename:participant.events[j].name +'.jpg',
            // path: '../../../../public/particert/'+participant._id + '_'+j+'.jpg'
            path: 'public/particert/'+participant._id + '_'+j+'.jpg'
        
        })
    
    try{
    let replacement = {
        name: participant.firstname + " " + participant.lastname,
        // qr: participants[i]._id.toString()
    }
    let mail = await sendmail2('/../../../../certi.html',participant.email,"Spectrum'19 Certificates",replacement,attachments);
    console.log("Certificates sended to "+ participant.email);
    } catch(e) {
        console.log("Certificates send failed to " + participant.email);
       console.log(e);
       
        // return res.json({status:true,error:error})
    }

}

return res.json({status:true,error:error,name:participant.firstname});
        } else {
            return res.json({status:true,error:error})
        } 
    }
    
}


var participantData = async(Collection, query,fields)=>{
    return new Promise((resolve, reject) =>{
  Collection.
    find(query,fields).
    populate([{
    path: 'package',
    populate: [{ path: 'tech1',select:'event',populate:[{path:'event',select:'name'}] },
    { path: 'tech2',select:'event',populate:[{path:'event',select:'name'}] },
    { path: 'nontech',select:'event',populate:[{path:'event',select:'name'}] }]
    },{
        path:'college',
        select:'name'
    }]).exec((err,result)=>{
        (err ? reject(err) : resolve(result))
    });
    })
}




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

var sendmail2=async (filepath,email,subject,replacements,attachments)=>{
    return new Promise(async (resolve, reject) =>{
    await readHTMLFile(__dirname + filepath,async function(err, html) {
        var template = handlebars.compile(html);
        var htmlToSend = template(replacements);
        var mailOptions = {
            from: 'spectrum@adit.ac.in',
            to : email,
            subject : subject,
            html : htmlToSend,
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



    

var generateCerti = (ctr,canvas,parti_name,event_name,id,number)=>{
    return new Promise(async (resolve,reject)=>{
        
ctr.font = '80pt Hanzel Wide Normal'
ctr.fillText(parti_name,2200, 1200)

ctr.font = '60pt Hanzel Wide Normal'
ctr.fillText(event_name,2110, 1505)

// ObjectId("5c401610c63da006f5e3336e")

ctr.font = '40pt Arial'
ctr.fillText(id,2260, 65)

// canvas.createJPEGStream().pipe(fs.createWriteStream(path.join(__dirname, 'image1.jpg')))
canvas.createJPEGStream().pipe(fs.createWriteStream('public/particert/'+id+'_'+number+'.jpg'))
   resolve()

    })
}

function loadImage () {
    return new Promise((resolve, reject) => {
      let img = new Canvas.Image()
      img.onload = () => resolve(img)
      img.onerror = () => reject(new Error('Failed to load image'))
  
img.src = 'particerti-min.jpg';
    //   })
    })
  }