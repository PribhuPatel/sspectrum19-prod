

var {Ondayusers} = require('../../../middlewares/schemas/schema');
var {getSingleData} = require('../../../utils/helpers/general_one_helper');

module.exports = {
    signup: async (req, res) => {
        
        let userPhone = req.body.phone;
        let olduser = await getSingleData(Ondayusers,{phone:userPhone});
       console.log(olduser);
    if(olduser===null){
        var user = new Ondayusers({
            name: req.body.name,
            phone: req.body.phone,
            password  : req.body.password,
            role: req.body.role,
            event:req.body.event
        });
       await user.save((err)=>{
            if(err) {
                res.send(err);
            }
            else{
            res.send(user + "saved");
            }
        });
    }else{
        res.send("User Already exist");
    }
    },
  };
  