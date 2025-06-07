const express = require('express');
const router = express.Router();
const Devotee = require('../models/Devotee');
const { auth, adminOnly, userOrAdmin } = require('../middleware/auth');
const User = require('../models/User');

// Get all devotees (admin only)
router.get('/', auth, adminOnly, async (req, res) => {
  try {
    const devotees = await Devotee.find();
    res.json(devotees);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get paginated devotees (admin only)
router.get('/paginate', auth, adminOnly, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const totalDevotees = await Devotee.countDocuments();
    const devotees = await Devotee.find()
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    res.json({
      devotees,
      currentPage: page,
      totalPages: Math.ceil(totalDevotees / limit),
      totalDevotees,
      hasNextPage: skip + limit < totalDevotees,
      hasPreviousPage: page > 1
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get devotee by ID (user can access their own, admin can access any)
router.get('/:id', auth, async (req, res) => {
  try {
    const devotee = await Devotee.findById(req.params.id);
    if (!devotee) return res.status(404).json({ message: 'Devotee not found' });
    
    // If not admin, check if user is requesting their own devotee profile
    if (req.user.role !== 'admin') {
      const user = await User.findById(req.user.id);
      if (!user || user.devoteeId.toString() !== req.params.id) {
        return res.status(403).json({ message: 'Access denied. You can only view your own profile.' });
      }
    }
    
    res.json(devotee);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create devotee (admin only)
router.post('/', auth, adminOnly, async (req, res) => {
  const devotee = new Devotee(req.body);
  try {
    const newDevotee = await devotee.save();
    res.status(201).json(newDevotee);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update devotee (user can update their own, admin can update any)
router.patch('/:id', auth, async (req, res) => {
  try {
    // If not admin, check if user is updating their own devotee profile
    if (req.user.role !== 'admin') {
      const user = await User.findById(req.user.id);
      if (!user || user.devoteeId.toString() !== req.params.id) {
        return res.status(403).json({ message: 'Access denied. You can only update your own profile.' });
      }
      
      // Regular users can only update certain fields
      const allowedUpdates = ['phone'];
      const updates = Object.keys(req.body);
      const isValidOperation = updates.every(update => allowedUpdates.includes(update));
      
      if (!isValidOperation) {
        return res.status(400).json({ message: 'Invalid updates. You can only update phone and address.' });
      }
    }
    
    const devotee = await Devotee.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!devotee) return res.status(404).json({ message: 'Devotee not found' });
    res.json(devotee);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete devotee (admin only)
router.delete('/:id', auth, adminOnly, async (req, res) => {
  try {
    const devotee = await Devotee.findByIdAndDelete(req.params.id);
    if (!devotee) return res.status(404).json({ message: 'Devotee not found' });
    
    // Also delete associated user account if exists
    await User.deleteMany({ devoteeId: req.params.id });
    
    res.json({ message: 'Devotee deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add donation to devotee (admin only)
router.post('/:id/donations', auth, adminOnly, async (req, res) => {
  try {
    const devotee = await Devotee.findById(req.params.id);
    if (!devotee) return res.status(404).json({ message: 'Devotee not found' });
    
    devotee.donationHistory.push(req.body);
    await devotee.save();
    
    res.status(201).json(devotee);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router; 