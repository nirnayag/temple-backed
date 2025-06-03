const express = require('express');
const router = express.Router();
const Payment = require('../models/Payment');
const { auth } = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');

// Create a new payment
router.post('/', auth, async (req, res) => {
    try {
        const { amount, paymentType, description } = req.body;
        const payment = new Payment({
            amount,
            paymentType,
            description,
            userId: req.user.id
        });
        await payment.save();
        res.status(201).json(payment);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get all payments (admin only)
router.get('/all', adminAuth, async (req, res) => {
    try {
        const payments = await Payment.find()
            .populate('userId', 'name email')
            .sort({ createdAt: -1 });
        res.json(payments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get user's payments
router.get('/my-payments', auth, async (req, res) => {
    try {
        const payments = await Payment.find({ userId: req.user._id })
            .sort({ createdAt: -1 });
        res.json(payments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get single payment
router.get('/:id', auth, async (req, res) => {
    try {
        const payment = await Payment.findById(req.params.id);
        if (!payment) {
            return res.status(404).json({ message: 'Payment not found' });
        }
        // Check if user is admin or payment owner
        if (!req.user.isAdmin && payment.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized' });
        }
        res.json(payment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update payment (admin only)
router.patch('/:id', adminAuth, async (req, res) => {
    try {
        const payment = await Payment.findById(req.params.id);
        if (!payment) {
            return res.status(404).json({ message: 'Payment not found' });
        }
        
        const updates = Object.keys(req.body);
        const allowedUpdates = ['status', 'paymentType', 'description'];
        const isValidOperation = updates.every(update => allowedUpdates.includes(update));
        
        if (!isValidOperation) {
            return res.status(400).json({ message: 'Invalid updates' });
        }

        updates.forEach(update => payment[update] = req.body[update]);
        payment.updatedAt = Date.now();
        
        await payment.save();
        res.json(payment);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete payment (admin only)
router.delete('/:id', adminAuth, async (req, res) => {
    try {
        const payment = await Payment.findById(req.params.id);
        if (!payment) {
            return res.status(404).json({ message: 'Payment not found' });
        }
        await payment.remove();
        res.json({ message: 'Payment deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router; 