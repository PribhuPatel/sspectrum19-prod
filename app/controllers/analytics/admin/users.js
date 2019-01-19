var {Users,Participants} = require('../../../middlewares/schemas/schema');
var {getManyDataWithPopulate} = require('../../../utils/helpers/general_one_helper');

module.exports = {
    users: async (req, res,next) => {
      
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
                      id:"$_id",
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
  
