var {Admins,Departments,Participants, Entries, Events} = require('../../../middlewares/schemas/schema');
var {getSingleDataWithPopulate, getSingleData,getManyData, getManyDataWithPopulate,getCount} = require('../../../utils/helpers/general_one_helper');
var {verifyToken}  = require('../../../middlewares/verifytoken');
module.exports = {
    getDepartmentData: async (req, res,next) => {
      
        // let user_name = req.user.name;
        // let user =await getSingleDataWithPopulate(Admins,{phone: req.user.phone},'department','name role department','_id');
        // console.log(user);
        let department =await getSingleDataWithPopulate(Departments,{_id:req.body.department_id},'events faculty_coordinator student_coordinator','name linked_department events faculty_coordinator','name email phone max_participants available_entries price');
        // {
        // let events = await getSingleDataWithPopulate(Events,{department:user.department._id},'name max_participants available_entries status');
        // return res.json({status:true, data:{total_registered:total_registered, total_entries: total_entries,total_events:total_events,total_revenue:total_revenue}
        // events: events 
        // });
        let events = department.events;
        var allEvents = [];
        for(let i=0;i<events.length;i++){
            let event_Data = await Participants.aggregate([
                { $match: { events : { "$in" : [events[i]._id]}}  },
                { $group: { _id: null,count : { $sum : 1 }} }
            ]).exec();

            let count=0;
            console.log(event_Data);
            if(event_Data.length != 0){
                count = event_Data[0].count;
            }
            allEvents.push({
                id: events[i]._id,
                name: events[i].name,
                registered_participants: count,
                registered_groups: events[i].max_participants - events[i].available_entries,
                revenue: count * events[i].price
            });
            // allEvents.push()
        }

        var student_coordinator_name = null;
        var student_coordinator_email = null;
        var student_coordinator_phone = null;
        var faculty_coordinator_name = null;
        // var faculty_coordinator_email = null;
        // var faculty_coordinator_phone = null;

        if(department.faculty_coordinator !=null){
            faculty_coordinator_name = department.faculty_coordinator.name;
            // faculty_coordinator_email = department.faculty_coordinator.email;
            // faculty_coordinator_phone = department.faculty_coordinator.phone;  
        }

        if(department.student_coordinator !=null){
            student_coordinator_name = department.student_coordinator.name;
            student_coordinator_email = department.student_coordinator.email;
            student_coordinator_phone = department.student_coordinator.phone;
        }

        let department_details = {
           nick_name:department.name,
          department_name: department.linked_department,
          faculty_coordinator_name: faculty_coordinator_name,
        //   faculty_coordinator_email: faculty_coordinator_email,
        //   faculty_coordinator_phone: faculty_coordinator_phone,
          student_coordinator_name : student_coordinator_name,
          student_coordinator_email : student_coordinator_email,
          student_coordinator_phone : student_coordinator_phone
        };
        return res.json({status:true,events:allEvents,department_details:department_details});
    }
// }
  };
