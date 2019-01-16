const router = require('express').Router();


router.post('/createpackage',require('./createpackage').createPackage);

router.get('/addpackage',require('./addpackagepage').addPackagePage);

module.exports = router;