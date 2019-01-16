var {Users,Departments,Participants, Entries, Events, Colleges, GlobalVars} = require('../../../middlewares/schemas/schema');
var {getSingleDataWithPopulate, getSingleData,getManyData, getManyDataWithPopulate,getCount,getDateWiseCount} = require('../../../utils/helpers/general_one_helper');
var {verifyToken}  = require('../../../middlewares/verifytoken');
module.exports = {
    dashboard: async (req, res,next) => {
      
      let total_expense = 0;

      let participant_count_for_graph = await getDateWiseCount(Participants,{},"$created_date");
      let colleges =[];

        let total_registered = await getCount(Participants,{});
        let total_entries = await getCount(Entries,{});
        let total_events = await getCount(Events,{});
        let total_revenue  = await runForEach(Participants);
        let events = await getManyDataWithPopulate(Events,{},'department','name max_participants available_entries','name');
        let collegesdata= await getManyData(Colleges,{},'name registered');
        for(let i=0;i<collegesdata.length;i++){
            colleges.push({
              id:collegesdata[i]._id,
              name:collegesdata[i].name,
              participants_count:collegesdata[i].registered.participants.length
            });
        }
        let check = await getSingleData(GlobalVars,{key:'portal_status'},'value');
        //let today_payment = user.today_payment;
        //let events = await getManyDataWithPopulate(Departments,{},'events','name linked_department','name',{available_entries:{ $ne: 0 }});
        //return res.json({status:true, today_registered: today_registered,today_payment: today_payment,eventsdata:events});
        return res.json({status:true, total_registered:total_registered, total_entries: total_entries,total_events:total_events,total_revenue:total_revenue, participant_count_for_graph:participant_count_for_graph,
        events: events,colleges:colleges, total_expense:total_expense, registration_portal_status: check.value
        });
    // }
}
  };
  

  var runForEach = async (Participants)=>{
        let payment = 0;
        let participants = await getManyData(Participants,{});
    await asyncForEach(participants,async (element)=>{
            payment = payment + element.payment;
    })
    return payment;
  }


  async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
      await callback(array[index], index, array);
    }
  }