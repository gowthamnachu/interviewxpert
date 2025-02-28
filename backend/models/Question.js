const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  text: String,
  expected: [String], // Keywords for AI evaluation
  
});

module.exports = mongoose.model("Question", questionSchema);
