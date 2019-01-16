

var {Departments, Colleges,Events, Entries} = require('../../../middlewares/schemas/schema');
var {getManyData, getManyDataWithPopulateWithLimit} = require('../../../utils/helpers/general_one_helper');

module.exports = {
  addEventPage: async (req, res) => {
        
        let events =await getManyData(Events,{},'name');
      //  let college = await getManyData(Colleges,{},'name city');
       //console.log(olduser.length);
       //console.log(olduser);

//   console.log(req.body.email);
//   console.log(req.body.password);
      return res.json({ status: true, events: events });
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
  let leaders  = await  getManyDataWithPopulateWithLimit(Entries,{event:req.body.event_id},5,'team_leader event','team_leader event participants','firstname lastname phone name max_members');
  console.log(leaders);
  leaders = leaders.filter(l=> (l.team_leader.phone.toString().includes(partiPhone.toString() ) && l.participants.length<l.event.max_members));
  // let leaders  = await getManyDataWithPopulateWithLimit(Entries,{$and:[{event:req.body.event_id},{"$where": "function(){ return this.team_leader.phone.toString().match(/"+partiPhone+"/)!=null;}"}]},5,'phone name','team_leader')
  // let leaders =  await Entries.find({$and:[{event:req.body.event_id},{"$where": "function(){ return this.team_leader.phone.toString().match(/"+partiPhone+"/)!=null;}"}]}).populate({
  return res.json({status:true, leaders:leaders});
    }
  };
  