var {Users,Departments,Participants, Entries, Events, Colleges, Revenue} = require('../../../middlewares/schemas/schema');
var {getSingleDataWithPopulate, getSingleData,getManyData, getManyDataWithPopulate,getCount,getDateWiseCount, localDate} = require('../../../utils/helpers/general_one_helper');
var {verifyToken}  = require('../../../middlewares/verifytoken');
module.exports = {
    runCron: async (req, res,next) => {
      
        let users = await getManyData(Users,{},'today_payment payment_history');
        // let date = new Date();
        // console.log(date+5.5);
        // date = date+5.5;
        // console.log(date);
        // let da1 =date.getFullYear()+ '-'+(date.getMonth()+1)+'-' +(date.getDate()+1); 
        
        // console.log();
        // date = convertUTCDateToLocalDate(date);
        // let da = date.getFullYear()+ '-'+(date.getMonth()+1)+'-' +date.getDate() ;
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
        
        // let events = await getManyDataWithPopulate(Events,{},'department','name max_participants available_entries','name');
        return res.json({status: true, today_revenue:today_revenue});
}
  };
  
