

var {Users} = require('../../../middlewares/schemas/schema');
var {getSingleDataWithPopulate, getSingleData,getManyData, getManyDataWithPopulate} = require('../../../utils/helpers/general_one_helper');

module.exports = {
    getUser: async (req, res) => {
        
      let userphone = req.body.phone;
        let id = req.body.id;

        let user = await getSingleData(Users,{$or:[{phone: userphone},{_id: id}]},req.body.fields);
    if(user===null){
        res.send("No User Found");
    }else{
        res.send(user);
    }
},
    getUsers: async(req,res)=>{
    let users = await getManyData(Users,{},req.body.fields);
    if(users.length === 0){
        res.send("No Users Found");
    }else{
        res.send(users);
    }
    }
  };
  