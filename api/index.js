const fs = require('fs');
const path = require('path');

// Load the built Express app
let appModule;
try {
  appModule = require('../dist/index.cjs');
} catch (e) {
  console.error('Failed to load app:', e);
  throw e;
}

// Serve static files from dist/public
const publicDir = path.join(__dirname, '../dist/public');

module.exports = async (req, res) => {
  try {
    // For static files, try to serve them directly
    if (!req.url.startsWith('/api')) {
      const filePath = path.join(publicDir, req.url === '/' ? 'index.html' : req.url);
      
      try {
        if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
          const content = fs.readFileSync(filePath);
          const ext = path.extname(filePath);
          
          const mimeTypes = {
            '.html': 'text/html; charset=utf-8',
            '.css': 'text/css',
            '.js': 'application/javascript',
            '.json': 'application/json',
            '.png': 'image/png',
            '.svg': 'image/svg+xml',
            '.jpg': 'image/jpeg',
            '.gif': 'image/gif',
            '.woff': 'font/woff',
            '.woff2': 'font/woff2',
          };
          
          res.setHeader('Content-Type', mimeTypes[ext] || 'text/plain');
          res.setHeader('Cache-Control', ext === '.html' ? 'no-cache, no-store, must-revalidate' : 'public, max-age=31536000, immutable');
          return res.end(content);
        }
      } catch (e) {
        // Fall through to serve index.html for SPA routing
      }
      
      // Serve index.html for all other routes (SPA)
      try {
        const indexPath = path.join(publicDir, 'index.html');
        const indexContent = fs.readFileSync(indexPath);
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        return res.end(indexContent);
      } catch (e) {
        res.statusCode = 404;
        return res.end('Not Found');
      }
    }
    
    // For API routes, use the Express app
    if (appModule && typeof appModule === 'function') {
      // It's an Express app
      return appModule(req, res);
    } else if (appModule && appModule.default && typeof appModule.default === 'function') {
      return appModule.default(req, res);
    } else {
      throw new Error('App is not a valid Express application');
    }
  } catch (error) {
    console.error('Error handling request:', error);
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'Internal Server Error' }));
  }
};
