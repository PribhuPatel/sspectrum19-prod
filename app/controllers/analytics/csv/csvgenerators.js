

var {Colleges,Participants, Entries,Users,Packages, Events, SingleEntries, Revenue} = require('../../../middlewares/schemas/schema');
var {getManyDataWithPopulate, getSingleData, getManyData, getCount,localDate} = require('../../../utils/helpers/general_one_helper');
const mongoose =  require('mongoose');
const fs = require('fs');
const json2csv = require('json2csv').parse;
const ObjectId = mongoose.Types.ObjectId;
var csv;

var exec = require('child_process').exec;

module.exports = {
    getParticipants: async (req, res) => {
        var source = [];
        var participants =await getManyDataWithPopulate(Participants,{createby:{$ne:'5c4032db44dcf010af3c8cf6'}},'college','college firstname lastname email phone college payment','name');
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
        var participants = await getManyDataWithPopulate(Participants,{college : req.body.college_id,createby:{$ne:'5c4032db44dcf010af3c8cf6'}},'events','firstname lastname email phone','name');
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
    getByUser: async (req, res) => {
        var source = [];
        var participants;
        console.log("asd");
        if(req.body.phone !=null){
        let user = await getSingleData(Users,{phone:req.body.phone});
        
        participants =await getManyDataWithPopulate(Participants,{createby:user._id},'college events','college firstname lastname email phone college payment package events','name price type');
        } else {
            participants =await getManyDataWithPopulate(Participants,{},'college events','college firstname lastname email phone college payment package events','name price type');
        
        }
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
                    
                for(let k=0;k<participants[i].events.length;k++){
                    event = event + participants[i].events[k].price
                }
                event = event - 60;
                }
            } else {
                for(let k=0;k<participants[i].events.length;k++){
                    event = event + participants[i].events[k].price
                }
                // event = event + (participants[i].events.length * )
            }
            // participants[i]["payment"] = package + event;
            // participants[i].save((err)=>{
            //     if(err){
            //         console.log(err);
            //     }
            // });        
               if(req.body.phone){
                           
                                source.push({
                                    "_id": participants[i]._id,
                                    "firstname":participants[i].firstname, 
                                    "lastname":participants[i].lastname, 
                                    "email":participants[i].email, 
                                    "phone":participants[i].phone,
                                    "college": participants[i].college.name,
                                    "events": events,
                                    "package":package,
                                    "event" : event,
                                    "total":package +event
                                    
                                })
                            } else {
                                source.push({
                                    "_id": participants[i]._id,
                                    "firstname":participants[i].firstname, 
                                    "lastname":participants[i].lastname, 
                                    // "email":participants[i].email, 
                                    // "phone":participants[i].phone,
                                    // "college": participants[i].college.name,
                                    // "events": events,
                                    "package":package,
                                    "event" : event,
                                    "total" : package + event
                                })

                            }
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
    getTotalByUser: async (req, res) => {
        var clashParticipants =[];
        let user1  = await getSingleData(Users,{phone:req.body.user1});
        let date = localDate();
        let da = date.getFullYear()+ '-'+(date.getMonth()+1)+'-' +date.getDate() ;
           let da1 = date.getFullYear()+ '-'+(date.getMonth()+1)+'-' +(date.getDate()+1) ;
           da= da.concat(' 00:00:00 UTC')
           da1= da1.concat(' 00:00:00 UTC')
           da = new Date(da);
           da1 = new Date(da1);
        // let user2 = await getSingleData(Users,{phone:req.body.user2});
        let entries = await getManyData(SingleEntries,{createby:user1._id,created_time:{ $gte: da,$lt:  da1}});

        // let participants = await getManyData(Participants,{createby:user1._id});
    //     for(i=0;i<participants.length;i++){
    //         let partis = [];
    //         partis.push(participants[i]._id);
    //     let clash_participant = await getManyData(Entries,{$and:[{created_by:user2._id},{participants:{"$in":partis}}]});
    //         clashParticipants.push(clash_participant);
    // }
        return res.json({status:true,entries:entries});
        // var source = [];
        // var participants;
        // console.log("asd");
        // if(req.body.phone !=null){
        // let user = await getSingleData(Users,{phone:req.body.phone});
        
        // participants =await getManyDataWithPopulate(Participants,{createby:user._id},'college events','college firstname lastname email phone college payment package events','name');
        // } else {
        //     participants =await getManyDataWithPopulate(Participants,{},'college events','college firstname lastname email phone college payment package events','name');
        
        // }
        // if(participants.length != 0 ){
        // for(var i = 0; i < participants.length; i++) {
        //     let events = [];
        //     for(let j=0;j<participants[i].events.length;j++){
        //         events.push(participants[i].events[j].name);
        //     }
        //     let package =0;
        //     let event = 0;
        //     if(participants[i].package){
        //         package = 50;
        //         if(participants[i].events.length>3){
        //             event = event + ((participants[i].events.length-3) *20)
        //         }
        //     } else {
        //         event = event + (participants[i].events.length * 20)
        //     }           if(req.body.phone){
        //                         source.push({
        //                             "_id": participants[i]._id,
        //                             "firstname":participants[i].firstname, 
        //                             "lastname":participants[i].lastname, 
        //                             "email":participants[i].email, 
        //                             "phone":participants[i].phone,
        //                             "college": participants[i].college.name,
        //                             "events": events,
        //                             "package":package,
        //                             "event" : event,
        //                             "total":package +event
                                    
        //                         })
        //                     } else {
        //                         source.push({
        //                             "_id": participants[i]._id,
        //                             "firstname":participants[i].firstname, 
        //                             "lastname":participants[i].lastname, 
        //                             // "email":participants[i].email, 
        //                             // "phone":participants[i].phone,
        //                             // "college": participants[i].college.name,
        //                             // "events": events,
        //                             "package":package,
        //                             "event" : event,
        //                             "total" : package + event
        //                         })

        //                     }
        //                     }
        //                     return res.json(source)
        //                 } else{
        //                     source.push({
        //                         "firstname":"", 
        //                         "lastname":"", 
        //                         "email":"", 
        //                         "phone":"",
        //                         "college": "",
        //                         "events":"",
        //                         "package":package,
        //                         "event" : event
        //                         // "payment": ""
        //                     })
        //                 return res.json(source);
        //                 }
    },
    getCountbyEvents:async(req,res)=>{
        let events = await getManyData(Events,{});
        var EntriesCounts = []
        try{
        for(let i=0;i<events.length;i++){
            let entriescount = await getCount(Entries,{event:events[i]._id});
            // events[i]["available_entries"] =events[i]["max_participants"] - entriescount
            // events[i].save() 

            // console.log(entriescount);
            EntriesCounts.push({
                name:events[i].name,
                count: entriescount,
                available_entries: events[i].available_entries
            })
        }
    } catch(e){
        console.log(e);
    }
        return res.json({entriescount:EntriesCounts});
    },
    getCountbysingleEntries:async(req,res)=>{
        let date = localDate();
        let da = date.getFullYear()+ '-'+(date.getMonth()+1)+'-' +date.getDate() ;
           let da1 = date.getFullYear()+ '-'+(date.getMonth()+1)+'-' +(date.getDate()+1) ;
           da= da.concat(' 00:00:00 UTC')
           da1= da1.concat(' 00:00:00 UTC')
           da = new Date(da);
           da1 = new Date(da1);
        // let entries = await getManyDataWithPopulate(SingleEntries,{$and:[{created_time:{ $gte: da,$lt:  da1}},{createby:req.body.user_id},{package:{$eq:null}}]},'event','event','price');
        // let package = await getCount(SingleEntries,{$and:[{created_time:{ $gte: da,$lt:  da1}},{createby:req.body.user_id},{entry:{$eq:null}}]})
        var participants = [];
        let entries;
        var user;
        if(req.params.user_id!='all'){
            user = await getSingleData(Users,{_id:req.params.user_id});
     
        entries =  await dataByParticipant(SingleEntries,{$and:[{created_time:{ $gte: da,$lt:  da1}},{createby:ObjectId(req.params.user_id)}]});
        } else {
            user = {
                phone:"all"
            }
        entries =  await dataByParticipant(SingleEntries,{created_time:{ $gte: da,$lt:  da1}});    
        }
        if(entries.length != 0){
        for(let i=0;i<entries.length;i++){
            participants.push({
                "name" : entries[i].participant.firstname + " " + entries[i].participant.lastname,
                "payment" : entries[i].payment
            });
        }
    } else {
        participants.push({
            "name":"",
            "payment":""
        })
    }
        csv = participants;
        // console.log(da);
        // console.log(da1);
        
        // console.log(data);
        // return res.json({participants:participants});
    //     var fields = ['lead', 'salutation', 'fname','lname','title','email','mobile','rating','address','city','state','zcode','company','industry','empSize','lsource'];
    //     var csv = json2csv({ data: data, fields: fields });
    //     var path='./public/csv/file'+Date.now()+'.csv'; 
    //      fs.writeFile(path, csv, function(err,data) {
    //       if (err) {throw err;}
    //       else{ 
    //         res.download(path); // This is what you need
    //       }
    //   }); 
        // await exec("sudo rm -rf dailycsvs/-" '.zip', function (err) { });
        return res.redirect('/analytics/csv/gettodaytotalbyuserdownload/'+user.phone.toString());
    },
    getCountbysingleEntriesDownload:async(req,res)=>{
        // console.log(csv);
        
        // var fields = ["name","payment"];
        var csvdata = json2csv(csv);
        // console.log(csvdata); let date = localDate();
        let date = localDate();
     let da = date.getFullYear()+ '-'+(date.getMonth()+1)+'-' +date.getDate() ;
        var path='dailycsvs/'+req.params.user_phone.toString()+'-'+da.toString()+'.csv'; 
        // var createStream = fs.createWriteStream(path);
        // await createStream.end();
       await csvGenerate(path,csvdata);
//    await res.download(path,(req,));
   return res.status(200).download(path,async function(err){
    if(err){
        console.log(err);
    } else {
        
    // await  fs.unlink(path, (err) => {
    //     if (err) throw err;
    // console.log(path+' was deleted');
    //  });
    }
})

    //   });
        // res.download();
    },
    getAllParticipantWithPayment:async(req,res)=>{
        participants =await getManyData(Participants,{createby:{$ne:'5c4032db44dcf010af3c8cf6'}},'firstname lastname payment');
        sources = []
        for(let i=0;i<participants.length;i++){
            sources.push({
                "firstname":participants[i].firstname,
                "lastname":participants[i].lastname,
                "payment":participants[i].payment
            });
        }
        var csvdata = json2csv(sources);
        
        var path='all.csv';
        await csvGenerate(path,csvdata);
        return res.status(200).send("done");
    },
    getUserDataByDate:async(req,res)=>{
        let date = req.params.date;
        da= date.concat(' 00:00:00 UTC')
        da = new Date(da);
           let da1 = da.getFullYear()+ '-'+(da.getMonth()+1)+'-' +(da.getDate()+1) ;
           da1= da1.concat(' 00:00:00 UTC')
           da1 = new Date(da1);
        //    console.log(da);
           
           var usersDetails = [];
           let users = await getManyData(Users,{},'name phone payment_history');
       for(let i =0;i<users.length;i++){
        //    console.log(users[i].payment_history[0].date.toISOString().split('T')[0]);
           
           let index = users[i].payment_history.findIndex(x=>x.date.toISOString().split('T')[0]==date.toString());

           let payment; 
        if(index==-1){
                payment = 0;
            } else {
               payment = users[i].payment_history[index].payment;
            }

           let packages = await getCount(SingleEntries,{$and:[{created_time:{ $gte: da,$lt:  da1}},{createby:users[i]._id},{package:{$ne:null}}]});
            let events = await getCount(SingleEntries,{$and:[{created_time:{ $gte: da,$lt:  da1}},{createby:users[i]._id},{package:{$eq:null}}]});
           // let package_total = 50 * packages;
            usersDetails.push({
                name:users[i].name,
                phone:users[i].phone,
                package: packages,
                events:events,
                payment: payment
            })
       }
       var path='oldcsvs/'+date.toString()+'.csv'; 

       var csvdata = json2csv(usersDetails);
      await csvGenerate(path,csvdata);
          return res.status(200).download(path,async function(err){
       if(err){
          console.log(err);
      } else {
       
      } 
    })
},
    getRevenueReport:async (req,res)=>{
        let revenue = await getManyData(Revenue,{});
         var revenues =[];
         for(let i=0;i<revenue.length;i++){
        revenues.push({
        "date": revenue[i].date.toISOString().split('T')[0],
        "revenue":revenue[i].revenue
        })  
         }
        return res.json({status:true,revenue_data:revenues});
    },
    getEventReport:async (req,res)=>{
        let events = await getManyDataWithPopulate(Events,{},'department','name max_participants available_entries','name');
        var event_details = []
        for(let i=0;i<events.length;i++){
            event_details.push({
                name:events[i].name,
                department:events[i].department.name,
                team_registered: events[i].max_participants - events[i].available_entries
            })
        }
    return res.json({status:true,events:event_details});
        },
        getDatebysingleEntries:async(req,res)=>{
            var date = req.params.date;
        var da= date.concat(' 00:00:00 UTC')
        da = new Date(da);
           var da1 = da.getFullYear()+ '-'+(da.getMonth()+1)+'-' +(da.getDate()+1) ;
           da1= da1.concat(' 00:00:00 UTC')
           da1 = new Date(da1);
           var participants = [];
            var parti = []             
           let entries;
           var user;
         
           if(date == '2019-01-17' || date == '2019-01-18'){
            if(req.params.user_id!='all'){
                user = await getSingleData(Users,{phone:req.params.user_id},'_id phone');
            //    console.log(user);
                
            entries =  await getManyDataWithPopulate(SingleEntries,{$and:[{created_time:{ $gte: da,$lt:  da1}},{createby:user._id}]},'event participant','event participant','firstname lastname price');
            } else {
                user = {
                    phone:"all"
                }
            entries =  await getManyDataWithPopulate(SingleEntries,{created_time:{ $gte: da,$lt:  da1}},'event participant','event participant package','firstname lastname price');    
            
        }
        // console.log(entries.length);
        // console.log(da);
        // console.log(da1);

            for(let i=0;i<entries.length;i++){
                // console.log(entries[i].event);
                   
                let payment = 0;
                    if(entries[i].event ==null){
                        payment = 50;
                        
                    } else {
                        payment = entries[i].event.price;
                    }
                    // console.log("sad");
                    
                    let index = participants.findIndex(x => x.id.toString()==entries[i].participant._id.toString());
                    // console.log(index);
                    
                    if(index  ==-1){         
                        participants.push({
                            id: entries[i].participant._id,
                            name: entries[i].participant.firstname + " " + entries[i].participant.lastname,
                            payment: payment
                        })
                    } else {
                        participants[index]["payment"] = participants[index]["payment"] + payment
                    }
                }
                for(let i=0;i<participants.length;i++)
                delete participants[i]["id"]; 
            // parti.push
            // console.log(participants);
            // return res.send("wqeqe");
           } else {
            if(req.params.user_id!='all'){
                user = await getSingleData(Users,{phone:req.params.user_id});
                // console.log(user);
                
            entries =  await dataByParticipant(SingleEntries,{$and:[{created_time:{ $gte: da,$lt:  da1}},{createby:user._id}]});
            } else {
                user = {
                    phone:"all"
                }
            entries =  await dataByParticipant(SingleEntries,{created_time:{ $gte: da,$lt:  da1}});    
            }
            // let da = date.getFullYear()+ '-'+(date.getMonth()+1)+'-' +date.getDate() ;
            //    let da1 = date.getFullYear()+ '-'+(date.getMonth()+1)+'-' +(date.getDate()+1) ;
            //    da= da.concat(' 00:00:00 UTC')
            //    da1= da1.concat(' 00:00:00 UTC')
            //    da = new Date(da);
            //    da1 = new Date(da1);
            // let entries = await getManyDataWithPopulate(SingleEntries,{$and:[{created_time:{ $gte: da,$lt:  da1}},{createby:req.body.user_id},{package:{$eq:null}}]},'event','event','price');
            // let package = await getCount(SingleEntries,{$and:[{created_time:{ $gte: da,$lt:  da1}},{createby:req.body.user_id},{entry:{$eq:null}}]})
 
            if(entries.length != 0){
            for(let i=0;i<entries.length;i++){
                participants.push({
                    "name" : entries[i].participant.firstname + " " + entries[i].participant.lastname,
                    "payment" : entries[i].payment
                });
            }
        } else {
            participants.push({
                "name":"",
                "payment":""
            })
        }
    }
            // csv = participants;
            var path='oldparticipantcsvs/'+user.phone+date.toString()+'.csv'; 

            var csvdata = json2csv(participants);
           await csvGenerate(path,csvdata);
               return res.status(200).download(path,async function(err){
            if(err){
               console.log(err);
           } else {
            
           }}) 
            // console.log(da);
            // console.log(da1);
            
            // console.log(data);
            // return res.json({participants:participants});
        //     var fields = ['lead', 'salutation', 'fname','lname','title','email','mobile','rating','address','city','state','zcode','company','industry','empSize','lsource'];
        //     var csv = json2csv({ data: data, fields: fields });
        //     var path='./public/csv/file'+Date.now()+'.csv'; 
        //      fs.writeFile(path, csv, function(err,data) {
        //       if (err) {throw err;}
        //       else{ 
        //         res.download(path); // This is what you need
        //       }
        //   }); 
            // await exec("sudo rm -rf dailycsvs/-" '.zip', function (err) { });
            // return res.redirect('/analytics/csv/gettodaytotalbyuserdownload/'+user.phone.toString());
        // }
  }
}
var dataByParticipant= async (Collection,query)=>{
    return new Promise(async (resolve, reject) =>{
        // console.log(user_id);
        
      Collection.aggregate([
      {$match:query},{
        $group: { 
        _id: {participant:"$participant"},
        payment: { $sum: "$payment" }
    }
    }
    , {
        "$project": {
            "_id": null,
            "participant": "$_id.participant",
            "payment": "$payment"
        }} ],function(err,result){
            SingleEntries.populate(result,{path:'participant',select:'firstname lastname'},function(err,results){
                (err? reject(err) : resolve(results));   
            })
        // console.log(result);
    } )
})
}


var csvGenerate= async(path,csvdata)=>{
    return new Promise(async (resolve, reject) =>{
    await fs.writeFile(path, csvdata, async function(err,data) {
        if (err) {throw err;}
        else{  // This is what you need
        //   let check =true;
          resolve()
  //   return res.status(200).send("File Downlaoded"); 
      }
  });
})
}