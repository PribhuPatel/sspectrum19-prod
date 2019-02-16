const router = require('express').Router();


router.post('/login',require('./login').login);

router.post('/signup', require('./signup').signup);

router.get('/logout', function(req,res,next){
     res.clearCookie('accesstoken');
  res.redirect('/');
});

module.exports = router;