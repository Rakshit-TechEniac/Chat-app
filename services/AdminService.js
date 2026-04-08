const userRepository = require('../repositories/UserRepository');
const messageRepository = require('../repositories/MessageRepository');

class AdminService {
  /**
   * Get detailed user statistics for the dashboard
   * @returns {Promise<Array<Object>>}
   */
  async getUserStats() {
    const users = await userRepository.getAll({ role: 'user' });
    
    return await Promise.all(users.map(async (user) => {
      const partnerIds = await messageRepository.getUniqueChatPartnerIds(user._id);
      
      const chatPartners = await userRepository.getAll(
        { _id: { $in: partnerIds } },
        { select: 'username email' }
      );

      const messageCount = await messageRepository.countUserMessages(user._id);

      return {
        _id: user._id,
        username: user.username,
        email: user.email,
        messageCount,
        chatPartners
      };
    }));
  }
}

module.exports = new AdminService();
