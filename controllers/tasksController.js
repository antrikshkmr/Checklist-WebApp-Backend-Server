TasksList = require("../models/tasksListModel");
Task = require("../models/taskModel");
const mongoose = require("mongoose");

exports.getAllTasksById = async function(req, res) {
  await TasksList.findOne(
    { _userId: mongoose.Types.ObjectId(req.params.userid) },
    async function(err, response) {
      if (err) {
        return res.status(400).json({
          code: 1,
          message: err
        });
      } else {
        if (!response) {
          var tasksList = new TasksList();
          var task = new Task();
          tasksList._userId = mongoose.Types.ObjectId(req.params.userid);
          task._id = new mongoose.Types.ObjectId();
          task.type = 0;
          task.taskName = "";
          tasksList.tasksList.todo.push(task);
          await tasksList.save(function(err) {
            if (err) {
              return res.status(400).json({
                code: 2,
                message: err
              });
            }
            return res.status(200).json({
              code: 0,
              message: "Tasks List",
              data: tasksList
            });
          });
        } else {
          if (err) {
            return res.status(400).json({
              code: 3,
              message: err
            });
          }
          if (response.tasksList)
            res.json({
              code: 0,
              message: "Tasks List",
              data: response
            });
        }
      }
    }
  );
};

exports.createNewTask = async function(req, res) {
  var tasksList = new TasksList();
  var task = new Task();
  tasksList._userId = mongoose.Types.ObjectId(req.params.userid);
  task._id =
    req.body._id === null
      ? new mongoose.Types.ObjectId()
      : mongoose.Types.ObjectId(req.body._id);
  task.type = req.body.type;
  task.taskName = req.body.taskName;
  tasksList.tasksList.todo.push(task);
  TasksList.updateOne(
    { _userId: mongoose.Types.ObjectId(req.params.userid) },
    {
      $push: {
        "tasksList.todo": {
          $each: [task],
          $position: 0
        }
      }
    },
    { new: true },
    async function(err, response) {
      if (err) {
        return res.status(400).json({
          code: 1,
          message: err
        });
      } else {
        if (response.n === 0 && response.nModified === 0) {
          await tasksList.save(function(err) {
            if (err) {
              return res.status(400).json({
                code: 2,
                message: err
              });
            }
            return res.status(200).json({
              code: 0,
              message: "Item created successfully",
              data: task
            });
          });
        } else if (response.n === 1 && response.nModified === 1) {
          return res.status(200).json({
            code: 0,
            message: "Item created successfully",
            data: task
          });
        } else {
          return res.status(400).json({
            code: 3,
            message: "Error"
          });
        }
      }
    }
  );
};

exports.updateTodoTaskById = async function(req, res) {
  await TasksList.updateOne(
    {
      _userId: mongoose.Types.ObjectId(req.params.userid),
      "tasksList.todo._id": mongoose.Types.ObjectId(req.params.id)
    },
    {
      $set: {
        "tasksList.todo.$.taskName": req.body.taskName,
        "tasksList.todo.$.type": req.body.type,
        "tasksList.todo.$.lastModifiedAt": new Date()
      }
    },
    async function(err, response) {
      if (err) {
        return res.status(400).json({
          code: 1,
          message: err
        });
      }

      if (response.n === 0 && response.nModified === 0) {
        return res.status(400).json({
          code: 2,
          message: "Error"
        });
      } else if (
        (response.n === 1 && response.nModified === 1) ||
        (response.n === 1 && response.ok === 1)
      ) {
        return res.status(200).json({
          code: 0,
          message: "Item updated successfully",
          data: response
        });
      } else {
        console.log(response);
        return res.status(400).json({
          code: 3,
          message: "Error"
        });
      }
    }
  );
};

exports.updateCompletedTaskById = async function(req, res) {
  await TasksList.update(
    {
      _userId: mongoose.Types.ObjectId(req.params.userid),
      "tasksList.completed._id": mongoose.Types.ObjectId(req.params.id)
    },
    {
      $set: {
        "tasksList.completed.$.taskName": req.body.taskName
      }
    },
    async function(err, response) {
      if (err) {
        return res.status(400).json({
          code: 1,
          message: err
        });
      }
      if (response.n === 0 && response.nModified === 0) {
        return res.status(400).json({
          code: 2,
          message: "Error"
        });
      } else if (response.n === 1 && response.nModified === 1) {
        return res.status(200).json({
          code: 0,
          message: "Item updated successfully",
          data: response
        });
      } else {
        return res.status(400).json({
          code: 3,
          message: "Error"
        });
      }
    }
  );
};

