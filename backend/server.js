// Update dotenv config to load from the correct path
const path = require('path');
require("dotenv").config({ path: path.join(__dirname, '../.env') });
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

if (!process.env.JWT_SECRET) {
  console.error("JWT_SECRET environment variable is not set!");
  process.exit(1);
}

const app = express();
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Enable CORS for all routes
app.use(cors({
  origin: true,
  credentials: true
}));

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/interviewxpert')
  .then(() => {
    console.log("✅ MongoDB Connected");
  })
  .catch(err => {
    console.error("❌ MongoDB Connection Error:", err);
    if (!process.env.MONGO_URI) {
      console.error("MONGO_URI environment variable is not set!");
      console.log("Please check that:");
      console.log("1. You have created a .env file in the project root");
      console.log("2. The .env file contains MONGO_URI=your_mongodb_connection_string");
    }
    console.log("\nIf using MongoDB Atlas, ensure your IP address is whitelisted:");
    console.log("1. Go to MongoDB Atlas dashboard");
    console.log("2. Click Network Access under Security");
    console.log("3. Click '+ ADD IP ADDRESS' and add your current IP");
    process.exit(1);
  });

const Question = require("./models/Question");
const User = require("./models/User");
const Resume = require("./models/Resume");
const Certificate = require("./models/Certificate"); // Add this line

// Create Certificate Schema
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
  email: String,
  domain: String,
  subDomain: String,
  score: Number,
  grade: String,
  issueDate: {
    type: Date,
    default: Date.now
  },
  expiryDate: Date,
  issuer: String,
  verificationUrl: String,
  achievements: [String],
  badgeLevel: String
});

const CertificateModel = mongoose.model('Certificate', certificateSchema);

// API to Fetch Questions
app.get("/api/questions", async (req, res) => {
  try {
    const { domain } = req.query;
    const query = domain ? { domain } : {};
    const questions = await Question.find(query);
    res.json(questions);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch questions" });
  }
});

// Register route
app.post(["/api/register", "/.netlify/functions/api/register"], async (req, res) => {
  try {
    console.log('Registration request received:', { ...req.body, password: '[REDACTED]' });
    const { username, email, password } = req.body;
    
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
      console.log('User already exists:', { username, email });
      return res.status(400).json({ 
        error: existingUser.username === username ? "Username already taken" : "Email already registered" 
      });
    }

    // Create new user
    const user = new User({ username, email, password });
    await user.save();

    console.log('User registered successfully:', { username, email });
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: error.message || "Registration failed" });
  }
});

const JWT_SECRET = process.env.JWT_SECRET;
console.log('JWT Secret initialized'); // Debug log

// Login route
app.post("/api/login", async (req, res) => {
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
      { userId: user._id, username: user.username, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );
    console.log('Token generated successfully'); // Debug log

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

// Add middleware for token verification
const verifyToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }
    console.log('Verifying token...'); // Debug log
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(401).json({ error: "Invalid token" });
  }
};

// Resume endpoints
app.post("/api/resume", verifyToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    if (!userId) {
      return res.status(401).json({ error: "User ID not found in token" });
    }

    const resumeData = { ...req.body, userId };
    const existingResume = await Resume.findOne({ userId });

    if (existingResume) {
      const updatedResume = await Resume.findOneAndUpdate(
        { userId },
        resumeData,
        { new: true }
      );
      return res.json(updatedResume);
    }

    const newResume = new Resume(resumeData);
    await newResume.save();
    res.status(201).json(newResume);
  } catch (error) {
    console.error("Resume save error:", error);
    res.status(500).json({ error: error.message || "Failed to save resume" });
  }
});

app.get("/api/resume", verifyToken, async (req, res) => {
  try {
    const resume = await Resume.findOne({ userId: req.user.userId });
    
    if (!resume) {
      return res.status(404).json({ error: "Resume not found" });
    }

    console.log("PDF data exists:", !!resume.pdfData); // Debug log
    res.json(resume);
  } catch (error) {
    console.error("Resume fetch error:", error);
    res.status(500).json({ error: "Failed to fetch resume" });
  }
});

app.put("/api/resume", verifyToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    const updatedResume = await Resume.findOneAndUpdate(
      { userId },
      { ...req.body, updatedAt: Date.now() },
      { new: true }
    );

    if (!updatedResume) {
      return res.status(404).json({ error: "Resume not found" });
    }

    res.json(updatedResume);
  } catch (error) {
    res.status(500).json({ error: "Failed to update resume" });
  }
});

app.delete("/api/resume", verifyToken, async (req, res) => {
  try {
    const result = await Resume.findOneAndDelete({ userId: req.user.userId });
    
    if (!result) {
      return res.status(404).json({ error: "Resume not found" });
    }
    
    res.json({ message: "Resume deleted successfully" });
  } catch (error) {
    console.error("Resume deletion error:", error);
    res.status(500).json({ error: error.message || "Failed to delete resume" });
  }
});

// Certificate routes
app.post('/api/certificates', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { certificateId, domain, score, userName, fullName } = req.body;

    // Validate required fields
    if (!certificateId || !domain || !score || !userName) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Check for existing certificate
    const existingCert = await CertificateModel.findOne({ certificateId });
    if (existingCert) {
      return res.status(409).json({ error: "Certificate ID already exists" });
    }

    // Create new certificate
    const newCertificate = new CertificateModel({
      certificateId,
      userId: decoded.userId,
      userName,
      fullName,
      domain,
      score,
      grade: calculateGrade(score),
      issueDate: new Date(),
      expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      badgeLevel: calculateBadgeLevel(score),
      verificationUrl: `${req.protocol}://${req.get('host')}/verify-certificate/${certificateId}`
    });

    await newCertificate.save();
    res.status(201).json(newCertificate);

  } catch (error) {
    console.error("Certificate save error:", error);
    res.status(500).json({ error: "Failed to save certificate" });
  }
});

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

app.get("/api/certificates/verify/:id", async (req, res) => {
  try {
    const certificate = await CertificateModel.findOne({ 
      certificateId: req.params.id 
    });
    
    if (!certificate) {
      return res.status(404).json({ error: "Certificate not found" });
    }
    
    res.json(certificate);
  } catch (error) {
    console.error("Certificate verification error:", error);
    res.status(500).json({ error: "Failed to verify certificate" });
  }
});

app.get("/api/certificates/user", verifyToken, async (req, res) => {
  try {
    const certificates = await CertificateModel.find({ userId: req.user.userId });
    res.json(certificates);
  } catch (error) {
    console.error("Certificate fetch error:", error);
    res.status(500).json({ error: "Failed to fetch certificates" });
  }
});

// Add delete certificate endpoint
app.delete('/api/certificates/:id', async (req, res) => {
  try {
    await CertificateModel.findByIdAndDelete(req.params.id);
    res.json({ message: 'Certificate deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting certificate' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log('====================================');
  console.log(`🚀 Backend server running on port ${PORT}`);
  console.log(`📑 API endpoints available at http://localhost:${PORT}/api`);
  console.log('====================================');
});
