/* centalizing all the manual queries at one place */
var moment = require('moment-timezone');
var handlebars = require('handlebars');
const fs = require('fs');
var {transporter} = require('../sendmail');

module.exports = {
    getSingleData : async (Collection, query,fields=null) =>{
        return new Promise((resolve, reject) =>{
            Collection.findOne(query,fields,(err,result)=>{
                (err ? reject(err) : resolve(result))
            })
        })
    },
    getSingleDataWithPopulate : async (Collection, query, population,main_fields=null,populate_fields=null) =>{
        return new Promise((resolve, reject) =>{
            Collection.findOne(query,main_fields).populate(population,populate_fields).exec((err,result)=>{
                (err ? reject(err) : resolve(result))
            })
        })
    },
    getManyData : async (Collection, query,fields=null) =>{
        return new Promise((resolve, reject) =>{
            Collection.find(query,fields,(err,result)=>{
                (err ? reject(err) : resolve(result))
            })
        })
    },
    getManyDataWithPopulate : async (Collection, query, population,main_fields=null,populate_fields=null,options=null) =>{
        return new Promise((resolve, reject) =>{
            Collection.find(query,main_fields).populate(population,populate_fields,options).exec((err,result)=>{
                (err ? reject(err) : resolve(result))
            })
        })
    },
    getManyDataWithPopulateWithLimit : async (Collection, query,limit, population,main_fields=null,populate_fields=null,options=null) =>{
        return new Promise((resolve, reject) =>{
            Collection.find(query,main_fields).limit(limit).populate(population,populate_fields).exec((err,result)=>{
                (err ? reject(err) : resolve(result))
            })
        })
    },
    getCount : async (Collection, query) =>{
        return new Promise((resolve, reject) =>{
            Collection.countDocuments(query,(err,result)=>{
                (err ? reject(err) : resolve(result))
            })
        })
    },
    getDateWiseCount: async (Collection,query,timestamp_variable)=>{
        return new Promise((resolve, reject) =>{
         Collection.aggregate([{
            $match:query
        },
            { $group : { 
                 _id : { year: { $year : timestamp_variable }, month: { $month : timestamp_variable },day: { $dayOfMonth : timestamp_variable }}, 
                 count : { $sum : 1 }}
                 },
                 {$sort: {_id: 1}}],
            function (err, res){
            (err ? reject(err) : resolve(res));
            }
        )})
    },
    localDate:()=>{
    let da = moment().tz("Asia/Kolkata").format();
    da  = da.split('+')[0]
    let date = new Date(da+'.000Z');
        return date;
    },
    sendmail:async (filepath,email,subject,replacements)=>{
        return new Promise(async (resolve, reject) =>{
        await readHTMLFile(__dirname + filepath,async function(err, html) {
            var template = handlebars.compile(html);
            var htmlToSend = template(replacements);
            var mailOptions = {
                from: 'spectrum@adit.ac.in',
                to : email,
                subject : subject,
                html : htmlToSend
            };
            await transporter.sendMail(mailOptions, function (error, response) {
                if (error) {
                    console.log(error);
                } else{
            (error? reject(error) : resolve(response));
                }
            });
        });
    })
}
}

var readHTMLFile = function(path, callback) {
    fs.readFile(path, {encoding: 'utf-8'}, function (err, html) {
        if (err) {
            throw err;
            callback(err);
        }
        else {
            callback(null, html);
        }
    });
};