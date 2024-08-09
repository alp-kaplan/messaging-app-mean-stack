const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * Mongoose model for users.
 * Defines the schema for users collection with fields: username, password, name, surname, birthdate, gender, email, location, and isAdmin.
 */
let User = new Schema({
  username: {
    type: String,
    unique: true
  },
  password: {
    type: String
  },
  name: {
    type: String
  },
  surname: {
    type: String
  },
  birthdate: {
    type: Date
  },
  gender: {
    type: String
  },
  email: {
    type: String
  },
  location: {
    type: String
  },
  isAdmin: {
    type: Boolean
  }
}, {
  collection: 'users'
});

module.exports = mongoose.model('User', User);
