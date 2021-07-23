var mongoose = require("mongoose");

var taskSchema = mongoose.Schema({
  _id: {
    type: mongoose.Types.ObjectId,
    default: new mongoose.Types.ObjectId()
  },
  taskName: {
    type: String,
    required: true
  },
  type: {
    type: Number,
    required: true
  },
  lastModifiedAt: {
    type: Date,
    default: Date.now
  }
});
var Task = (module.exports = mongoose.model("task", taskSchema));
module.exports.get = function(callback, limit) {
  Task.find(callback).limit(limit);
};
