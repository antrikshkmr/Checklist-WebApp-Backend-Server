// ====================================================== //
// =========== Schema for User Account Details ========== //
// ====================================================== //

var mongoose = require("mongoose");

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

// Export User model
var Users = (module.exports = mongoose.model("users", usersSchema));

module.exports.get = function(callback, limit) {
  Users.find(callback).limit(limit);
};
