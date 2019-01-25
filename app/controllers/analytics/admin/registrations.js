var {Participants, Events, Colleges} = require('../../../middlewares/schemas/schema');
var {getManyData, getManyDataWithPopulate,getCount} = require('../../../utils/helpers/general_one_helper');

module.exports = {
    registrations: async (req, res,next) => {
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
                    alldepartments[j].total_groups = alldepartments[j].total_groups + event.total_groups;
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
        for(let i=0;i<collegesdata.length;i++){
            let total_revenue =0;
            let college_total_revenue=await Participants.aggregate([
                { $match: { college: collegesdata[i]._id}  },
                { $group: { _id: null,amount: { $sum: "$payment" } } }
            ]).exec();
            if(total_revenue[0]){
               total_revenue =  college_total_revenue[0].amount;
            } else {
                total_revenue = 0;
            }
            colleges.push({
                id: collegesdata[i]._id, 
                      name:collegesdata[i].name,
                      participants_count:collegesdata[i].registered.participants.length,
                      revenue: total_revenue
            })
        
        }
        return res.json({status:true,allevents:allevents,alldepartments:alldepartments,colleges:colleges});
    }
};