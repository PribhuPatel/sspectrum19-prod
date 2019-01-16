// var moment = require('moment');
var moment = require('moment-timezone');

let da = moment().tz("Asia/Kolkata").format();
da  = da.split('+')[0]
let das = new Date(da+'.000Z');
// da = da.split('+')[0];
// let date  = new Date(da);
// moment.tz.add("Asia/Calcutta|HMT BURT IST IST|-5R.k -6u -5u -6u|01232|-18LFR.k 1unn.k HB0 7zX0");
// moment.tz.link("Asia/Calcutta|Asia/Kolkata");

// var da = moment().utcOffset("+05:30").format();
console.log(da);
console.log(das);
// console.log(date);