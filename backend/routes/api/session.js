// backend/routes/api/session.js
const express = require('express')
const { setTokenCookie, restoreUser } = require('../../utils/auth');
const { User } = require('../../db/models');
const router = express.Router();
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const validateLogin = [
  check('credential',)
    .notEmpty()
    .withMessage('Email or username is required'),
  check('password')
    .notEmpty()
    .withMessage('Password is required'),
  handleValidationErrors
];

//Log in
router.post('/',  validateLogin, async (req, res, next) => {
      const { credential, password } = req.body;

      const user = await User.login({ credential, password });

      if (!user) {
        const err = new Error('Login failed');
        err.status = 401;
        err.title = "UNAUTHORIZED LOGIN"
        err.message = "Invalid credentials"
        err.errors =
          {
            loginError: "The provided credentials were invalid",
            username: "Please check your username or email",
            password: "Please check your password"
          }
        return next(err);
      }

      await setTokenCookie(res, user);

      return res.json({
        user
      });
    }
  );

// Log out
router.delete('/', (_req, res) => {
      res.clearCookie('token');
      return res.json({ message: 'success' });
    }
  );

// Restore session user
router.get('/', restoreUser, (req, res) => {
  const { user } = req;
  if (user) {
    //console.log(user)
    return res.json({
      user //.toSafeObject()
    });
  } else return res.json({ user: null });
}
);

module.exports = router;
