const jwt = require('jsonwebtoken');

class TokenService {
  /**
   * Generate a JWT for a user
   * @param {string} userId - The user ID
   * @returns {string} - Signed JWT
   */
  generateToken(userId) {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
      expiresIn: '30d'
    });
  }

  /**
   * Get cookie options for the token
   * @returns {Object}
   */
  getCookieOptions() {
    return {
      expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production'
    };
  }

  /**
   * Verify a JWT
   * @param {string} token - The token to verify
   * @returns {Object} - Decoded payload
   */
  verifyToken(token) {
    try {
      return jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      throw new Error('Invalid or expired token');
    }
  }
}

module.exports = new TokenService();
