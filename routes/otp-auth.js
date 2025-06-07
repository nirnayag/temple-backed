const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const otpGenerator = require('otp-generator');
const User = require('../models/User');
const Devotee = require('../models/Devotee');

// Environment variable for JWT secret (fallback to a default for development)
const JWT_SECRET = process.env.JWT_SECRET || 'temple_management_secret_key';

// Initialize Twilio client if credentials are available
let twilioClient;
const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER;

if (TWILIO_ACCOUNT_SID && TWILIO_AUTH_TOKEN) {
  const twilio = require('twilio');
  twilioClient = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
}

// Helper function to generate OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Helper function to send OTP via SMS
const sendOTP = async (mobileNumber, otp) => {
  if (!twilioClient || !TWILIO_PHONE_NUMBER) {
    console.log(`[DEV MODE] OTP for ${mobileNumber}: ${otp}`);
    return true;
  }
  
  try {
    await twilioClient.messages.create({
      body: `Your Temple App verification code is: ${otp}`,
      from: TWILIO_PHONE_NUMBER,
      to: mobileNumber
    });
    return true;
  } catch (error) {
    console.error('Error sending OTP:', error);
    return false;
  }
};

// Request OTP for login/registration
router.post('/request-otp', async (req, res) => {
  try {
    const { mobileNumber } = req.body;
    
    if (!mobileNumber) {
      return res.status(400).json({ message: 'Mobile number is required' });
    }
    
    // Generate OTP
    const otp = generateOTP();
    const otpExpiry = new Date();
    otpExpiry.setMinutes(otpExpiry.getMinutes() + 10); // OTP valid for 10 minutes
    
    // Check if user exists
    let user = await User.findOne({ mobileNumber });
    
    if (user) {
      // Update existing user with new OTP
      user.otp = otp;
      user.otpExpiry = otpExpiry;
      await user.save();
    } else {
      // Create a temporary user with OTP
      user = new User({
        mobileNumber,
        otp,
        otpExpiry
      });
      await user.save();
    }
    
    // Send OTP via SMS
    const otpSent = await sendOTP(mobileNumber, otp);
    
    if (!otpSent) {
      return res.status(500).json({ message: 'Failed to send OTP' });
    }
    
    res.status(200).json({ 
      message: 'OTP sent successfully',
      userExists: user.devoteeId ? true : false,
      otp: otp // Including OTP in response for development
    });
  } catch (error) {
    console.error('OTP request error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Verify OTP and login/register user
router.post('/verify-otp', async (req, res) => {
  try {
    const { mobileNumber, otp } = req.body;
    
    if (!mobileNumber || !otp) {
      return res.status(400).json({ message: 'Mobile number and OTP are required' });
    }
    
    // Find user by mobile number
    const user = await User.findOne({ mobileNumber });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Check if OTP is valid
    if (user.otp !== otp) {
      return res.status(401).json({ message: 'Invalid OTP' });
    }
    
    // Check if OTP is expired
    if (user.otpExpiry < new Date()) {
      return res.status(401).json({ message: 'OTP expired' });
    }
    
    // Clear OTP after successful verification
    user.otp = null;
    user.otpExpiry = null;
    
    let isNewUser = false;
    
    // If user doesn't have devoteeId, it's a new user
    if (!user.devoteeId) {
      isNewUser = true;
      return res.status(200).json({ 
        message: 'Additional user data required for registration',
        requiresRegistration: true
      });
    }
    
    await user.save();
    
    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        mobileNumber: user.mobileNumber,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('OTP verification error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Register new user after OTP verification
router.post('/register', async (req, res) => {
  try {
    const { mobileNumber, name, email, role } = req.body;
    
    if (!mobileNumber || !name) {
      return res.status(400).json({ message: 'Mobile number and name are required' });
    }
    
    // Find user by mobile number
    const user = await User.findOne({ mobileNumber });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found. Please request OTP first.' });
    }
    
    if (user.devoteeId) {
      return res.status(400).json({ message: 'User already registered' });
    }
    
    // Generate unique email if the requested one exists
    let finalEmail = email;
    if (email) {
      const existingDevotee = await Devotee.findOne({ email });
      if (existingDevotee) {
        const [localPart, domain] = email.split('@');
        finalEmail = `${localPart}_${Date.now()}@${domain}`;
      }
    }
    
    // Create a devotee record
    const devotee = new Devotee({
      name,
      email: finalEmail,
      mobileNumber,
      membershipType: 'regular'
    });
    
    const savedDevotee = await devotee.save();
    
    // Update user with devotee reference and other details
    user.devoteeId = savedDevotee._id;
    user.email = finalEmail;
    user.role = role || 'user';
    await user.save();
    
    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    res.status(201).json({
      message: 'Registration successful',
      token,
      user: {
        id: user._id,
        mobileNumber: user.mobileNumber,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 