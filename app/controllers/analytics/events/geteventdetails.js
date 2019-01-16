var {Admins,Departments,Participants, Entries, Events} = require('../../../middlewares/schemas/schema');
var {getSingleDataWithPopulate, getSingleData,getManyData, getManyDataWithPopulate,getCount} = require('../../../utils/helpers/general_one_helper');
var {verifyToken}  = require('../../../middlewares/verifytoken');
module.exports = {
    singleEventDetails: async (req, res,next) => {
      
        // let user_name = req.user.name;
        let event =await getSingleDataWithPopulate(Events,{_id: req.body.event_id},'department','name department coordinators max_members min_members max_participants','linked_department');
        // console.log(user);
        let participants = await getManyDataWithPopulate(Participants,{events : { "$in" : event._id}},'college','firstname lastname college phone','name');
        // {
        // let events = await getSingleDataWithPopulate(Events,{department:user.department._id},'name max_participants available_entries status');
        // return res.json({status:true, data:{total_registered:total_registered, total_entries: total_entries,total_events:total_events,total_revenue:total_revenue}
        // events: events 
        // });
        // let events = department.events;
        // let event = {
        //   name:event.name,
        //   department: department.name,
        // };
        event = {
            name: event.name,
            department: event.department.linked_department,
            max_members: event.max_members,
            min_members: event.min_members,
            max_participants: event.max_participants,
            coordinators: event.coordinators
        }
        return res.json({status:true,event:event,participants:participants});
    }
// }
  };
  
