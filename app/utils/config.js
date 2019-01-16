/* this is config file for our application */

module.exports = {
    jsonWebTokenKey : 'jsonWebTokenSecreyKey1212##',
    /* this mysql database config 
       you can also opt for env variables  
    */
    mongoDB : {
        user: 'admin',
        password: 'shreeji1',
        host : 'localhost',
        port : 27017,
        database : 'spectrum'
    },   
     nodemailer:{
        service: 'gmail',
        auth: {
            user: 'spectrum@adit.ac.in',
            pass: 'Spec1700@adit19'
        }
    },
    /* do not change this salrounds value */
    bycryptSalt : 13
}