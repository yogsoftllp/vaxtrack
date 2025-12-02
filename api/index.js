const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, '../dist/public');

module.exports = (req, res) => {
  const urlPath = req.url;
  
  // Serve static files
  if (!urlPath.startsWith('/api/')) {
    const filePath = path.join(publicDir, urlPath === '/' ? 'index.html' : urlPath);
    
    try {
      if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
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
        
        const content = fs.readFileSync(filePath);
        res.setHeader('Content-Type', mimeTypes[ext] || 'text/plain');
        res.setHeader('Cache-Control', ext === '.html' ? 'no-cache' : 'public, max-age=31536000');
        return res.end(content);
      }
    } catch (e) {
      // Fall through to SPA routing
    }
    
    // SPA routing - serve index.html for all non-existent files
    try {
      const indexContent = fs.readFileSync(path.join(publicDir, 'index.html'));
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.setHeader('Cache-Control', 'no-cache');
      return res.end(indexContent);
    } catch (e) {
      res.statusCode = 404;
      return res.end('Not Found');
    }
  }
  
  // Placeholder for API routes
  res.statusCode = 404;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({ error: 'API route not implemented' }));
};
