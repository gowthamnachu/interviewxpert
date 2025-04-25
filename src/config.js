const prod = {
  apiUrl: '/.netlify/functions/api'
};

const dev = {
  apiUrl: 'http://localhost:3001/api'
};

export const config = {
  ...process.env.NODE_ENV === 'production' ? prod : dev,
  maxFileSize: 5 * 1024 * 1024, // 5MB
  allowedImageTypes: ['image/jpeg', 'image/png'],
  pdfOptions: {
    maxWidth: 190,
    fontSize: 12
  }
};
