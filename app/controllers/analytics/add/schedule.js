

var {Departments, Colleges, Schedules} = require('../../../middlewares/schemas/schema');
var {getSingleData} = require('../../../utils/helpers/general_one_helper');

module.exports = {
    addSchedule: async (req, res) => {
        
        // let name = req.body.name;
        // let city = req.body.city;
        // let cvm = req.body.cvm;
        console.log(req.body);
        let schedule = await getSingleData(Schedules,{event:req.body.event_id});
       //console.log(olduser.length);
       //console.log(olduser);
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
               // console.log("Saved");
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
  