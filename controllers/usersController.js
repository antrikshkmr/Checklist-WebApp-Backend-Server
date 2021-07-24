// ====================================================== //
// ========== Controller for User related APIs ========== //
// ====================================================== //

// Import Users Model
Users = require("../models/usersModel");

// Import bycrypt
const bcrypt = require("bcrypt");

// Import jsonwebtoken
const jwt = require("jsonwebtoken");

// Import Mongoose
const mongoose = require("mongoose");

// Get the JWT Secret Key from environment variable
let secretKey = process.env.JWT_SECRET_KEY;

//* For getting user account details by username
exports.getUserByUsername = async function(req, res) {
  await Users.findOne({ username: req.params.username }, async function(
    err,
    response
  ) {
    // If an error occurred
    if (err) {
      return res.status(400).json({
        code: 1,
        message: err
      });
    } else {
      // If user account doesn not exist
      if (!response) {
        res.status(400).json({
          code: 3,
          message: "User account does not exist."
        });
      } else {
        // If an error occurred
        if (err) {
          return res.status(400).json({
            code: 2,
            message: err
          });
        }

        // If user account exists
        response = JSON.parse(JSON.stringify(response));
        delete response["password"];
        res.json({
          code: 0,
          message: "User Details",
          data: response
        });
      }
    }
  });
};

//* For getting user account details by userid
exports.getUserById = async function(req, res) {
  await Users.findOne(
    { _id: mongoose.Types.ObjectId(req.params.userid) },
    async function(err, response) {
      // If an error occurred
      if (err) {
        return res.status(400).json({
          code: 1,
          message: err
        });
      } else {
        // If user account doesn not exist
        if (!response) {
          res.status(400).json({
            code: 3,
            message: "User account does not exist."
          });
        } else {
          // If an error occurred
          if (err) {
            return res.status(400).json({
              code: 2,
              message: err
            });
          }

          // If user account exists
          response = JSON.parse(JSON.stringify(response));
          delete response["password"];
          res.json({
            code: 0,
            message: "User Details",
            data: response
          });
        }
      }
    }
  );
};

//* For creating a new user account
exports.registerUser = async function(req, res) {
  var user = new Users();

  user.username = req.body.username;

  await Users.findOne({ username: user.username }, async function(
    err,
    response
  ) {
    // If an error occurred
    if (err) {
      return res.status(400).json({
        code: 1,
        message: err
      });
    }

    // If user account already exists
    if (response) {
      res.status(200).json({
        code: 2,
        message:
          "Email address already registered. Please try with a different email address."
      });
    }

    // If user account does not exist
    else {
      user.firstName = req.body.firstName;
      user.lastName = req.body.lastName;

      // Encrypt password
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(req.body.password, salt);

      await user.save(function(err) {
        // If an error occurred
        if (err)
          res.status(400).json({
            code: 2,
            message: err
          });

        // JWT payload
        const payload = {
          user: {
            id: user._id,
            email: req.body.username
          }
        };

        // Sign JWT
        jwt.sign(
          payload,
          secretKey,
          {
            expiresIn: 86400
          },
          (err, token) => {
            // If an error occurred in signing JWT
            if (err) throw err;

            // On successful registration
            return res.status(200).json({
              code: 0,
              message: "Registration Successfull.",
              data: user,
              token: token,
              tokenExpiresIn: 86400
            });
          }
        );
      });
    }
  });
};

//* For validating a user's login credentials and generating the JWT auth token
exports.login = async function(req, res) {
  const { username, password } = req.body;

  Users.findOne({ username: username }, async function(err, response) {
    // If an error occurred
    if (err) {
      return res.status(400).json({
        code: 2,
        message: err
      });
    }

    // If user credentials are not valid
    if (!response) {
      return res.status(200).json({
        code: 1,
        message: "Incorrect email address or password"
      });
    } else {
      // Decrypt and validate password
      const isMatch = await bcrypt.compare(password, response.password);

      // If password is invalid
      if (!isMatch) {
        return res.status(200).json({
          code: 2,
          message: "Incorrect email address or password"
        });
      }

      // If credentials are valid
      else {
        // JWT payload
        const payload = {
          user: {
            id: response._id,
            email: response.username
          }
        };

        // Sign JWT
        jwt.sign(
          payload,
          secretKey,
          {
            expiresIn: 86400
          },
          (err, token) => {
            // If an error occurred in signing JWT
            if (err) throw err;
            return res.status(200).json({
              code: 0,
              message: "Logged In Successfully",
              token: token,
              tokenExpiresIn: 86400
            });
          }
        );
      }
    }
  });
};
