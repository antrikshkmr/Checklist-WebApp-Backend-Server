// ====================================================== //
// ======= File having all the API endpoint routes ====== //
// ====================================================== //

// Initialize Express Router
let router = require("express").Router();

var usersController = require("../controllers/usersController");
var tasksController = require("../controllers/tasksController");

// Import the api auth middleware
let auth = require("../middleware/auth");

// User routes
router.route("/register").post(usersController.registerUser);
router
  .route("/users/username/:username")
  .get(auth, usersController.getUserByUsername);
router.route("/users/id/:userid").get(auth, usersController.getUserById);
router.route("/login").post(usersController.login);

// Tasks routes
router.route("/tasks/:userid").get(auth, tasksController.getAllTasksById);

router.route("/tasks/create/:userid").post(auth, tasksController.createNewTask);
router
  .route("/tasks/update/:userid/todo/:id")
  .post(auth, tasksController.updateTodoTaskById);

router
  .route("/tasks/update/:userid/completed/:id")
  .post(auth, tasksController.updateCompletedTaskById);
router
  .route("/tasks/updatestatus/:userid/:id")
  .post(auth, tasksController.updateTaskStatus);

router
  .route("/tasks/rearrange/:userid/:id/:position")
  .post(auth, tasksController.updateTaskPosition);

router
  .route("/tasks/delete/:userid/todo/:id")
  .post(auth, tasksController.deleteTodoTaskById);
router
  .route("/tasks/delete/:userid/completed/:id")
  .post(auth, tasksController.deleteCompletedTaskById);

// Export API routes
module.exports = router;
