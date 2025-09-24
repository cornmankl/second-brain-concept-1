// server.ts - Next.js Standalone + Socket.IO
import { setupSocket } from '@/lib/socket';
import { createServer } from 'http';
import { Server } from 'socket.io';
import next from 'next';
import { join } from 'path';

const dev = process.env.NODE_ENV !== 'production';
const currentPort = 3000;
const hostname = '0.0.0.0';

// Custom server with Socket.IO integration
async function createCustomServer() {
  try {
    // Create Next.js app
    const nextApp = next({ 
      dev,
      dir: process.cwd(),
      // In production, use the current directory where .next is located
      conf: dev ? undefined : { distDir: './.next' }
    });

    await nextApp.prepare();
    const handle = nextApp.getRequestHandler();

    // Create HTTP server that will handle both Next.js and Socket.IO
    const server = createServer((req, res) => {
      // Skip socket.io requests from Next.js handler
      if (req.url?.startsWith('/api/socketio')) {
        return;
      }
      
      // Handle static files directly in production
      if (!dev && req.url?.startsWith('/_next/static')) {
        const staticPath = join(process.cwd(), '.next', 'static');
        const filePath = join(staticPath, req.url.replace('/_next/static', ''));
        
        // Import fs only when needed
        const fs = require('fs');
        if (fs.existsSync(filePath)) {
          const ext = filePath.split('.').pop();
          const contentType = {
            'js': 'application/javascript',
            'css': 'text/css',
            'json': 'application/json',
            'woff2': 'font/woff2',
            'png': 'image/png',
            'jpg': 'image/jpeg',
            'jpeg': 'image/jpeg',
            'gif': 'image/gif',
            'svg': 'image/svg+xml',
            'ico': 'image/x-icon'
          }[ext || ''] || 'application/octet-stream';
          
          res.setHeader('Content-Type', contentType);
          res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
          fs.createReadStream(filePath).pipe(res);
          return;
        }
      }
      
      handle(req, res);
    });

    // Setup Socket.IO
    const io = new Server(server, {
      path: '/api/socketio',
      cors: {
        origin: "*",
        methods: ["GET", "POST"]
      }
    });

    setupSocket(io);

    // Start the server
    server.listen(currentPort, hostname, () => {
      console.log(`> Ready on http://${hostname}:${currentPort}`);
      console.log(`> Socket.IO server running at ws://${hostname}:${currentPort}/api/socketio`);
      if (dev) {
        console.log(`> Development mode with hot reload enabled`);
      } else {
        console.log(`> Production mode with static file serving`);
      }
    });

  } catch (err) {
    console.error('Server startup error:', err);
    process.exit(1);
  }
}

// Start the server
createCustomServer();
