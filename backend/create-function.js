const fs = require('fs');
const path = require('path');

// Create functions directory if it doesn't exist
const functionsDir = path.join(__dirname, 'functions');
if (!fs.existsSync(functionsDir)) {
  fs.mkdirSync(functionsDir);
}

// Create public directory if it doesn't exist
const publicDir = path.join(__dirname, 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir);
}

// Create a simple index.html in public
fs.writeFileSync(
  path.join(publicDir, 'index.html'),
  '<html><body><h1>InterviewXpert API</h1></body></html>'
);

console.log('Function setup completed');
