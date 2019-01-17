
var {Admins} = require('../../../middlewares/schemas/schema');
var {getSingleData,localDate} = require('../../../utils/helpers/general_one_helper');
var {createToken} = require('../../../utils/tokenhelper.js');

module.exports = {
    login:  async(req, res) => {
  
        let userPhone = req.body.phone;
        let loginuser = await getSingleData(Admins,{phone:userPhone},'name password role department phone');
       
      console.log(loginuser);
        if(!loginuser){
          console.log(userPhone +" is not found at " +localDate());
          return res.json({status:true,login:false,username: false,password:false,error:false});
        } else{
          if(loginuser.password===req.body.password){
            let token = await createToken({data: {user:{name:loginuser.name, phone: loginuser.phone, role: loginuser.role, id:loginuser._id}}});
          
            console.log(loginuser.phone +" with name "+loginuser.name + " is logged in at " +localDate());
            return res.json({status:true,login:true ,username:true,password:true,error:false, token: token, name: loginuser.name,role: loginuser.role});
          } else{
            console.log(loginuser.phone +" with name "+loginuser.name + " tried to false login at " +localDate());
            return res.json({status:true,login:false,username: true,password:false,error:false});
          }
          
        }
    }
  };
  