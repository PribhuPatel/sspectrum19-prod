const router = require('express').Router();


router.post('/changetonewemail',require('./mailoptions').changeEmail);

router.post('/sendparticipantmail',require('./mailoptions').sendParticipantMail);

router.post('/changenameandsendcerti',require('./mailoptions').changeNameAndSendCerti);

module.exports = router;