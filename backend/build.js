require('dotenv').config();
const fs = require('fs');
const path = require('path');

// Ensure environment variables are set
const requiredEnvVars = [
  'MONGO_URI',
  'JWT_SECRET',
  'NODE_ENV'
];

const missingEnvVars = requiredEnvVars.filter(env => !process.env[env]);

if (missingEnvVars.length > 0) {
  console.error('Missing required environment variables:', missingEnvVars);
  process.exit(1);
}

// Create functions directory if it doesn't exist
const functionsDir = path.join(__dirname, '..', 'netlify', 'functions');
if (!fs.existsSync(functionsDir)) {
  fs.mkdirSync(functionsDir, { recursive: true });
}

// Copy necessary files to functions directory
const filesToCopy = [
  { src: './models', dest: path.join(functionsDir, 'models') },
  { src: './routes', dest: path.join(functionsDir, 'routes') },
  { src: './middleware', dest: path.join(functionsDir, 'middleware') }
];

filesToCopy.forEach(({ src, dest }) => {
  if (fs.existsSync(src)) {
    fs.cpSync(src, dest, { recursive: true });
    console.log(`Copied ${src} to ${dest}`);
  }
});

console.log('Build process completed successfully');
