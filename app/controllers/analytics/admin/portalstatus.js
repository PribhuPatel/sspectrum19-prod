var {Admins,Departments,Participants, Entries, Events, GlobalVars} = require('../../../middlewares/schemas/schema');
var {getSingleDataWithPopulate, getSingleData,getManyData, getManyDataWithPopulate,getCount,getDateWiseCount} = require('../../../utils/helpers/general_one_helper');
var {verifyToken}  = require('../../../middlewares/verifytoken');
module.exports = {
    getPortalStatus: async (req, res,next) => {
            let check = await getSingleData(GlobalVars,{key:'portal_status'},'value');
        return res.json({status:true,portal_status: check.value});
    },
    // portalStatusOn: async (req, res,next) => {
    //     process.env.PORTAL_STATUS = true;
    //     return res.json({status:true,portal_status:process.env.PORTAL_STATUS});
    // },
    portalStatusChange: async (req, res,next) => {
        var check = await getSingleData(GlobalVars,{key:'portal_status'},'value');
        if(check.value=='true'){
        // process.env.PORTAL_STATUS=false;
        check.value ='false';
        check.save();
        } else{
            check.value ='true';
            check.save();
        }
        // if(check.value=='true'){
        //     // process.env.PORTAL_STATUS=false;
        //     check.value ='false';
        //     check.save();
        //     }
        return res.json({status:true,portal_status:check.value});
    }

// }
  };
