const authService = require('../services/AuthService');
const tokenService = require('../services/TokenService');
const asyncHandler = require('../middlewares/async');

// @desc    Register user
exports.register = asyncHandler(async (req, res) => {
  const { user, token } = await authService.register(req.body);
  
  res.status(201)
    .cookie('token', token, tokenService.getCookieOptions())
    .redirect('/');
});

// @desc    Login user
exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const { user, token } = await authService.login(email, password);

  res.status(200)
    .cookie('token', token, tokenService.getCookieOptions())
    .redirect('/');
});

// @desc    Logout user
exports.logout = (req, res) => {
  const { tokenValue, options } = authService.logout();
  res.cookie('token', tokenValue, options).redirect('/login');
};

// @desc    Save FCM Token
exports.saveToken = asyncHandler(async (req, res) => {
  await authService.saveFcmToken(req.user._id, req.body.token);

  res.status(200).json({ success: true, message: 'Token saved successfully' });
});
