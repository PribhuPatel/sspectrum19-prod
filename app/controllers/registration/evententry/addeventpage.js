

var {Events, Entries} = require('../../../middlewares/schemas/schema');
var {getManyData, getManyDataWithPopulateWithLimit,getManyDataWithPopulate} = require('../../../utils/helpers/general_one_helper');

module.exports = {
  addEventPage: async (req, res) => {
        
        let events =await getManyData(Events,{},'name');
      return res.json({ status: true, events: events });
    },
    getLeaders: async(req,res)=>{
      let partiPhone = req.body.leader_phone;
  let leaders  = await  getManyDataWithPopulate(Entries,{event:req.body.event_id},'team_leader event','team_leader event participants','firstname lastname phone name max_members');
    leaders = leaders.filter(l=> (l.team_leader.phone.toString().includes(partiPhone.toString() ) && l.participants.length<l.event.max_members));
   return res.json({status:true, leaders:leaders});
    }
  };
  