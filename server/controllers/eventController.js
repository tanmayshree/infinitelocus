const { app } = require('../app');
const Event = require('../models/Event');

// Create an Event
exports.createEvent = async (req, res) => {
      try {
            const { title, description, date, location } = req.body;
            const event = new Event({
                  title,
                  description,
                  date,
                  location,
                  organizer: req.user.id
            });
            await event.save();
            res.status(201).json(event);
      } catch (err) {
            res.status(400).json({ error: err.message });
      }
};

// Update an event (only the date and location are editable)
exports.updateEvent = async (req, res) => {
      try {
            const { id } = req.params;
            const { date, location } = req.body; // Only accept date and location fields
            const userId = req.user.id; // Get the logged-in user from the request

            // Find the event by ID
            const event = await Event.findById(id);

            if (!event) {
                  return res.status(404).json({ message: 'Event not found' });
            }

            // Check if the logged-in user is the event organizer (assuming the event model has an `organizer` field)
            if (event.organizer.toString() !== userId) {
                  return res.status(403).json({ message: 'You are not authorized to edit this event' });
            }

            // Update only the date and location
            if (date) event.date = date;
            if (location) event.location = location;

            await event.save(); // Save the updated event

            res.status(200).json({ message: 'Event updated successfully', event });
      } catch (err) {
            console.error('Error updating event:', err);
            res.status(500).json({ message: 'Server error' });
      }
};


// Delete Event
exports.deleteEvent = async (req, res) => {
      try {
            const event = await Event.findById(req.params.id);
            if (!event) return res.status(404).json({ error: 'Event not found' });

            // Ensure only the organizer can delete
            if (event.organizer.toString() !== req.user.id) {
                  return res.status(403).json({ error: 'Not authorized to delete this event' });
            }

            await event.deleteOne();
            res.json({ message: 'Event removed' });
      } catch (err) {
            res.status(500).json({ error: err.message });
      }
};

exports.getEventDetail = async (req, res) => {
      try {
            const eventId = req.params.id;
            const event = await Event.findById(eventId); // Find the event by ID

            if (!event) {
                  return res.status(404).json({ message: 'Event not found' });
            }

            res.status(200).json(event); // Send event data to the frontend
      } catch (err) {
            console.error('Error fetching event:', err);
            res.status(500).json({ message: 'Server error' });
      }
};

exports.getEventsList = async (req, res) => {
      try {
            // Optional filters (query parameters like location, date, or status)
            const { location, date, status } = req.query;

            // Build query object based on available query parameters
            let query = {};

            if (location) {
                  query.location = location; // Filter by location
            }

            if (date) {
                  query.date = { $gte: new Date(date) }; // Filter by date (events on or after the given date)
            }

            if (status) {
                  const now = new Date();
                  if (status === 'upcoming') {
                        query.date = { $gte: now }; // Upcoming events
                  } else if (status === 'past') {
                        query.date = { $lt: now }; // Past events
                  }
            }

            // Fetch filtered events from the database
            const events = await Event.find(query);

            if (events.length === 0) {
                  return res.status(201).json({ message: 'No events found' });
            }

            // Return events if found
            res.status(200).json(events);
      } catch (err) {
            console.error('Error fetching events:', err);
            res.status(500).json({ message: 'Server error' });
      }
};

// Register for an event
exports.registerForEvent = async (req, res) => {
      try {
            const eventId = req.params.id;
            const userId = req.user.id; // Assuming user is authenticated and you have their ID in `req.user`

            // Find the event by ID
            const event = await Event.findById(eventId);
            if (!event) {
                  return res.status(404).json({ message: 'Event not found' });
            }

            // Check if the user has already registered
            if (event.registrations.includes(userId)) {
                  return res.status(400).json({ message: 'User already registered for this event' });
            }

            // Add the user to the event registrations
            event.registrations.push(userId);
            await event.save();

            const io = app.get('socketio')
            const totalRegistrations = await this.fetchRegistrationCount();
            io.emit("countUpdate", totalRegistrations);

            res.status(200).json({ message: 'Successfully registered for the event' });
      } catch (err) {
            console.error('Error registering for event:', err);
            res.status(500).json({ message: 'Server error' });
      }
};

exports.fetchRegistrationCount = async () => {
      try {
            const events = await Event.find(); // Fetch all events from the database
            let totalRegistrations = 0;

            events.forEach(event => {
                  totalRegistrations += event.registrations.length || 0; // Add up all registration counts
            });
            console.log(totalRegistrations)
            return totalRegistrations;
      } catch (err) {
            console.error('Error fetching registration count:', err);
            return -1
      }
};