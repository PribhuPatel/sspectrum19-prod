/* this middleware helps us in verifying the token */


var {Users,Departments,GlobalVars} = require('./schemas/schema');
var {getSingleDataWithPopulate, getSingleData,getManyData, getManyDataWithPopulate} = require('../utils/helpers/general_one_helper');
const tokenHelper = require('../utils/tokenhelper');
// const resHandler = require('../utils/responseHandler');

exports.verifyToken = async (req,res,next) =>{
  //  console.log(req.body);
    //console.log(req.get('auth'));
    // console.log("asdad");
    try{
        var check = await getSingleData(GlobalVars,{key:'portal_status'},'value');
       
        if(req.get('auth') == undefined || null){
        //    return resHandler.errorMessage(res,'no token provided',req);
        return res.send("Fired");
        }
        const tokenData = await tokenHelper.verifyToken(req.get('auth'));
        if(tokenData.data.user.role ==='campaign' && check.value != 'true'){
            return res.json({status:true, message:'Campaigning Turned Off', error:true});
        } else {
        req.user = tokenData.data.user;
        next();
        }
     //   console.log(tokenData.data);
        
    }catch(error){
        // console.log("adsadad");
        /* when token expires 
           either you can end session or refresh the token and 
           send 
        */
        if(error.name === 'TokenExpiredError'){
            // return resHandler.errorMessage(res,'token expired',req);
            return res.json({status:false});
        }
      //  resHandler.errorMessage(res,'not a valid token',req);
    }
}
