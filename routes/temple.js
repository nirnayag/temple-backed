const express = require('express');
const router = express.Router();
const { Temple, Feature, Section } = require('../models/Temple');
const { auth, adminOnly } = require('../middleware/auth');

// Get temple information (public)
router.get('/', async (req, res) => {
  try {
    // Get the temple info or return null if none exists
    const templeInfo = await Temple.findOne();
    if (!templeInfo) {
      return res.status(404).json({ message: 'Temple information not found in database' });
    }
    res.json(templeInfo);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get temple features (public)
router.get('/features', async (req, res) => {
  try {
    const features = await Feature.find({ isActive: true }).sort({ order: 1 });
    res.json(features);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get temple sections (public) 
router.get('/sections', async (req, res) => {
  try {
    const sections = await Section.find({ isActive: true }).sort({ order: 1 });
    res.json(sections);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update temple information (admin only)
router.post('/info', auth, adminOnly, async (req, res) => {
  try {
    // Find existing temple info or create new
    let templeInfo = await Temple.findOne();
    if (templeInfo) {
      // Update existing
      templeInfo = await Temple.findByIdAndUpdate(
        templeInfo._id,
        req.body,
        { new: true, runValidators: true }
      );
    } else {
      // Create new
      templeInfo = await new Temple(req.body).save();
    }
    res.json(templeInfo);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Create a new feature (admin only)
router.post('/features', auth, adminOnly, async (req, res) => {
  try {
    const feature = new Feature(req.body);
    const newFeature = await feature.save();
    res.status(201).json(newFeature);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update a feature (admin only)
router.patch('/features/:id', auth, adminOnly, async (req, res) => {
  try {
    const feature = await Feature.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!feature) return res.status(404).json({ message: 'Feature not found' });
    res.json(feature);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a feature (admin only)
router.delete('/features/:id', auth, adminOnly, async (req, res) => {
  try {
    const feature = await Feature.findByIdAndDelete(req.params.id);
    if (!feature) return res.status(404).json({ message: 'Feature not found' });
    res.json({ message: 'Feature deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new section (admin only)
router.post('/sections', auth, adminOnly, async (req, res) => {
  try {
    const section = new Section(req.body);
    const newSection = await section.save();
    res.status(201).json(newSection);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update a section (admin only)
router.patch('/sections/:id', auth, adminOnly, async (req, res) => {
  try {
    const section = await Section.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!section) return res.status(404).json({ message: 'Section not found' });
    res.json(section);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a section (admin only)
router.delete('/sections/:id', auth, adminOnly, async (req, res) => {
  try {
    const section = await Section.findByIdAndDelete(req.params.id);
    if (!section) return res.status(404).json({ message: 'Section not found' });
    res.json({ message: 'Section deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router; 