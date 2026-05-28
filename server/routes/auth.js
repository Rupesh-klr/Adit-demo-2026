const express = require('express');
const router = express.Router();
const authCtrl = require('../controllers/authController');

module.exports = (options, authenticate) => {
  const { JWT_SECRET, REFRESH_TOKEN_SECRET, cookieOptions, ENABLE_GUEST_LOGIN } = options;
  router.post('/signup', authCtrl.signup(JWT_SECRET, REFRESH_TOKEN_SECRET, cookieOptions));
  router.post('/login', authCtrl.login(JWT_SECRET, REFRESH_TOKEN_SECRET, cookieOptions));
  router.post('/guest-login', authCtrl.guestLogin(JWT_SECRET, REFRESH_TOKEN_SECRET, cookieOptions, ENABLE_GUEST_LOGIN));
  router.post('/refresh', authCtrl.refresh(JWT_SECRET, REFRESH_TOKEN_SECRET, cookieOptions));
  router.post('/logout', authCtrl.logout(cookieOptions));
  if (authenticate) {
    router.get('/me', authenticate, authCtrl.me());
  } else {
    router.get('/me', (req, res, next) => next(), authCtrl.me());
  }
  return router;
};
