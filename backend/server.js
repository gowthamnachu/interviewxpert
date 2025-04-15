require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cors());

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
  domain: String,
  score: Number,
  date: {
    type: Date,
    default: Date.now
  }
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

    // Create JWT token
    const token = jwt.sign(
      { userId: user._id, username: user.username, email: user.email },
      "your-secret-key", // Replace with actual secret from env
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

    const decoded = jwt.verify(token, "your-secret-key");
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

    const decoded = jwt.verify(token, "your-secret-key");
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

    const decoded = jwt.verify(token, "your-secret-key");
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

    const decoded = jwt.verify(token, "your-secret-key");
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

    const decoded = jwt.verify(token, "your-secret-key");
    const { certificateId, domain, score } = req.body;

    // Check for existing certificate
    const existingCert = await CertificateModel.findOne({ 
      userId: decoded.userId,
      domain: domain 
    });

    if (existingCert) {
      // Update only if new score is higher
      if (score > existingCert.score) {
        const updatedCert = await CertificateModel.findByIdAndUpdate(
          existingCert._id,
          {
            score,
            certificateId,
            date: new Date()
          },
          { new: true }
        );
        return res.json(updatedCert);
      }
      return res.json(existingCert);
    }

    // Create new certificate
    const newCertificate = new CertificateModel({
      certificateId,
      userId: decoded.userId,
      userName: req.body.userName,
      fullName: req.body.fullName,
      domain,
      score,
      date: new Date()
    });

    await newCertificate.save();
    res.json(newCertificate);
  } catch (error) {
    console.error("Certificate save error:", error);
    res.status(500).json({ error: error.message || 'Error saving certificate' });
  }
});

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

    const decoded = jwt.verify(token, "your-secret-key");
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
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
