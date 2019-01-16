
var {Users} = require('../../../middlewares/schemas/schema');
var {getSingleData} = require('../../../utils/helpers/general_one_helper');

module.exports = {
    createUser : async (req, res) => {
        
        let userPhone = req.body.phone;
        let olduser = await getSingleData(Users,{phone:userPhone});
       //console.log(olduser.length);
       console.log(olduser);
    if(olduser===null){
        var user = new Users({
            name: req.body.name,
            phone: req.body.phone,
            password  : req.body.password,
            role: req.body.role,
            status: 1
        });
       await user.save((err)=>{
            if(err) {
              //  console.log(err);
                res.send(err);
            }
            else{
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
  