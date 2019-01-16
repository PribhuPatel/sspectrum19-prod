const router = require('express').Router();


router.post('/createdepartment',require('./createdepartment').createDepartment);

router.post('/getdepartment',require('./getdepartmentdata').getDepartment);

router.post('/getdepartmentwithevents',require('./getdepartmentdata').getDepartmentWithEvents);


router.get('/getalldepartments',require('./getdepartmentdata').getDepartments);

router.post('/getalldepartmentswithevents',require('./getdepartmentdata').getDepartmentsWithEvents);

module.exports = router;