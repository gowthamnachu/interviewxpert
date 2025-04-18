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

// Add auth middleware
const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Auth error:', error);
    res.status(401).json({ error: "Invalid token" });
  }
};

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

// Protected routes
app.get('/.netlify/functions/api/resume', authMiddleware, async (req, res) => {
  try {
    const resume = await Resume.findOne({ userId: req.user.userId });
    res.json(resume || {});
  } catch (error) {
    console.error('Resume fetch error:', error);
    res.status(500).json({ error: "Failed to fetch resume" });
  }
});

app.post('/.netlify/functions/api/resume', authMiddleware, async (req, res) => {
  try {
    const resumeData = { ...req.body, userId: req.user.userId };
    const resume = await Resume.findOneAndUpdate(
      { userId: req.user.userId },
      resumeData,
      { new: true, upsert: true }
    );
    res.json(resume);
  } catch (error) {
    console.error('Resume save error:', error);
    res.status(500).json({ error: "Failed to save resume" });
  }
});

// Get user certificates
app.get('/.netlify/functions/api/certificates/user', authMiddleware, async (req, res) => {
  try {
    console.log('Fetching certificates for user:', req.user.userId);
    const certificates = await Certificate.find({ userId: req.user.userId });
    console.log(`Found ${certificates.length} certificates for user`);
    res.json(certificates);
  } catch (error) {
    console.error('Certificate fetch error:', error);
    res.status(500).json({ error: "Failed to fetch certificates" });
  }
});

// Verify certificate
app.get('/.netlify/functions/api/certificates/verify/:id', async (req, res) => {
  try {
    console.log('Verifying certificate:', req.params.id);
    
    const certificate = await Certificate.findOne({ 
      certificateId: req.params.id 
    });
    
    if (!certificate) {
      console.log('Certificate not found:', req.params.id);
      return res.status(404).json({ error: "Certificate not found" });
    }
    
    res.json(certificate);
  } catch (error) {
    console.error('Certificate verification error:', error);
    res.status(500).json({ 
      error: "Failed to verify certificate",
      details: error.message 
    });
  }
});

// Delete certificate
app.delete('/.netlify/functions/api/certificates/:id', authMiddleware, async (req, res) => {
  try {
    const result = await Certificate.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.userId
    });
    if (!result) {
      return res.status(404).json({ error: "Certificate not found" });
    }
    res.json({ message: "Certificate deleted successfully" });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ error: "Failed to delete certificate" });
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
