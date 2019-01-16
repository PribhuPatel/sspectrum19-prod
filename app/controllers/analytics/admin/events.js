var {Users,Departments,Participants, Entries, Events, Colleges} = require('../../../middlewares/schemas/schema');
var {getSingleDataWithPopulate, getSingleData,getManyData, getManyDataWithPopulate,getCount,getDateWiseCount} = require('../../../utils/helpers/general_one_helper');
var {verifyToken}  = require('../../../middlewares/verifytoken');
module.exports = {
    events: async (req, res,next) => {
      
 
        let events = await getManyDataWithPopulate(Events,{},'department','name max_participants available_entries','name');
        return res.json({status: true, events: events});
}
  };
  
