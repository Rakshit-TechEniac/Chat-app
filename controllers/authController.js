const User = require('../models/User');
const jwt = require('jsonwebtoken');

// @desc    Register user
// @route   POST /register
// @access  Public
exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const user = await User.create({ username, email, password });
    sendTokenResponse(user, 201, res);
  } catch (err) {
    res.status(400).render('register', { error: err.message });
  }
};

// @desc    Login user
// @route   POST /login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).render('login', { error: 'Please provide email and password' });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).render('login', { error: 'Invalid credentials' });
    }

    sendTokenResponse(user, 200, res);
  } catch (err) {
    res.status(500).render('login', { error: err.message });
  }
};

// @desc    Logout user
// @route   GET /logout
// @access  Private
exports.logout = (req, res) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });
  res.redirect('/login');
};

const sendTokenResponse = (user, statusCode, res) => {
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });

  const options = {
    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    httpOnly: true
  };

  res.status(statusCode).cookie('token', token, options).redirect('/');
};

// @desc    Save FCM Token
// @route   POST /save-token
// @access  Private
exports.saveToken = async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) {
      return res.status(400).json({ success: false, message: 'Token is required' });
    }

    await User.findByIdAndUpdate(req.user._id, { fcmToken: token });

    res.status(200).json({ success: true, message: 'Token saved successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
