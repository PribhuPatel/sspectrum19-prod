var {Events, Entries, Users, Participants,Colleges, SingleEntries} = require('../../../middlewares/schemas/schema');
var {getSingleData, localDate, sendmail} = require('../../../utils/helpers/general_one_helper');

module.exports = {
createEntry: async (req, res) => {
        let date =localDate();
    let payment = 0;
    let user = await getSingleData(Users,{phone: req.user.phone},'_id today_payment registered phone name');
    var event = await getSingleData(Events,{_id: req.body.intrested_event});
    let participant = await getSingleData(Participants,{phone: req.body.participant},'_id firstname lastname college events payment email phone');
    
  let participants = [];
  participants.push(participant._id);
  let college = await getSingleData(Colleges,{_id: participant.college},'registered');
  let oldentry = await getSingleData(Entries,{$and:[{event: event._id},{participants : { "$in" : participants}}]});
    var leader_id = null;
    payment = event.price;
    if(oldentry === null){
    if(event.available_entries != 0 || req.body.leader_phone!=undefined){
        if(req.body.leader_phone){
            leader_id = await getSingleData(Participants,{phone:req.body.leader_phone});
            let entry = await getSingleData(Entries,{$and:[{team_leader: leader_id},{event: event._id},{participants : { "$nin" : participants}}]},'participants payment');
            if(entry.participants.length < event.max_members){
            participant.events.push(event._id);
            // if(event.type == "mega"){
                // payment = 0;
            // } else {
            participant["payment"] = participant["payment"] + event.price;
            user["today_payment"] = user["today_payment"] + event.price;
            entry["payment"] = entry["payment"] + event.price;
            // }
            entry.participants.push(participant._id);
            let singleEntry = new SingleEntries({
                created_time:date,
                participant:participant._id,
                event: event._id,
                entry: entry._id,
                createby: user._id,
                payment:event.price
            })
            await singleEntry.save();
           await entry.save();
            await user.save();
           await participant.save();

           let replacements = {
            name: participant.firstname + " " + participant.lastname,
            event:event.name,
            price: event.price,
            token: singleEntry._id
        }
           console.log(participant.phone +":"+participant.firstname + " entry created by "+user.phone+":"+user.name + " at "+date);
           try{
            let mail = await sendmail('/single-event.html',participant.email,"Spectrum'19 Event Verification",replacements);
            console.log("Event Entry Mail sended to "+ participant.email);
            } catch (e){
                console.log("Mail send failed to " + participant.email);
            }
            return res.json({status: true, entryadded: true, entryFull:false, alreadyAdded: false,payment:payment})
            }
            else{
                return res.json({status: true, entryadded: false, entryFull:false, alreadyAdded: false,max_members:true,message:"Maximum members in team"});
            }
       } else {

            var newEntry = new Entries({
                created_by: user._id,
                team_leader: participant._id,
                event: event._id,
                participants: participants,
                payment: payment,
                created_date:date
            });
        
           await newEntry.save(async (err)=>{
                if(err) {
                    console.log(err);
                   return res.json({status: true, entryadded: false, entryFull:false, alreadyAdded: false,message:"There is a error on server side"});
                }
                else{
                    participant.events.push(event._id);
                    participant["payment"] = participant["payment"] + event.price;
                    user["today_payment"] = user["today_payment"] + event.price; 
                    event["available_entries"] = event["available_entries"] - 1;
                    user.registered.entries.push(newEntry._id);
                    college.registered.entries.push(newEntry._id);
                    let singleEntry = new SingleEntries({
                        created_time:date,
                        participant:participant._id,
                        event: event._id,
                        entry: newEntry._id,
                        createby: user._id,
                        payment:event.price
                    })
                    await singleEntry.save();
                    await college.save();
                    await event.save();
                    await user.save();
                    await participant.save();
                    
        let replacements = {
            name: participant.firstname + " " + participant.lastname,
            event:event.name,
            price: event.price,
            token: singleEntry._id
        }
                    try{
                        let mail = await sendmail('/single-event.html',participant.email,"Spectrum'19 Event Verification",replacements);
                    console.log(participant.phone +":"+participant.firstname + " event entry has been created by "+user.phone+":"+user.name + " at "+date);
                        } catch(e) {
                            console.log("Mail send failed to " + participant.email);
                        }
               return res.json({status: true, entryadded: true, entryFull:false, alreadyAdded: false, payment : payment});
                }
            });
        }
    } else {
        return res.json({status: true, entryadded: false, entryFull:true, alreadyAdded: false,message:"Event Entry Full"});
    }
} else {
    return res.json({status: true, entryadded: false, entryFull:false, alreadyAdded: true,message:"Participant already added in " +event.name + " event"});
}
}
  };
  