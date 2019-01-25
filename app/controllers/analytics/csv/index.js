const router = require('express').Router();


router.get('/allparticipants',require('./csvgenerators').getParticipants);

router.post('/byevent',require('./csvgenerators').getByEvent);

router.post('/bycollege',require('./csvgenerators').getByCollege);


router.post('/getbyuser',require('./csvgenerators').getByUser);


router.post('/gettotalbyuser',require('./csvgenerators').getTotalByUser);


router.get('/getcountbyevents',require('./csvgenerators').getCountbyEvents);


router.get('/gettodaytotalbyuser/:user_id',require('./csvgenerators').getCountbysingleEntries);

router.get('/getusersdatabydate/:user_id/:date',require('./csvgenerators').getDatebysingleEntries);

router.get('/gettodaytotalbyuserdownload/:user_phone',require('./csvgenerators').getCountbysingleEntriesDownload);

router.get('/getallparticipantwithpayment',require('./csvgenerators').getAllParticipantWithPayment);

// router.post('/getusersdatabydate',require('./csvgenerators').getUserDataByDate);

router.get('/getusersdatabydate/:date',require('./csvgenerators').getUserDataByDate);

router.get('/getrevenuereport/',require('./csvgenerators').getRevenueReport);

router.get('/geteventsreport/',require('./csvgenerators').getEventReport);

module.exports = router;