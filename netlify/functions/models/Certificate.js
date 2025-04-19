const mongoose = require('mongoose');

const certificateSchema = new mongoose.Schema({
  certificateId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  userName: {
    type: String,
    required: true
  },
  fullName: String,
  domain: {
    type: String,
    required: true
  },
  score: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  grade: {
    type: String,
    enum: ['A+', 'A', 'B', 'C', 'D'],
    required: true
  },
  badgeLevel: {
    type: String,
    enum: ['Expert', 'Advanced', 'Intermediate', 'Beginner'],
    required: true
  },
  issueDate: {
    type: Date,
    default: Date.now,
    required: true
  },
  expiryDate: {
    type: Date,
    required: true
  },
  verificationUrl: String
}, {
  timestamps: true
});

// Ensure indexes for better query performance
certificateSchema.index({ userId: 1, certificateId: 1 });

// Add pre-save middleware to validate expiry date
certificateSchema.pre('save', function(next) {
  if (!this.expiryDate || this.expiryDate <= this.issueDate) {
    this.expiryDate = new Date(this.issueDate.getTime() + 365 * 24 * 60 * 60 * 1000);
  }
  next();
});

// Export model only if it hasn't been compiled yet
module.exports = mongoose.models.Certificate || mongoose.model('Certificate', certificateSchema);