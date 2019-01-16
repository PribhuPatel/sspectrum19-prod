

var {Colleges} = require('../../../middlewares/schemas/schema');
var {getManyData} = require('../../../utils/helpers/general_one_helper');

module.exports = {
    getColleges: async (req, res) => {
        

        let college = await getManyData(Colleges,{},'name city');
     return res.json({ status: true, colleges: college });
    },
  };
  