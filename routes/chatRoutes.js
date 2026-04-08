const express = require('express');
const { getChat } = require('../controllers/chatController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/', protect, getChat);

module.exports = router;
