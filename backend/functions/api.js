const express = require('express');
const serverless = require('serverless-http');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Enable CORS for all routes
app.use(cors());

// Add request logging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`, req.body);
  next();
});

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log("MongoDB Connected");
}).catch(err => {
  console.error("MongoDB Connection Error:", err);
});

// Import models
const Question = require('./models/Question');
const User = require('./models/User');
const Resume = require('./models/Resume');
const Certificate = require('./models/Certificate');

// Routes with error handling
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

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something broke!',
    details: err.message
  });
});

module.exports.handler = serverless(app);
