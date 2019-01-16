

var {Events} = require('../../../middlewares/schemas/schema');
var {getManyData} = require('../../../utils/helpers/general_one_helper');

module.exports = {
    getEventsName: async(req,res)=>{
        let events = await getManyData(Events,{},'name');
        return  res.json({status: true, events: events});
    }
  };
  