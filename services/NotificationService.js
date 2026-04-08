const admin = require('../config/firebase');

class NotificationService {
  /**
   * Send a private message notification
   * @param {Object} params
   * @param {string} params.token - Recipient FCM token
   * @param {string} params.senderName - Name of the sender
   * @param {string} params.message - Message content
   * @param {string} params.senderId - Sender ID (for deep linking)
   * @returns {Promise<void>}
   */
  async sendPrivateMessageNotification({ token, senderName, message, senderId }) {
    if (!token) return;

    try {
      await admin.messaging().send({
        token: token,
        notification: {
          title: `New Message from ${senderName}`,
          body: message
        },
        webpush: {
          fcmOptions: {
            link: `/?user=${senderId}`
          }
        }
      });
      console.log(`FCM notification sent to user`);
    } catch (err) {
      console.error('FCM Error:', err.message);
    }
  }
}

module.exports = new NotificationService();
