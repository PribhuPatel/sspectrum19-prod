

var {Departments, Events} = require('../../../middlewares/schemas/schema');
var {getSingleDataWithPopulate, getSingleData,getManyData, getManyDataWithPopulate} = require('../../../utils/helpers/general_one_helper');

module.exports = {
    getDepartment: async (req, res) => {
        
        let name = req.body.name;
        let id = req.body.eventid;

        let department = await getSingleData(Departments,{$or:[{name: name},{_id: id}]});
    if(department===null){
        res.send("No Department Found");
    }else{
        res.send(department);
    }
},
    getDepartmentWithEvents: async (req, res) => {
        
        let name = req.body.name;
        let id = req.body.eventid;

        let department = await getSingleDataWithPopulate(Departments,{$or:[{name: name},{_id: id}]},'events');
        if(department===null){
        res.send("No Department Found");
    }else{
        res.send(department);
    }
    },
    getDepartments: async(req,res)=>{
        
        // let name = req.body.name;
        // let id = req.body.eventid;

        let department = await getManyData(Departments,{},'linked_department');
    // if(department===null){
    //     res.send("No Department Found");
    // }else{
       return  res.json({status: true, departments: department});
    // }
    },
    getDepartmentsWithEvents: async(req,res)=>{
        let name = req.body.name;
        let id = req.body.eventid;

        let department = await getManyDataWithPopulate(Departments,{},'events');
    if(department===null){
        res.send("No Department Found");
    }else{
        res.send(department);
    }
    }
  };
  