const router = require('express').Router();


// router.use('/participant',require('./participant'));
router.post('/createprofile', require('./createprofile').createProfile);

router.post('/getprofilewithphone', require('./getprofilewithphone').getProfile);
// router.use('/event', require('./events'));

// router.use('/evententry', require('./events'));

// router.use('/department', require('./department'));


 module.exports = router;