const express = require('express');
const { getDashboard } = require('../controllers/adminController');
const { protect, authorize } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/dashboard', protect, authorize('admin'), getDashboard);

module.exports = router;
