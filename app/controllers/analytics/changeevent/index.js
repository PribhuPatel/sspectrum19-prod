const router = require('express').Router();

router.post('/changesingleevent', require('./changeevent').changeSingleEvent);

module.exports = router;