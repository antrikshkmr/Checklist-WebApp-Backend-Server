Users = require("../models/usersModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
let secretKey = process.env.JWT_SECRET_KEY;

exports.getUserByUsername = async function(req, res) {
  await Users.findOne({ username: req.params.username }, async function(
    err,
    response
  ) {
    if (err) {
      return res.status(400).json({
        code: 1,
        message: err
      });
    } else {
      if (!response) {
        res.status(400).json({
          code: 3,
          message: "User account does not exist."
        });
      } else {
        if (err) {
          return res.status(400).json({
            code: 2,
            message: err
          });
        }
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

exports.getUserById = async function(req, res) {
  await Users.findOne(
    { _id: mongoose.Types.ObjectId(req.params.userid) },
    async function(err, response) {
      if (err) {
        return res.status(400).json({
          code: 1,
          message: err
        });
      } else {
        if (!response) {
          res.status(400).json({
            code: 3,
            message: "User account does not exist."
          });
        } else {
          if (err) {
            return res.status(400).json({
              code: 2,
              message: err
            });
          }
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

exports.registerUser = async function(req, res) {
  var user = new Users();
  user.username = req.body.username;

  await Users.findOne({ username: user.username }, async function(
    err,
    response
  ) {
    if (err) res.send(err);
    if (response) {
      res.status(200).json({
        code: 1,
        message:
          "Email address already registered. Please try with a different email address."
      });
    } else {
      user.firstName = req.body.firstName;
      user.lastName = req.body.lastName;
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(req.body.password, salt);
      await user.save(function(err) {
        if (err)
          res.status(400).json({
            code: 2,
            message: err
          });
        const payload = {
          user: {
            id: user._id,
            email: req.body.username
          }
        };
        jwt.sign(
          payload,
          secretKey,
          {
            expiresIn: 86400
          },
          (err, token) => {
            if (err) throw err;
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

exports.login = async function(req, res) {
  const { username, password } = req.body;
  Users.findOne({ username: username }, async function(err, response) {
    if (err) {
      return res.status(400).json({
        code: 2,
        message: err
      });
    }

    if (!response) {
      return res.status(200).json({
        code: 1,
        message: "Incorrect email address or password"
      });
    } else {
      const isMatch = await bcrypt.compare(password, response.password);
      if (!isMatch) {
        return res.status(200).json({
          code: 2,
          message: "Incorrect email address or password"
        });
      } else {
        const payload = {
          user: {
            id: response._id,
            email: response.username
          }
        };
        jwt.sign(
          payload,
          secretKey,
          {
            expiresIn: 86400
          },
          (err, token) => {
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
