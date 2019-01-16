

var {Participants} = require('../../middlewares/schemas/schema');
var {getSingleDataWithPopulate} = require('../../utils/helpers/general_one_helper');

module.exports = {
   getEvents: async(req,res)=>{
        let user = await getSingleDataWithPopulate(Participants,{phone:req.user.phone},'events college','events college','name max_members min_members coordinators rounds description img');
            return res.json({status:true,userdata:user,name : req.user.firstname+" "+req.user.lastname, events_completed: 0});  
        }
  };
  