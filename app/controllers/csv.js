

var {Colleges,Participants, Entries, Users} = require('../middlewares/schemas/schema');
var {getManyDataWithPopulate, getSingleData} = require('../utils/helpers/general_one_helper');

module.exports = {
    getParticipants: async (req, res) => {
        var source = [];
        var participants =await getManyDataWithPopulate(Participants,{},'college','college firstname lastname email phone college payment','name');
        if(participants.length != 0 ){
        for(var i = 0; i < participants.length; i++) {
                                source.push({
                                    "firstname":participants[i].firstname, 
                                    "lastname":participants[i].lastname, 
                                    "email":participants[i].email, 
                                    "phone":participants[i].phone,
                                    "college": participants[i].college.name,
                                    "payment": participants[i].payment
                                })
                            }
                            return res.json(source)
                        } else{
                            source.push({
                                "firstname":"", 
                                "lastname":"", 
                                "email":"", 
                                "phone":"",
                                "college": "",
                                "payment": ""
                            })
                        return res.json(source);
                        }
    },
    getByEvent: async (req,res)=>{
        var source = [];
        var groups = await getManyDataWithPopulate(Entries,{event : req.body.event_id},'participants','participants college','firstname lastname email phone college name');
        if(groups.length != 0 ){
            for(var i = 0; i < groups.length; i++) {
                                    for(let j=0;j<groups[i].participants.length;j++){
                                    let participant = groups[i].participants[j];
                                    let college = await getSingleData(Colleges,{_id:participant.college},'name');
                                    source.push({
                                        "entry": groups[i]._id,
                                        "firstname":participant.firstname, 
                                        "lastname":participant.lastname, 
                                        "email":participant.email, 
                                        "phone":participant.phone,
                                        "college": college.name
                                    })
                                }
                                source.push({
                                    "firstname":"", 
                                    "lastname":"", 
                                    "email":"", 
                                    "phone":"",
                                    "college": ""
                                })

                            }
                                return res.json(source)
                            } else{
                                source.push({
                                    "firstname":"", 
                                    "lastname":"", 
                                    "email":"", 
                                    "phone":"",
                                    "college": ""
                                })
                            return res.json(source);
                            }
    },
    getByCollege: async (req,res)=>{
        var source = [];
        var participants = await getManyDataWithPopulate(Participants,{college : req.body.college_id},'events','firstname lastname email phone','name');
        if(participants.length != 0 ){
            for(var i = 0; i < participants.length; i++) {
                                    let participant = {
                                        "firstname":participants[i].firstname, 
                                        "lastname":participants[i].lastname, 
                                        "email":participants[i].email, 
                                        "phone":participants[i].phone
                                    }
                                    for(let j=0;j<participants[i].events.length;j++){
                                        participant["Event"+(j+1)] = participants[i].events[j].name
                                }
                                source.push(participant)
                                }
                                return res.json(source)
                            } else{
                                source.push({
                                    "firstname":"", 
                                    "lastname":"", 
                                    "email":"", 
                                    "phone":"",
                                    "college": ""
                                })
                            return res.json(source);
                            }
    },
    // getByUser: async (req, res) => {
    //     var source = [];
    //     var participants =await getManyDataWithPopulate(Participants,{createby:req.body.user_id},'college','college firstname lastname email phone college payment package events','name');
    //     if(participants.length != 0 ){
    //     for(var i = 0; i < participants.length; i++) {
    //         let package =0;
    //         let event = 0;
    //         if(participants[i].package){
    //             package = 50;
    //             if(participants[i].events.length>3){
    //                 event = event + ((participants[i].events.length-3) *20)
    //             }
    //         } else {
    //             event = event + (participants[i].events.length * 20)
    //         }
    //                             source.push({
    //                                 "_id": participants[i]._id,
    //                                 "firstname":participants[i].firstname, 
    //                                 "lastname":participants[i].lastname, 
    //                                 "email":participants[i].email, 
    //                                 "phone":participants[i].phone,
    //                                 "college": participants[i].college.name,
    //                                 "package":package,
    //                                 "event" : event
    //                             })
    //                         }
    //                         return res.json(source)
    //                     } else{
    //                         source.push({
    //                             "firstname":"", 
    //                             "lastname":"", 
    //                             "email":"", 
    //                             "phone":"",
    //                             "college": "",
    //                             "payment": ""
    //                         })
    //                     return res.json(source);
    //                     }
    // },
    getByUser: async (req, res) => {
        var source = [];
        console.log("asd");
        
        let user = await getSingleData(Users,{phone:req.body.phone});
        var participants =await getManyDataWithPopulate(Participants,{createby:user._id},'college events','college firstname lastname email phone college payment package events','name');
        if(participants.length != 0 ){
        for(var i = 0; i < participants.length; i++) {
            let events = [];
            for(let j=0;j<participants[i].events.length;j++){
                events.push(participants[i].events[j].name);
            }
            let package =0;
            let event = 0;
            if(participants[i].package){
                package = 50;
                if(participants[i].events.length>3){
                    event = event + ((participants[i].events.length-3) *20)
                }
            } else {
                event = event + (participants[i].events.length * 20)
            }   
                                source.push({
                                    "_id": participants[i]._id,
                                    "firstname":participants[i].firstname, 
                                    "lastname":participants[i].lastname, 
                                    "email":participants[i].email, 
                                    "phone":participants[i].phone,
                                    "college": participants[i].college.name,
                                    "events": events,
                                    "package":package,
                                    "event" : event
                                })
                            }
                            return res.json(source)
                        } else{
                            source.push({
                                "firstname":"", 
                                "lastname":"", 
                                "email":"", 
                                "phone":"",
                                "college": "",
                                "events":"",
                                "package":package,
                                "event" : event
                                // "payment": ""
                            })
                        return res.json(source);
                        }
    },
  };
  