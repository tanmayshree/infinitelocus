const { app } = require('../app');
const cron = require('node-cron');
const moment = require('moment');
const Event = require('../models/Event');
const User = require('../models/User');
const Notification = require('../models/Notification');
// const io = require('./socket'); // Socket instance for real-time notifications
const setupCron = () => {

      cron.schedule('* * * * * *', async () => { // Every hour
            try {
                  const upcomingEvents = await Event.find({
                        date: {
                              $gte: new Date(), // Current date
                              $lte: moment().add(24, 'hours').toDate() // Events within the next 24 hours
                        }
                  });

                  for (const event of upcomingEvents) {
                        const users = await User.find(); // Get users (you can also notify only those registered)

                        for (const user of users) {
                              const message = `Reminder: The event "${event.title}" is happening within the next 24 hours.`;

                              // Create notification
                              const notification = new Notification({
                                    userId: user._id,
                                    message,
                                    eventId: event._id
                              });
                              await notification.save();

                              console.log("cron running", message)
                              const io = app.get('socketio')
                              // Emit notification to the user using Socket.IO
                              io.to(user._id.toString()).emit('newNotification', message);
                        }
                  }
            } catch (err) {
                  console.error('Error checking upcoming events:', err);
            }
      });
}

module.exports = setupCron;