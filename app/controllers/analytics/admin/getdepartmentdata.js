var {Departments,Participants} = require('../../../middlewares/schemas/schema');
var {getSingleDataWithPopulate} = require('../../../utils/helpers/general_one_helper');

module.exports = {
    getDepartmentData: async (req, res,next) => {
      
        let department =await getSingleDataWithPopulate(Departments,{_id:req.body.department_id},'events faculty_coordinator student_coordinator','name linked_department events faculty_coordinator','name email phone max_participants available_entries price');
      
        let events = department.events;
        var allEvents = [];
        for(let i=0;i<events.length;i++){
            let event_Data = await Participants.aggregate([
                { $match: { events : { "$in" : [events[i]._id]}}  },
                { $group: { _id: null,count : { $sum : 1 }} }
            ]).exec();

            let count=0;
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
        }

        var student_coordinator_name = null;
        var student_coordinator_email = null;
        var student_coordinator_phone = null;
        var faculty_coordinator_name = null;

        if(department.faculty_coordinator !=null){
            faculty_coordinator_name = department.faculty_coordinator.name; 
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
          student_coordinator_name : student_coordinator_name,
          student_coordinator_email : student_coordinator_email,
          student_coordinator_phone : student_coordinator_phone
        };
        return res.json({status:true,events:allEvents,department_details:department_details});
    }
// }
  };
