

var {Participants, Schedules, GlobalVars} = require('../../middlewares/schemas/schema');
var {getSingleDataWithPopulate,getSingleData} = require('../../utils/helpers/general_one_helper');

module.exports = {
   getSchedule: async(req,res)=>{
        let user = await getSingleDataWithPopulate(Participants,{phone:req.user.phone},'events','events','name');
        let day1date = await getSingleData(GlobalVars,{key:'day1 date'},'value');
        let declaredSchedule  = await getSingleData(GlobalVars,{key:"declareschedule"});
        if(declaredSchedule.value === "false"){
            return res.json({status:true, declared:false})
        } else {
        var day1 =[];
        var day2 =[];
        for(let i=0;i<user.events.length;i++){
            let eventSchedule  = await getSingleData(Schedules,{event:user.events[i]._id});
            eventSchedule = eventSchedule.toJSON();
            for(key in eventSchedule){
                if(key == 'event'){
                    continue;
                } else {
                    if(eventSchedule[key].start_time){
                    if(eventSchedule[key].start_time != ''){
                        let rou;
                        switch(key){
                            case 'round1': rou='Round 1';
                                            break;
                            case 'round2': rou='Round 2';
                                            break;
                            case 'round3': rou='Round 3';
                                            break;
                        }
                    let event ={
                        time: eventSchedule[key].start_time.split(" ")[1].split(":")[0] +":" +eventSchedule[key].start_time.split(" ")[1].split(":")[1],
                        description: eventSchedule[key].venue,
                        title: user.events[i].name + " " + rou
                }
                if(eventSchedule[key].start_time.split(" ")[0]==day1date.value){
                    day1.push(event);
                } else{
                    day2.push(event);
                }       
                }}
            }
            }
        }return res.json({status:true, day1:day1, day2:day2, declared:true});
    }
}
  };
  