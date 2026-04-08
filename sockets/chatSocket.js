const chatService = require('../services/ChatService');

const onlineUsers = {}; // Map to store userId -> socketId

/**
 * Handle Socket.io connections and events
 * @param {import('socket.io').Server} io 
 */
const chatSocket = (io) => {
  io.on('connection', (socket) => {
    console.log('User connected...', socket.id);

    socket.on('join', (userId) => {
      socket.join(userId);
      onlineUsers[userId] = socket.id;
      console.log(`User ${userId} joined their private room`);
    });

    socket.on('privateMessage', async (data) => {
      try {
        const { senderId, receiverId, message } = data;
        
        const isReceiverOffline = !onlineUsers[receiverId];

        const populatedMessage = await chatService.sendMessage({
          senderId,
          receiverId,
          message,
          isReceiverOffline
        });

        // Emit to sender's room
        io.to(senderId).emit('message', populatedMessage);
        
        // Emit to receiver's room
        io.to(receiverId).emit('message', populatedMessage);

      } catch (err) {
        console.error('Socket Error:', err.message);
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
