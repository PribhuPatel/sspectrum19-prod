

var {Users,Departments,Participants} = require('../../middlewares/schemas/schema');
var {getSingleData,getManyDataWithPopulate, getCount,localDate} = require('../../utils/helpers/general_one_helper');

module.exports = {
    dashboard: async (req, res,next) => {
        let user = await getSingleData(Users,{phone: req.user.phone});
        
        if(user===null){
            return res.json({status: true,message:"No User Found"});
    }else{
        let date = localDate();
     let da = date.getFullYear()+ '-'+(date.getMonth()+1)+'-' +date.getDate() ;
        let da1 = date.getFullYear()+ '-'+(date.getMonth()+1)+'-' +(date.getDate()+1) ;
        da= da.concat(' 00:00:00 UTC')
        da1= da1.concat(' 00:00:00 UTC')
        da = new Date(da);
        da1 = new Date(da1);
     console.log(da);
     console.log(da1);
       let today_registered = await getCount(Participants,{$and:[{created_date: { $gte: da,$lt:  da1}},{createby:user._id}]});
        let today_payment = user.today_payment;
        let events = await getManyDataWithPopulate(Departments,{},'events','name linked_department','name',{available_entries:{ $ne: 0 }});
        return res.json({status:true, today_registered: today_registered,today_payment: today_payment,eventsdata:events});
    }
}
  };
  