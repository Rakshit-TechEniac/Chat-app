const messageRepository = require('../repositories/MessageRepository');
const userRepository = require('../repositories/UserRepository');
const notificationService = require('./NotificationService');

class ChatService {
  /**
   * Get main chat view data
   * @param {string} currentUserId
   * @param {string} [otherUserId] - Optional selected chat partner ID
   * @returns {Promise<Object>}
   */
  async getChatContext(currentUserId, otherUserId) {
    const users = await userRepository.getAll(
      { _id: { $ne: currentUserId } }, 
      { select: 'username email' }
    );

    const partnerId = otherUserId || (users.length > 0 ? users[0]._id : null);
    
    let messages = [];
    let selectedUser = null;

    if (partnerId) {
      selectedUser = await userRepository.findById(partnerId, 'username email');
      if (selectedUser) {
        messages = await messageRepository.getChatHistory(currentUserId, partnerId);
      }
    }

    return { users, messages, selectedUser };
  }

  /**
   * Send a private message
   * @param {Object} data 
   * @param {string} data.senderId
   * @param {string} data.receiverId
   * @param {string} data.message
   * @param {boolean} [isReceiverOffline] - Trigger notification if true
   * @returns {Promise<Object>} - The saved message (populated)
   */
  async sendMessage(data) {
    const { senderId, receiverId, message, isReceiverOffline } = data;

    const newMessage = await messageRepository.create({
      sender: senderId,
      receiver: receiverId,
      content: message
    });

    const populatedMessage = await messageRepository.findById(newMessage._id, { path: 'sender', select: 'username' });

    if (isReceiverOffline) {
      const receiver = await userRepository.findById(receiverId);
      if (receiver && receiver.fcmToken) {
        await notificationService.sendPrivateMessageNotification({
          token: receiver.fcmToken,
          senderName: populatedMessage.sender.username,
          message: message,
          senderId: senderId
        });
      }
    }

    return populatedMessage;
  }
}

module.exports = new ChatService();
