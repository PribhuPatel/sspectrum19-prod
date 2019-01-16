
var {Admins} = require('../../../middlewares/schemas/schema');
var {getSingleData} = require('../../../utils/helpers/general_one_helper');
var {createToken,verifyToken} = require('../../../utils/tokenhelper.js');

module.exports = {
    login:  async(req, res) => {
  
        let userPhone = req.body.phone;
        // let loginuser = await getSingleDataWithPopulate(Admins,{phone:userPhone},'department','name password role department phone','linked_department name');
        let loginuser = await getSingleData(Admins,{phone:userPhone},'name password role department phone');
       
        //console.log(olduser.length);
      console.log(loginuser);
        if(!loginuser){
          return res.json({status:true,login:false,username: false,password:false,error:false});
        } else{
          if(loginuser.password===req.body.password){
            // if(loginuser.department==null){
            //   loginuser.department= {name:'admin'};
            // }
            let token = await createToken({data: {user:{name:loginuser.name, phone: loginuser.phone, role: loginuser.role}}});
            // const tokenData = await verifyToken(token);
            // console.log(tokenData);
           // res.cookie('access-token',token ,{ maxAge: 900000, httpOnly: true });
           // res.send("sada");
        //   console
      //  res.append('Set-Cookie', 'access-token=' + token + ';');
            //return res.cookie('accesstoken',token,{ maxAge: 365 * 24 * 60 * 60 * 1000}).json({status:true,login:true ,username:true,password:true,error:false});
            return res.json({status:true,login:true ,username:true,password:true,error:false, token: token, name: loginuser.name,role: loginuser.role});
          } else{
            return res.json({status:true,login:false,username: true,password:false,error:false});
          }
          
        }
      //  res.json(loginuser);
 // console.log(req.body.email);
 // console.log(req.body.password);
     //res.json({ status: true });
    }
  };
  