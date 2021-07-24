// ====================================================== //
// = Controller for handling Checklist Item related APIs  //
// ====================================================== //

// Import TaskList Model
TasksList = require("../models/tasksListModel");

// Import Task Model
Task = require("../models/taskModel");

// Import Mongoose
const mongoose = require("mongoose");

//* For getting all checklist items/tasks for a user
exports.getAllTasksById = async function(req, res) {
  await TasksList.findOne(
    { _userId: mongoose.Types.ObjectId(req.params.userid) },
    async function(err, response) {
      // If an error occurred
      if (err) {
        return res.status(400).json({
          code: 1,
          message: err
        });
      }

      // If no tasklist found
      else {
        if (!response) {
          var tasksList = new TasksList();
          var task = new Task();

          tasksList._userId = mongoose.Types.ObjectId(req.params.userid);
          task._id = new mongoose.Types.ObjectId();
          task.type = 0;
          task.taskName = "";

          tasksList.tasksList.todo.push(task);

          // Create a dummy task/item for that user with type=0
          await tasksList.save(function(err) {
            // If an error occurred
            if (err) {
              return res.status(400).json({
                code: 2,
                message: err
              });
            }

            // On success
            return res.status(200).json({
              code: 0,
              message: "Tasks List",
              data: tasksList
            });
          });
        }

        // If an error occurred
        else {
          if (err) {
            return res.status(400).json({
              code: 3,
              message: err
            });
          }

          // On success
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

//* For creating a new checklist item/task for a user
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
      // If an error occurred
      if (err) {
        return res.status(400).json({
          code: 1,
          message: err
        });
      } else {
        if (response.n === 0 && response.nModified === 0) {
          await tasksList.save(function(err) {
            // If an error occurred
            if (err) {
              return res.status(400).json({
                code: 2,
                message: err
              });
            }
            // On success
            return res.status(200).json({
              code: 0,
              message: "Item created successfully",
              data: task
            });
          });
        }

        // On success
        else if (response.n === 1 && response.nModified === 1) {
          return res.status(200).json({
            code: 0,
            message: "Item created successfully",
            data: task
          });
        }

        // Unable to create new task/item
        else {
          return res.status(400).json({
            code: 3,
            message: "Error"
          });
        }
      }
    }
  );
};

//* For updating an existing todo checklist item/task for a user
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
      // If an error occurred
      if (err) {
        return res.status(400).json({
          code: 1,
          message: err
        });
      }

      // Unable to update the task/item
      if (response.n === 0 && response.nModified === 0) {
        return res.status(400).json({
          code: 2,
          message: "Error"
        });
      }

      // On success
      else if (
        (response.n === 1 && response.nModified === 1) ||
        (response.n === 1 && response.ok === 1)
      ) {
        return res.status(200).json({
          code: 0,
          message: "Item updated successfully",
          data: response
        });
      }

      // Unable to update the task/item
      else {
        console.log(response);
        return res.status(400).json({
          code: 3,
          message: "Error"
        });
      }
    }
  );
};

//* For updating an existing completed checklist item/task for a user
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
      // If an error occurred
      if (err) {
        return res.status(400).json({
          code: 1,
          message: err
        });
      }

      // Unable to update the task/item
      if (response.n === 0 && response.nModified === 0) {
        return res.status(400).json({
          code: 2,
          message: "Error"
        });
      }

      // On success
      else if (response.n === 1 && response.nModified === 1) {
        return res.status(200).json({
          code: 0,
          message: "Item updated successfully",
          data: response
        });
      }

      // Unable to update the task/item
      else {
        return res.status(400).json({
          code: 3,
          message: "Error"
        });
      }
    }
  );
};

//* For updating the status of an existing checklist item/task for a user
exports.updateTaskStatus = async function(req, res) {
  var task = new Task();

  task._id = mongoose.Types.ObjectId(req.params.id);
  task.type = req.body.type;
  task.taskName = req.body.taskName;

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
      // If an error occurred
      if (err) {
        return res.status(400).json({
          code: 1,
          message: err
        });
      }

      // Unable to update the task status
      else {
        if (response.n === 0 && response.nModified === 0) {
          return res.status(400).json({
            code: 2,
            message: "Error"
          });
        }

        // On success
        else if (response.n === 1 && response.nModified === 1) {
          return res.status(200).json({
            code: 0,
            message: "Item status updated successfully",
            data: response
          });
        }

        // Unable to update the task status
        else {
          return res.status(400).json({
            code: 3,
            message: "Error"
          });
        }
      }
    }
  );
};

//* For updating the position of an existing checklist item/task for a user
exports.updateTaskPosition = async function(req, res) {
  var task = new Task();
  
  task._id = mongoose.Types.ObjectId(req.params.id);
  task.type = req.body.type;
  task.taskName = req.body.taskName;

  // Pull the task/item from todo list
  TasksList.updateOne(
    { _userId: mongoose.Types.ObjectId(req.params.userid) },
    {
      $pull: {
        "tasksList.todo": { _id: mongoose.Types.ObjectId(req.params.id) }
      }
    },
    { safe: true, new: true },
    async function(err, response) {
      // If an error occurred
      if (err) {
        return res.status(400).json({
          code: 1,
          message: err
        });
      }

      // Unable to get the task/item
      else {
        if (response.n === 0 && response.nModified === 0) {
          return res.status(400).json({
            code: 2,
            message: "Error"
          });
        }

        // On successfully fetching the todo task/item
        else if (response.n === 1 && response.nModified === 1) {
          // Push the task/item to completed list
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
              // If an error occurred
              if (err) {
                return res.status(400).json({
                  code: 3,
                  message: err
                });
              } else {
                // Unable to push the task/item
                if (response.n === 0 && response.nModified === 0) {
                  return res.status(400).json({
                    code: 4,
                    message: "Error"
                  });
                }

                // On success
                else if (response.n === 1 && response.nModified === 1) {
                  return res.status(200).json({
                    code: 0,
                    message: "Item position changed successfully",
                    data: response
                  });
                }
                // Unable to push the task/item
                else {
                  return res.status(400).json({
                    code: 5,
                    message: "Error"
                  });
                }
              }
            }
          );
        }

        // Unable to get the task/item
        else {
          return res.status(400).json({
            code: 6,
            message: "Error"
          });
        }
      }
    }
  );
};

//* For deleting an existing todo checklist item/task for a user
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
      // If an error occurred
      if (err) {
        return res.status(400).json({
          code: 1,
          message: err
        });
      }

      // On success
      return res.status(200).json({
        code: 0,
        message: "Item deleted successfully",
        data: data
      });
    }
  );
};

//* For deleting an existing completed checklist item/task for a user
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
      // If an error occurred
      if (err) {
        return res.status(400).json({
          code: 1,
          message: err
        });
      }

      // On success
      return res.status(200).json({
        code: 0,
        message: "Item deleted successfully",
        data: data
      });
    }
  );
};
