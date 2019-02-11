var {Participants, Entries, SingleEntries} = require('../../../middlewares/schemas/schema');
var {getSingleData,getManyData, getManyDataWithPopulate,getCount,getDateWiseCount,localDate} = require('../../../utils/helpers/general_one_helper');

module.exports = {
    changeSingleEvent: async (req, res,next) => {
        var participant = await getSingleData(Participants,{phone:req.body.phone},'firstname lastname phone events');
        
        // console.log(participant);
        
        if(participant){
            let events = participant.events;
            let index = events.findIndex(x => x.toString()==req.body.event1.toString());
            console.log(index);
            console.log(events[index]);
            console.log(req.body.event2);
            if(index !=-1){
            events[index] = req.body.event2;
            console.log(events);
            
            participant.events = events;
            // participant.save();
            // try{
                
            await participant.save(async (err)=>{
                if(err){
                    return res.send("not saved");
                } else {
                    console.log("sad");
                    
                await SingleEntries.updateOne({$and:[{participant:participant._id},{event:req.body.event1}]},{$set:{event:req.body.event2}},{upsert:false});
                await Entries.updateOne({$and:[{team_leader:participant._id},{event:req.body.event1}]},{$set:{event:req.body.event2}},{upsert:false});
                    
                 return res.json({name:participant.firstname});
            }
                
            });
        } else {
            return res.send("participant not in this event");
        }
        // } catch (e){
            // res.send(e);
        // }
    } else {
        return res.send("Participant Not Found");
    }
    }
  };