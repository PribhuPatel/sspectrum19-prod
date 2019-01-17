var express = require('express');
var router = express.Router();
var {SingleEntries, Events, Packages} = require('../middlewares/schemas/schema');
var {getSingleData} = require('../utils/helpers/general_one_helper');

router.get('/',(req,res)=>{
    res.render("index");
});

// router.get('/login',function(req, res, next) {
//   res.render('login');
// });

// router.get('/signup', function(req, res, next) {
//     res.render('signup');
// });

router.get('/verify/:token',async function(req,res){
    let token = req.params.token;
    if(token.match(/^[0-9a-fA-F]{24}$/)){
    let singleEntry = await getSingleData(SingleEntries,{_id:token});
    if(singleEntry===null){
        return res.send("Token is not Acceptable");
    } else {
    if(singleEntry.verify){
        return res.send("Already Verified");
    }  else {
        if(singleEntry.event  != null){
            let event = await getSingleData(Events,{_id:singleEntry.event});
             event["available_entries"] = event["available_entries"] - 1;
             event.save();
        } else if(singleEntry.package !=null) {
            let package  = await getSingleData(Packages,{_id:singleEntry.package},'tech1 tech2 nontech');
            console.log(package);
            let tech1 = await getSingleData(Events,{_id:package.tech1});
            let tech2 = await getSingleData(Events,{_id:package.tech2});
            let nontech = await getSingleData(Events,{_id:package.nontech});
            console.log(tech1); 
            tech1["available_entries"] = tech1["available_entries"] - 1;
             tech2["available_entries"] = tech2["available_entries"] - 1;
             nontech["available_entries"] = nontech["available_entries"] - 1;
             tech1.save();
             tech2.save();
             nontech.save();
        }
        singleEntry["verify"] = 1;
        singleEntry.save();
        return res.render("verify");
    }
        }
    } else {
        return res.send("Enter valid token");
    }
})

module.exports = router;