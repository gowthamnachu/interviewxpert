const express = require('express');
const serverless = require('serverless-http');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();

// Middleware
app.use(cors({
  origin: true,
  credentials: true
}));

app.use(express.json());

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
const Resume = require('./models/Resume');

// Certificate Schema
const certificateSchema = new mongoose.Schema({
  certificateId: String,
  userId: String,
  domain: String,
  score: Number,
  date: { type: Date, default: Date.now },
});

const Certificate = mongoose.models.Certificate || mongoose.model('Certificate', certificateSchema);

// Add auth middleware
if (!process.env.JWT_SECRET) {
  console.error("JWT_SECRET environment variable is not set!");
  throw new Error("JWT_SECRET must be configured");
}

const verifyToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }
    console.log('Verifying token in Netlify function...'); // Debug log
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(401).json({ error: "Invalid token" });
  }
};

// Routes
app.get('/.netlify/functions/api/questions', verifyToken, async (req, res) => {
  try {
    console.log('Received request for questions:', req.query);
    const { domain } = req.query;
    const query = domain ? { domain, isMockQuestion: true } : { isMockQuestion: true };
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
      process.env.JWT_SECRET,
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

// Register route
app.post("/.netlify/functions/api/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    // Validate request body
    if (!username || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({ error: "Username or email already exists" });
    }

    // Create new user
    const user = new User({ username, email, password });
    await user.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: "Registration failed" });
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

app.post('/.netlify/functions/api/resume', verifyToken, async (req, res) => {
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
app.get('/.netlify/functions/api/certificates/user', verifyToken, async (req, res) => {
  try {
    await connectToDatabase();
    
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
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
app.delete('/.netlify/functions/api/certificates/:id', verifyToken, async (req, res) => {
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
