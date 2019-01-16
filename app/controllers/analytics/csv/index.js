const router = require('express').Router();


// router.post('/addcollege',require('./addcollege').addCollege);

router.get('/allparticipants',require('./csvgenerators').getParticipants);

router.post('/byevent',require('./csvgenerators').getByEvent);

router.post('/bycollege',require('./csvgenerators').getByCollege);

module.exports = router;