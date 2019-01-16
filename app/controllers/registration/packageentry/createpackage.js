

var {Events, Entries, Users, Participants,Colleges,Packages, SingleEntries} = require('../../../middlewares/schemas/schema');
var {getSingleData, localDate, sendmail} = require('../../../utils/helpers/general_one_helper');

module.exports = {
createPackage: async (req, res) => {
    // try{
        console.log(req.body);
        let date = localDate();
    let payment = 0;
    let user = await getSingleData(Users,{phone: req.user.phone},'_id today_payment registered');
    var event1  =req.body.tech1;
    var event2 = req.body.tech2;
    var event3 = req.body.nontech;
    //console.log(req.body.team_members);
    let participant = await getSingleData(Participants,{phone: req.body.participant},'_id college events payment package email');

  let participants = [];
  participants.push(participant._id);
  let college = await getSingleData(Colleges,{_id: participant.college},'registered');
  
  
  var leader_id = null;
  var event1event = await getSingleData(Events,{_id: event1.intrested_event});
  var event2event = await getSingleData(Events,{_id: event2.intrested_event});
  var event3event = await getSingleData(Events,{_id: event3.intrested_event});
  
  
//   let oldentry = await getSingleData(Entries,{$or:[{$and:[{event: event1event._id},{participants : { "$in" : participants}}]}]});

let oldentry = await getSingleData(Entries,{$and:[{$or:[{event: event1event._id},{event: event2event._id},{event: event3event._id}]}, {participants : { "$in" : participants}}]});

console.log(oldentry);
//   let oldentry2 = await getSingleData(Entries,{$and:[{event: event2event._id},{participants : { "$in" : participants}}]});
//   let oldentry3 = await getSingleData(Entries,{$and:[{event: event3event._id},{participants : { "$in" : participants}}]});
    // let participants = [];
    // let partifull = [];
    // let parti = {};
  //  for(i=0;i<events.length<i++){
    
    // payment1 = event1event.price;
    // payment2 = event2event.price;
    // payment3 = event3event.price;

    
    // user["today_payment"] = user["today_payment"] + event.price; 

    // participant.save();

    // user.save();

    if(oldentry === null && participant.package === null){
    if(event1event.available_entries != 0 && event2event.available_entries != 0 && event3event.available_entries != 0){
        console.log("asasdadasdada");
      let event1entry =  await createNewEntry(event1event,event1,participant,participants,user,date,college);
      console.log(event1entry);
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
        // console.log("asasdadasdasaaaaaaaaaaaaaaada");
        await newPackage.save(async (err)=>{
            if(err){
                console.log(err);
            } else {
                
        participant["payment"] = participant["payment"] + 50;
        participant["package"] = newPackage._id;
        user["today_payment"] = user["today_payment"] + 50;
        
        let singleEntry = new SingleEntries({
            created_time:date,
            participant:participant._id,
            // event: event._id,
            // entry: entry._id,
            package: newPackage._id
        })
        await singleEntry.save();
        await user.save();
        await college.save();
        await participant.save();
        try{
        let mail = await sendmail('/packageverify.html',participant.email,"Spectrum'19 Package Verification",{token:singleEntry._id});
        console.log(mail);
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
            // let oldentry  = await getSingleData(Entries, {$and:[{event: event._id},{participants : { "$in" : participants}}]});
            let entry = await getSingleData(Entries,{$and:[{team_leader: leader_id},{event: event._id},{participants : { "$nin" : participants}}]},'participants payment');
            if(entry.participants.length < event.max_members){
            participant.events.push(event._id);
            participant["payment"] = participant["payment"] + event.price;
                    
            entry.participants.push(participant._id);
            entry["payment"] = entry["payment"] + event.price;
            await entry.save();
        //    await participant.save();
            // return res.json({status: true, entryadded: true, entryFull:false, alreadyAdded: false,payment:payment})
            let returnVar = {
                id: entry._id,
                participant:participant,
                user:user,
                college: college,
                result:true
            }
            // return returnVar;
            resolve(returnVar);
        }
            else{
               let returnVar = {
                   result: false
               }
                // return returnVar;
                resolve(returnVar);
            }
            // leader_id = req.body.leader_id;

        } else {

            var newEntry = new Entries({
                created_by: user._id,
                team_leader: participant._id,
                event: event._id,
                participants: participants,
                // payment: event.price,
                created_date:date
            });
        
           await newEntry.save(async (err)=>{
                if(err) {
                   console.log(err);
                    // res.send(err);
                    let returnVar = {
                        result: false
                    }
                    //  return returnVar;
                    resolve(returnVar);
                    //  (err ? reject(err) : resolve(result))
                }
                else{
                    participant.events.push(event._id);
                    // participant["payment"] = participant["payment"] + event.price;
                    // user["today_payment"] = user["today_payment"] + event.price; 
                    event["available_entries"] = event["available_entries"] - 1;
                    user.registered.entries.push(newEntry._id);
                    college.registered.entries.push(newEntry._id);
                //    await college.save();
                   await event.save();
                    // await user.save();
                    // await participant.save();
                    // console.log(participant);

                    let returnVar = {
                        id: newEntry._id,
                        participant:participant,
                        user:user,
                        college: college,
                        result:true
                    }
                    // return returnVar;
                    resolve(returnVar);
                // return res.json({status: true, entryadded: true, entryFull:false, alreadyAdded: false, payment : payment});
                }
            });
        }
    });
    
}