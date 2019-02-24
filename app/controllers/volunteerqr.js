var {Users,Revenue, GlobalVars, Volunteers} = require('../middlewares/schemas/schema');
var {getManyData, localDate,getSingleData} = require('../utils/helpers/general_one_helper');
var list = require('./volunteerlist');
const fs = require('fs');
const QRCode = require('qrcode');

module.exports = {
    generateVolunteerQr: async (req, res,next) => { 
        // console.log(list);
        
        // try {
           
        //     console.log('done');
            
        //  } catch (e) {
        //     console.log(e);
        //  }
         let ins = await insertVolunteer();
        //  ins.catch((err)=>{
        //      console.log(err);
             
        //  })
        //  let c = await Volunteers.deleteMany({}).skip(182);
        //  console.log(c);
         
         let fullList = await Volunteers.find({});
         for(let i=256;i<fullList.length;i++){
            let qr = await generateQr('volunteer2/qr-'+(i+1)+'.png',fullList[i]._id.toString());
            console.log(qr + (i+1).toString());
            // qr.catch((err)=>{
            //     console.log(err);
            // })
            
        }
    return res.send("done");
    }
}



var generateQr =  (path,text)=>{
    return new Promise(async (resolve,reject)=>{
        await QRCode.toFile(path,text, {
        }, function (err) {
          if (err) throw reject(err)
          resolve('done')
        })
    })
}

var insertVolunteer = ()=>{
    return new Promise(async (resolve,reject)=>{
           try {
           
        await Volunteers.insertMany(list);
            resolve('inserted')
            
         } catch (e) {
            reject(e)
         }

    })
}