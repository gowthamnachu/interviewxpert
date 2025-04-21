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

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  next();
});

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

// Certificate Schema
const certificateSchema = new mongoose.Schema({
  certificateId: {
    type: String,
    required: true,
    unique: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  userName: String,
  fullName: String,
  domain: String,
  score: Number,
  grade: String,
  issueDate: {
    type: Date,
    default: Date.now
  },
  expiryDate: Date,
  badgeLevel: String
});

const Certificate = mongoose.model('Certificate', certificateSchema);

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

// Define Resume Schema if not already defined
const resumeSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
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
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

const Resume = mongoose.models.Resume || mongoose.model('Resume', resumeSchema);

// Your existing routes go here
app.post('/.netlify/functions/api/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Validate required fields
    if (!username || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Validate password strength
    const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        error: "Password must be at least 8 characters long and include a number and special character"
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({ 
        error: existingUser.username === username ? "Username already taken" : "Email already registered" 
      });
    }

    // Create new user
    const user = new User({ username, email, password });
    await user.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: error.message || "Registration failed" });
  }
});

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
  res.setHeader('Content-Type', 'application/json');
  try {
    if (!req.user || !req.user.userId) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const resume = await Resume.findOne({ userId: req.user.userId });
    if (!resume) {
      return res.status(404).json({ error: "Resume not found" });
    }

    console.log('Resume fetched successfully:', resume._id);
    return res.json(resume);
  } catch (error) {
    console.error('Resume fetch error:', error);
    return res.status(500).json({ 
      error: "Failed to fetch resume",
      details: error.message 
    });
  }
});

app.post('/.netlify/functions/api/resume', verifyToken, async (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  try {
    if (!req.user || !req.user.userId) {
      return res.status(401).json({ error: "Authentication required" });
    }

    // Validate required fields
    const { name, email } = req.body;
    if (!name || !email) {
      return res.status(400).json({ error: "Name and email are required" });
    }

    const resumeData = { 
      ...req.body, 
      userId: req.user.userId,
      updatedAt: new Date()
    };

    const resume = await Resume.findOneAndUpdate(
      { userId: req.user.userId },
      resumeData,
      { new: true, upsert: true, runValidators: true }
    );

    console.log('Resume saved successfully:', resume._id);
    return res.status(201).json(resume);
  } catch (error) {
    console.error('Resume save error:', error);
    return res.status(500).json({ 
      error: "Failed to save resume",
      details: error.message 
    });
  }
});

app.put('/.netlify/functions/api/resume', verifyToken, async (req, res) => {
  try {
    const resumeData = { ...req.body, userId: req.user.userId };
    const resume = await Resume.findOneAndUpdate(
      { userId: req.user.userId },
      resumeData,
      { new: true }
    );
    
    if (!resume) {
      return res.status(404).json({ error: "Resume not found" });
    }
    
    res.json(resume);
  } catch (error) {
    console.error('Resume update error:', error);
    res.status(500).json({ error: error.message || "Failed to update resume" });
  }
});

app.delete('/.netlify/functions/api/resume', verifyToken, async (req, res) => {
  try {
    const result = await Resume.findOneAndDelete({ userId: req.user.userId });
    
    if (!result) {
      return res.status(404).json({ error: "Resume not found" });
    }
    
    res.json({ message: "Resume deleted successfully" });
  } catch (error) {
    console.error('Resume deletion error:', error);
    res.status(500).json({ error: error.message || "Failed to delete resume" });
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

app.get('/.netlify/functions/api/certificates/user', verifyToken, async (req, res) => {
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

app.delete('/.netlify/functions/api/certificates/:id', verifyToken, async (req, res) => {
  try {
    if (!req.user || !req.user.userId) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const certificate = await Certificate.findOne({
      _id: req.params.id,
      userId: req.user.userId
    });

    if (!certificate) {
      return res.status(404).json({ error: "Certificate not found or unauthorized" });
    }

    await Certificate.findByIdAndDelete(req.params.id);
    res.json({ message: "Certificate deleted successfully" });
  } catch (error) {
    console.error('Delete certificate error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ error: "Invalid certificate ID" });
    }
    res.status(500).json({ error: "Failed to delete certificate" });
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

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

module.exports.handler = serverless(app);
