require("dotenv").config();
const mongoose = require("mongoose");
const Question = require("./models/Question");

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log("✅ MongoDB Connected");
  seedDatabase(); // Call function to seed data once connected
}).catch((err) => {
  console.error("❌ MongoDB Connection Error:", err);
});

// Function to seed the database
const seedDatabase = () => {
  const primaryQuestions = [
    { text: "Introduce yourself.", expected: ["name", "experience", "background"], domain: "General" },
    { text: "Why do you want this job?", expected: ["career", "company", "opportunity"], domain: "General" },
  ];

  const additionalQuestions = [
    { text: "What are your strengths?", expected: ["skill", "strength", "expertise"], domain: "General" },
    { text: "Tell me about a time you solved a problem.", expected: ["problem", "solution", "teamwork"], domain: "General" },
    { text: "Where do you see yourself in five years?", expected: ["career", "growth", "leadership"], domain: "General" },
    { text: "What are your weaknesses?", expected: ["weakness", "improvement", "challenge"], domain: "General" },
    { text: "Describe a difficult work situation and how you overcame it.", expected: ["difficult", "overcame", "solution"], domain: "General" },
    { text: "How do you handle stress and pressure?", expected: ["stress", "pressure", "cope"], domain: "General" },
    { text: "What motivates you?", expected: ["motivation", "drive", "inspiration"], domain: "General" },
    { text: "What are your career goals?", expected: ["career", "goals", "aspirations"], domain: "General" },
    { text: "How do you prioritize your work?", expected: ["prioritize", "tasks", "time management"], domain: "General" },
    { text: "What is your greatest achievement?", expected: ["achievement", "success", "accomplishment"], domain: "General" },
    { text: "What is OOP?", expected: ["object", "oriented", "programming"], domain: "Software Development" },
    { text: "Explain HTTP methods.", expected: ["get", "post", "put", "delete"], domain: "Software Development" },
    { text: "What is SEO?", expected: ["search engine", "optimization"], domain: "Marketing" },
    { text: "Explain market segmentation.", expected: ["market", "segmentation"], domain: "Marketing" },
    { text: "What is GDP?", expected: ["gross", "domestic", "product"], domain: "Finance" },
  ];

  // Shuffle additional questions
  const shuffledAdditionalQuestions = additionalQuestions.sort(() => 0.5 - Math.random());

  // Combine primary and shuffled additional questions
  const sampleQuestions = [...primaryQuestions, ...shuffledAdditionalQuestions];

  Question.insertMany(sampleQuestions)
    .then(() => {
      console.log("✅ Sample Questions Inserted!");
      mongoose.connection.close();
    })
    .catch(err => {
      console.error("❌ Error inserting sample questions:", err);
      mongoose.connection.close();
    });
};