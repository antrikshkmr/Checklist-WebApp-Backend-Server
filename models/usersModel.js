var mongoose = require("mongoose");
const Joi = require("joi");

var usersSchema = mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },

  registered_on: {
    type: Date,
    default: Date.now
  }
});

var Users = (module.exports = mongoose.model("users", usersSchema));
module.exports.get = function(callback, limit) {
  Users.find(callback).limit(limit);
};
