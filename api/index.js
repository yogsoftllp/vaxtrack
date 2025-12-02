// Import the built Express app from dist
const app = require('../dist/index.cjs');

// Export as Vercel serverless function
module.exports = app;
