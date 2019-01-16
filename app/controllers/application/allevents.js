

var {Departments} = require('../../middlewares/schemas/schema');
var {getManyDataWithPopulate} = require('../../utils/helpers/general_one_helper');

module.exports = {
   getEvents: async(req,res)=>{
        let departments = await getManyDataWithPopulate(Departments,{},'events','name events','name max_members min_members coordinators rounds description img');
           return res.json({status:true,departments:departments});
        }
  };
  