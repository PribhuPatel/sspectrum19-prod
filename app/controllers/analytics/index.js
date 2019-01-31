const router = require('express').Router();
const {verifyToken} = require('../../middlewares/verifytoken');

router.use('/admin',verifyToken, require('./admin'));


// router.use('/admin',require('./admin'));

router.use('/auth', require('./auth'));

router.use('/coordinator', verifyToken,require('./coordinator'));

router.use('/events', verifyToken,require('./events'));

router.use('/add',verifyToken, require('./add'));

router.use('/getdata',verifyToken, require('./getdata'));

router.use('/csv',require('./csv'));

// router.use('/campaigning',require('./campaigning'));

router.use('/campaigning',verifyToken,require('./campaigning'));

router.use('/emailoptions',require('./emailoptions'));

module.exports = router;