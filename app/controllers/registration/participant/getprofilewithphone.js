

var {Participants, Users, Colleges} = require('../../../middlewares/schemas/schema');
var {getSingleData,getManyDataWithPopulateWithLimit} = require('../../../utils/helpers/general_one_helper');

module.exports = {
    getProfile : async (req, res) => {
        
        let partiPhone = req.body.phone;
        let limit  = req.body.limit;
       
       if(!req.body.limit){
           limit = 0;
       } else{
       limit=parseInt(limit);
       }
       try{
           if(partiPhone === null || partiPhone=== '' || partiPhone === undefined){
            let participant = await getManyDataWithPopulateWithLimit(Participants,{},limit,'college','firstname lastname college phone','name city');
            return res.json({status: true, participants: participant});
           }
           else{
            let participant = await getManyDataWithPopulateWithLimit(Participants,{"$where": "function(){ return this.phone.toString().match(/"+partiPhone+"/)!=null;}"},limit,'college','firstname lastname college phone','name city');
            return res.json({status: true, participants: participant});
         
           }
    } catch (e){
           console.log(e);
            return res.json({status: true,message:"Error"});
   
        }

   
    },
  };
  