var express = require('express');
var router = express.Router();
var {SingleEntries, Events, Packages,Entries} = require('../middlewares/schemas/schema');
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
    var singleEntry;
    try{
    singleEntry = await getSingleData(SingleEntries,{_id:token});
    } catch(e) {
        return res.send("Enter valid token");
    }
    console.log(singleEntry);
    if(singleEntry===null){
        return res.send("Token is not Acceptable");
    } else {
    if(singleEntry.verify){
        return res.send("Already Verified");
    }  else {
             singleEntry["verify"] = 1;
        singleEntry.save();
        return res.render("verify");
    }
        }
})

module.exports = router;