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
  origin: true,
  credentials: true
}));

// Database connection with connection pooling
let cachedDb = null;

const connectToDatabase = async () => {
  if (cachedDb && mongoose.connection.readyState === 1) {
    console.log('Using cached database connection');
    return;
  }

  try {
    console.log('Creating new database connection');
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      maxPoolSize: 10
    });

    cachedDb = mongoose.connection;
    console.log('MongoDB Connected Successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
};

// Ensure database connection before handling requests
app.use(async (req, res, next) => {
  try {
    await connectToDatabase();
    next();
  } catch (error) {
    console.error('Database connection middleware error:', error);
    res.status(500).json({ error: 'Database connection failed' });
  }
});

// Import models
const Question = require('../../backend/models/Question');
const User = require('../../backend/models/User');
const Resume = require('../../backend/models/Resume');
const Certificate = require('../../backend/models/Certificate');

// Add JWT verification middleware
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: "No token provided" });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Store full decoded token
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

// Login route
app.post('/.netlify/functions/api/login', async (req, res) => {
  try {
    const { usernameOrEmail, password } = req.body;

    // Find user by username or email
    const user = await User.findOne({
      $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }]
    });

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Create JWT token
    const token = jwt.sign(
      { 
        userId: user._id, 
        username: user.username, 
        email: user.email 
      },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
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
    res.status(500).json({ error: "Login failed" });
  }
});

// Protected routes
app.get('/.netlify/functions/api/resume', verifyToken, async (req, res) => {
  try {
    const resume = await Resume.findOne({ userId: req.user.userId });
    res.json(resume || {});
  } catch (error) {
    console.error('Resume fetch error:', error);
    res.status(500).json({ error: "Failed to fetch resume" });
  }
});

app.post('/.netlify/functions/api/certificates', verifyToken, async (req, res) => {
  try {
    const { certificateId, domain, score, userName, fullName } = req.body;

    // Validate required fields
    if (!certificateId || !domain || !score || !userName) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Check for existing certificate
    const existingCert = await Certificate.findOne({ certificateId });
    if (existingCert) {
      return res.status(409).json({ error: "Certificate ID already exists" });
    }

    // Create new certificate
    const newCertificate = new Certificate({
      certificateId,
      userId: req.user.userId,
      userName,
      fullName,
      domain,
      score,
      grade: calculateGrade(score),
      issueDate: new Date(),
      expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      badgeLevel: calculateBadgeLevel(score)
    });

    await newCertificate.save();
    res.status(201).json(newCertificate);
  } catch (error) {
    console.error('Certificate creation error:', error);
    res.status(500).json({ error: "Failed to create certificate" });
  }
});

app.get('/.netlify/functions/api/certificates', verifyToken, async (req, res) => {
  try {
    const certificates = await Certificate.find({ userId: req.user.userId });
    res.json(certificates);
  } catch (error) {
    console.error('Certificate fetch error:', error);
    res.status(500).json({ 
      error: "Failed to fetch certificates",
      details: error.message
    });
  }
});

// Helper functions for certificate grading
function calculateGrade(score) {
  if (score >= 90) return 'A+';
  if (score >= 80) return 'A';
  if (score >= 70) return 'B';
  if (score >= 60) return 'C';
  return 'D';
}

function calculateBadgeLevel(score) {
  if (score >= 90) return 'Expert';
  if (score >= 75) return 'Advanced';
  if (score >= 60) return 'Intermediate';
  return 'Beginner';
}

module.exports.handler = serverless(app);
