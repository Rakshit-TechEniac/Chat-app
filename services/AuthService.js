const userRepository = require('../repositories/UserRepository');
const tokenService = require('./TokenService');
const UserRole = require('../constants/roles');

class AuthService {
  /**
   * Register a new user
   * @param {Object} userData - User data (username, email, password)
   * @returns {Promise<Object>} - User and Token
   */
  async register(userData) {
    const { username, email, password } = userData;

    const existingUser = await userRepository.findByUsernameOrEmail(username, email);
    if (existingUser) {
      throw new Error('Username or Email already exists');
    }

    const user = await userRepository.create({
      username,
      email,
      password,
      role: UserRole.USER
    });

    const token = tokenService.generateToken(user._id);

    return { user, token };
  }

  /**
   * Login a user
   * @param {string} email
   * @param {string} password
   * @returns {Promise<Object>} - User and Token
   */
  async login(email, password) {
    if (!email || !password) {
      throw new Error('Please provide email and password');
    }

    const user = await userRepository.findByEmailWithPassword(email);
    
    if (!user || !(await user.matchPassword(password))) {
      throw new Error('Invalid credentials');
    }

    const token = tokenService.generateToken(user._id);

    return { user, token };
  }

  /**
   * Update the FCM token for a user
   * @param {string} userId
   * @param {string} fcmToken
   * @returns {Promise<void>}
   */
  async saveFcmToken(userId, fcmToken) {
    if (!fcmToken) {
      throw new Error('Token is required');
    }

    await userRepository.update(userId, { fcmToken });
  }

  /**
   * Logout user logic (returns cookie cleanup info if needed)
   * @returns {Object}
   */
  logout() {
    return {
      tokenValue: 'none',
      options: {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true
      }
    };
  }
}

module.exports = new AuthService();
