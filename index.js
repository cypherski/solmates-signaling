import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import 'dotenv/config';

const app = express();
const httpServer = createServer(app);

// Enable CORS
app.use(cors());

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy' });
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
  pingInterval: 25000
});

// Keep track of users
const waitingUsers = new Map(); // walletAddress -> socket
const connectedPairs = new Map(); // socketId -> socketId

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('ready', (data) => {
    if (!data?.walletAddress) {
      console.error('Invalid ready event - missing wallet address');
      return;
    }

    console.log(`User ${data.walletAddress} is ready for matching`);

    // Don't add if already waiting
    if (waitingUsers.has(data.walletAddress)) {
      console.log(`User ${data.walletAddress} already waiting`);
      return;
    }

    // Find a match if there are waiting users
    const waitingUser = Array.from(waitingUsers.entries()).find(([addr]) => addr !== data.walletAddress);
    
    if (waitingUser) {
      const [peerAddress, peerSocket] = waitingUser;
      waitingUsers.delete(peerAddress);
      
      // Set up the peer connection
      connectedPairs.set(socket.id, peerSocket.id);
      connectedPairs.set(peerSocket.id, socket.id);

      console.log(`Matched users: ${data.walletAddress} <-> ${peerAddress}`);

      // Notify both peers
      socket.emit('matched', { peer: peerSocket.id, initiator: true });
      peerSocket.emit('matched', { peer: socket.id, initiator: false });
    } else {
      // Add to waiting list if no match found
      waitingUsers.set(data.walletAddress, socket);
      console.log(`Added to waiting list: ${data.walletAddress}`);
    }
  });

  socket.on('signal', (data) => {
    const peerId = connectedPairs.get(socket.id);
    if (peerId) {
      const peerSocket = io.sockets.sockets.get(peerId);
      if (peerSocket) {
        peerSocket.emit('signal', { signal: data.signal });
      }
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    
    // Clean up waiting list
    for (const [addr, sock] of waitingUsers.entries()) {
      if (sock.id === socket.id) {
        waitingUsers.delete(addr);
        break;
      }
    }

    // Notify peer if connected
    const peerId = connectedPairs.get(socket.id);
    if (peerId) {
      const peerSocket = io.sockets.sockets.get(peerId);
      if (peerSocket) {
        peerSocket.emit('peer-left');
      }
      connectedPairs.delete(socket.id);
      connectedPairs.delete(peerId);
    }
  });
});

const PORT = process.env.PORT || 10000;
httpServer.listen(PORT, () => {
  console.log(`Signaling server running on port ${PORT}`);
});