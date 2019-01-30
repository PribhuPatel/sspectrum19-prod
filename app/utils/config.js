/* this is config file for our application */

module.exports = {
    jsonWebTokenKey : 'jsonWebTokenSecreyKey1212##',
    /* this mysql database config 
       you can also opt for env variables  
    */
    mongoDB : {
        user: 'admin',
        password: 'shreeji1',
        host : '34.73.92.20',
        // host:'ds135003.mlab.com',
        // port:35003,
        // host:'localhost',
        port : 27017,
        database : 'spectrum'
    },   
     nodemailer:{
        service: 'gmail',
        auth: {
            user: 'spectrum@adit.ac.in',
            // user:'markhentony@gmail.com',
            // pass:'markhentony@12345'
          pass: 'Spec1700@adit2019'
        }
    },
    /* do not change this salrounds value */
    bycryptSalt : 13
}