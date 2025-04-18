const express = require('express');
const serverless = require('serverless-http');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const app = express();

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
