import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import uploadRoutes from './src/uploadRoutes.js';
import { registerSocketHandlers } from './src/socketHandler.js';

const app = express();
const PORT = process.env.PORT || 5000;

// 1. DYNAMIC CORS & PREFLIGHT INTERCEPTOR MIDDLEWARE (Ensures absolute priority)
app.use((req, res, next) => {
  const origin = req.headers.origin;
  
  // Whitelist local environments dynamically
  if (origin && origin.startsWith('http://localhost:')) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  } else {
    // Fallback alignment rule
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  }

  res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, PUT, PATCH, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  // Handle browser preflight checks immediately before hitting routes
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }
  next();
});

// Standard Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve Static Assets
app.use('/uploads', express.static('uploads'));

// REST Routes
app.use('/api/upload', uploadRoutes);

// Health check endpoint
app.get('/', (req, res) => res.status(200).json({ status: 'healthy' }));

// Attach Socket.IO to raw HTTP Native Server instance
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
    credentials: true
  },
  allowEIO3: true,
  transports: ['polling', 'websocket']
});

// Wire WebSocket pipelines
registerSocketHandlers(io);

httpServer.listen(PORT, () => {
  console.log(`[Core] Server actively listening on port ${PORT}`);
});