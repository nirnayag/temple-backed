const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const { auth, adminOnly, userOrAdmin } = require('../middleware/auth');

// Get all events (public)
router.get('/', async (req, res) => {
  try {
    const events = await Event.find().sort({ date: 1 });
    res.json(events);
  } catch (err) {
    console.error('Error fetching all events:', err);
    res.status(500).json({ message: err.message });
  }
});

// Get upcoming events (public)
router.get('/upcoming', async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const upcomingEvents = await Event.find({
      date: { $gte: today },
      isActive: true
    }).sort({ date: 1 });
    
    res.json(upcomingEvents);
  } catch (err) {
    console.error('Error fetching upcoming events:', err);
    res.status(500).json({ message: err.message });
  }
});

// Get event by ID (public)
router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('registeredDevotees', 'name email mobileNumber')
      .populate('sponsors.devoteId', 'name email mobileNumber');
      
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.json(event);
  } catch (err) {
    console.error('Error fetching event by ID:', err);
    res.status(500).json({ message: err.message });
  }
});

// Create event (admin only)
router.post('/', auth, adminOnly, async (req, res) => {
  try {
    const event = new Event(req.body);
    const newEvent = await event.save();
    res.status(201).json(newEvent);
  } catch (err) {
    console.error('Error creating event:', err);
    res.status(400).json({ message: err.message });
  }
});

// Update event (admin only)
router.patch('/:id', auth, adminOnly, async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    
    res.json(event);
  } catch (err) {
    console.error('Error updating event:', err);
    res.status(400).json({ message: err.message });
  }
});

// Delete event (admin only)
router.delete('/:id', auth, adminOnly, async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    
    res.json({ message: 'Event deleted successfully' });
  } catch (err) {
    console.error('Error deleting event:', err);
    res.status(500).json({ message: err.message });
  }
});

// Register for event (user or admin)
router.post('/:id/register', auth, userOrAdmin, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    
    // Check if registration is required
    if (!event.registrationRequired) {
      return res.status(400).json({ message: 'Registration is not required for this event' });
    }
    
    // Check if event is full
    if (event.maxAttendees && event.registeredDevotees.length >= event.maxAttendees) {
      return res.status(400).json({ message: 'Event is full' });
    }
    
    // Check if user is already registered
    if (event.registeredDevotees.includes(req.user.id)) {
      return res.status(400).json({ message: 'You are already registered for this event' });
    }
    
    // Add user to registered devotees
    event.registeredDevotees.push(req.user.id);
    await event.save();
    
    // Return updated event with populated fields
    const updatedEvent = await Event.findById(req.params.id)
      .populate('registeredDevotees', 'name email mobileNumber')
      .populate('sponsors.devoteId', 'name email mobileNumber');
    
    res.json(updatedEvent);
  } catch (err) {
    console.error('Error registering for event:', err);
    res.status(400).json({ message: err.message });
  }
});

module.exports = router; 