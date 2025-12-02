export default async function handler(req, res) {
  try {
    // Dynamically load the built app
    const { app, initialize } = await import('../dist/index.cjs');
    
    // Initialize the app
    await initialize();
    
    // Let Express handle the request
    app(req, res);
  } catch (error) {
    console.error('Error in handler:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
