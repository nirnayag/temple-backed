const express = require('express');
const router = express.Router();
const { Puja, PujaBooking } = require('../models/Puja');
const { auth, adminOnly } = require('../middleware/auth');

// Get all pujas (public)
router.get('/', async (req, res) => {
  try {
    const pujas = await Puja.find({ isActive: true });
    res.json(pujas);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get upcoming pujas (public)
router.get('/upcoming', async (req, res) => {
  try {
    const today = new Date();
    const pujas = await Puja.find({
      isActive: true,
      'bookings.date': { $gte: today }
    }).populate('bookings');
    res.json(pujas);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get puja by ID (public)
router.get('/:id', async (req, res) => {
  try {
    const puja = await Puja.findById(req.params.id);
    if (!puja) return res.status(404).json({ message: 'Puja not found' });
    res.json(puja);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create new puja (admin only)
router.post('/', auth, adminOnly, async (req, res) => {
  try {
    const puja = new Puja(req.body);
    const savedPuja = await puja.save();
    res.status(201).json(savedPuja);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update puja (admin only)
router.patch('/:id', auth, adminOnly, async (req, res) => {
  try {
    const puja = await Puja.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!puja) return res.status(404).json({ message: 'Puja not found' });
    res.json(puja);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete puja (admin only)
router.delete('/:id', auth, adminOnly, async (req, res) => {
  try {
    const puja = await Puja.findByIdAndDelete(req.params.id);
    if (!puja) return res.status(404).json({ message: 'Puja not found' });
    res.json({ message: 'Puja deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Book a puja (authenticated users)
router.post('/book', auth, async (req, res) => {
  try {
    const puja = await Puja.findById(req.body.pujaId);
    if (!puja) return res.status(404).json({ message: 'Puja not found' });

    const booking = new PujaBooking({
      ...req.body,
      devoteeId: req.user.devoteeId,
      paymentAmount: puja.cost
    });

    const savedBooking = await booking.save();
    res.status(201).json(savedBooking);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get user's puja bookings (authenticated users)
router.get('/bookings', auth, async (req, res) => {
  try {
    const bookings = await PujaBooking.find({ devoteeId: req.user.devoteeId })
      .populate('pujaId')
      .sort({ date: 1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Cancel puja booking (authenticated users)
router.delete('/bookings/:id', auth, async (req, res) => {
  try {
    const booking = await PujaBooking.findOne({
      _id: req.params.id,
      devoteeId: req.user.devoteeId
    });

    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    if (booking.status === 'completed') {
      return res.status(400).json({ message: 'Cannot cancel a completed booking' });
    }

    booking.status = 'cancelled';
    await booking.save();
    res.json({ message: 'Booking cancelled successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all bookings (admin only)
router.get('/admin/bookings', auth, adminOnly, async (req, res) => {
  try {
    const bookings = await PujaBooking.find()
      .populate('pujaId')
      .populate('devoteeId')
      .sort({ date: 1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update booking status (admin only)
router.patch('/admin/bookings/:id', auth, adminOnly, async (req, res) => {
  try {
    const booking = await PujaBooking.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true, runValidators: true }
    );
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    res.json(booking);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router; 