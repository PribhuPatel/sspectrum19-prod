var {SingleEntries,Participants, Entries, Events, Colleges, GlobalVars,Users} = require('../../../middlewares/schemas/schema');
var {getSingleData,getManyData, getManyDataWithPopulate,getCount,getDateWiseCount} = require('../../../utils/helpers/general_one_helper');

module.exports = {
    dashboard: async (req, res,next) => {
      let total_expense = 0;
      let participant_count_for_graph = await getDateWiseCount(Participants,{},"$created_date");
      let colleges =[];
      let total_packages = await getCount(Participants,{package:{$ne:null}})
      let total_events = await getCount(SingleEntries,{package:{$eq:null}});
    let total_registered = await getCount(Participants,{createby:{$ne:'5c4032db44dcf010af3c8cf6'}});
        let total_entries = await getCount(Entries,{});
        // let total_events = await getCount(Events,{});
        let total_revenue  = await runForEach(Participants);
        let events = await getManyDataWithPopulate(Events,{},'department','name max_participants available_entries','name');
        // let events_ = await getManyData(Events,{},'department','name max_participants available_entries department','name');
      // var events; 
      // await Events.populate(events_,{path:'department',select:'name'},(err,result)=>{
      //     events= result
      // });
        // let l=  events.sort(dynamicSort("department.name"));
      // console.log(l);
    //    let events =       
    //   let events= await Events.aggregate([
    //    {
    //      $group: { 
    //      _id: {department:"$department"},
    //      name:"$name",
    //      max_participants:"$max_participants",
    //      available_entries: "$available_entries"
    //  }
    //  }
    //  , {
    //      "$project": {
    //          "_id": null,
    //          "department": "$_id.department.name",
    //      name:"$name",
    //      max_participants:"$max_participants",
    //      available_entries: "$available_entries"
    //      }} 
    //     ]).exec()

      let collegesdata= await getManyData(Colleges,{},'name registered');
        for(let i=0;i<collegesdata.length;i++){
            colleges.push({
              id:collegesdata[i]._id,
              name:collegesdata[i].name,
              participants_count:collegesdata[i].registered.participants.length
            });
        }
        let check = await getSingleData(GlobalVars,{key:'portal_status'},'value');
        return res.json({status:true, total_registered:total_registered, total_entries: total_entries,total_events:total_events,total_revenue:total_revenue, participant_count_for_graph:participant_count_for_graph,
        events: events,colleges:colleges, total_expense:total_expense, registration_portal_status: check.value,total_packages:total_packages
        });
    }
  };
  
//   function dynamicSort(property) {
//     var sortOrder = 1;
//     if(property[0] === "-") {
//         sortOrder = -1;
//         property = property.substr(1);
//     }
//     return function (a,b) {
//         var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
//         return result * sortOrder;
//     }
// }
  var runForEach = async (Participants)=>{
        let payment = 0;
        let participants = await getManyData(Participants,{});
    await asyncForEach(participants,async (element)=>{
            payment = payment + element.payment;
    })
    return payment;
  }

//   var runForEach = async (Users)=>{
//     let payment = 0;
//     let participants = await getManyData(Users,{});
// await asyncForEach(participants,async (element)=>{
//         payment = payment + element.today_payment;
// })
// return payment;
// }


  async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
      await callback(array[index], index, array);
    }
  }