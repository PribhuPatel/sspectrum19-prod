

var {Participants, Users, Colleges} = require('../../../middlewares/schemas/schema');
var {getSingleData,localDate,sendmail} = require('../../../utils/helpers/general_one_helper');
// var moment = require('moment-timezone');


module.exports = {
    createProfile : async (req, res) => {
        let partiPhone = req.body.phone;
        let participant = await getSingleData(Participants,{phone:partiPhone});
        let user = await getSingleData(Users, {phone: req.user.phone});
        let college = await getSingleData(Colleges,{$and:[{name: req.body.college.split(",")[0]},{city: req.body.college.split(",")[1]}]});
     let  date = localDate();

    if(participant===null){
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
       await newParticipant.save(async (err)=>{
            if(err) {
               console.log(err);
               
        return res.json({status: false,addParticipant: false, alreadyAdded: false});
            }
            else{
                await user.registered.participants.push(newParticipant._id);
                await college.registered.participants.push(newParticipant._id);
                await college.save();
                await user.save();
                console.log(newParticipant.phone +":"+newParticipant.firstname + " has been created by "+user.phone+":"+user.name + " at "+date.toUTCString());
                
                let replacements = {
                    name: newParticipant.firstname + " " + newParticipant.lastname,
                    email: newParticipant.email,
                    mobile: newParticipant.phone,
                    college: college.name
                }
                try{
                let mail = await sendmail('/participant.html',newParticipant.email,"You have Registered for Spectrum\'19",replacements);
                console.log("Create participant Mail sended to "+ newParticipant.email);
                } catch(e) {
                    
                console.log("Mail send failed to " + newParticipant.email);
                }
                return res.json({status: true, addParticipant: true, alreadyAdded:false});
            }
        });
    }else{
        return res.json({status: true,addParticipant: false, alreadyAdded: true});
    }},
  };
  