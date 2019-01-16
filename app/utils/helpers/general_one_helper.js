/* centalizing all the manual queries at one place */
var moment = require('moment-timezone');

module.exports = {
    /*getSingleData : async (Collection, query) =>{
        return new Promise((resolve, reject) =>{
            Collection.findOne(query,(err,result)=>{
                (err ? reject(err) : resolve(result))
            })
        })
    },
    */
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
        // var newDate = new Date(date.getTime()+date.getTimezoneOffset()*60*1000);
    
        // var offset = date.getTimezoneOffset() / 60;
        // var hours = date.getHours();
    
        // newDate.setHours(hours - offset + 1);
    
        // return newDate;   
        // let da  = new Date().toString();
        //  let daa = da.split(' ');
        // let date = new Date(daa[0]+' '+daa[1]+' '+daa[2]+' '+daa[3]+' '+daa[4]+' UTC');
        

    let da = moment().tz("Asia/Kolkata").format();
    da  = da.split('+')[0]
    let date = new Date(da+'.000Z');
        return date;
    }
}