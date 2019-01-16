const router = require('express').Router();


// router.post('/createuser', require('./createuser').createUser);

router.post('/getuser', require('./getuser').getUser);

router.post('/getusers', require('./getuser').getUsers);


 module.exports = router;