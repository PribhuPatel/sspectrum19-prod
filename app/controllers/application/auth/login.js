
var {Participants, NotificationTokens} = require('../../../middlewares/schemas/schema');
var {getSingleData,sendmail,localDate} = require('../../../utils/helpers/general_one_helper');
var {createToken} = require('../../../utils/tokenhelper.js');
var {Expo} = require('expo-server-sdk');

let expo = new Expo();

function randomString(length, chars) {
    var result = '';
    for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
    return result;
}
module.exports = {
    getOTP:  async(req, res) => {
        let userPhone = req.body.phone;
        let loginuser = await getSingleData(Participants,{phone:userPhone},'firstname lastname phone email password');
        if(!loginuser){
          return res.json({status:true,otp:false,username: false,error:false});
        } else{
            try{
            let rString = randomString(4, '0123456789');
            loginuser.password = rString;
            loginuser.save();
            let replacements = {
                name: loginuser.firstname +" "+ loginuser.lastname,
                otp1:rString[0],
                otp2:rString[1],
                otp3:rString[2],
                otp4:rString[3]
            }
            try{
            let mail = await sendmail('/otpmail.html',loginuser.email,"Spectrum'19 App Login OTP",replacements);
            console.log("OTP Email sended to "+ loginuser.email);
            } catch(e) {
            console.log("Mail send failed to " + login.email);
            }
    // var mailOptions = {
    //     from: config.auth.user,
    //     to: loginuser.email,
    //     subject: "Spectrum App OTP",
    //    text: 'Your OTP is ' + rString,
    // };

    // transporter.sendMail(mailOptions, function (error, info) {
    //     if (error) {
    //         console.log(error);
    //         return res.json({status:true,otp:false,username: true,error:true});
    //     } else {
    //         console.log('Email sent: ' + info.response);
    //     }
    // })
    console.log("OTP sended to "+loginuser.phone + " : " + loginuser.name+" at "+ localDate());
       return res.json({status:true,otp:true,username: true,error:false});
           } catch (e){
                return res.json({status:true,otp:false,username: true,error:true});
            }
        }
    },

    login: async(req,res)=>{
        let userPhone = req.body.phone;
        let loginuser = await getSingleData(Participants,{phone:userPhone},'firstname lastname phone password');
        let notificationToken = req.body.notificationToken;

        if(!loginuser){
          return res.json({status:true,login:false,username: false,password:false,error:false});
        } else{
          if(loginuser.password===req.body.password){
            let token = await createToken({data: {user:{firstname:loginuser.firstname,lastname:loginuser.lastname, phone: loginuser.phone,userid:loginuser._id}}});

            if (!Expo.isExpoPushToken(notificationToken)) {
                console.error(`Push token ${notificationToken} is not a valid Expo push token`);
              } else {
                  let oldtoken = await getSingleData(NotificationTokens,{participant:loginuser._id});
                  if(oldtoken){
                      oldtoken["token"] = notificationToken;
                      oldtoken.save();
                  } else {
                let newNotification = new NotificationTokens({
                    token: notificationToken,
                    participant: loginuser._id
                });

                newNotification.save();
            }
              }
              
            console.log(loginuser.phone + " : " + loginuser.name+" is logged in at "+ localDate());
            return res.json({status:true,login:true ,username:true,password:true,error:false, token: token, name: loginuser.name,userid:loginuser._id});
          } else{
            return res.json({status:true,login:false,username: true,password:false,error:false});
          }
          
    }
  }
}