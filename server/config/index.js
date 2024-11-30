import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import 'dotenv/config';

const app = express();
const httpServer = createServer(app);

// Enable CORS
app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? ['https://solmates.club', 'https://www.solmates.club']
    : 'http://localhost:5173',
  methods: ['GET', 'POST'],
  credentials: true
}));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

const io = new Server(httpServer, {
  cors: {
    origin: process.env.NODE_ENV === 'production'
      ? ['https://solmates.club', 'https://www.solmates.club']
      : 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true
  },
  pingTimeout: 60000,
  pingInterval: 25000,
  transports: ['websocket']
});

// Keep track of users and their states
const waitingUsers = new Map(); // walletAddress -> { socket, timestamp }
const connectedPairs = new Map(); // socketId -> { peerId, walletAddress }
const userSessions = new Map(); // socketId -> { walletAddress, lastActivity }

// Cleanup inactive sessions every 5 minutes
setInterval(() => {
  const now = Date.now();
  const inactiveTimeout = 5 * 60 * 1000; // 5 minutes

  for (const [socketId, session] of userSessions.entries()) {
    if (now - session.lastActivity > inactiveTimeout) {
      const socket = io.sockets.sockets.get(socketId);
      if (socket) {
        socket.disconnect(true);
      }
    }
  }
}, 5 * 60 * 1000);

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('ready', (data) => {
    try {
      if (!data?.walletAddress) {
        console.error('Invalid ready event - missing wallet address');
        socket.emit('error', { message: 'Invalid wallet address' });
        return;
      }

      console.log(`User ${data.walletAddress} is ready for matching`);

      // Update session activity
      userSessions.set(socket.id, {
        walletAddress: data.walletAddress,
        lastActivity: Date.now()
      });

      // Don't add if already waiting
      if (waitingUsers.has(data.walletAddress)) {
        console.log(`User ${data.walletAddress} already waiting`);
        return;
      }

      // Find a match if there are waiting users
      const waitingUser = Array.from(waitingUsers.entries()).find(([addr]) => addr !== data.walletAddress);
      
      if (waitingUser) {
        const [peerAddress, peerData] = waitingUser;
        const peerSocket = peerData.socket;
        waitingUsers.delete(peerAddress);
        
        // Set up the peer connection
        connectedPairs.set(socket.id, { peerId: peerSocket.id, walletAddress: peerAddress });
        connectedPairs.set(peerSocket.id, { peerId: socket.id, walletAddress: data.walletAddress });

        console.log(`Matched users: ${data.walletAddress} <-> ${peerAddress}`);

        // Notify both peers
        socket.emit('matched', { peer: peerSocket.id, initiator: true });
        peerSocket.emit('matched', { peer: socket.id, initiator: false });
      } else {
        // Add to waiting list if no match found
        waitingUsers.set(data.walletAddress, {
          socket,
          timestamp: Date.now()
        });
        console.log(`Added to waiting list: ${data.walletAddress}`);
      }
    } catch (error) {
      console.error('Error in ready handler:', error);
      socket.emit('error', { message: 'Failed to process ready signal' });
    }
  });

  socket.on('signal', (data) => {
    try {
      const peerConnection = connectedPairs.get(socket.id);
      if (peerConnection) {
        const peerSocket = io.sockets.sockets.get(peerConnection.peerId);
        if (peerSocket) {
          // Update activity timestamp
          const session = userSessions.get(socket.id);
          if (session) {
            session.lastActivity = Date.now();
          }
          
          peerSocket.emit('signal', { signal: data.signal });
        }
      }
    } catch (error) {
      console.error('Error in signal handler:', error);
    }
  });

  socket.on('disconnect', () => {
    try {
      console.log('User disconnected:', socket.id);
      
      // Clean up session
      const session = userSessions.get(socket.id);
      if (session) {
        waitingUsers.delete(session.walletAddress);
        userSessions.delete(socket.id);
      }

      // Clean up peer connection
      const peerConnection = connectedPairs.get(socket.id);
      if (peerConnection) {
        const peerSocket = io.sockets.sockets.get(peerConnection.peerId);
        if (peerSocket) {
          peerSocket.emit('peer-left');
        }
        connectedPairs.delete(socket.id);
        connectedPairs.delete(peerConnection.peerId);
      }
    } catch (error) {
      console.error('Error in disconnect handler:', error);
    }
  });
});

const PORT = process.env.PORT || 10000;
httpServer.listen(PORT, () => {
  console.log(`Signaling server running on port ${PORT}`);
});