

var {Events, Participants} = require('../../middlewares/schemas/schema');
var {getManyData,getSingleDataWithPopulate} = require('../../utils/helpers/general_one_helper');
const mongoose =  require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

module.exports = {
    checkQr: async (req,res)=>{
        let qr  = req.body.qr;
        let participant = null
        var alreadyRegistered=false
        try{
        let id= ObjectId(qr);
        let parti = await getSingleDataWithPopulate(Participants,{_id:id},'college','firstname lastname phone college package registered','name');
    
        let package= false ;
        if(parti==null || parti== undefined){
            participant = null;
        } else {
            if(parti.package !=null){
                package= true;
            }
            if(parti.registered){
                alreadyRegistered=true;
            } else {
                console.log(parti);
                
            parti.registered =true;
            await parti.save();
            } 
            // participant = parti;
       
            participant = {name:parti.firstname + ' '+ parti.lastname, phone:parti.phone, college:parti.college.name,package:package}
    }
        return res.json({status:true,participant:participant,error:false,alreadyRegistered:alreadyRegistered});
    } catch(e){
        return res.json({status:true,participant:null,error:true,alreadyRegistered:false});
        }
    }
  };
  