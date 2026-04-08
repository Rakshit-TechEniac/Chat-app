const express = require('express');
const { register, login, logout, saveToken } = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');
const validate = require('../middlewares/validate');
const { registerSchema, loginSchema, fcmTokenSchema } = require('../dtos/UserDtos');

const router = express.Router();

router.get('/login', (req, res) => res.render('login'));
router.get('/register', (req, res) => res.render('register'));

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.get('/logout', logout);
router.post('/save-token', protect, validate(fcmTokenSchema), saveToken);

module.exports = router;
