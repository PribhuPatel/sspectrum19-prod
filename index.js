// require('dotenv').config()
const express = require('express');
const ejs = require('ejs');
const app = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const {handle404Error, handleDevErrors} = require('./app/middlewares/errorHandlers');
//const passport  = require('passport');
const {connectMongoDb} = require('./app/middlewares/mongodb');
app.set('views', './views') // specify the views directory
app.set('view engine', 'ejs') // register the template engine
var {verifyToken} = require('./app/middlewares/verifytoken');
//require('./app/utils/passport');

// app.use(require('express-session')({
//     secret: 'keyboard cat',
//     resave: false,
//     saveUninitialized: false
// }));
app.use(connectMongoDb);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
  

  //app.use(require('flash')());
//app.use(ejs);
// app.get('/',(req,res)=>{
//     res.render("index");
// });

//  app.use((req,res,next)=>{
//    req.user = {};
//   //  req.user.phone = 9586556778;
//   //  req.user.name = 'Shreeji';
//    next();
// })

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Credentials", "true");
  //res.header("Access-Control-Allow-Headers", "Origin,Content-Type, Authorization, x-id, Content-Length, X-Requested-With");
  res.header("Access-Control-Allow-Headers", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  // res.header("Access-Control-Allow-Origin", "*");
  // res.header("Access-Control-Allow-Credentials", "true");
  // res.header("Access-Control-Allow-Headers", "*");
  // res.header("Access-Control-Allow-Methods", "*");
  next();
});

app.use(express.static('./public'));
app.use('/',require('./app/router/index'));
app.use('/auth',require('./app/controllers/auth'));
//app.use('/registration',verifyToken,require('./app/controllers/registration'));
app.use('/registration',verifyToken,require('./app/controllers/registration'));
app.use('/user',verifyToken,require('./app/controllers/user'));
app.use('/analytics',require('./app/controllers/analytics'));
app.use('/application',require('./app/controllers/application'));
//app.use('/department',require('./app/controllers/registration/department'));
//app.use('/users',require('./app/controllers/re'));

// console.log(process.env.MY_VAR);
// //process.env.MY_VAR = 5;
// console.log(parseInt(process.env.MY_VAR) === 1);
var port = process.env.PORT || 5000;
/* query all the errors */
// app.use('/getErrorsList', async ( req, res ) =>{
//     const haha =  await require('./app/logger').queryErrors(new Date('2018-2-11'), new Date());
//     res.json(haha)
//   });

  // catch 404 and forward to error handler
  app.use(handle404Error);
  
  // error handler
  app.use(handleDevErrors);

app.listen(port,()=>{
    console.log("server started on port:" + port);
});

module.exports = app;