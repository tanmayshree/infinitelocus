const socketIo = require('socket.io');
const { fetchRegistrationCount } = require('./controllers/eventController');

const socketSetup = (server) => {
      const io = socketIo(server, {
            cors: {
                  origin: "http://localhost:3000",
                  methods: ["GET", "POST"],
                  credentials: true
            }
      });

      io.on('connection', async (socket) => {
            console.log('User connected');

            const totalRegistrations = await fetchRegistrationCount();
            socket.emit("countUpdate", totalRegistrations);

            socket.on('join', (userId) => {
                  if (userId) {
                        socket.join(userId); // Join the user to a room with their ID
                        console.log(`User ${userId} connected to room.`);
                  } else {
                        console.log('User ID not provided.');
                  }
            });

            socket.on('disconnect', () => {
                  console.log('User disconnected');
            });
      });

      return io;
};

module.exports = { socketSetup };

