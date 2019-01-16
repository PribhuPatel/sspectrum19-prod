

var {Departments} = require('../../../middlewares/schemas/schema');
var {getSingleData} = require('../../../utils/helpers/general_one_helper');

module.exports = {
    createDepartment: async (req, res) => {
        
        let nick_name = req.body.nick_name;
        let linked_department = req.body.linked_department;
        let department = await getSingleData(Departments,{$or:[{name: nick_name},{linked_department: linked_department}]});
    if(department===null){
        var newDepartment = new Departments({
            name: nick_name,
            linked_department: linked_department
        });
       await newDepartment.save((err)=>{
            if(err) {
                res.send(err);
            }
            else{
            res.send(newDepartment + "saved");
            }
        });
    }else{
        res.send("Department Already exist");
    }
  },
  };
  