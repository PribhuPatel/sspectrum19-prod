const router = require('express').Router();


router.post('/createentry',require('./createentry').createEntry);

router.get('/addevent',require('./addeventpage').addEventPage);

router.post('/getleaders',require('./addeventpage').getLeaders);

module.exports = router;