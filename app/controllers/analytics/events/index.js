const router = require('express').Router();

router.post('/geteventdetails', require('./geteventdetails').singleEventDetails);
router.get('/getev', function(req,res){
    res.send("Go from here");
});

module.exports = router;