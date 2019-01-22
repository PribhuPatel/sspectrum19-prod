var {Participants, Events,Colleges,SingleEntries,Packages} = require('../../../middlewares/schemas/schema');
var {getSingleData,getManyData, getCount,getSingleDataWithPopulate} = require('../../../utils/helpers/general_one_helper');

module.exports = {
    getParticipantWiseData: async (req, res,next) => {
        // let participant = await getSingleDataWithPopulate(Participants,{_id:req.body.participant},'package createby college tech1 tech2 nontech','created_date firstname lastname payment college phone email','name tech1 tech2 nontech');
        let participant = await populateParticipant(Participants,{_id:req.body.participant},'created_date firstname lastname payment college phone email events');
        // let events = [];
        var fullpackage = {};
        var events = [];
        // if(participant.package._id){
        //     // let check = await getCount(SingleEntries,{$and:[{package:participant.package._id},{verify:true}]});
        //     let package = await getSingleDataWithPopulate(Packages,{_id:participant.package._id},'tech1 tech2 nontech event');
        //     let techevent1 = await getSingleData();
        //     let tech1 = {

        //     }
        // }
        if(participant[0].package){
            let role1,role2,role3;
            role1=role2=role3 ='Team Member'
            console.log(participant[0].package.tech1.team_leader);
            
            if(participant[0].package.tech1.team_leader.toString() == participant[0]._id.toString()){
                role1 = 'Team Leader'
            }
            if(participant[0].package.tech2.team_leader.toString() == participant[0]._id.toString()){
                role2 = 'Team Leader'
            }
            if(participant[0].package.nontech.team_leader.toString() == participant[0]._id.toString()){
                role3 = 'Team Leader'
            }
            let tech1members = [];
            let tech2members = [];
            let nontechmembers = [];
            for(let i=0;i<participant[0].package.nontech.participants.length;i++){
                tech1members.push(participant[0].package.nontech.participants[i].firstname + " "+participant[0].package.nontech.participants[i].lastname);
            }
            for(let i=0;i<participant[0].package.nontech.participants.length;i++){
                tech2members.push(participant[0].package.nontech.participants[i].firstname + " "+participant[0].package.nontech.participants[i].lastname);
            }
            for(let i=0;i<participant[0].package.nontech.participants.length;i++){
                nontechmembers.push(participant[0].package.nontech.participants[i].firstname + " "+participant[0].package.nontech.participants[i].lastname);
            }
            let check = await getCount(SingleEntries,{$and:[{package:participant[0].package._id},{verify:true}]});
            let verify=false;
            if(check==1){
                verify=true;
            }
            fullpackage = {
                tech1: {
                    name : participant[0].package.tech1.event.name,
                    role : role1,
                    members: tech1members.toString()
                },
                tech2: {
                    name : participant[0].package.tech2.event.name,
                    role : role2,
                    members: tech2members.toString()
                },
                nontech: {
                    name : participant[0].package.nontech.event.name,
                    role : role3,
                    members: nontechmembers.toString()
                },
                verify:verify
            }
        }
        var participantDetails = {
            name: participant[0].firstname + " " + participant[0].lastname,
            college: participant[0].college.name,
            mobile: participant[0].phone,
            email: participant[0].email,
            events: participant[0].events.length,
            payment: participant[0].payment,
            register_date: participant[0].created_date,
            register_by: participant[0].createby.name
        }

        let individual_events = await populateEntries(SingleEntries,{$and:[{participant:participant[0]._id},{entry:{$ne:null}}]},'entry verify');
        // individual_events = individual_events[0];
        for(let i=0;i<individual_events.length;i++){
            let role = 'Team Member'
            if(individual_events[i].entry.team_leader.toString() ==participant[0]._id.toString()){
                role = 'Team Leader'
            }
            let teammembers = [];
            for(let j=0;j<individual_events[i].entry.participants.length;j++){
                teammembers.push(individual_events[i].entry.participants[j].firstname + " "+individual_events[i].entry.participants[j].lastname);
            }
            events.push({
                name:individual_events[i].entry.event.name,
                members: teammembers.toString(),
                role: role,
                verify: individual_events[i].verify
            })
        }
        // console.log(individual_events);
        
        // console.log(participant);
        // console.log(fullpackage);
        // console.log(participantDetails);
        // console.log(events);
        // console.log(participant[0].package.tech1);
        // console.log(package);
        
        return res.json({status:true,participantDetails:participantDetails,packageDetails: fullpackage,events:events});
    }
  };

var populateParticipant = async(Collection, query,fields)=>{
    return new Promise((resolve, reject) =>{
  Collection.
    find(query,fields).
    populate([{
    path: 'package',
    populate: [{ path: 'tech1',select:'team_leader participants',populate:[{path:'event',select:'name'},{path:'participants',select:'firstname lastname'}] },
    { path: 'tech2',select:'team_leader participants',populate:[{path:'event',select:'name'},{path:'participants',select:'firstname lastname'}] },
    { path: 'nontech',select:'team_leader participants',populate:[{path:'event',select:'name'},{path:'participants',select:'firstname lastname'}] }]
    },{
        path:'createby',
        select:'name'
    },{
        path:'college',
        select:'name'
    }]).exec((err,result)=>{
        (err ? reject(err) : resolve(result))
    });
    })
}

var populateEntries = async(Collection, query,fields)=>{
    return new Promise((resolve, reject) =>{
  Collection.
    find(query,fields).
    populate([{
    path: 'entry',
    select:'team_leader participants',
    populate:[{path:'event',select:'name'},{path:'participants',select:'firstname lastname'}] 

    }]).exec((err,result)=>{
        (err ? reject(err) : resolve(result))
    });
    })
}