var mongoose = require("mongoose");
var tasksListSchema = mongoose.Schema({
  tasksList: {
    todo: {
      type: Array,
      ref: "task"
    },
    completed: {
      type: Array,
      ref: "task"
    }
  },
  _userId: {
    type: mongoose.Types.ObjectId,
    default: new mongoose.Types.ObjectId()
  }
});

var TasksList = (module.exports = mongoose.model("tasks", tasksListSchema));

module.exports.get = function(callback, limit) {
  TasksList.find(callback).limit(limit);
};
