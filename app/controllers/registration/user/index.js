const router = require('express').Router();


// router.use('/participant',require('./participant'));
router.post('/createuser', require('./createuser').createUser);

router.post('/getuser', require('./getuser').getUser);

router.post('/getusers', require('./getuser').getUsers);
// router.use('/event', require('./events'));

// router.use('/evententry', require('./events'));

// router.use('/department', require('./department'));


 module.exports = router;