const router = require('express').Router();

// const {verifyToken} = require('../../middlewares/verifytoken');

router.post('/register',require('./register').checkQr);


module.exports = router;