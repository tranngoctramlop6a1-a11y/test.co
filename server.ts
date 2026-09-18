import { app } from './server/app';
import path from 'path';
import express from 'express';

const PORT = 3000;

// Serve frontend: Vite middleware in dev, static files in prod
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      // Guard against serving HTML for any /api requests
      if (req.path.startsWith('/api')) {
        return res.status(404).json({
          success: false,
          error: 'API_NOT_FOUND',
          path: req.originalUrl || req.url
        });
      }
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();

export { app };
export default app;
