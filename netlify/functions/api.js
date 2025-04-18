const express = require('express');
const serverless = require('serverless-http');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

// Enable CORS for all routes
app.use(cors());
app.use(express.json());

// MongoDB connection with error handling
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB Connected via Netlify Function");
  } catch (err) {
    console.error("MongoDB Connection Error:", err);
    // Don't exit process in serverless function
    return false;
  }
  return true;
};

// Wrap routes in async handler to ensure DB connection
const routeHandler = async (req, res, next) => {
  if (!mongoose.connection.readyState) {
    const connected = await connectDB();
    if (!connected) {
      return res.status(500).json({ error: "Database connection failed" });
    }
  }
  next();
};

// Apply route handler to all routes
app.use(routeHandler);

// Import your existing models
const Question = require('../../backend/models/Question');
const User = require('../../backend/models/User');
const Resume = require('../../backend/models/Resume');
const Certificate = require('../../backend/models/Certificate');

// Questions route
app.get('/questions', async (req, res) => {
  try {
    const { domain } = req.query;
    const query = domain ? { domain } : {};
    const questions = await Question.find(query);
    res.json(questions);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch questions" });
  }
});

// User routes
app.post('/register', async (req, res) => {
  // Add your registration logic here
});

app.post('/login', async (req, res) => {
  // Add your login logic here
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

// Ensure proper error handling for serverless environment
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Export the handler using proper module.exports
module.exports.handler = serverless(app);
