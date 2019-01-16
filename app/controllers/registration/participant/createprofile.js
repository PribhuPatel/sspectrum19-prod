

var {Participants, Users, Colleges} = require('../../../middlewares/schemas/schema');
var {getSingleData,localDate} = require('../../../utils/helpers/general_one_helper');
// var moment = require('moment-timezone');


module.exports = {
    createProfile : async (req, res) => {
        console.log(req.body);
        let partiPhone = req.body.phone;
        let participant = await getSingleData(Participants,{phone:partiPhone});
        let user = await getSingleData(Users, {phone: req.user.phone});
        let college = await getSingleData(Colleges,{$and:[{name: req.body.college.split(",")[0]},{city: req.body.college.split(",")[1]}]});
        console.log(participant);

        
// let da = moment().tz("Asia/Kolkata").format();
// console.log(da);
// da.
// var d = new Date(2018, 11, 24, 10, 33, 30, 0);
// var date = da.split('+')[0];
// date = date + "+11";
        
       //console.log(olduser.length);
       //console.log(olduser);
    //    let date = new Date();
    //    console.log(date);
     let  date = localDate();
    //    console.log(date);
    //    let date = new Date();
       // console.log(date+5.5);
       // date = date+5.5;
       
       // let da1 =date.getFullYear()+ '-'+(date.getMonth()+1)+'-' +(date.getDate()+1); 
       
       // console.log();
    //    date = convertUTCDateToLocalDate(date);
    //    let da = date.getFullYear()+ '-'+(date.getMonth()+1)+'-' +date.getDate() ;
       console.log(date);
    //    da = new Date(da + ' 00:00:00');
       
    if(participant===null){
        console.log(participant);
        var newParticipant = new Participants({
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            cvm: college.cvm,
            email: req.body.email,
            phone: req.body.phone,
            createby: user._id,
            college: college._id,
            created_date:date
        });
        //let a= 10;
       await newParticipant.save(async (err)=>{
            if(err) {
               console.log(err);
                res.send(err);
            }
            else{
                // user["today_payment"] = user["today_payment"] + 30;
                // console.log(user["today_payment"]);
                await user.registered.participants.push(newParticipant._id);
                await college.registered.participants.push(newParticipant._id);
                await college.save();
                await user.save();
               // console.log("Saved");
           return res.json({status: true, addParticipant: true, alreadyAdded:false});
           
        //    return res.json({status: true, addParticipant: true,participant_payment: newParticipant.payment});
            }
        });
    }else{
        return res.json({status: true,addParticipant: false, alreadyAdded: true});
    }
//   console.log(req.body.email);
//   console.log(req.body.password);
     // res.json({ status: true });
    },
  };
  