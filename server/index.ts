import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import { verifyToken } from './middleware/auth';
import { setupSocketHandlers } from './socket';
import userRoutes from './routes/users';
import authRoutes from './routes/auth';
import videoRoutes from './routes/video';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const PORT = process.env.PORT || 10000;
const app = express();
const httpServer = createServer(app);

// Configure Socket.IO with proper CORS
const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
    credentials: true
  },
  transports: ['websocket'],
  pingTimeout: 60000,
  pingInterval: 25000
  }
});

// Initialize Supabase client for logging
const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.VITE_SUPABASE_ANON_KEY!
);

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', verifyToken, userRoutes);
app.use('/api/video', verifyToken, videoRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy' });
});

// Metrics endpoint
app.post('/metrics', async (req, res) => {
  try {
    const { event, data } = req.body;
    await supabase
      .from('connection_logs')
      .insert([{ event, data, timestamp: new Date().toISOString() }]);
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Failed to log metrics:', error);
    res.status(500).json({ error: 'Failed to log metrics' });
  }
});

// Socket.io setup
setupSocketHandlers(io, supabase);

// Error handling
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: process.env.NODE_ENV === 'production' 
      ? 'Internal server error' 
      : err.message 
  });
});

httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});