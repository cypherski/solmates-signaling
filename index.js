import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const httpServer = createServer(app);

// Get allowed origins from environment variables
const ALLOWED_ORIGINS = process.env.NODE_ENV === 'production'
  ? ['https://solmates.club']
  : ['http://localhost:5173', 'http://127.0.0.1:5173'];

const io = new Server(httpServer, {
  cors: {
    origin: ALLOWED_ORIGINS,
    methods: ['GET', 'POST'],
    credentials: true
  },
  transports: ['websocket'],
  pingInterval: 10000,
  pingTimeout: 5000
});

const waitingUsers = new Map(); // walletAddress -> socket
const connectedPairs = new Map(); // socketId -> socketId

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('ready', ({ walletAddress }) => {
    // Remove any existing entries for this user
    for (const [addr, sock] of waitingUsers.entries()) {
      if (sock.id === socket.id || addr === walletAddress) {
        waitingUsers.delete(addr);
      }
    }

    // Find a waiting user to match with
    const waitingUser = Array.from(waitingUsers.entries()).find(([addr]) => addr !== walletAddress);
    
    if (waitingUser) {
      const [peerAddress, peerSocket] = waitingUser;
      waitingUsers.delete(peerAddress);
      
      // Set up peer connection
      connectedPairs.set(socket.id, peerSocket.id);
      connectedPairs.set(peerSocket.id, socket.id);

      // Notify both peers
      socket.emit('matched', { peer: peerSocket.id, initiator: true });
      peerSocket.emit('matched', { peer: socket.id, initiator: false });
      
      console.log(`Matched ${walletAddress} with ${peerAddress}`);
    } else {
      // Add to waiting list
      waitingUsers.set(walletAddress, socket);
      console.log(`${walletAddress} waiting for match`);
    }
  });

  socket.on('signal', ({ signal, peer }) => {
    const peerSocket = io.sockets.sockets.get(peer);
    if (peerSocket) {
      peerSocket.emit('signal', { signal });
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

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
  console.log(`Signaling server running on port ${PORT}`);
});