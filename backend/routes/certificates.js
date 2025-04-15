const express = require('express');
const router = express.Router();
const Certificate = require('./models/certificate');
const auth = require('../middleware/auth');

// Save certificate
router.post('/', auth, async (req, res) => {
  try {
    const certificate = new Certificate({
      ...req.body,
      userId: req.user._id
    });
    await certificate.save();
    res.status(201).json(certificate);
  } catch (error) {
    console.error('Error saving certificate:', error);
    res.status(500).json({ error: 'Failed to save certificate' });
  }
});

// Get all certificates for a user
router.get('/user', auth, async (req, res) => {
  try {
    const certificates = await Certificate.find({ userId: req.user._id });
    res.json(certificates);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Verify certificate - public route, no auth required
router.get('/verify/:id', async (req, res) => {
  try {
    const certificate = await Certificate.findOne({ 
      certificateId: req.params.id 
    }).select('-userId -__v');

    if (!certificate) {
      return res.status(404).json({ 
        error: 'Certificate not found. Please check the ID and try again.' 
      });
    }

    res.json(certificate);
  } catch (error) {
    console.error('Error verifying certificate:', error);
    res.status(500).json({ 
      error: 'Failed to verify certificate. Please try again later.' 
    });
  }
});

module.exports = router;
