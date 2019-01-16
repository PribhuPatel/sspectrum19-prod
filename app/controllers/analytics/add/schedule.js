

var {Departments, Colleges, Schedules} = require('../../../middlewares/schemas/schema');
var {getSingleData} = require('../../../utils/helpers/general_one_helper');

module.exports = {
    addSchedule: async (req, res) => {
        
        let schedule = await getSingleData(Schedules,{event:req.body.event_id});
    if(schedule===null){
        var newSchedule = new Schedules({
            event: req.body.event_id,
            round1: req.body.round1,
            round2: req.body.round2,
            round3: req.body.round3
        });
       await newSchedule.save((err)=>{
            if(err) {
              //  console.log(err);
              console.log(err);
              return res.json({status: true, scheduleAdded: false, alreadyAdded: false,error:true});
            }
            else{
                console.log(req.user.phone + " Added Schedule: "+ newSchedule.event);
            return res.json({status: true, scheduleAdded: true, alreadyAdded: false,error:false});
            }
        });
    }else{
        return res.json({status:true,scheduleAdded:false, alreadyAdded: true,error:false});
    }
//   console.log(req.body.email);
//   console.log(req.body.password);
     // res.json({ status: true });
    }
  };
  