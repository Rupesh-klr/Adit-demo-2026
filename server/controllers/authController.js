const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { signAccessToken, signRefreshToken, setAuthCookies, clearAuthCookies } = require('../utils/tokens');

const signup = (JWT_SECRET, REFRESH_TOKEN_SECRET, cookieOptions) => async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) return res.status(400).json({ error: 'Missing fields' });
  if (String(password).length < 6) return res.status(400).json({ error: 'Password too short' });

  const normalizedEmail = String(email).trim().toLowerCase();
  const existingUser = await User.findOne({ email: normalizedEmail });
  if (existingUser) return res.status(409).json({ error: 'Conflict', message: 'Email exists' });

  const passwordHash = await bcrypt.hash(String(password), 10);
  const user = await User.create({ name: String(name).trim(), email: normalizedEmail, passwordHash, role: 'user' });

  const accessToken = signAccessToken(user, JWT_SECRET);
  const refreshToken = signRefreshToken(user, REFRESH_TOKEN_SECRET);
  setAuthCookies(res, accessToken, refreshToken, cookieOptions);
  res.status(201).json({ accessToken, refreshToken, user: { id: user._id, name: user.name, email: user.email } });
};

const login = (JWT_SECRET, REFRESH_TOKEN_SECRET, cookieOptions) => async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Missing fields' });

  const normalizedEmail = String(email).trim().toLowerCase();
  const user = await User.findOne({ email: normalizedEmail });
  if (!user) return res.status(401).json({ error: 'Unauthorized' });

  const validPassword = await bcrypt.compare(String(password), user.passwordHash);
  if (!validPassword) return res.status(401).json({ error: 'Unauthorized' });

  const accessToken = signAccessToken(user, JWT_SECRET);
  const refreshToken = signRefreshToken(user, REFRESH_TOKEN_SECRET);
  setAuthCookies(res, accessToken, refreshToken, cookieOptions);
  res.json({ accessToken, refreshToken, user: { id: user._id, name: user.name, email: user.email } });
};

const guestLogin = (JWT_SECRET, REFRESH_TOKEN_SECRET, cookieOptions, ENABLE_GUEST_LOGIN) => async (req, res) => {
  if (!ENABLE_GUEST_LOGIN) return res.status(403).json({ error: 'Forbidden' });
  const guestEmail = 'guest@taskmanager.local';
  let guestUser = await User.findOne({ email: guestEmail });
  if (!guestUser) {
    guestUser = await User.create({ name: 'Guest User', email: guestEmail, passwordHash: await bcrypt.hash('guest-login', 10), role: 'guest', isGuest: true });
  }
  const accessToken = signAccessToken(guestUser, JWT_SECRET);
  const refreshToken = signRefreshToken(guestUser, REFRESH_TOKEN_SECRET);
  setAuthCookies(res, accessToken, refreshToken, cookieOptions);
  res.json({ accessToken, refreshToken, user: { id: guestUser._id, name: guestUser.name, email: guestUser.email } });
};

const refresh = (JWT_SECRET, REFRESH_TOKEN_SECRET, cookieOptions) => async (req, res) => {
  const token = req.cookies.refreshToken || req.body.refreshToken;
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  let decoded;
  try { decoded = require('jsonwebtoken').verify(token, REFRESH_TOKEN_SECRET); } catch (err) { return res.status(401).json({ error: 'Unauthorized' }); }
  const user = await User.findById(decoded.sub);
  if (!user) return res.status(401).json({ error: 'Unauthorized' });
  const accessToken = signAccessToken(user, JWT_SECRET);
  const refreshToken = signRefreshToken(user, REFRESH_TOKEN_SECRET);
  setAuthCookies(res, accessToken, refreshToken, cookieOptions);
  res.json({ accessToken, refreshToken, user: { id: user._id, name: user.name, email: user.email } });
};

const logout = (cookieOptions) => async (req, res) => {
  clearAuthCookies(res, cookieOptions);
  res.json({ message: 'Logged out' });
};

const me = () => async (req, res) => {
  if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
  res.json({ user: { id: req.user._id, name: req.user.name, email: req.user.email, role: req.user.role } });
};

module.exports = { signup, login, guestLogin, refresh, logout, me };
