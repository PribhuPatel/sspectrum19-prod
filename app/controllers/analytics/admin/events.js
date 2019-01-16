var {Events} = require('../../../middlewares/schemas/schema');
var {getManyDataWithPopulate} = require('../../../utils/helpers/general_one_helper');

module.exports = {
    events: async (req, res,next) => {
      
 
        let events = await getManyDataWithPopulate(Events,{},'department','name max_participants available_entries','name');
        return res.json({status: true, events: events});
}
  };
  
