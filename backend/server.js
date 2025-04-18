require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Update CORS configuration
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.FRONTEND_URL 
    : ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Update MongoDB connection with better error handling
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000
})
.then(() => {
  console.log("✅ MongoDB Connected");
})
.catch(err => {
  console.error("❌ MongoDB Connection Error:", err);
  console.log("\nTroubleshooting steps:");
  console.log("1. Check if MongoDB is running");
  console.log("2. Verify MONGO_URI in .env file");
  console.log("3. Check network connectivity");
  console.log("4. Verify IP whitelist in MongoDB Atlas");
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
app.post("/api/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
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
    res.status(500).json({ error: "Registration failed" });
  }
});

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

    // Update JWT authentication to use environment variable
    const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

    // Create JWT token
    const token = jwt.sign(
      { userId: user._id, username: user.username, email: user.email },
      JWT_SECRET,
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
    res.status(500).json({ error: "Login failed" });
  }
});

// Resume endpoints
app.post("/api/resume", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key");
    const userId = decoded.userId;

    const resumeData = { ...req.body, userId };
    
    // Update if exists, create if doesn't
    const existingResume = await Resume.findOne({ userId });
    if (existingResume) {
      const updatedResume = await Resume.findOneAndUpdate(
        { userId },
        { ...resumeData, updatedAt: Date.now() },
        { new: true }
      );
      res.json(updatedResume);
    } else {
      const newResume = new Resume(resumeData);
      await newResume.save();
      res.status(201).json(newResume);
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to save resume" });
  }
});

app.get("/api/resume", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key");
    const resume = await Resume.findOne({ userId: decoded.userId });
    
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

app.put("/api/resume", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key");
    const userId = decoded.userId;

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

app.delete("/api/resume", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key");
    const result = await Resume.findOneAndDelete({ userId: decoded.userId });
    
    if (!result) {
      return res.status(404).json({ error: "Resume not found" });
    }
    
    res.json({ message: "Resume deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete resume" });
  }
});

// Certificate routes
app.post('/api/certificates', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key");
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

app.get("/api/certificates/user", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key");
    const certificates = await CertificateModel.find({ userId: decoded.userId });
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
app.listen(PORT, '0.0.0.0', () => {
  console.log('====================================');
  console.log(`🚀 Backend server running on port ${PORT}`);
  console.log(`📑 API endpoints available at http://localhost:${PORT}/api`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV}`);
  console.log('====================================');
});
