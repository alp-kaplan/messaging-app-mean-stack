const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * Mongoose model for messages.
 * Defines the schema for messages collection with fields: sender, receiver, content, timestamp, senderDeleted, and receiverDeleted.
 */
let Message = new Schema({
  sender: {
    type: String,
  },
  receiver: {
    type: String
  },
  content: {
    type: String
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  senderDeleted: {
    type: Boolean,
    default: false
  },
  receiverDeleted: {
    type: Boolean,
    default: false
  }
}, {
  collection: 'messages'
});

module.exports = mongoose.model('Message', Message);
