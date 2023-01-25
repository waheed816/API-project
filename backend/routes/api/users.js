// backend/routes/api/session.js
const express = require('express')
const router = express.Router();

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User } = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

//Signup Validation step
const validateSignup = [
  check('email')
    .exists({ checkFalsy: true })
    .isEmail()
    .withMessage('Please provide a valid email.'),
  check('username')
    .exists({ checkFalsy: true })
    .isLength({ min: 4 })
    .withMessage('Please provide a username with at least 4 characters.'),
  check('username')
    .not()
    .isEmail()
    .withMessage('Username cannot be an email.'),
  check('password')
    .exists({ checkFalsy: true })
    .isLength({ min: 6 })
    .withMessage('Password must be 6 characters or more.'),
  //checking for firstName and lastName column values
  check('firstName')
      .exists({ checkFalsey: true })
      .withMessage('First name required'),
  check('lastName')
      .exists({ checkFalsey: true })
      .withMessage('Last name required'),
  handleValidationErrors
];

// Sign up
router.post('/', validateSignup, async (req, res, next) => {
      const { email, password, username, firstName, lastName } = req.body;

      const err = {};

      let emailExists = await User.findOne({
          where: {
              email
          }
       });

      if (emailExists) {
          err.title = "Validation error"
          err.message = "Email invalid";
          err.status = 403;
          err.errors = ["That email address is already in use"]

          return next(err)
      }

      let usernameExists = await User.findOne({
          where: {
              username
          }
      });

      if (usernameExists) {
          err.title = "Validation error"
          err.message = "Username invalid";
          err.status = 403;
          err.errors = ["That username is already in use"]
          return next(err)
      }

      if (!username || !email || !firstName || !lastName) {
          err.title = "Validation error"
          err.message = "Validation error"
          err.status = 400;
          err.errors = [];

          if (!email) {
              err.errors.push("Email required")
          }

          if (!username) {
              err.errors.push("Username required")
          }

          if (!firstName) {
              err.errors.push(["First name required"])
          }

          if (!lastName) {
              err.errors.push(["Last name required"])
          }

          return next(err)
      }

      const user = await User.signup({ email, username, password, firstName, lastName });

      await setTokenCookie(res, user);

      return res.json({
          'user': {
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            username: user.username,
            token: ""
          }
      });
    }
  );


module.exports = router;
