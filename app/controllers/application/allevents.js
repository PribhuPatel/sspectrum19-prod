

var {Departments} = require('../../middlewares/schemas/schema');
var {getSingleDataWithPopulate,getManyDataWithPopulate} = require('../../utils/helpers/general_one_helper');

module.exports = {
   getEvents: async(req,res)=>{
        // let events = await getSingleDataWithPopulate(Participants,{phone:req.user.phone},'events','events','name max_members min_members coordinators rounds description');
        let departments = await getManyDataWithPopulate(Departments,{},'events','name events','name max_members min_members coordinators rounds description img');
        // if(events.length===0){
        //     res.json({status: true});
        // }else{
            return res.json({status:true,departments:departments});
        // }   
    }
  };
  