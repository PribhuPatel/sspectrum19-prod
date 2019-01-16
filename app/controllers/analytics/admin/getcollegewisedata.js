var {Admins,Departments,Participants, Entries, Events,Colleges} = require('../../../middlewares/schemas/schema');
var {getSingleDataWithPopulate, getSingleData,getManyData, getManyDataWithPopulate,getCount} = require('../../../utils/helpers/general_one_helper');
var {verifyToken}  = require('../../../middlewares/verifytoken');
module.exports = {
    getCollegeWiseData: async (req, res,next) => {
      
     
        // console.log(req.body.college_id);
        let events = await getManyData(Events,{},'price name');

        var allEvents = [];
        for(let i=0;i<events.length;i++){
            let participants = await getCount(Participants,{$and:[{college:req.body.college_id},{events:{$in:[events[i]._id]}}]});
            // console.log(participants);
            if(participants != 0){
                allEvents.push({
                    registered_participants: participants,
                    name: events[i].name,
                    id: events[i]._id,
                    revenue: events[i].price * participants
                });
            }
        }

        let college_details = await getSingleData(Colleges,{_id:req.body.college_id},'name city cvm');
        return res.json({status:true,events:allEvents,college_details:college_details});
    }
  };
