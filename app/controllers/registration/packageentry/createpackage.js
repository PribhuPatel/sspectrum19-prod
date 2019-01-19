

var {Events, Entries, Users, Participants,Colleges,Packages, SingleEntries} = require('../../../middlewares/schemas/schema');
var {getSingleData, localDate, sendmail} = require('../../../utils/helpers/general_one_helper');

module.exports = {
createPackage: async (req, res) => {
        let date = localDate();
    let payment = 0;
    let user = await getSingleData(Users,{phone: req.user.phone},'_id today_payment registered phone name');
    var event1  =req.body.tech1;
    var event2 = req.body.tech2;
    var event3 = req.body.nontech;
    let participant = await getSingleData(Participants,{phone: req.body.participant},'_id firstname lastname college events payment package email phone');

  let participants = [];
  participants.push(participant._id);
  let college = await getSingleData(Colleges,{_id: participant.college},'registered');
  
  
  var leader_id = null;
  var event1event = await getSingleData(Events,{_id: event1.intrested_event});
  var event2event = await getSingleData(Events,{_id: event2.intrested_event});
  var event3event = await getSingleData(Events,{_id: event3.intrested_event});
  
let oldentry = await getSingleData(Entries,{$and:[{$or:[{event: event1event._id},{event: event2event._id},{event: event3event._id}]}, {participants : { "$in" : participants}}]});

    if(oldentry === null && participant.package === null){
    if(event1event.available_entries != 0 && event2event.available_entries != 0 && event3event.available_entries != 0){
      let event1entry =  await createNewEntry(event1event,event1,participant,participants,user,date,college);
      let event2entry =  await createNewEntry(event2event,event2,event1entry.participant,participants,event1entry.user,date,event1entry.college);
      let event3entry =  await createNewEntry(event3event,event3,event2entry.participant,participants, event2entry.user,date,event2entry.college);

      user = event3entry.user;
      college = event3entry.college;
      participant = event3entry.participant;

        let newPackage = new Packages({
            tech1: event1entry.id,
            tech2: event2entry.id,
            nontech:event3entry.id,
            participant:participant._id,
            created_date:date
        })
        await newPackage.save(async (err)=>{
            if(err){
                console.log(err);
                
        return res.json({status: false, entryadded: false, entryFull:false, alreadyAdded: false,message:"Error Occcurd. Contact developer"});
            } else {
                
        participant["payment"] = participant["payment"] + 50;
        participant["package"] = newPackage._id;
        user["today_payment"] = user["today_payment"] + 50;
        
        let singleEntry = new SingleEntries({
            created_time:date,
            participant:participant._id,
            package: newPackage._id,
            createby: user._id,
            payment:50
        })
        await singleEntry.save();
        await user.save();
        await college.save();
        await participant.save();
        
        let replacements = {
            name: participant.firstname + " " + participant.lastname,
            tech1:event1event.name,
            tech2:event2event.name,
            nontech:event3event.name,
            token: singleEntry._id
        }
        console.log(participant.phone +":"+participant.firstname + " package created by "+user.phone+":"+user.name + " at "+date);
        try{
        let mail = await sendmail('/package-mail.html',participant.email,"Spectrum'19 Package Verification",replacements);
        console.log("Event Entry Mail sended to "+ participant.email);
        } catch(e) {
            console.log("Mail send failed to " + participant.email);
        }
        return res.json({status: true, entryadded: true, entryFull:false, alreadyAdded: false,message:"Package added",payment:50});
    }
        }); 
                    
    } else {
        return res.json({status: true, entryadded: false, entryFull:true, alreadyAdded: false,message:"Event Entry Full"});
    }
} else {
    return res.json({status: true, entryadded: false, entryFull:false, alreadyAdded: true,message:"Participant already added in event or package registered by participant"});
}
}
};

var createNewEntry = async (event,intrested_event,participant,participants,user,date,college,entry)=>{
    return new Promise(async (resolve, reject) =>{
        if(intrested_event.leader_phone != ''){
            var leader_id = await getSingleData(Participants,{phone: intrested_event.leader_phone});
            let entry = await getSingleData(Entries,{$and:[{team_leader: leader_id},{event: event._id},{participants : { "$nin" : participants}}]},'participants payment');
            if(entry.participants.length < event.max_members){
            participant.events.push(event._id);
            // participant["payment"] = participant["payment"] + event.price;
                    
            entry.participants.push(participant._id);
            // entry["payment"] = entry["payment"] + event.price;
            await entry.save();
        let returnVar = {
                id: entry._id,
                participant:participant,
                user:user,
                college: college,
                result:true
            }
            // if(err)? resolve():
            resolve(returnVar);
        }
            else{
               let returnVar = {
                   result: false
               }
                resolve(returnVar);
            }
            
        } else {

            var newEntry = new Entries({
                created_by: user._id,
                team_leader: participant._id,
                event: event._id,
                participants: participants,
                created_date:date
            });
        
           await newEntry.save(async (err)=>{
                if(err) {
                    console.error(err);
                    let returnVar = {
                        result: false
                    }
                    resolve(returnVar);
                }
                else{
                    participant.events.push(event._id);
                   event["available_entries"] = event["available_entries"] - 1;
                    user.registered.entries.push(newEntry._id);
                    college.registered.entries.push(newEntry._id);
                   await event.save();
            
                    let returnVar = {
                        id: newEntry._id,
                        participant:participant,
                        user:user,
                        college: college,
                        result:true
                    }
                    resolve(returnVar);
                }
            });
        }
    });
    
}