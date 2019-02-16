const router = require('express').Router();

const {verifyToken} = require('../../middlewares/verifytoken');

router.use('/auth',require('./auth'));

router.post('/register',verifyToken,require('./register').checkQr);

router.post('/event/register',verifyToken,require('./event').checkQr);

router.post('/event/checkAttendance',verifyToken,require('./event').ckeckAttendance);

router.post('/food',verifyToken,require('./food').checkQr);

router.get('/event/createtable',require('./event').createTable);

module.exports = router;