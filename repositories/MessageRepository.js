const BaseRepository = require('./BaseRepository');
const Message = require('../models/Message');

class MessageRepository extends BaseRepository {
  constructor() {
    super(Message);
  }

  /**
   * Get chat history between two users
   * @param {string} userId1
   * @param {string} userId2
   * @returns {Promise<Array<import('mongoose').Document>>}
   */
  async getChatHistory(userId1, userId2) {
    return await this.model.find({
      $or: [
        { sender: userId1, receiver: userId2 },
        { sender: userId2, receiver: userId1 }
      ]
    }).sort('createdAt').exec();
  }

  /**
   * Get unique chat partners for a user
   * @param {string} userId
   * @returns {Promise<Array<string>>} - IDs of chat partners
   */
  async getUniqueChatPartnerIds(userId) {
    const messagedUsers = await this.model.distinct('receiver', { sender: userId });
    const receivedFromUsers = await this.model.distinct('sender', { receiver: userId });
    
    return [...new Set([
      ...messagedUsers.map(id => id.toString()), 
      ...receivedFromUsers.map(id => id.toString())
    ])];
  }

  /**
   * Count total messages for a user (sent or received)
   * @param {string} userId
   * @returns {Promise<number>}
   */
  async countUserMessages(userId) {
    return await this.model.countDocuments({
      $or: [{ sender: userId }, { receiver: userId }]
    });
  }
}

module.exports = new MessageRepository();
