

var {Departments, Colleges} = require('../../../middlewares/schemas/schema');
var {getSingleData} = require('../../../utils/helpers/general_one_helper');

module.exports = {
    addCollege: async (req, res) => {
        
        let name = req.body.name;
        let city = req.body.city;
        let cvm = req.body.cvm;
        let college = await getSingleData(Colleges,{$and:[{name: name},{city: city}]});
       //console.log(olduser.length);
       //console.log(olduser);
    if(college===null){
        var newCollege = new Colleges({
            name: name,
            city: city,
            cvm: cvm
        });
       await newCollege.save((err)=>{
            if(err) {
              //  console.log(err);
              return res.json({status: true, collegeAdded: false, alreadyAdded: false,error:true});
            }
            else{
               // console.log("Saved");
            return res.json({status: true, collegeAdded: true, alreadyAdded: false,error:false});
            }
        });
    }else{
        return res.json({status:true,collegeAdded:false, alreadyAdded: true,error:false});
    }
//   console.log(req.body.email);
//   console.log(req.body.password);
     // res.json({ status: true });
    },
  };
  