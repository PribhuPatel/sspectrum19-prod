var express = require('express');
var router = express.Router();
var {verifyToken} = require('../middlewares/verifytoken');
var {Participants} = require('../middlewares/schemas/schema');
var {getManyDataWithPopulate} = require('../utils/helpers/general_one_helper');
// var csv = require('csv');
// const async = require('async');
// const Json2csvParser = require('json2csv').Parser;
// var csv = require('csv-express')
/* GET home page. */


router.get('/',(req,res)=>{
  //  console.log(req);
    res.render("index");
});

router.get('/user',verifyToken,(req,res)=>{
    res.render("user",{user:req.user});
});

router.get('/login',function(req, res, next) {
  res.render('login');
});

router.get('/signup', function(req, res, next) {
    res.render('signup');
});


router.get('/mycsv',async function(req, res, next) {
    // await downloadContacts(req,res);
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
});

module.exports = router;


// downloadContacts = function(req,res) {
//     async.waterfall([
//         async function(callback) {
//             var source = [];
//             var participants =await getManyData(Participants,{},'firstname lastname email phone college payment');
//             if(participants.length != 0 ){
//             for(var i = 0; i < participants.length; i++) {
//                                     console.log(participants)
//                                     //console.log(participants[i]);
//                                     source.push({
//                                         firstname:participants[i].firstname, 
//                                         lastname:participants[i].lastname, 
//                                         email:participants[i].email, 
//                                         phone:participants[i].phone,
//                                         college: participants[i].college,
//                                         payment: participants[i].payment
//                                     })
//                                 }
//                                 console.log(source);
//                                 res.csv(source, true)
//                                 // callback(null, source);
//                             }
//                             res.send("sad");
//             // Participants.find({userId: req.signedCookies.userid}, function(err, friends) {
//             //     if(err) {console.log('err with friends for download');
//             //     } else {
//             //         var userMap = {};
//             //         var friendIds = friends.map(function (user) {
//             //             userMap[user.friend_id] = user;
//             //             return user.friend_id;
//             //         });
//             //         console.log(friends);
//                     // User.find({_id: {$in: friendIds}}, function(err, participants) {
//                     //     if(err) {console.log(err); 
//                     //     } else {
//                     //         for(var i = 0; i < participants.length; i++) {
//                     //             console.log('participants')
//                     //             //console.log(participants[i]);
//                     //             source.push(participants[i].firstNameTrue, participants[i].lastNameTrue, participants[i].emailTrue, participants[i].phone, participants[i].emailList, participants[i].phoneList)
//                     //         }
//                     //         console.log(source);
//                     //         callback(null, source);
//                     //     }


//             //         });
//             //     }


//             // });

            

//         }
//     ],
//     function(err, source) {
//         var result = [];
//         var fields = ['firstname', 'lastname', 'email','phone','college','payment'];
//         res.contentType('csv');

//         const csv = json2csv(m, opts);
//         // var json2csvParser = new Json2csvParser({ fields });
//         // var csv = json2csvParser.parse(source);

//         // res.download('');
//         // source =JSON.parse(source);
//         // res.csv(source, true, {
//         //     "Access-Control-Allow-Origin": "*"
//         //   }, 500)
        
//         // csv()
//         // .from(source)
//         // .on('data', function(data){ 
//         //     result.push(data.join());
//         // })
//         // .on('end', function(){
//         //     res.send(result.join('\n'));
//         // });
//     });     
// };