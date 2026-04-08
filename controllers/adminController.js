const adminService = require('../services/AdminService');
const asyncHandler = require('../middlewares/async');

// @desc    Get all users and their chat stats
exports.getDashboard = asyncHandler(async (req, res) => {
  const usersWithStats = await adminService.getUserStats();
  res.render('admin/dashboard', { user: req.user, users: usersWithStats });
});
