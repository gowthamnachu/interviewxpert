const express = require('express');
const serverless = require('serverless-http');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
let cachedDb = null;

// Always set JSON content type
app.use((req, res, next) => {
  res.setHeader('Content-Type', 'application/json');
  next();
});

// CORS configuration for Netlify
app.use(cors({
  origin: function(origin, callback) {
    callback(null, true); // Allow all origins in production
  },
  credentials: true
}));

// Parse JSON bodies
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Error handling middleware - must be before routes
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({ error: 'Invalid JSON format' });
  }
  next(err);
});

// Database connection with better error handling
async function connectToDatabase() {
  if (cachedDb && mongoose.connection.readyState === 1) {
    return cachedDb;
  }

  try {
    const connection = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 10000,
      keepAlive: true,
      retryWrites: true,
      w: 'majority'
    });
    
    cachedDb = connection;
    return cachedDb;
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw new Error('Database connection failed');
  }
}

// Wrap route handlers with try-catch and proper JSON responses
const wrapAsync = (fn) => {
  return async (req, res, next) => {
    try {
      await fn(req, res, next);
    } catch (error) {
      console.error('Route error:', error);
      res.status(500).json({
        error: process.env.NODE_ENV === 'development' 
          ? error.message 
          : 'Internal server error'
      });
    }
  };
};

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

// Your existing routes go here
app.post('/.netlify/functions/api/register', wrapAsync(async (req, res) => {
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
}));

app.get('/.netlify/functions/api/questions', wrapAsync(async (req, res) => {
  const { domain } = req.query;
  const query = domain ? { domain } : {};
  const questions = await Question.find(query);
  res.json(questions);
}));

// Login route
app.post('/.netlify/functions/api/login', wrapAsync(async (req, res) => {
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
}));

// Protected routes
app.get('/.netlify/functions/api/resume', verifyToken, wrapAsync(async (req, res) => {
  const resume = await Resume.findOne({ userId: req.user.userId });
  res.json(resume || {});
}));

app.post('/.netlify/functions/api/certificates', verifyToken, wrapAsync(async (req, res) => {
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
}));

app.get('/.netlify/functions/api/certificates', verifyToken, wrapAsync(async (req, res) => {
  const certificates = await Certificate.find({ userId: req.user.userId });
  res.json(certificates);
}));

app.get('/.netlify/functions/api/certificates/verify/:id', wrapAsync(async (req, res) => {
  console.log('Verifying certificate:', req.params.id);
  
  const certificate = await Certificate.findOne({ 
    certificateId: req.params.id 
  });
  
  if (!certificate) {
    console.log('Certificate not found:', req.params.id);
    return res.status(404).json({ error: "Certificate not found" });
  }
  
  res.json(certificate);
}));

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

// Add global error handler at the end
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: process.env.NODE_ENV === 'development' 
      ? err.message 
      : 'Internal server error'
  });
});

// Handler with improved error handling
const handler = async (event, context) => {
  // Important: this prevents function timeout from waiting for DB connection
  context.callbackWaitsForEmptyEventLoop = false;
  
  try {
    await connectToDatabase();
    const handler = serverless(app);
    const result = await handler(event, context);
    
    // Ensure JSON content type in response
    if (!result.headers) {
      result.headers = {};
    }
    result.headers['Content-Type'] = 'application/json';
    
    return result;
  } catch (error) {
    console.error("Handler error:", error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        error: process.env.NODE_ENV === 'development' 
          ? error.message 
          : 'Internal server error'
      })
    };
  }
};

module.exports.handler = handler;
