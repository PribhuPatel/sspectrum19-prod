var {Participants, Entries, Events, Colleges, GlobalVars,Users,Revenue} = require('../../../middlewares/schemas/schema');
var {getSingleData,getManyData, getManyDataWithPopulate,getCount,getDateWiseCount,localDate} = require('../../../utils/helpers/general_one_helper');

module.exports = {
    dashboard: async (req, res,next) => {
      let total_expense = 0;
      let participant_count_for_graph = await getDateWiseCount(Participants,{},"$created_date");
    //   let colleges =[];
    let date = localDate();
    let da = date.getFullYear()+ '-'+(date.getMonth()+1)+'-' +date.getDate() ;
    let da1;
    if(date.getDate()==31){
            da1 = date.getFullYear()+ '-'+(date.getMonth()+2)+'-' +(1) ;

         } else {
            da1 = date.getFullYear()+ '-'+(date.getMonth()+1)+'-' +(date.getDate()+1) ;
         }
       da= da.concat(' 00:00:00 UTC')
       da1= da1.concat(' 00:00:00 UTC')
       da = new Date(da);
       da1 = new Date(da1);
    let total_registered = await getCount(Participants,{});
        // let total_entries = await getCount(Entries,{});
        let total_events = await getCount(Events,{});
        // let total_revenue  = await runForEach(Users);
        // let events = await getManyDataWithPopulate(Events,{},'department','name max_participants available_entries','name');
        // let collegesdata= await getManyData(Colleges,{},'name registered');
        // for(let i=0;i<collegesdata.length;i++){
        //     colleges.push({
        //       id:collegesdata[i]._id,
        //       name:collegesdata[i].name,
        //       participants_count:collegesdata[i].registered.participants.length
        //     });
        // }
        // let check = await getSingleData(GlobalVars,{key:'portal_status'},'value');

    //   let daily_revenue = await getManyData(Revenue,{});
      let revenue = await Revenue.aggregate([{
          $group: {
          _id: null,
          revenue: { $sum: "$revenue" }
      }
      }]).exec();
      let total_revenue = revenue[0].revenue;
    //   for(let i=0;i<daily_revenue.length;i++){
    //     total_revenue = daily_revenue[i].revenue + total_revenue;
    //     }
    let users = await getManyData(Users, {},'name phone today_payment');
    var usersdata = [];
    for(let i=0;i<users.length;i++){
        let today_registered = await getCount(Participants,{$and:[{created_date:{ $gte: da,$lt:  da1}},{createby:users[i]._id}]});
        usersdata.push({
            id:users[i]._id,
            phone: users[i].phone,
            name: users[i].name,
            today_payment: users[i].today_payment,
            today_registered:today_registered
        });
        total_revenue = total_revenue + users[i].today_payment
    }
        return res.json({status:true, total_registered:total_registered, total_events:total_events,total_revenue:total_revenue, participant_count_for_graph:participant_count_for_graph,
        users:usersdata
        });
    }
  };


  // var runForEach = async (Participants)=>{
  //       let payment = 0;
  //       let participants = await getManyData(Participants,{});
  //   await asyncForEach(participants,async (element)=>{
  //           payment = payment + element.payment;
  //   })
  //   return payment;
  // }

  var runForEach = async (Users)=>{
    let payment = 0;
    let participants = await getManyData(Users,{});
await asyncForEach(participants,async (element)=>{
        payment = payment + element.today_payment;
})
return payment;
}


  async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
      await callback(array[index], index, array);
    }
  }
