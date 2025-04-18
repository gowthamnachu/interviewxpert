const express = require('express');
const serverless = require('serverless-http');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const app = express();

// Import your existing models and routes
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

// Add JWT verification middleware
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: "No token provided" });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    console.error("Token verification error:", error);
    return res.status(401).json({ error: "Invalid token" });
  }
};

// Your existing routes go here
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

// Protected routes
app.get('/.netlify/functions/api/resume', verifyToken, async (req, res) => {
  // Add your logic for fetching resumes here
});

app.post('/.netlify/functions/api/certificates', verifyToken, async (req, res) => {
  // Add your logic for creating certificates here
});

app.get('/.netlify/functions/api/certificates', verifyToken, async (req, res) => {
  // Add your logic for fetching certificates here
});

module.exports.handler = serverless(app);
