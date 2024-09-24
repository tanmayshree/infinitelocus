const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Register User
exports.register = async (req, res) => {
      const { name, email, password } = req.body;
      try {
            const user = new User({ name, email, password });
            await user.save();
            const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
            res.json({ token });
      } catch (err) {
            res.status(400).json({ error: err.message });
      }
};

// Login User
exports.login = async (req, res) => {
      const { email, password } = req.body;
      try {
            const user = await User.findOne({ email });
            if (!user) return res.status(400).json({ error: 'Invalid credentials' });

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

            const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
            res.json({ token: token, id: user._id, role: user.role });
      } catch (err) {
            res.status(500).json({ error: err.message });
      }
};

exports.me = async (req, res) => {
      try {
            // Get the user ID from req.user (set in the authenticateToken middleware)
            const userId = req.user.id;

            // Find the user by their ID in the database
            const user = await User.findById(userId).select('-password'); // Exclude password from response

            // If user is not found
            if (!user) {
                  return res.status(404).json({ message: 'User not found' });
            }

            // Send user data in the response
            res.json({
                  id: user._id,
                  name: user.name,            // User's name
                  email: user.email,        // User's email
                  role: user.role             // User's role
            });

      } catch (err) {
            // Handle errors (e.g., server issues)
            res.status(500).json({ message: 'Server error' });
      }
};