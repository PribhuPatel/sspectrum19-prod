

var {Participants, Events, Schedules, GlobalVars} = require('../../middlewares/schemas/schema');
var {getSingleDataWithPopulate,getSingleData, getManyDataWithPopulate, getCount} = require('../../utils/helpers/general_one_helper');

module.exports = {
   getSchedule: async(req,res)=>{
        let user = await getSingleDataWithPopulate(Participants,{phone:req.user.phone},'events','events','name');
        let day1date = await getSingleData(GlobalVars,{key:'day1 date'},'value');
        // let schedules = await getCount(Schedules,{});
        let declaredSchedule  = await getSingleData(GlobalVars,{key:"declareschedule"});
        if(declaredSchedule.value === "false"){
            return res.json({status:true, declared:false})
        } else {
        // let day2date = await getSingleData(GlobalVars,{key:'day2 date'},'value');
      //  let totalSchedule = await getManyDataWithPopulate(Schedules,{},'event','event round1 round2 round3','name');
        console.log(req.user);
        var day1 =[];
        var day2 =[];
        for(let i=0;i<user.events.length;i++){
            let eventSchedule  = await getSingleData(Schedules,{event:user.events[i]._id});
            let a = eventSchedule;
            // let  round1 = {
            //     time: eventSchedule.round1.start_time.split(" ")[1],
            //     venue: eventSchedule.round1.venue,
            //     description: user.events[i].name + " Round 1"
            // }
            // console.log(eventSchedule);
            // console.log(a);
             eventSchedule = eventSchedule.toJSON();
            // console.log(keyNames);
            for(key in eventSchedule){
                if(key == 'event'){
                    continue;
                } else {
                    // console.log(eventSchedule[key]);
                    
                    if(eventSchedule[key].start_time){
                    if(eventSchedule[key].start_time != ''){
                        // console.log(key);
                        let rou;
                        switch(key){
                            case 'round1': rou='Round 1';
                                            break;
                            case 'round2': rou='Round 2';
                                            break;
                            case 'round3': rou='Round 3';
                                            break;
                        }
                        // console.log(eventSchedule[key]);
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
        }
        console.log(day1);
        console.log(day2);
        // for(let i=0;i<totalSchedule.length;i++){
        //     for(let j=0;j<)
        // }
        // let user = getSingleData(Participants,{phone:});
        // if(events.length===0){
        //     res.json({status: true});
        // }else{
            return res.json({status:true, day1:day1, day2:day2, declared:true});
        // }   
    }
}
  };
  