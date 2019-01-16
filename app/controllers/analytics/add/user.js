

var {Admins, Departments,Users} = require('../../../middlewares/schemas/schema');
var {getSingleData} = require('../../../utils/helpers/general_one_helper');

module.exports = {
    addUser: async (req, res) => {
        
        let userPhone = req.body.phone;
        let olduser;
        var department;
        var department_id;
        var coordinator_added = false;
        department = await getSingleData(Departments,{_id:req.body.department_id});; 
        // console.log(department);
        
        // if(department != null){
            department_id = req.body.department_id;
            if(req.body.role === 'campaign'){
            olduser = await getSingleData(Users,{phone:userPhone});
        } else {
            if(req.body.role === 'faculty_coordinator'){
                olduser = await getSingleData(Admins,{$or :[{phone:userPhone},{$and:[{department:department_id},{role:'faculty_coordinator'}]}]});
                if(olduser!=null){
                    coordinator_added = true;
                    }
            } 
            else if(req.body.role === 'student_coordinator'){
                olduser = await getSingleData(Admins,{$or :[{phone:userPhone},{$and:[{department:department_id},{role:'student_coordinator'}]}]});
                if(olduser!=null){
                    coordinator_added = true;
                    }
            }
             else{
            olduser = await getSingleData(Admins,{phone:userPhone});
            }
        }
        //console.log(olduser.length);
   
       console.log(olduser);
       
        // if(req.body.role !== 'admin'){

        // }

    if(olduser===null){
        if(req.body.role === 'campaign'){
            var user = new Users({
                name: req.body.firstname + req.body.lastname,
                phone: req.body.phone,
                password  : req.body.password,
                role: req.body.role,
                status: 1,
                department: department_id,
                college: req.body.college_id
            });
        } else {
        var user = new Admins({
            name: req.body.firstname + req.body.lastname,
            phone: req.body.phone,
            password  : req.body.password,
            role: req.body.role,
            status: 1,
            email: req.body.email,
            department: department_id,
            college: req.body.college_id
        });
    }
       await user.save(async (err)=>{
            if(err) {
              //  console.log(err);
              return res.json({status: true, userAdded: false, error: true, alreadyAdded: fasle,coordinator_added:coordinator_added});
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
            return res.json({status: true, userAdded: true, error: false, alreadyAdded: false,coordinator_added:coordinator_added});
            }
        });
    }else{
        return res.json({status: true, userAdded: false, error: false, alreadyAdded: true,coordinator_added:coordinator_added});
    }
// } else{
//     return res.json({status: true, userAdded: false, error: true, alreadyAdded: false,coordinator_added:coordinator_added});
// }
//   console.log(req.body.email);
//   console.log(req.body.password);
     // res.json({ status: true });
    },
  };
  