exports.updateTaskStatus = async function(req, res) {
  var task = new Task();

  task._id = mongoose.Types.ObjectId(req.params.id);
  task.type = req.body.type;
  task.taskName = req.body.taskName;

  console.log("task: " + task);
  TasksList.updateOne(
    {
      _userId: mongoose.Types.ObjectId(req.params.userid),
      "tasksList.todo._id": mongoose.Types.ObjectId(req.params.id)
    },
    {
      $pull: {
        "tasksList.todo": { _id: mongoose.Types.ObjectId(req.params.id) }
      },
      $push: { "tasksList.completed": task }
    },
    { safe: true, new: true },
    async function(err, response) {
      if (err) {
        return res.status(400).json({
          code: 1,
          message: err
        });
      } else {
        if (response.n === 0 && response.nModified === 0) {
          return res.status(400).json({
            code: 2,
            message: "Error"
          });
        } else if (response.n === 1 && response.nModified === 1) {
          return res.status(200).json({
            code: 0,
            message: "Item status updated successfully",
            data: response
          });
        } else {
          return res.status(400).json({
            code: 3,
            message: "Error"
          });
        }
      }
    }
  );
};
exports.updateTaskPosition = async function(req, res) {
  var task = new Task();
  task._id = mongoose.Types.ObjectId(req.params.id);
  task.type = req.body.type;
  task.taskName = req.body.taskName;
  console.log("task: " + task);

  TasksList.updateOne(
    { _userId: mongoose.Types.ObjectId(req.params.userid) },
    {
      $pull: {
        "tasksList.todo": { _id: mongoose.Types.ObjectId(req.params.id) }
      }
    },
    { safe: true, new: true },
    async function(err, response) {
      if (err) {
        return res.status(400).json({
          code: 1,
          message: err
        });
      } else {
        if (response.n === 0 && response.nModified === 0) {
          return res.status(400).json({
            code: 2,
            message: "Error"
          });
        } else if (response.n === 1 && response.nModified === 1) {
          TasksList.updateOne(
            { _userId: mongoose.Types.ObjectId(req.params.userid) },
            {
              $push: {
                "tasksList.todo": {
                  $each: [task],
                  $position: req.params.position
                }
              }
            },
            { safe: true, new: true },
            async function(err, response) {
              if (err) {
                return res.status(400).json({
                  code: 3,
                  message: err
                });
              } else {
                if (response.n === 0 && response.nModified === 0) {
                  return res.status(400).json({
                    code: 4,
                    message: "Error"
                  });
                } else if (response.n === 1 && response.nModified === 1) {
                  return res.status(200).json({
                    code: 0,
                    message: "Item position changed successfully",
                    data: response
                  });
                } else {
                  return res.status(400).json({
                    code: 5,
                    message: "Error"
                  });
                }
              }
            }
          );
        } else {
          return res.status(400).json({
            code: 6,
            message: "Error"
          });
        }
      }
    }
  );
};
exports.deleteTodoTaskById = function(req, res) {
  TasksList.updateOne(
    { _userId: mongoose.Types.ObjectId(req.params.userid) },
    {
      $pull: {
        "tasksList.todo": { _id: mongoose.Types.ObjectId(req.params.id) }
      }
    },
    { safe: true, new: true },
    function(err, data) {
      if (err) {
        return res.status(400).json({
          code: 1,
          message: err
        });
      }
      return res.status(200).json({
        code: 0,
        message: "Item deleted successfully",
        data: data
      });
    }
  );
};

exports.deleteCompletedTaskById = function(req, res) {
  TasksList.updateOne(
    { _userId: mongoose.Types.ObjectId(req.params.userid) },
    {
      $pull: {
        "tasksList.completed": { _id: mongoose.Types.ObjectId(req.params.id) }
      }
    },
    { safe: true, new: true },
    function(err, data) {
      if (err) {
        return res.status(400).json({
          code: 1,
          message: err
        });
      }
      return res.status(200).json({
        code: 0,
        message: "Item deleted successfully",
        data: data
      });
    }
  );
};
