var {Participants, Events,Colleges} = require('../../../middlewares/schemas/schema');
var {getSingleData,getManyData, getCount} = require('../../../utils/helpers/general_one_helper');

module.exports = {
    getCollegeWiseData: async (req, res,next) => {
        let events = await getManyData(Events,{},'price name');

        var allEvents = [];
        for(let i=0;i<events.length;i++){
            let participants = await getCount(Participants,{$and:[{college:req.body.college_id},{events:{$in:[events[i]._id]}}]});
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
