const { app } = require('./app');
const express = require('express');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const eventRoutes = require('./routes/eventRoutes');
const { socketSetup } = require('./socket');
const cors = require('cors');
const setupCron = require('./config/cron');
require('dotenv').config();

app.use(cors());
app.use(express.json());

connectDB();

app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);

const server = app.listen(process.env.PORT, () => {
      console.log(`Server running on port ${process.env.PORT}`);

      setupCron();
});

io = socketSetup(server);
app.set('socketio', io);
