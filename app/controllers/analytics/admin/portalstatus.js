var {GlobalVars} = require('../../../middlewares/schemas/schema');
var {getSingleData} = require('../../../utils/helpers/general_one_helper');

module.exports = {
    getPortalStatus: async (req, res,next) => {
            let check = await getSingleData(GlobalVars,{key:'portal_status'},'value');
        return res.json({status:true,portal_status: check.value});
    },
    portalStatusChange: async (req, res,next) => {
        var check = await getSingleData(GlobalVars,{key:'portal_status'},'value');
        if(check.value=='true'){
        check.value ='false';
        check.save();
        } else{
            check.value ='true';
            check.save();
        }
        console.log(req.user.phone + " changed portal status to: "+check.value);
        return res.json({status:true,portal_status:check.value});
    }

// }
  };
