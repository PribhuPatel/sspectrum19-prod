var express = require('express');
var router = express.Router();
var {SingleEntries} = require('../middlewares/schemas/schema');
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
    let verify = await getSingleData(SingleEntries,{_id:token},'verify');
    if(verify===null){
        return res.send("Token is not Acceptable");
    } else {
    if(verify.verify){
        return res.send("Already Verified");
    }  else {
        verify["verify"] = 1;
        verify.save();
        return res.send("Thank You for verification");
    }
        }
    } else {
        return res.send("Enter valid token");
    }
})

module.exports = router;