import { Server, Socket } from 'socket.io';
import { PrismaClient } from '@prisma/client';

const waitingUsers = new Set<Socket>();
const connectedPairs = new Map<string, string>(); // socketId -> socketId

export const setupSocketHandlers = (io: Server) => {
  io.on('connection', (socket: Socket) => {
    console.log('User connected:', socket.id);

    socket.on('ready', () => {
      if (waitingUsers.has(socket)) return;

      if (waitingUsers.size > 0) {
        const peer = waitingUsers.values().next().value;
        waitingUsers.delete(peer);
        
        connectedPairs.set(socket.id, peer.id);
        connectedPairs.set(peer.id, socket.id);

        socket.emit('matched', { initiator: true });
        peer.emit('matched', { initiator: false });
      } else {
        waitingUsers.add(socket);
      }
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
      
      waitingUsers.delete(socket);

      const peerId = connectedPairs.get(socket.id);
      if (peerId) {
        const peerSocket = io.sockets.sockets.get(peerId);
        peerSocket?.emit('peer-left');
        connectedPairs.delete(socket.id);
        connectedPairs.delete(peerId);
      }
    });
  });
};