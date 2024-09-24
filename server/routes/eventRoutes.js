const express = require('express');
const { createEvent, registerForEvent, updateEvent, deleteEvent, getEventsList, getEventDetail } = require('../controllers/eventController');
const { authenticateToken } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/create', authenticateToken, createEvent);
router.post('/:id/register', authenticateToken, registerForEvent);
router.get('/:id', authenticateToken, getEventDetail);     // Update event
router.put('/:id', authenticateToken, updateEvent);     // Update event
router.delete('/:id', authenticateToken, deleteEvent); // Delete event
router.get('/', authenticateToken, getEventsList);
router.post('/:id/register', authenticateToken, registerForEvent);


module.exports = router;
