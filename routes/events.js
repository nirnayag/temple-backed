const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const { auth, adminOnly, userOrAdmin } = require('../middleware/auth');

// Get all events (public)
router.get('/', async (req, res) => {
  try {
    const events = await Event.find();
    res.json(events);
  } catch (err) {
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
    res.status(400).json({ message: err.message });
  }
});

module.exports = router; 