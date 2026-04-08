const Message = require('../models/Message');
const User = require('../models/User');
const admin = require('../config/firebase');

const onlineUsers = {}; // Map to store userId -> socketId

const chatSocket = (io) => {
  io.on('connection', (socket) => {
    console.log('User connected...', socket.id);

    socket.on('join', (userId) => {
      // Each user joins their own private room named after their userId
      socket.join(userId);
      onlineUsers[userId] = socket.id;
      console.log(`User ${userId} joined their private room`);
    });

    socket.on('privateMessage', async (data) => {
      try {
        const { senderId, receiverId, message } = data;
        console.log(`Private message from ${senderId} to ${receiverId}: ${message}`);
        
        // Save message to DB
        const newMessage = await Message.create({
          sender: senderId,
          receiver: receiverId,
          content: message
        });

        const populatedMessage = await Message.findById(newMessage._id).populate('sender', 'username');

        // Emit to sender's room
        io.to(senderId).emit('message', populatedMessage);
        
        // Emit to receiver's room
        io.to(receiverId).emit('message', populatedMessage);

        // Logic for Push Notifications (if recipient is offline)
        if (!onlineUsers[receiverId]) {
          console.log(`User ${receiverId} is offline. Attempting to send FCM notification...`);
          const receiver = await User.findById(receiverId);
          if (receiver && receiver.fcmToken) {
            console.log(`Sending FCM to token: ${receiver.fcmToken.substring(0, 10)}...`);
            await admin.messaging().send({
              token: receiver.fcmToken,
              notification: {
                title: `New Message from ${populatedMessage.sender.username}`,
                body: message
              },
              webpush: {
                fcmOptions: {
                  link: `/?user=${senderId}`
                }
              }
            }).then(() => {
              console.log('FCM Notification sent successfully!');
            }).catch(err => console.error(`FCM Error:`, err.message));
          } else {
            console.log(`Receiver has no FCM token or was not found.`);
          }
        } else {
          console.log(`User ${receiverId} is online. Skipping FCM.`);
        }

      } catch (err) {
        console.error('Socket Error:', err);
      }
    });

    socket.on('disconnect', () => {
      for (const [userId, socketId] of Object.entries(onlineUsers)) {
        if (socketId === socket.id) {
          delete onlineUsers[userId];
          console.log(`User ${userId} left their private room`);
          break;
        }
      }
    });
  });
};

module.exports = chatSocket;
