const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const { auth, adminOnly, userOrAdmin } = require('../middleware/auth');

// Get upcoming events (public)
router.get('/upcoming', async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const upcomingEvents = await Event.find({
      date: { $gte: today }
    }).sort({ date: 1 });
    
    // Simply return what we found, even if empty
    res.json(upcomingEvents);
  } catch (err) {
    console.error('Error fetching upcoming events:', err);
    res.status(500).json({ message: err.message });
  }
});

// Get all events (public)
router.get('/', async (req, res) => {
  try {
    const events = await Event.find();
    res.json(events);
  } catch (err) {
    console.error('Error fetching all events:', err);
    res.status(500).json({ message: err.message });
  }
});

// Get event by ID (public)
router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate('registeredDevotees', 'name email phone');
    if (!event) return res.status(404).json({ message: 'Event not found' });
    res.json(event);
  } catch (err) {
    console.error('Error fetching event by ID:', err);
    res.status(500).json({ message: err.message });
  }
});

// Create event (admin only)
router.post('/', auth, adminOnly, async (req, res) => {
  const event = new Event(req.body);
  try {
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
    if (!event) return res.status(404).json({ message: 'Event not found' });
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
    if (!event) return res.status(404).json({ message: 'Event not found' });
    res.json({ message: 'Event deleted' });
  } catch (err) {
    console.error('Error deleting event:', err);
    res.status(500).json({ message: err.message });
  }
});

// Register devotee for event (user or admin)
router.post('/:id/register/:devoteeId', auth, userOrAdmin, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    
    // Check if devotee already registered
    if (event.registeredDevotees.includes(req.params.devoteeId)) {
      return res.status(400).json({ message: 'Devotee already registered for this event' });
    }
    
    event.registeredDevotees.push(req.params.devoteeId);
    await event.save();
    
    res.status(200).json(event);
  } catch (err) {
    console.error('Error registering for event:', err);
    res.status(400).json({ message: err.message });
  }
});

// Unregister devotee from event (user or admin)
router.delete('/:id/register/:devoteeId', auth, userOrAdmin, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    
    event.registeredDevotees = event.registeredDevotees.filter(
      devotee => devotee.toString() !== req.params.devoteeId
    );
    
    await event.save();
    res.status(200).json(event);
  } catch (err) {
    console.error('Error unregistering from event:', err);
    res.status(400).json({ message: err.message });
  }
});

module.exports = router; 