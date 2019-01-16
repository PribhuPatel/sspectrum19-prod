

var {Departments, Events} = require('../../../middlewares/schemas/schema');
var {getSingleDataWithPopulate, getSingleData,getManyData, getManyDataWithPopulate} = require('../../../utils/helpers/general_one_helper');

module.exports = {
    getEventsName: async(req,res)=>{
        
        // let name = req.body.name;
        // let id = req.body.eventid;

        let events = await getManyData(Events,{},'name');
    // if(department===null){
    //     res.send("No Department Found");
    // }else{
       return  res.json({status: true, events: events});
    // }
    }
  };
  