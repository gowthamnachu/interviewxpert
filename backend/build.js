const fs = require('fs');
const path = require('path');

// Create directories if they don't exist
const dirs = ['functions', 'public'];
dirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Copy models and routes to functions directory
['models', 'routes'].forEach(dir => {
  if (fs.existsSync(dir)) {
    fs.cpSync(dir, path.join('functions', dir), { recursive: true });
  }
});

console.log('Build completed successfully!');
