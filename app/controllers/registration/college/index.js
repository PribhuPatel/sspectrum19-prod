const router = require('express').Router();


router.post('/addcollege',require('./addcollege').addCollege);

router.get('/getcollege',require('./getcollege').getCollege);


module.exports = router;