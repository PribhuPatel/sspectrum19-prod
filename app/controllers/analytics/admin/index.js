const router = require('express').Router();

router.get('/dashboard', require('./dashboard').dashboard);

router.get('/registrations', require('./registrations').registrations);

router.get('/events', require('./events').events);

router.get('/users', require('./users').users);

router.get('/revenue', require('./revenue').revenue);

router.post('/getdepartmentdata', require('./getdepartmentdata').getDepartmentData);

router.post('/getcollegedata', require('./getcollegewisedata').getCollegeWiseData);

router.post('/getparticipantdata', require('./getparticipantdata').getParticipantWiseData);

router.get('/portalstatus', require('./portalstatus').getPortalStatus);

router.get('/changeportalstatus', require('./portalstatus').portalStatusChange);

// router.get('/cron', require('./cronjob').runCron);

router.post('/sendnotifications', require('./sendnotification').sendNotification);

module.exports = router;