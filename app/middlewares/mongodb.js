/* connecting mongodb */

const mongoose = require('mongoose');
const configs = require('../utils/config');

const url = `mongodb://${configs.mongoDB.user}:${configs.mongoDB.password}@${configs.mongoDB.host}:${configs.mongoDB.port}/${configs.mongoDB.database}`;

exports.connectMongoDb = (req, res, next) => {
  /* check if mongodb already connected or not */
  if (mongoose.connection.readyState === 1) return next();
  /* Get Mongoose to use the global promise library */
  mongoose.Promise = global.Promise;
  /* connecting to MongoDB */
  mongoose.connect(url,{ useCreateIndex: true,useNewUrlParser: true });
  const db = mongoose.connection;
  // Bind connection to error event (to get notification of connection errors)
  db.on('error', (error) => { next(error); });
  db.on('open', () => {
    next();
  });
};
