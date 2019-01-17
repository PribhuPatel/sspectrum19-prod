const router = require('express').Router();


router.get('/allparticipants',require('./csvgenerators').getParticipants);

router.post('/byevent',require('./csvgenerators').getByEvent);

router.post('/bycollege',require('./csvgenerators').getByCollege);


router.post('/getbyuser',require('./csvgenerators').getByUser);

module.exports = router;