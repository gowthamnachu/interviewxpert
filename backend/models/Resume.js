const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true
  },
  education: {
    type: String,
    required: [true, 'Education details are required']
  },
  experience: {
    type: String,
    required: [true, 'Experience details are required']
  },
  skills: {
    type: String,
    required: [true, 'Skills are required']
  },
  languages: String,
  volunteerExperience: String,
  summary: String,
  awards: String,
  photo: String,
  pdfData: {
    type: String,
    required: [true, 'PDF data is required for resume storage']
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Pre-save middleware to update timestamps
resumeSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Pre-update middleware
resumeSchema.pre('findOneAndUpdate', function(next) {
  this._update.updatedAt = new Date();
  next();
});

// Handle errors for duplicate entries
resumeSchema.post('save', function(error, doc, next) {
  if (error.name === 'MongoError' && error.code === 11000) {
    next(new Error('A resume for this user already exists'));
  } else {
    next(error);
  }
});

// Validate PDF data before saving
resumeSchema.path('pdfData').validate(function(value) {
  if (!value) return false;
  try {
    // Check if it's a valid base64 string
    return Buffer.from(value.split(',')[1] || value, 'base64').toString('base64') === (value.split(',')[1] || value);
  } catch (e) {
    return false;
  }
}, 'Invalid PDF data format');

module.exports = mongoose.model('Resume', resumeSchema);
