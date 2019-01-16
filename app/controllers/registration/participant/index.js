const router = require('express').Router();

router.post('/createprofile', require('./createprofile').createProfile);

router.post('/getprofilewithphone', require('./getprofilewithphone').getProfile);

 module.exports = router;