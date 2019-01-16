

var {Admins, Departments} = require('../../../middlewares/schemas/schema');
var {getSingleData} = require('../../../utils/helpers/general_one_helper');

module.exports = {
    signup: async (req, res) => {
        
        let userPhone = req.body.phone;
        let olduser = await getSingleData(Admins,{phone:userPhone});
       //console.log(olduser.length);
       var department;
       var department_id;
       console.log(olduser);
       
        if(req.body.role == 'student_coordinator' || req.body.role == 'faculty_coordinator'){
            department = await getSingleData(Departments,{linked_department:req.body.department});; 
            console.log(department);
            department_id = department._id;
        }
    if(olduser===null){
        var user = new Admins({
            name: req.body.name,
            phone: req.body.phone,
            password  : req.body.password,
            role: req.body.role,
            status: 1,
            email: req.body.email,
            department: department_id
        });
       await user.save(async (err)=>{
            if(err) {
              //  console.log(err);
                res.send(err);
            }
            else{
                if(req.body.role == 'student_coordinator'){
                    department.student_coordinator=user._id;
                    await department.save();
                }
                if( req.body.role =='faculty_coordinator'){
                    department.faculty_coordinator=user._id;
                    await department.save();
                }
               // console.log("Saved");
            res.send(user + "saved");
            }
        });
    }else{
        res.send("User Already exist");
    }
//   console.log(req.body.email);
//   console.log(req.body.password);
     // res.json({ status: true });
    },
  };
  