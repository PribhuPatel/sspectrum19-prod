

var {Departments} = require('../../../middlewares/schemas/schema');
var {getSingleData} = require('../../../utils/helpers/general_one_helper');

module.exports = {
    addDepartment: async (req, res) => {
        
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
              return res.json({status: true, departmentAdded:false,alreadyAdded:false,error:true});
            }
            else{
                console.log(req.user.phone + " Added Department: " + newDepartment.name);
               return res.json({status: true, departmentAdded:true,alreadyAdded:false,error:false});
            }
        });
    }else{
        return res.json({status: true, departmentAdded:false,alreadyAdded:true,error:false});
    }
    },
  };
  