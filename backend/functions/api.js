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

// Ensure MongoDB connection
let cachedDb = null;

async function connectToDatabase() {
  if (cachedDb) {
    console.log("Using cached MongoDB connection");
    return cachedDb;
  }

  try {
    console.log("Creating new MongoDB connection");
    const connection = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    cachedDb = connection;
    console.log("MongoDB Connected Successfully");
    return cachedDb;
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw error;
  }
}

// Import models
const Question = require('./models/Question');
const User = require('./models/User');

// Certificate Schema
const certificateSchema = new mongoose.Schema({
  certificateId: String,
  userId: String,
  domain: String,
  score: Number,
  date: { type: Date, default: Date.now },
});

const Certificate = mongoose.models.Certificate || mongoose.model('Certificate', certificateSchema);

// Resume Schema
const resumeSchema = new mongoose.Schema({
  userId: String,
  name: String,
  email: String,
  phone: String,
  education: String,
  experience: String,
  skills: String,
  languages: String,
  volunteerExperience: String,
  photo: String,
  pdfData: String,
  updatedAt: { type: Date, default: Date.now }
});

const Resume = mongoose.models.Resume || mongoose.model('Resume', resumeSchema);

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

// Get resume endpoint
app.get('/.netlify/functions/api/resume', async (req, res) => {
  try {
    await connectToDatabase();
    
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    console.log("Fetching resume for user:", decoded.userId);

    const resume = await Resume.findOne({ userId: decoded.userId });
    console.log("Resume found:", !!resume);

    if (!resume) {
      return res.status(404).json({ error: "Resume not found" });
    }

    res.json(resume);
  } catch (error) {
    console.error("Resume fetch error:", error);
    res.status(500).json({
      error: "Failed to fetch resume",
      details: error.message
    });
  }
});

// Update resume endpoint
app.post('/.netlify/functions/api/resume', async (req, res) => {
  try {
    await connectToDatabase();
    
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const userId = decoded.userId;

    const resumeData = { ...req.body, userId, updatedAt: new Date() };
    const resume = await Resume.findOneAndUpdate(
      { userId },
      resumeData,
      { new: true, upsert: true }
    );

    res.json(resume);
  } catch (error) {
    console.error("Resume save error:", error);
    res.status(500).json({
      error: "Failed to save resume",
      details: error.message
    });
  }
});

// Get user certificates
app.get('/.netlify/functions/api/certificates/user', async (req, res) => {
  try {
    await connectToDatabase();
    
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    console.log("Fetching certificates for user:", decoded.userId);

    const certificates = await Certificate.find({ userId: decoded.userId });
    console.log(`Found ${certificates.length} certificates`);

    res.json(certificates);
  } catch (error) {
    console.error("Certificate fetch error:", error);
    res.status(500).json({
      error: "Failed to fetch certificates",
      details: error.message,
    });
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
