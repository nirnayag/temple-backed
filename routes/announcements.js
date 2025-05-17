const express = require('express');
const router = express.Router();
const Announcement = require('../models/Announcement');
const { auth, adminOnly } = require('../middleware/auth');

// Get all announcements (public)
router.get('/', async (req, res) => {
  try {
    const announcements = await Announcement.find({ isActive: true }).sort({ startDate: 1 });
    res.json(announcements);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get announcement by ID (public)
router.get('/:id', async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id);
    if (!announcement) return res.status(404).json({ message: 'Announcement not found' });
    res.json(announcement);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create announcement (admin only)
router.post('/', auth, adminOnly, async (req, res) => {
  const announcement = new Announcement(req.body);
  try {
    const newAnnouncement = await announcement.save();
    res.status(201).json(newAnnouncement);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update announcement (admin only)
router.patch('/:id', auth, adminOnly, async (req, res) => {
  try {
    const announcement = await Announcement.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!announcement) return res.status(404).json({ message: 'Announcement not found' });
    res.json(announcement);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete announcement (admin only)
router.delete('/:id', auth, adminOnly, async (req, res) => {
  try {
    const announcement = await Announcement.findByIdAndDelete(req.params.id);
    if (!announcement) return res.status(404).json({ message: 'Announcement not found' });
    res.json({ message: 'Announcement deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router; 