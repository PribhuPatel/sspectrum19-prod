var {Admins,Departments,Participants, Entries, Events} = require('../../../middlewares/schemas/schema');
var {getSingleDataWithPopulate, getSingleData,getManyData, getManyDataWithPopulate,getCount} = require('../../../utils/helpers/general_one_helper');
var {verifyToken}  = require('../../../middlewares/verifytoken');
module.exports = {
    dashboard: async (req, res,next) => {
      
        // let user_name = req.user.name;
        let user =await getSingleDataWithPopulate(Admins,{phone: req.user.phone},'department','name role department','_id');
        console.log(user);
        let department =await getSingleDataWithPopulate(Departments,{_id:user.department._id},'events faculty_coordinator','name linked_department events faculty_coordinator','status name email phone max_participants available_entries event_status');
        // {
        // let events = await getSingleDataWithPopulate(Events,{department:user.department._id},'name max_participants available_entries status');
        // return res.json({status:true, data:{total_registered:total_registered, total_entries: total_entries,total_events:total_events,total_revenue:total_revenue}
        // events: events 
        // });
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
