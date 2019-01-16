var {Participants, Events} = require('../../../middlewares/schemas/schema');
var {getSingleDataWithPopulate, getManyDataWithPopulate} = require('../../../utils/helpers/general_one_helper');

module.exports = {
    singleEventDetails: async (req, res,next) => {
      let event =await getSingleDataWithPopulate(Events,{_id: req.body.event_id},'department','name department coordinators max_members min_members max_participants','linked_department');
        let participants = await getManyDataWithPopulate(Participants,{events : { "$in" : event._id}},'college','firstname lastname college phone','name');
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
  
