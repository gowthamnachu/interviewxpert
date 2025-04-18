const express = require('express');
const serverless = require('serverless-http');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
  origin: 'https://interviewxpert.netlify.app',
  credentials: true
}));

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('MongoDB Connection Error:', err));

// Import models
const Question = require('./models/Question');
const User = require('./models/User');
const Resume = require('./models/Resume');
const Certificate = require('./models/Certificate');

// Routes
app.get('/.netlify/functions/api/questions', async (req, res) => {
  try {
    console.log('Received request for questions:', req.query);
    const { domain } = req.query;
    const query = domain ? { domain } : {};
    const questions = await Question.find(query);
    console.log(`Found ${questions.length} questions`);
    res.json(questions);
  } catch (error) {
    console.error('Error fetching questions:', error);
    res.status(500).json({ 
      error: "Failed to fetch questions",
      details: error.message 
    });
  }
});

app.post('/.netlify/functions/api/login', async (req, res) => {
  try {
    console.log('Login request received:', {
      body: req.body,
      headers: req.headers
    });

    const { usernameOrEmail, password } = req.body;

    if (!usernameOrEmail || !password) {
      return res.status(400).json({ 
        error: "Username/email and password are required" 
      });
    }

    const user = await User.findOne({
      $or: [
        { username: usernameOrEmail },
        { email: usernameOrEmail }
      ]
    });

    console.log('User found:', user ? 'Yes' : 'No');

    if (!user) {
      return res.status(401).json({ 
        error: "Invalid credentials" 
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    console.log('Password match:', isMatch ? 'Yes' : 'No');

    if (!isMatch) {
      return res.status(401).json({ 
        error: "Invalid credentials" 
      });
    }

    const token = jwt.sign(
      { 
        userId: user._id,
        username: user.username,
        email: user.email 
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        username: user.username,
        email: user.email,
        registrationDate: user.registrationDate
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      error: "Login failed",
      details: error.message 
    });
  }
});

// Not found handler
app.use('/.netlify/functions/api/*', (req, res) => {
  res.status(404).json({ error: `Cannot ${req.method} ${req.url}` });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error', details: err.message });
});

module.exports.handler = serverless(app);
