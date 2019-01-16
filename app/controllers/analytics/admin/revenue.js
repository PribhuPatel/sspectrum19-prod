var {Revenue,Users} = require('../../../middlewares/schemas/schema');
var {getManyData} = require('../../../utils/helpers/general_one_helper');

module.exports = {
    revenue: async (req, res,next) => {
        let today_expense = 0;
       var total_expense=0;
       var total_revenue = 0;
       var today_revenue = 0;
      let daily_revenue = await getManyData(Revenue,{});
      var newDailyRevenue = [];
    
      for(let i=0;i<daily_revenue.length;i++){
          newDailyRevenue.push({
              date: daily_revenue[i].date.toISOString().split('T')[0],
              revenue: daily_revenue[i].revenue,
              expense: daily_revenue[i].expense
          });
          total_revenue = daily_revenue[i].revenue + total_revenue;
          total_expense = daily_revenue[i].expense + total_expense;
      }

      let today_payment = await Users.aggregate([
        { $group: { _id: null,payment : { $sum : "$today_payment" }} }
    ]).exec()
    if(today_payment[0]){
        total_revenue = total_revenue + today_payment[0].payment;
        today_revenue = today_payment[0].payment;
    } else {
      total_revenue = total_revenue;
    }
        return res.json({status: true, daily_revenue:newDailyRevenue, total_revenue:total_revenue,total_expense:total_expense,today_revenue:today_revenue,today_expense:today_expense});
}
  };
  
