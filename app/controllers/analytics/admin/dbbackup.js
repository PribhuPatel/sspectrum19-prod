// var fs = require('fs');
// var _ = require('lodash');
// var exec = require('child_process').exec;

// var {localDate} = require('../../../utils/helpers/general_one_helper');
// var {mongoDB} = require('../../../utils/config');
// var dbOptions =  {
// user: mongoDB.user,
// pass: mongoDB.password,
// host: mongoDB.host,
// port: mongoDB.port,
// database: mongoDB.database,
// autoBackup: true, 
// removeOldBackup: true,
// keepLastDaysBackup: 2,
// autoBackupPath: '~spectrum/dailybackups/' // i.e. /var/database-backup/
// };
 
//     /* return date object */
// exports.stringToDate = function (dateString) {
//     return new Date(dateString);
// }
     
//     /* return if variable is empty or not. */
// exports.empty = function(mixedVar) {
//     var undef, key, i, len;
//     var emptyValues = [undef, null, false, 0, '', '0'];
//     for (i = 0, len = emptyValues.length; i < len; i++) {
//         if (mixedVar === emptyValues[i]) {
//         return true;
//         }
//     }
//     if (typeof mixedVar === 'object') {
//         for (key in mixedVar) {
// return false;
//         }
//         return true;
//     }
//     return false;
// };
 
 
//     // Auto backup script
 
// dbAutoBackUp = async function () {
    
//     return new Promise((resolve, reject) =>{
// // check for auto backup is enabled or disabled
//     // if (dbOptions.autoBackup == true) {
//         var date = localDate();
//         var beforeDate, oldBackupDir, oldBackupPath;
//         currentDate = this.stringToDate(date); // Current date
//         var newBackupDir = currentDate.getFullYear() + '-' + (currentDate.getMonth() + 1) + '-' + currentDate.getDate();
//         var newBackupPath = dbOptions.autoBackupPath + 'mongodump-' + newBackupDir; // New backup path for current backup process
//         // check for remove old backup after keeping # of days given in configuration
//         if (dbOptions.removeOldBackup == true) {
//             beforeDate = _.clone(currentDate);
//             beforeDate.setDate(beforeDate.getDate() - dbOptions.keepLastDaysBackup); // Substract number of days to keep backup and remove old backup
//             oldBackupDir = beforeDate.getFullYear() + '-' + (beforeDate.getMonth() + 1) + '-' + beforeDate.getDate();
//             oldBackupPath = dbOptions.autoBackupPath + 'mongodump-' + oldBackupDir; // old backup(after keeping # of days)
//         }
//         var cmd = 'mongodump --host ' + dbOptions.host + ' --port ' + dbOptions.port + ' --db ' + dbOptions.database + ' --username ' + dbOptions.user + ' --password ' + dbOptions.pass + ' --out ' + newBackupPath; // Command for mongodb dump process
 
//         await exec(cmd, function (error, stdout, stderr) {
//             if (this.empty(error)) {
//                 // check for remove old backup after keeping # of days given in configuration
//                 if (dbOptions.removeOldBackup == true) {
//                     if (fs.existsSync(oldBackupPath)) {
//                        await exec("rm -rf " + oldBackupPath, function (err) { });
//                     }
//                 }
//             }
//         });
//     })
//     // }
// }

// dbAutoBackUp();