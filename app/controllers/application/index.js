const router = require('express').Router();
const   {verifyToken}     = require('../../middlewares/verifytoken');

router.use('/auth',require('./auth'));

router.get('/myevents',verifyToken,require('./myevents').getEvents);

router.get('/allevents',verifyToken,require('./allevents').getEvents);

router.get('/schedule',verifyToken,require('./schedule').getSchedule);

// router.use('/event', require('./events'));

// router.use('/evententry', require('./evententry'));

// router.use('/department', require('./department'));

// router.use('/college', require('./college'));

// router.use('/user', require('./user'));


module.exports = router;