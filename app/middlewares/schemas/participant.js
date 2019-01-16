const mongoose = require('mongoose');
const Schema = require('mongoose').Schema;
import {Users} from './schema';
var ParticipantSchema = new Schema({
    firstname: { type: String, required:true },
    lastname: { type: String, required: true },
    email: { type: String, required: true},
    phone: {type: Number, index: true, required:true, unique: true},
    college: {type:String, required:true},
    payment: {type: Number, required: true, default: 30},
    createby: { type: Schema.Types.ObjectId,ref: 'Users',required: true},
    created_date: { type: Date, default: Date.now },
    events: [{type: Schema.Types.ObjectId, ref: 'Events'}]
  });

var Participants =  mongoose.model('participants', ParticipantSchema);
module.exports = {
    Participants
}