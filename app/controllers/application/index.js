const router = require('express').Router();
const   {verifyToken}     = require('../../middlewares/verifytoken');

router.use('/auth',require('./auth'));

router.get('/myevents',verifyToken,require('./myevents').getEvents);

router.get('/allevents',verifyToken,require('./allevents').getEvents);

router.get('/schedule',verifyToken,require('./schedule').getSchedule);

module.exports = router;