

var {Departments, Colleges,Participants, Entries} = require('../../../middlewares/schemas/schema');
var {getManyDataWithPopulate, getSingleData} = require('../../../utils/helpers/general_one_helper');

module.exports = {
    getParticipants: async (req, res) => {
        var source = [];
        var participants =await getManyDataWithPopulate(Participants,{},'college','college firstname lastname email phone college payment','name');
        if(participants.length != 0 ){
        for(var i = 0; i < participants.length; i++) {
                                console.log(participants)
                                //console.log(participants[i]);
                                source.push({
                                    "firstname":participants[i].firstname, 
                                    "lastname":participants[i].lastname, 
                                    "email":participants[i].email, 
                                    "phone":participants[i].phone,
                                    "college": participants[i].college.name,
                                    "payment": participants[i].payment
                                })
                            }
                            console.log(source);
                            // res.csv(source,true)
                            return res.json(source)
                            // callback(null, source);
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
            // console.log(groups[0].participants);
            for(var i = 0; i < groups.length; i++) {
                                    // console.log(participants)
                                    //console.log(participants[i]);
                                    console.log(groups[i].participants.length);
                                    for(let j=0;j<groups[i].participants.length;j++){
                                    let participant = groups[i].participants[j];
                                    let college = await getSingleData(Colleges,{_id:participant.college},'name');
                                    source.push({
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
                                console.log(source);
                                // res.csv(source,true)
                                return res.json(source)
                                // callback(null, source);
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
            // console.log(groups[0].participants);
            for(var i = 0; i < participants.length; i++) {
                                    // console.log(participants)
                                    //console.log(participants[i]);
                                    let participant = {
                                        "firstname":participants[i].firstname, 
                                        "lastname":participants[i].lastname, 
                                        "email":participants[i].email, 
                                        "phone":participants[i].phone
                                    }
                                    // console.log(groups[i].participants.length);
                                    for(let j=0;j<participants[i].events.length;j++){
                                        participant["Event"+(j+1)] = participants[i].events[j].name
                                }
                                source.push(participant)
                                // source.push({
                                //     "firstname":"", 
                                //     "lastname":"", 
                                //     "email":"", 
                                //     "phone":"",
                                //     "college": ""
                                // })

                            }
                                console.log(source);
                                // res.csv(source,true)
                                return res.json(source)
                                // callback(null, source);
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
    }
  };
  