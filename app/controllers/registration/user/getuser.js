

var {Users} = require('../../../middlewares/schemas/schema');
var {getSingleDataWithPopulate, getSingleData,getManyData, getManyDataWithPopulate} = require('../../../utils/helpers/general_one_helper');

module.exports = {
    getUser: async (req, res) => {
        
       // let name = req.body.name;
        let userphone = req.body.phone;
        let id = req.body.id;

        let user = await getSingleData(Users,{$or:[{phone: userphone},{_id: id}]},req.body.fields);
    if(user===null){
        res.send("No User Found");
    }else{
        res.send(user);
    }
},
    // getDepartmentWithEvents: async (req, res) => {
        
    //     let name = req.body.name;
    //     let id = req.body.eventid;

    //     let department = await getSingleDataWithPopulate(Departments,{$or:[{name: name},{_id: id}]},'events');
    //     if(department===null){
    //     res.send("No Department Found");
    // }else{
    //     res.send(department);
    // }
    // },
    getUsers: async(req,res)=>{
        
        //let name = req.body.name;
        //let id = req.body.eventid;

        let users = await getManyData(Users,{},req.body.fields);
    if(users.length === 0){
        res.send("No Users Found");
    }else{
        res.send(users);
    }
    },
    // getDepartmentsWithEvents: async(req,res)=>{
    //     let name = req.body.name;
    //     let id = req.body.eventid;

    //     let department = await getManyDataWithPopulate(Departments,{},'events');
    // if(department===null){
    //     res.send("No Department Found");
    // }else{
    //     res.send(department);
    // }
    // }
  };
  