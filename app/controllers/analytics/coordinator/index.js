const router = require('express').Router();

router.get('/dashboard', require('./dashboard').dashboard);

module.exports = router;