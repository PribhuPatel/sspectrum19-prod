var {Users,Departments,Participants, Entries, Events, Colleges} = require('../../../middlewares/schemas/schema');
var {getSingleDataWithPopulate, getSingleData,getManyData, getManyDataWithPopulate,getCount,getDateWiseCount} = require('../../../utils/helpers/general_one_helper');
var {verifyToken}  = require('../../../middlewares/verifytoken');
module.exports = {
    registrations: async (req, res,next) => {
      
    //   let total_expense = 0;

    //   let participant_count_for_graph = await getDateWiseCount(Participants,{},"$created_date");
    //   let colleges =[];
        // let departments =await getManyDataWithPopulate();
        let events = await getManyDataWithPopulate(Events,{},'department','name available_entries max_participants price','linked_department');
        var alldepartments = [];
        var departments = [];
        var allevents =[];
        for(let i=0;i<events.length;i++){
            let department = events[i].department.linked_department;
            let total_participants = await getCount(Participants,{events : { "$in" : events[i]._id}});
            let event = {
                id: events[i]._id,
                name : events[i].name,
                total_groups : events[i].max_participants - events[i].available_entries,
                total_participants: total_participants,
                total_revenue: total_participants * events[i].price
            }
            if(departments.includes(department)){
                for(let j=0;j<alldepartments.length;j++){
                if(alldepartments[j].name==department){
                    alldepartments[j].registered_teams  = alldepartments[j].registered_teams + event.total_groups;
                    alldepartments[j].total_revenue  = alldepartments[j].total_revenue + event.total_revenue;
                    break;
                }
                }
            } else{
                departments.push(department);
            department = {
                id: events[i].department._id,
                name: department,
                total_revenue: event.total_revenue,
                total_groups: event.total_groups
            }  
         
            alldepartments.push(department);
            }
            
            allevents.push(event);
        }
        var colleges = [];
        let collegesdata= await getManyData(Colleges,{},'name registered');
        // for(let i=0;i<collegesdata.length;i++){
        //     let total_revenue  = await runForEach(Participants,collegesdata[i]._id);
        //     colleges.push({
        //         id: collegesdata[i]._id, 
        //       name:collegesdata[i].name,
        //       participants_count:collegesdata[i].registered.participants.length,
        //       revenue: total_revenue
        //     });
        // }
        // let participants = await getManyData(Participants,{college:college_id});
        for(let i=0;i<collegesdata.length;i++){
            let total_revenue =0;
            // let participants = await getManyData(Participants,{college:collegesdata[i]._id});
            let college_total_revenue=await Participants.aggregate([
                { $match: { college: collegesdata[i]._id}  },
                { $group: { _id: null,amount: { $sum: "$payment" } } }
            ]).exec();
            if(total_revenue[0]){
               total_revenue =  college_total_revenue[0].amount;
            console.log(total_revenue);
            } else {
                total_revenue = 0;
            }
            colleges.push( {
                id: collegesdata[i]._id, 
                      name:collegesdata[i].name,
                      participants_count:collegesdata[i].registered.participants.length,
                      revenue: total_revenue
            })
        
        }

        console.log(alldepartments);
        console.log(allevents);
        console.log(colleges);
        return res.json({status:true,allevents:allevents,alldepartments:alldepartments,colleges:colleges});

        // let total_registered = await getCount(Participants,{});
        // let total_entries = await getCount(Entries,{});
        // let total_events = await getCount(Events,{});
        // let total_revenue  = await runForEach(Participants);
        // let events = await getManyDataWithPopulate(Events,{},'department','name max_participants available_entries','name');
        // let collegesdata= await getManyData(Colleges,{},'name registered');
        // for(let i=0;i<collegesdata.length;i++){
        //     colleges.push({
        //       name:collegesdata[i].name,
        //       participants_count:collegesdata[i].registered.participants.length
        //     });
        // }
        //let today_payment = user.today_payment;
        //let events = await getManyDataWithPopulate(Departments,{},'events','name linked_department','name',{available_entries:{ $ne: 0 }});
        //return res.json({status:true, today_registered: today_registered,today_payment: today_payment,eventsdata:events});
        // return res.json({status:true, total_registered:total_registered, total_entries: total_entries,total_events:total_events,total_revenue:total_revenue, participant_count_for_graph:participant_count_for_graph,
        // events: events,colleges:colleges, total_expense:total_expense, registration_portal_status: true
        // });
    // }
}
  };
  

  var runForEach = async (Participants,college_id)=>{
        let payment = 0;
        let participants = await getManyData(Participants,{college:college_id});
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