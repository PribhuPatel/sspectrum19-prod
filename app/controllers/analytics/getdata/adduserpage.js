

var {Departments, Colleges} = require('../../../middlewares/schemas/schema');
var {getManyData} = require('../../../utils/helpers/general_one_helper');

module.exports = {
    getData: async (req, res) => {
        
        // let name = req.body.name;
        // let id = req.body.eventid;

        let department = await getManyData(Departments,{},'linked_department');
        let college = await getManyData(Colleges,{},'name city');
       //console.log(olduser.length);
       //console.log(olduser);

//   console.log(req.body.email);
//   console.log(req.body.password);
      return res.json({ status: true, colleges: college ,departments:department});
    },
  };
  