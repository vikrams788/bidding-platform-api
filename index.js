const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const app = express();
const server = http.createServer(app);
const io = socketIo(server);
const authRoutes = require('./routes/authRoutes');
const itemRoutes = require('./routes/itemRoutes');
const bidRoutes = require('./routes/bidRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const db = require('./utils/db');

// middleware
app.use(express.json());
app.use('/api/users', authRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/bids', bidRoutes);
app.use('/api/notifications', notificationRoutes);

// webSocket setup
io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('bid', (data) => {
    io.emit('update', data);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

const PORT = process.env.PORT || 5000;
db.sync().then(() => {
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});