const User = require('../models/User');
const Message = require('../models/Message');

// @desc    Get all users and their chat stats
// @route   GET /admin/dashboard
// @access  Private/Admin
exports.getDashboard = async (req, res) => {
  try {
    // Aggregate chat stats for each user
    const users = await User.find({ role: 'user' });
    
    const usersWithStats = await Promise.all(users.map(async (user) => {
      // Find all unique users this user has messaged or received messages from
      const messagedUsers = await Message.distinct('receiver', { sender: user._id });
      const receivedFromUsers = await Message.distinct('sender', { receiver: user._id });
      
      const uniqueChatPartnersIds = [...new Set([...messagedUsers.map(id => id.toString()), ...receivedFromUsers.map(id => id.toString())])];
      
      const chatPartners = await User.find({ 
        _id: { $in: uniqueChatPartnersIds } 
      }, 'username email');

      const messageCount = await Message.countDocuments({
        $or: [{ sender: user._id }, { receiver: user._id }]
      });

      return {
        _id: user._id,
        username: user.username,
        email: user.email,
        messageCount,
        chatPartners
      };
    }));

    res.render('admin/dashboard', { user: req.user, users: usersWithStats });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};
