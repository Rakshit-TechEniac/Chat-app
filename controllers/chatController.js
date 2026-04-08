const chatService = require('../services/ChatService');
const asyncHandler = require('../middlewares/async');

// @desc    Get chat page
exports.getChat = asyncHandler(async (req, res) => {
  const { users, messages, selectedUser } = await chatService.getChatContext(
    req.user.id, 
    req.query.user
  );

  res.render('chat', { 
    user: req.user, 
    users, 
    messages, 
    selectedUser 
  });
});
