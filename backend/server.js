import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import uploadRoutes from './src/uploadRoutes.js';
import { registerSocketHandlers } from './src/socketHandler.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Standard Middlewares
app.use(cors({ origin: '*' })); // Match production target routing rules during setup
app.use(express.json());

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