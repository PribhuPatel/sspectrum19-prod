

var {Departments, Events} = require('../../../middlewares/schemas/schema');
var {getSingleDataWithPopulate,getManyDataWithPopulate,getManyData} = require('../../../utils/helpers/general_one_helper');

module.exports = {
    getEvent: async (req, res) => {
        
        let name = req.body.name;
        let id = req.body.eventid;

        let event = await getSingleDataWithPopulate(Events,{$or:[{name: name},{_id: id}]},'department',null,'name');

    if(event===null){
        res.send("No Event Found");
    }else{
        res.send(event);
    }
    },
    getEventsWithDepartment: async(req,res)=>{
     let events = await getManyDataWithPopulate(Events,{},'department');

    if(events.length===0){
        res.send("No Event Found");
    }else{
        res.json(events);
    }
    },
    getEvents: async(req,res)=>{
        let events = await getManyData(Events,{available_entries: {$ne: 0 }},'name max_members min_members');

        if(events.length===0){
            res.json({status: false});
        }else{
            res.json({status:true,events:events});
        }   
    }
  };
  