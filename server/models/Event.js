const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
      title: { type: String, required: true },
      description: String,
      date: { type: Date, required: true },
      location: String,
      organizer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      registrations: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
});


module.exports = mongoose.model('Event', eventSchema);
