const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * Mongoose model for logging requests.
 * Defines the schema for logs collection with fields: username, requestTime, ip, browser, endpoint, method, message, and statusCode.
 */
const logSchema = new Schema({
  username: {
    type: String,
    required: true
  },
  requestTime: {
    type: Date,
    required: true
  },
  ip: {
    type: String,
    required: true
  },
  browser: {
    type: String,
    required: true
  },
  endpoint: {
    type: String,
    required: true
  },
  method: {
    type: String,
    required: true
  },
  // Fields for error logs
  message: {
    type: String
  },
  statusCode: {
    type: Number
  }
}, {
  collection: 'logs'
});

module.exports = mongoose.model('Log', logSchema);
