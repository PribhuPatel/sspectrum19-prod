

var {Events, Participants, Ondayusers,Eventattendance} = require('../../middlewares/schemas/schema');
var {getManyData,getSingleDataWithPopulate, getManyDataWithPopulate,getSingleData} = require('../../utils/helpers/general_one_helper');
const mongoose =  require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

module.exports = {
    checkQr: async (req,res)=>{
        let qr  = req.body.qr;
        let event = [];
        // console.log(req.user);
        
        event.push(req.user.event);
        let participant = null;
        var alreadyRegistered=false
        try{
        let id= ObjectId(qr);
        // console.log(event);
        
        let parti = await getSingleData(Participants,{$and:[{_id:id},{events:{'$in':event}}]},'firstname lastname phone registered');
            // console.log(parti);
            
        if(parti==null || parti== undefined){
            participant = null;
        } else {
            let present = await getSingleData(Eventattendance,{event:event});
            console.log(present.present);
            console.log(parti._id.toString());
            pre = [];
            console.log(present.present.includes(parti._id.toString()));
            
            if(present.present.includes(parti._id)){
                alreadyRegistered=true;
            } else {
                present.present.push(parti._id);
                present.save();
            } 
            // participant = parti;
       
            participant = {name:parti.firstname + ' '+ parti.lastname, phone:parti.phone}
    }
        return res.json({status:true,participant:participant,error:false,alreadyRegistered:alreadyRegistered});
    } catch(e){
        console.log(e);
        
        return res.json({status:true,participant:null,error:true,alreadyRegistered:false});
        }
    },
    ckeckAttendance: async (req,res)=>{
        let event = [];
        event.push(req.user.event);
        let present = await getSingleDataWithPopulate(Eventattendance,{event:req.user.event},'present','present','firstname lastname phone');
        let absent = await getManyData(Participants,{$and:[{events:{'$in':event}},{_id:{$nin: present.present.$.id}}]},'firstname lastname phone')
        return res.json({status:true, presentParticipants:present.present, absentParticipants: absent})
    },
    createTable:async(req,res)=>{
        let events = await getManyData(Events,{},'_id');
        for(let i=0;i<events.length;i++){
            let event = new Eventattendance({
                event:events[i]._id,
                present:[]
            })
            event.save();
        }
        return res.send("Thank you");
    }
  };
  