const Message = require('../models/Message');
const User = require('../models/User');

// @desc    Get chat page
// @route   GET /
// @access  Private
exports.getChat = async (req, res) => {
  try {
    // Get all users except current user
    const users = await User.find({ _id: { $ne: req.user.id } }, 'username email');
    
    // Get last chat partner or first one from the list
    const otherUserId = req.query.user || (users.length > 0 ? users[0]._id : null);
    
    let messages = [];
    let selectedUser = null;

    if (otherUserId) {
      selectedUser = await User.findById(otherUserId, 'username email');
      messages = await Message.find({
        $or: [
          { sender: req.user.id, receiver: otherUserId },
          { sender: otherUserId, receiver: req.user.id }
        ]
      }).sort('createdAt');
    }

    res.render('chat', { 
      user: req.user, 
      users, 
      messages, 
      selectedUser 
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};
