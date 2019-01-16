const router = require('express').Router();


router.post('/createpackage',require('./createpackage').createPackage);

router.get('/addpackage',require('./addpackagepage').addPackagePage);

// router.post('/getleaders',require('./addeventpage').getLeaders);

module.exports = router;