const express = require('express');
const serverless = require('serverless-http');
const mongoose = require('mongoose');
const app = express();

// Import models
const Question = require('../../backend/models/Question');
const User = require('../../backend/models/User');
const Resume = require('../../backend/models/Resume');
const Certificate = require('../../backend/models/Certificate');

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log("MongoDB Connected via Netlify Function");
}).catch(err => {
  console.error("MongoDB Connection Error:", err);
});

// Parse JSON bodies
app.use(express.json());

// Questions route
app.get('/.netlify/functions/api/questions', async (req, res) => {
  try {
    const { domain } = req.query;
    const query = domain ? { domain } : {};
    const questions = await Question.find(query);
    res.json(questions);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch questions" });
  }
});

// Add other routes similarly
app.use('/.netlify/functions/api/*', (req, res) => {
  res.status(404).json({ error: "Not found" });
});

// Export handler
exports.handler = serverless(app);
