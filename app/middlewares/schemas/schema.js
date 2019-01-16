const mongoose = require('mongoose');
const Schema = require('mongoose').Schema;
var {localDate} = require('../../utils/helpers/general_one_helper');

var UserSchema = new Schema({
    name: { type: String, required: true},
    email: { type: String},
    phone: {type: Number, index: true, required:true, unique: true},
    password: { type: String, match: /[a-z]/ ,required: true},
    role: {type: String, required: true},
    created_date: { type: Date, default: localDate(new Date() )},
    last_login: {type: Date},
    today_payment: {type: Number, required: true, default: 0 },
    status: {type:Boolean, required:true},
    payment_history : [{
      date: {type: Date},
      payment: {type: Number}
    }],
    registered: {
      participants: [{type:Schema.Types.ObjectId, ref: 'Participants'}],
      entries: [{type: Schema.Types.ObjectId, ref: 'Entries'}]
    },
    department : {type: Schema.Types.ObjectId, ref: 'Departments'},
    college : {type:Schema.Types.ObjectId, required:true, ref: 'Colleges'}
  });

  var AdminsSchema = new Schema({
    name: { type: String, required: true},
    email: { type: String},
    phone: {type: Number, index: true, required:true, unique: true},
    password: { type: String, match: /[a-z]/ ,required: true},
    role: {type: String, required: true},
    created_date: { type: Date, default: localDate(new Date() ) },
    last_login: {type: Date},
    department:{type: Schema.Types.ObjectId, ref: 'Departments'},
    college : {type:Schema.Types.ObjectId, required:true, ref: 'Colleges'}
  });

  var ParticipantSchema = new Schema({
    firstname: { type: String, required:true },
    lastname: { type: String, required: true },
    email: { type: String, required: true},
    phone: {type: Number, index: true, required:true, unique: true},
    college: {type:Schema.Types.ObjectId, required:true, ref: 'Colleges'},
    cvm:{type: Boolean, required: true},
    payment: {type: Number, required: true, default: 0},
    createby: { type: Schema.Types.ObjectId,ref: 'Users',required: true},
    created_date: { type: Date  },
    events: [{type: Schema.Types.ObjectId, ref: 'Events'}],
    password: {type:String},
    package:{type:Schema.Types.ObjectId, ref: 'Packages',default:null}
  });

  var CollegeSchema = new Schema({
    name: {type: String, required: true},
    city: {type: String, required: true},
    cvm: {type: Boolean, required: true},
    registered: {
      participants: [{type:Schema.Types.ObjectId, ref: 'Participants'}],
      entries: [{type: Schema.Types.ObjectId, ref: 'Entries'}]
    }
  });

  var EventsSchema = new Schema({
    name: {type: String, required:true},
    event_type:{type:String, required:true},
    department: {type: Schema.Types.ObjectId, ref: 'Departments'},
    max_participants:{type: Number, required: true},
    min_members: {type: Number, required:true},
    max_members: {type: Number, required: true},
    price: {type: Number, required: true},
    available_entries: {type: Number, required: true},
    description: {type: String, default:null},
    img: {type: String, default:null},
    rounds:
     {
      round1: {type:String, default:null},
      round2: {type:String, default:null},
      round3: {type:String, default:null}, 
    },
    coordinators:[{
      name: {type:String, default:null},
      phone: {type:Number, default:null},
      email: {type:String, default:null}
    }],
    event_status : {type:Boolean, default:false, required:true}
  });

  var DepartmentSchema = new Schema({
    name:{type: String, required:true, unique:true},
    linked_department:{type: String, required:true, unique: true},
    events: [{type: Schema.Types.ObjectId, ref: 'Events'}],
    student_coordinator: {type: Schema.Types.ObjectId, ref: 'Admins',default:null},
    faculty_coordinator:{type: Schema.Types.ObjectId, ref: 'Admins',default:null}
  });
  
  var EntrySchema = new Schema({
    team_leader:{type: Schema.Types.ObjectId, ref:'Participants',required:true},
    event:{type:Schema.Types.ObjectId, ref: 'Events', required: true},
    participants: [{type: Schema.Types.ObjectId , ref:'Participants', required: true}],
    created_by: {type: Schema.Types.ObjectId, ref: 'Users',required:true},
    // payment: {type: Number, required:true,default:0},
    created_date:{type:Date,required:true}
    // package:{type:Schema.Types.ObjectId,ref:Packages}
  });

  var PackageSchema = new Schema({
    participant:{type: Schema.Types.ObjectId, ref:'Participants',required:true},
    tech1:{type: Schema.Types.ObjectId, ref: 'Entries'},
    tech2: {type: Schema.Types.ObjectId, ref: 'Entries'},
    nontech: {type: Schema.Types.ObjectId, ref: 'Entries'},
    // payment: {type: Number, required:true,default:0},
    created_date:{type:Date,required:true}
    // package:{type:Schema.Types.ObjectId,ref:Packages}
  });

  var GlobalVarSchema= new Schema({
    key: {type: String, required: true,unique:true},
    value:{type: String, required: true}
  });

  var TokenSchema = new Schema({
    user: {type: Schema.Types.ObjectId, ref: 'Users', required: true},
    token:{type: String, required: true},
    created_time: {type: Date, default: localDate(new Date()) }
  });

  var ScheduleSchema = new Schema({
    round1:{
      start_time: {type:String},
      end_time:{type:String},
      venue:{type:String}
    },
    round2:{
      start_time: {type:String},
      end_time:{type:String},
      venue:{type:String}
    },
    round3:{
      start_time: {type:String},
      end_time:{type:String},
      venue:{type:String}
    },
    event:{type:Schema.Types.ObjectId, ref: 'Events', required: true}
    //round:{type:Number
  });

  var RevenueSchema = new Schema({
    date: {type:Date,default: localDate(new Date())},
    revenue: {type:Number},
    expense:{type:Number}
  });

  var NotificationTokenSchema = new Schema({
    token: {type:String},
    participant:{type: Schema.Types.ObjectId , ref:'Participants', required: true},
  })

var Revenue = mongoose.model('Revenue',RevenueSchema);
var Schedules = mongoose.model('Schedules',ScheduleSchema);
var Participants =  mongoose.model('Participants', ParticipantSchema);
var Users =  mongoose.model('Users', UserSchema);
var Events = mongoose.model('Events', EventsSchema);
var Departments = mongoose.model('Departments', DepartmentSchema);
var Entries = mongoose.model('Entries', EntrySchema);
var Colleges = mongoose.model('Colleges',CollegeSchema);
var GlobalVars = mongoose.model('GlobalVars', GlobalVarSchema);
var Tokens = mongoose.model('Tokens', TokenSchema);
var Admins = mongoose.model('Admins', AdminsSchema);
var Packages= mongoose.model('Packages', PackageSchema);
var NotificationTokens= mongoose.model('NotificationTokens', NotificationTokenSchema);

module.exports = {
    Users,Participants, Events, Departments, Entries, GlobalVars, Tokens, Colleges, Admins, Schedules,Revenue,Packages, NotificationTokens
}