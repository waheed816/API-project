// backend/routes/api/session.js
const express = require('express')
const router = express.Router();

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User } = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

//Signup Validation step
const validateSignup = [
  check('firstName',)
    .notEmpty()
    .withMessage('Please provide a firstname'),
  check('lastName')
    .notEmpty()
    .withMessage('Pleasee provide a lastname'),
  check('email', "Please provide an email")
    .notEmpty()
    .bail()
    .isEmail()
    .withMessage('Please provide a valid email.'),
  check('username', "Please provide a username")
    .notEmpty()
    .bail()
    .isLength({ min: 4 })
    .withMessage('Please provide a username with at least 4 characters.'),
  check('username')
    .not()
    .isEmail()
    .withMessage('Username cannot be an email.'),
  check('password', "Please provide a password")
    .notEmpty()
    .bail()
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

      let doesUsernameExist = await User.findOne({
        where: { username }
      });

      let doesEmailExist = await User.findOne({
        where: { email }
      });

      const err = {};

      if (doesEmailExist) {
        err.status = 403;
        err.title = "VALIDATION ERROR"
        err.message = "User already exists";
        err.errors = {email: "User with that email already exists"};

        return next(err)
      }

      if (doesUsernameExist) {
        err.status = 403;
        err.title = "VALIDATION ERROR";
        err.message = "User already exists";
        err.errors = {username: "User with that username already exists"};

        return next(err)
      }

      const user = await User.signup({ email, username, password, firstName, lastName });

      await setTokenCookie(res, user);

      return res.json({
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        username: user.username,
        token: ""
      });
    }
);


module.exports = router;
