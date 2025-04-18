const express = require('express');
const serverless = require('serverless-http');
const mongoose = require('mongoose');
const app = express();
const router = express.Router();

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

// Configure routes
router.get('/questions', async (req, res) => {
  try {
    const { domain } = req.query;
    const query = domain ? { domain } : {};
    const questions = await Question.find(query);
    res.json(questions);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch questions" });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { usernameOrEmail, password } = req.body;
    // Your login logic here
    // ...existing code...
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

app.use('/.netlify/functions/api', router);

module.exports.handler = serverless(app);
