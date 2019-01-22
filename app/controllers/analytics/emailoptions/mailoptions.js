var {Participants, Entries, Events, Colleges, GlobalVars,Users,Revenue,SingleEntries,Packages} = require('../../../middlewares/schemas/schema');
var {getSingleData,getManyData, getManyDataWithPopulate,getCount,getDateWiseCount,localDate,getSingleDataWithPopulate, sendmail} = require('../../../utils/helpers/general_one_helper');

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