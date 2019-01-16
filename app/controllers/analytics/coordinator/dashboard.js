var {Admins,Departments} = require('../../../middlewares/schemas/schema');
var {getSingleDataWithPopulate} = require('../../../utils/helpers/general_one_helper');

module.exports = {
    dashboard: async (req, res,next) => {
      
        let user =await getSingleDataWithPopulate(Admins,{phone: req.user.phone},'department','name role department','_id');
        let department =await getSingleDataWithPopulate(Departments,{_id:user.department._id},'events faculty_coordinator','name linked_department events faculty_coordinator','status name email phone max_participants available_entries event_status');
  
        var faculty_coordinator_name = null;
        var faculty_coordinator_email = null;
        var faculty_coordinator_phone = null;

        if(department.faculty_coordinator !=null){
            faculty_coordinator_name = department.faculty_coordinator.name;
            faculty_coordinator_email = department.faculty_coordinator.email;
            faculty_coordinator_phone = department.faculty_coordinator.phone;  
        }
        let events = department.events;
        let coordinator_details = {
          name:user.name,
          department: department.name,
          total_events: department.events.length,
          faculty_coordinator_name: faculty_coordinator_name,
          faculty_coordinator_email: faculty_coordinator_email,
          faculty_coordinator_phone: faculty_coordinator_phone
        };
        return res.json({status:true,events:events,coordinator_details:coordinator_details});
    }
// }
  };
