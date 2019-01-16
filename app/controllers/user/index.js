const router = require('express').Router();


router.post('/dashboard',require('./dashboard').dashboard);


module.exports = router;