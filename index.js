import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: process.env.NODE_ENV === 'production' 
      ? '*'
      : 'http://localhost:5173',
    methods: ['GET', 'POST']
  }
});

// Keep track of waiting users and connected pairs
const waitingUsers = new Map(); // walletAddress -> socket
const connectedPairs = new Map(); // socketId -> socketId

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('ready', (data) => {
    if (!data || !data.walletAddress) {
      console.error('Invalid ready event - missing wallet address');
      return;
    }

    const walletAddress = data.walletAddress;
    console.log(`User ${walletAddress} (${socket.id}) is ready for matching`);

    // Don't add if already waiting
    if (waitingUsers.has(walletAddress)) {
      console.log(`User ${walletAddress} already waiting`);
      return;
    }

    // Find a match if there are waiting users
    const waitingUser = Array.from(waitingUsers.entries()).find(([addr]) => addr !== walletAddress);
    
    if (waitingUser) {
      const [peerAddress, peerSocket] = waitingUser;
      waitingUsers.delete(peerAddress);
      
      // Set up the peer connection
      connectedPairs.set(socket.id, peerSocket.id);
      connectedPairs.set(peerSocket.id, socket.id);

      console.log(`Matched users: ${walletAddress} <-> ${peerAddress}`);

      // Notify both peers
      socket.emit('matched', { peer: peerSocket.id, initiator: true });
      peerSocket.emit('matched', { peer: socket.id, initiator: false });
    } else {
      // Add to waiting list if no match found
      waitingUsers.set(walletAddress, socket);
      console.log(`User ${walletAddress} added to waiting list`);
    }
  });

  socket.on('signal', ({ signal }) => {
    const peerId = connectedPairs.get(socket.id);
    if (peerId) {
      const peerSocket = io.sockets.sockets.get(peerId);
      if (peerSocket) {
        console.log(`Forwarding signal from ${socket.id} to ${peerId}`);
        peerSocket.emit('signal', { signal });
      }
    }
  });

  socket.on('next', () => {
    console.log(`User ${socket.id} requesting next peer`);

    const currentPeer = connectedPairs.get(socket.id);
    if (currentPeer) {
      const peerSocket = io.sockets.sockets.get(currentPeer);
      if (peerSocket) {
        peerSocket.emit('peer-left');
      }
      connectedPairs.delete(socket.id);
      connectedPairs.delete(currentPeer);
    }

    // Look for a new match
    socket.emit('ready');
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    
    // Clean up waiting list by checking all entries
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