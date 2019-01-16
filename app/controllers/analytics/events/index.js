const router = require('express').Router();

router.post('/geteventdetails', require('./geteventdetails').singleEventDetails);

module.exports = router;