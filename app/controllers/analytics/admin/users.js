var {Users,Participants, SingleEntries} = require('../../../middlewares/schemas/schema');
var {getManyDataWithPopulate,getManyData,getCount} = require('../../../utils/helpers/general_one_helper');
const mongoose =  require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
module.exports = {
    users: async (req, res,next) => {
        // var registered_users=[]; 
       
        //  ).exec();
        let registered_users= await getProcessedData();

        let campaignUsers = await getManyDataWithPopulate(Users,{},'college','name college registered phone email','name');
        var campaign_users=[];
        for(i=0;i<campaignUsers.length;i++){
            let user = {
                id:campaignUsers[i].id,
                name :campaignUsers[i].name,
                phone :campaignUsers[i].phone,
                email :campaignUsers[i].email,
                college :campaignUsers[i].college.name,
                registered_participants: campaignUsers[i].registered.participants.length
            }
            campaign_users.push(user);
        }
        return res.json({status: true, registered_users: registered_users,campaign_users:campaign_users});
}
  };
  


  function checkVerify(participant){
    return new Promise(async(resolve, reject) =>{
    let verify=false;
    // let part = ObjectId(participant)
    console.log(participant);
    
    let check = await getCount(SingleEntries,{$and:[{participant:participant},{verify:false}]});
    if(check==0){
        verify = true;
    }
    resolve(verify)
    })
}

function getProcessedData(){
    return new Promise(async(resolve, reject) =>{
await  Participants.aggregate(
    [
        {$match:{createby:{$ne:'5c4032db44dcf010af3c8cf6'}}},
    { $lookup: {
        from: "colleges",
        localField: "college",
        foreignField: "_id",
        as: "college"
    }},
    {
        $unwind: '$college'
    },
       {
          $project: {
              id:"$_id",
             firstname:"$firstname",
             lastname:"$lastname",
             phone:"$phone",
             email: "$email",
             college:"$college.name",
             events: { $size: "$events" },
             verified: 'true'
            //  ,
            //  verify: false
            // "verified": await checkVerify()
            // verified: await function(){
                // return new Promise(async(resolve, reject) =>{
                // let verify=false;
                // // let part = ObjectId(participant)
                // console.log("$id");
                
                // let check = await getCount(SingleEntries,{$and:[{participant:"$id"},{verify:false}]});
                // if(check==0){
                //     verify = true;
                // }
                // resolve(verify)
                // })
                // return "sad"
        //   }
        }
       }
    ],async(err,results)=>{
        // console.log(results);
        
        let entries = await getManyData(SingleEntries,{verify:false});
        for(let i=0;i<entries.length;i++){
            // console.log(entries[i]);
            
        let index = results.findIndex(x => x.id.toString()==entries[i].participant.toString());
        results[index]["verified"]='false'
        // console.log(index);
        
        }
        // for(let i=0;i<results.length;i++){
        //     results[i]["verified"] = false
        //     //     results[i].verified=false;   
        //         let check = await getCount(SingleEntries,{$and:[{participant:results[i]._id},{verify:false}]});
        //         if(check==0){
                    
        //     results[i]["verified"] = true
        //         }
        //         // console.log(results[i]);
                 
        // }
       resolve(results); 
        // registered_users = results;
    });
})
}