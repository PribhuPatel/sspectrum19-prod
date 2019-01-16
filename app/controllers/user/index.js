const router = require('express').Router();

const {verifyToken} = require('../../middlewares/verifytoken');

router.post('/dashboard',verifyToken,require('./dashboard').dashboard);


module.exports = router;