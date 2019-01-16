
var {Users,GlobalVars} = require('../../middlewares/schemas/schema');
var {getSingleData} = require('../../utils/helpers/general_one_helper');
var {createToken,verifyToken} = require('../../utils/tokenhelper.js');

module.exports = {
    login:  async(req, res) => {
  
        let userPhone = req.body.phone;
        var check = await getSingleData(GlobalVars,{key:'portal_status'},'value');
        if(check.value == 'true'){
        let loginuser = await getSingleData(Users,{phone:userPhone});
       //console.log(olduser.length);
      // console.log(loginuser);
        if(!loginuser){
          return res.json({status:true,login:false,username: false,password:false,error:false,portal_status:check.value});
        } else{
          if(loginuser.password===req.body.password){
            let token = await createToken({data: {user:{name:loginuser.name, phone: loginuser.phone, role: loginuser.role}}});
            const tokenData = await verifyToken(token);
            // console.log(tokenData);
           // res.cookie('access-token',token ,{ maxAge: 900000, httpOnly: true });
           // res.send("sada");
        //   console
      //  res.append('Set-Cookie', 'access-token=' + token + ';');
            //return res.cookie('accesstoken',token,{ maxAge: 365 * 24 * 60 * 60 * 1000}).json({status:true,login:true ,username:true,password:true,error:false});
            return res.json({status:true,login:true ,username:true,password:true,error:false, token: token, name: loginuser.name,role: loginuser.role,portal_status:check.value});
          } else{
            return res.json({status:true,login:false,username: true,password:false,error:false,portal_status:check.value});
          }
          
        }
      } else {
        return res.json({status:true,login:false,username: false,password:false,error:false,portal_status:check.value});
      }
      //  res.json(loginuser);
 // console.log(req.body.email);
 // console.log(req.body.password);
     //res.json({ status: true });
    }
  };
  