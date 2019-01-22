const router = require('express').Router();


router.post('/changetonewemail',require('./mailoptions').changeEmail);

router.post('/sendparticipantmail',require('./mailoptions').sendParticipantMail);

module.exports = router;