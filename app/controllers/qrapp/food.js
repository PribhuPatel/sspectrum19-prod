

var {Events, Participants, Ondayusers,Eventattendance, Volunteers,GlobalVars} = require('../../middlewares/schemas/schema');
var {getManyData,getSingleDataWithPopulate, getManyDataWithPopulate,getSingleData,localDate} = require('../../utils/helpers/general_one_helper');
const mongoose =  require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

module.exports = {
    checkQr: async (req,res)=>{
        console.log(req.user);
        console.log(req.body.qr);
        
        let qr  = req.body.qr;
        let participant = null;
        var alreadyRegistered=false;
        var day;
        try{
           
        let id= ObjectId(qr);
        
        var parti = await getSingleData(Volunteers,{_id:id});
         
        if(parti==null || parti== undefined){
            participant = null;
        } else {
            
        let date = await localDate();
        date = date.toISOString().split('T')[0];
        
        day = date.split('-')[2] + '-' + date.split('-')[1] + '-' + date.split('-')[0];
        let day1date = await getSingleData(GlobalVars,{key:'day1 date'},'value');

            if(day==day1date.value){
                if(parti.day1){
                    alreadyRegistered=true;
                } else{
                    parti.day1 = true;
                    await parti.save();
                }
            } else{
                if(parti.day2){
                    alreadyRegistered = true;
                } else{
                    parti.day2 = true;
                    
                    await parti.save();
                }
            } 
       
            participant = {name:parti.name, team:parti.team}
    }
        return res.json({status:true,participant:participant,error:false,alreadyRegistered:alreadyRegistered,day:day});
    } catch(e){
        console.log(e);
        return res.json({status:true,participant:null,error:true,alreadyRegistered:false,day:day});
        }
    }
  };
  