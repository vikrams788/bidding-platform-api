require('dotenv').config();
const express = require('express');
const http = require('http');
const { Sequelize } = require('sequelize');
const bodyParser = require('body-parser');
const cors = require('cors');
const socketIo = require('socket.io');
const authRoutes = require('./routes/authRoutes');
const itemRoutes = require('./routes/itemRoutes');
const bidRoutes = require('./routes/bidRoutes');
const notificationRoutes = require('./routes/notificationRoutes');

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  protocol: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
});

sequelize
  .authenticate()
  .then(() => console.log('Database connected...'))
  .catch((err) => console.log('Error: ' + err));

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: 'http://localhost:5000',
  },
});

app.use(bodyParser.json());
app.use(cors());

app.use('/api/auth', authRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/bids', bidRoutes(io));
app.use('/api/notifications', notificationRoutes);

io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('bid', (data) => {
    io.emit('update', data);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

sequelize.sync().then(() => {
  const PORT = process.env.PORT || 5000;
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});

module.exports = { io };