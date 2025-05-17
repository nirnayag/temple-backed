const express = require('express');
const router = express.Router();
const { Prasadam, PrasadamInfo } = require('../models/Prasadam');
const { auth, adminOnly } = require('../middleware/auth');

// Get general prasadam information (public)
router.get('/info', async (req, res) => {
  try {
    let info = await PrasadamInfo.findOne();
    if (!info) {
      info = await new PrasadamInfo().save();
    }
    res.json(info);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update general prasadam information (admin only)
router.patch('/info', auth, adminOnly, async (req, res) => {
  try {
    let info = await PrasadamInfo.findOne();
    if (info) {
      info = await PrasadamInfo.findByIdAndUpdate(
        info._id,
        { 
          description: req.body.description,
          updatedAt: Date.now()
        },
        { new: true, runValidators: true }
      );
    } else {
      info = await new PrasadamInfo({
        description: req.body.description
      }).save();
    }
    res.json(info);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get all prasadam info (public)
router.get('/', async (req, res) => {
  try {
    const prasadam = await Prasadam.find().sort({ dayOfWeek: 1 });
    res.json(prasadam);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get prasadam info by day (public)
router.get('/day/:dayOfWeek', async (req, res) => {
  try {
    const prasadam = await Prasadam.findOne({ dayOfWeek: req.params.dayOfWeek });
    if (!prasadam) return res.status(404).json({ message: 'Prasadam information not found for this day' });
    res.json(prasadam);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create prasadam info (admin only)
router.post('/', auth, adminOnly, async (req, res) => {
  const prasadam = new Prasadam(req.body);
  try {
    const newPrasadam = await prasadam.save();
    res.status(201).json(newPrasadam);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update prasadam info (admin only)
router.patch('/:id', auth, adminOnly, async (req, res) => {
  try {
    const prasadam = await Prasadam.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!prasadam) return res.status(404).json({ message: 'Prasadam information not found' });
    res.json(prasadam);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete prasadam info (admin only)
router.delete('/:id', auth, adminOnly, async (req, res) => {
  try {
    const prasadam = await Prasadam.findByIdAndDelete(req.params.id);
    if (!prasadam) return res.status(404).json({ message: 'Prasadam information not found' });
    res.json({ message: 'Prasadam information deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router; 