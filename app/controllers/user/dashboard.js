

var {Users,Departments,Participants} = require('../../middlewares/schemas/schema');
var {getSingleDataWithPopulate, getSingleData,getManyData, getManyDataWithPopulate, getCount,localDate} = require('../../utils/helpers/general_one_helper');
var {verifyToken}  = require('../../middlewares/verifytoken');
module.exports = {
    dashboard: async (req, res,next) => {
       // let name = req.body.name;
     //   let userphone = req.body.phone;
        console.log(req.user);
       // let id = req.body.id;
        //let user = await getSingleData(Users,{$or:[{phone: userphone},{_id: id}]},req.body.fields);
        let user = await getSingleData(Users,{phone: req.user.phone});
        
        if(user===null){
            return res.json({status: true,message:"No User Found"});
    }else{
        let date = new Date();
        // console.log(date+5.5);
        // date = date+5.5;
        
        // let da1 =date.getFullYear()+ '-'+(date.getMonth()+1)+'-' +(date.getDate()+1); 
        
        // console.log();
        // date = convertUTCDateToLocalDate(date);
        // console.log(date.getDate());
        let da = date.getFullYear()+ '-'+(date.getMonth()+1)+'-' +date.getDate() ;
        let da1 = date.getFullYear()+ '-'+(date.getMonth()+1)+'-' +(date.getDate()+1) ;
        console.log(date);
        da= da.concat(' 00:00:00 UTC')
        da1= da1.concat(' 00:00:00 UTC')
         console.log(da);
        da = new Date(da);
        da1 = new Date(da1);
        console.log(da);
        console.log(da1);

        // console.log(date.toString());
        // date.
        // date = date.no
        // let today_registered = await getCount(Participants,{created_date: { $gte: da+' 00:00:00',$lt:  (da + 1)+' 00:00:00'}});
        let today_registered = await getCount(Participants,{created_date: { $gte: da,$lt:  da1}});
        // let today_registere = await getManyData(Participants,{created_date: { $gte: da,$lt:  (da + 1)}});
        // console.log(today_registere);
        // let today_registered = 0;
        let today_payment = user.today_payment;
        let events = await getManyDataWithPopulate(Departments,{},'events','name linked_department','name',{available_entries:{ $ne: 0 }});
        return res.json({status:true, today_registered: today_registered,today_payment: today_payment,eventsdata:events});
    }
}
  };
  