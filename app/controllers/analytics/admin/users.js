var {Users,Departments,Participants, Entries, Events, Colleges} = require('../../../middlewares/schemas/schema');
var {getSingleDataWithPopulate, getSingleData,getManyData, getManyDataWithPopulate,getCount,getDateWiseCount} = require('../../../utils/helpers/general_one_helper');
var {verifyToken}  = require('../../../middlewares/verifytoken');
module.exports = {
    users: async (req, res,next) => {
      
        // let registered_users = await getManyDataWithPopulate(Participants,{},'college','name phone email college this.events.length','name');
     
        let registered_users =await  Participants.aggregate(
            [{ $lookup: {
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
                     firstname:"$firstname",
                     lastname:"$lastname",
                     phone:"$phone",
                     email: "$email",
                     college:"$college.name",
                     events: { $size: "$events" }
                  }
               }
            ]
         ).exec();

        let campaignUsers = await getManyDataWithPopulate(Users,{},'college','name college registered phone email','name');
        var campaign_users=[];
        for(i=0;i<campaignUsers.length;i++){
            let user = {
                name :campaignUsers[i].name,
                phone :campaignUsers[i].phone,
                email :campaignUsers[i].email,
                college :campaignUsers[i].college.name,
                registered_participants: campaignUsers[i].registered.participants.length
            }
            campaign_users.push(user);
        }

        // let campaign_users =await  Users.aggregate(
        //     // [{ $lookup: {
        //     //     from: "college",
        //     //     localField: "college",
        //     //     foreignField: "_id",
        //     //     as: "college"
        //     // }},
        //     // {
        //     //     $unwind: '$college'
        //     // },
        //     [{ $lookup: {
        //             from: "college",
        //             localField: "college",
        //             foreignField: "_id",
        //             as: "college"
        //         }},{
        //                 $unwind: '$college'
        //             },
        //        {
        //           $project: {
        //              name:"$name",
        //              phone:"$phone",
        //              email: "$email",
        //              college:"$college",
        //              registered_participants: { $size: "$registered.participants" }
        //           }
        //        }
        //     ]
        //  ).exec();

        //  let campaign_users = await getManyDataWithPopulate(Users,{},'college','name phone college');
        // let campaign_users = await getManyDataWithPopulate(Events,{},'department','name max_participants available_entries','name');
        return res.json({status: true, registered_users: registered_users,campaign_users:campaign_users});
}
  };
  
