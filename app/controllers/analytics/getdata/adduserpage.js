

var {Departments, Colleges} = require('../../../middlewares/schemas/schema');
var {getManyData} = require('../../../utils/helpers/general_one_helper');

module.exports = {
    getData: async (req, res) => {
        let department = await getManyData(Departments,{},'linked_department');
        let college = await getManyData(Colleges,{},'name city');
      return res.json({ status: true, colleges: college ,departments:department});
    },
  };
  