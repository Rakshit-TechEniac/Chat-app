const BaseRepository = require('./BaseRepository');
const User = require('../models/User');

class UserRepository extends BaseRepository {
  constructor() {
    super(User);
  }

  /**
   * Find user by email and include password for validation
   * @param {string} email
   * @returns {Promise<import('mongoose').Document|null>}
   */
  async findByEmailWithPassword(email) {
    return await this.model.findOne({ email }).select('+password').exec();
  }

  /**
   * Check if a username or email already exists
   * @param {string} username
   * @param {string} email
   * @returns {Promise<import('mongoose').Document|null>}
   */
  async findByUsernameOrEmail(username, email) {
    return await this.model.findOne({
      $or: [{ username }, { email }]
    }).exec();
  }
}

module.exports = new UserRepository();
