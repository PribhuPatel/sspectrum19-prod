

var {Departments, Colleges,Events, Entries} = require('../../../middlewares/schemas/schema');
var {getManyData, getManyDataWithPopulateWithLimit} = require('../../../utils/helpers/general_one_helper');

module.exports = {
  addPackagePage: async (req, res) => {
        
        let techevents =await getManyData(Events,{event_type:'tech'},'name min_members max_members');
        let nontechevents =await getManyData(Events,{event_type:'nontech'},'name min_members max_members');
      //  let college = await getManyData(Colleges,{},'name city');
       //console.log(olduser.length);
       //console.log(olduser);

//   console.log(req.body.email);
//   console.log(req.body.password);
      return res.json({ status: true, techevents:techevents, nontechevents:nontechevents });
    },
    getLeaders: async(req,res)=>{
      let partiPhone = req.body.leader_phone;
  //    let leaders =  await Entries.find({event:req.body.event_id}).populate({
  //       path: 'team_leader',
  //   match: {"$where": "function(){ return this.phone.toString().match(/"+partiPhone+"/)!=null;}"},
  //   select: 'phone name',
  //   options: { limit: 5 }
  // }).
  // exec();
  let leaders  = await  getManyDataWithPopulateWithLimit(Entries,{event:req.body.event_id},5,'team_leader college','team_leader','firstname lastname phone college name');
  leaders = await leaders.filter(l=> l.team_leader.phone.toString().includes(partiPhone.toString()));
  return res.json({status:true, leaders:leaders});
    }
  };
  