const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  text: String,
  expected: [String], // Keywords for AI evaluation
  domain: String, // Domain categorization
  answer: String, // Sample answer for the question
  options: [String], // Multiple choice options
  correctOption: Number, // Index of the correct option (0-3)
  isMockQuestion: { type: Boolean, default: false } // Flag to identify mock questions
});

module.exports = mongoose.model("Question", questionSchema);
