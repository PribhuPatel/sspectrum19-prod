

var {Departments, Events} = require('../../../middlewares/schemas/schema');
var {getSingleData} = require('../../../utils/helpers/general_one_helper');

module.exports = {
    createEvent: async (req, res) => {
        
        let name = req.body.name;
        let department = await getSingleData(Departments,{name: req.body.department});
        let max_participants= req.body.max_participants;
        let min_members= req.body.min_members;
        let max_members= req.body.max_members;
        let price = req.body.price;
        let round1 = null || req.body.round1;
        let round2 = null || req.body.round2;
        let round3 = null || req.body.round3;
        let coordinators = [] || req.body.coordinators;
        let img = null || req.body.img;
        let description = null || req.body.description;
        let event = await getSingleData(Events,{name: name});
       //console.log(olduser.length);
       //console.log(olduser);
       if(department === null){
           res.send("Cannot Add Event Without Department");
       } else{
    if(event===null){
        var newEvent = new Events({
            name: name,
            department: department._id,
            max_members:max_members,
            min_members: min_members,
            max_participants: max_participants,
            price: price,
            available_entries:max_participants,
            description: description,
            img: img,
            rounds:{
                round1: round1,
                round2:round2,
                round3:round3
            },
            coordinators: coordinators
        });

       await newEvent.save(async (err)=>{
            if(err) {
              //  console.log(err);
                res.send(err);
            }
            else{
                department.events.push(newEvent._id);
                await department.save();
               // console.log("Saved");
            res.send(newEvent + "saved");
            }
        });
    }else{
        res.send("Event Already exist");
    }
}
//   console.log(req.body.email);
//   console.log(req.body.password);
     // res.json({ status: true });
    },
  };
  