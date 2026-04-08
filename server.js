const http = require('http');
const socketio = require('socket.io');
const app = require('./app');
const connectDB = require('./config/db');
const chatSocket = require('./sockets/chatSocket');

// Connect to database
connectDB();

const server = http.createServer(app);
const io = socketio(server);

// Initialize Socket.io
chatSocket(io);

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});
