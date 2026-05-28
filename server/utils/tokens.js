const jwt = require('jsonwebtoken');

const signAccessToken = (user, secret, opts = { expiresIn: '15m' }) =>
  jwt.sign({ sub: user._id.toString(), email: user.email, role: user.role }, secret, opts);

const signRefreshToken = (user, secret, opts = { expiresIn: '7d' }) =>
  jwt.sign({ sub: user._id.toString(), tokenType: 'refresh' }, secret, opts);

const setAuthCookies = (res, accessToken, refreshToken, cookieOptions) => {
  res.cookie('accessToken', accessToken, { ...cookieOptions, maxAge: 15 * 60 * 1000 });
  res.cookie('refreshToken', refreshToken, { ...cookieOptions, maxAge: 7 * 24 * 60 * 60 * 1000 });
};

const clearAuthCookies = (res, cookieOptions) => {
  res.clearCookie('accessToken', cookieOptions);
  res.clearCookie('refreshToken', cookieOptions);
};

module.exports = { signAccessToken, signRefreshToken, setAuthCookies, clearAuthCookies };
