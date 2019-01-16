

var {Departments, Events} = require('../../../middlewares/schemas/schema');
var {getSingleData} = require('../../../utils/helpers/general_one_helper');

module.exports = {
    addEvent: async (req, res) => {
        let name = req.body.event_name;
        let department = await getSingleData(Departments,{_id: req.body.department_id});
        let max_participants= req.body.max_participants;
        let min_members= req.body.min_members;
        let max_members= req.body.max_members;
        let price = req.body.price;
        let round1 = req.body.round1_description;
        let round2 = req.body.round2_description;
        let round3 = req.body.round3_description;
        let coordinators = req.body.coordinators;
        let event_type = req.body.event_type;
        let img = req.body.image;
        let description = req.body.event_description;
        let event = await getSingleData(Events,{name: name});
    
       
       if(department === null){
        return res.json({status: true, eventAdded:false,alreadyAdded:false,error:true});
       } else{
    if(event===null){
        var newEvent = new Events({
            name: name,
            department: department._id,
            max_members:max_members,
            min_members: min_members,
            max_participants: max_participants,
            price: price,
            available_entries: max_participants,
            description: description,
            img: img,
            event_type:event_type,
            rounds:{
                round1: round1,
                round2:round2,
                round3:round3
            },
            coordinators: coordinators
        });

       await newEvent.save(async (err)=>{
            if(err) {
               console.log(err);
            }
            else{
                department.events.push(newEvent._id);
                await department.save();
                console.log(req.user.phone + " Added Event: "+newEvent.name);
                return res.json({status: true, eventAdded:true,alreadyAdded:false,error:false});
            }
        });
    }else{
        return res.json({status: true, eventAdded:false,alreadyAdded:true,error:false});
    }
}
    }
  };
  