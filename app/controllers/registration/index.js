const router = require('express').Router();

const {verifyToken} = require('../../middlewares/verifytoken');

router.use('/participant',verifyToken,require('./participant'));

router.use('/event',verifyToken, require('./events'));

router.use('/evententry',verifyToken,require('./evententry'));

router.use('/packageentry',verifyToken, require('./packageentry'));

router.use('/department',verifyToken, require('./department'));

router.use('/college',verifyToken, require('./college'));

router.use('/user',verifyToken, require('./user'));


module.exports = router;