const express = require('express');
const { register, login, logout, saveToken } = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/login', (req, res) => res.render('login'));
router.get('/register', (req, res) => res.render('register'));

router.post('/register', register);
router.post('/login', login);
router.get('/logout', logout);
router.post('/save-token', protect, saveToken);

module.exports = router;
