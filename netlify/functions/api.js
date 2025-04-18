const express = require('express');
const serverless = require('serverless-http');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cors = require('cors');
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

// Add middleware
app.use(express.json());
app.use(cors({
  origin: true,
  credentials: true
}));

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
    console.log('Login request received:', req.body);
    const { usernameOrEmail, password } = req.body;

    // Validate input
    if (!usernameOrEmail || !password) {
      return res.status(400).json({ error: "Username/email and password are required" });
    }

    // Find user
    const user = await User.findOne({
      $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }]
    });

    if (!user) {
      console.log('User not found');
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log('Password mismatch');
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, username: user.username, email: user.email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: "24h" }
    );

    console.log('Login successful, sending response');
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
    res.status(500).json({ error: 'Login failed: ' + error.message });
  }
});

app.use('/.netlify/functions/api', router);

module.exports.handler = serverless(app);
