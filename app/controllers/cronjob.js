var {Users,Revenue, GlobalVars} = require('../middlewares/schemas/schema');
var {getManyData, localDate,getSingleData} = require('../utils/helpers/general_one_helper');
var {dbAutoBackUp} = require('./dbbackup');

module.exports = {
    runCron: async (req, res,next) => {
        let password =  req.body.password;
        if(password === 'pribhu'){
        let users = await getManyData(Users,{},'today_payment payment_history');
        var dbquery = await getSingleData(GlobalVars,{key:'backupdbname'});
        // var db = dbquery.value;
        var payment = 0;
        for(let i=0;i<users.length;i++){
            payment = payment + users[i].today_payment;
            users[i].payment_history.push({
                date: localDate(),
                payment: users[i].today_payment
            });
            users[i]["today_payment"] = 0;
            await users[i].save();
        }

        let today_revenue = new Revenue({
            date: localDate(),
            revenue: payment
        });

        await today_revenue.save();
        let file = await dbAutoBackUp();
        console.log("Cronjob ran successfully");
        console.log(file);
        db=file;
        dbquery["value"] = db;
        await dbquery.save();
        // req.connection.setTimeout( 1000 * 20);
        // setTimeout( function() {
            
        //     console.log('done');
        // return res.download(file+'.zip',function(err){
        //     if(err){
        //         console.log(err);
        //     }
        // });
        // }, 20000 );
            // res.send('done');
            return res.redirect('/cron/downloaddb/'+password);
        // return res.download(file+'.zip',function(err){
        //     if(err){
        //         console.log(err);
        //     }
        // });
        // return res.json({status: true, today_revenue:today_revenue});
    } else {
        	return res.json({status:true});
    }
},
    downloadDB:async(req,res)=>{
        if(req.params.password == 'pribhu'){
            var dbquery = await getSingleData(GlobalVars,{key:'backupdbname'});
            var db = dbquery.value;
        return res.status(200).download(db+'.zip',function(err){
            if(err){
                console.log(err);
            }
        })
    } else {
        res.send("You are not authorized");
    }
    }
}
