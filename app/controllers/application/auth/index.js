const router = require('express').Router();


router.post('/getotp',require('./login').getOTP);
router.post('/login',require('./login').login);


module.exports = router;