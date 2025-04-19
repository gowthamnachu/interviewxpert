const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: String,
  email: String,
  phone: String,
  education: String,
  experience: String,
  skills: String,
  languages: String,
  volunteerExperience: String,
  summary: String,
  awards: String,
  photo: String, // Base64 string
  pdfData: String, // Store PDF as base64 string
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Resume', resumeSchema);
