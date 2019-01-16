const router = require('express').Router();


router.post('/createevent',require('./createevent').createEvent);

router.post('/getevent',require('./geteventsdata').getEvent);

router.get('/getevents',require('./geteventsdata').getEvents);

module.exports = router;