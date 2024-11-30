import { Server, Socket } from 'socket.io';
import { SupabaseClient } from '@supabase/supabase-js';

interface UserConnection {
  socket: Socket;
  walletAddress: string;
  joinedAt: Date;
  lastPing: Date;
}

const waitingUsers = new Map<string, UserConnection>(); // socketId -> UserConnection
const connectedPairs = new Map<string, string>();       // socketId -> socketId
const userSessions = new Map<string, {
  walletAddress: string;
  peerId: string | null;
  lastActivity: Date;
}>(); 

const log = async (supabase: SupabaseClient, message: string, data?: any) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${message}`, data ? JSON.stringify(data) : '');
  
  try {
    await supabase
      .from('socket_logs')
      .insert([{
        message,
        data,
        timestamp
      }]);
  } catch (error) {
    console.error('Failed to log to Supabase:', error);
  }
};

export const setupSocketHandlers = (io: Server, supabase: SupabaseClient) => {
  io.on('connection', (socket: Socket) => {
    log(supabase, 'Socket connected', { socketId: socket.id });

    socket.on('ready', ({ walletAddress }) => {
      if (!walletAddress) {
        log(supabase, 'Invalid ready event - missing wallet address', { 
          socketId: socket.id,
          existingSession: userSessions.get(socket.id)
        });
        return;
      }

      log(supabase, 'User ready for matching', { socketId: socket.id, walletAddress });

      // Check if user is already in a session
      const existingSession = userSessions.get(socket.id);
      if (existingSession?.peerId) {
        log(supabase, 'User already in session', { socketId: socket.id, session: existingSession });
        return;
      }

      // Check if already waiting
      if (waitingUsers.has(socket.id) || Array.from(waitingUsers.values()).some(u => u.walletAddress === walletAddress)) {
        log(supabase, 'User already waiting', { socketId: socket.id, walletAddress });
        return;
      }

      // Store user connection
      waitingUsers.set(socket.id, {
        socket,
        walletAddress,
        joinedAt: new Date(),
        lastPing: new Date()
      });
      userSessions.set(socket.id, {
        walletAddress,
        peerId: null,
        lastActivity: new Date()
      });

      // Find a match
      const waitingUser = Array.from(waitingUsers.values()).find(user => 
        user.walletAddress !== walletAddress
      );

      if (waitingUser) {
        log(supabase, 'Match found', { 
          user1: walletAddress,
          user2: waitingUser.walletAddress
        });

        // Remove both users from waiting list
        waitingUsers.delete(socket.id);
        waitingUsers.delete(waitingUser.socket.id);
        
        // Set up peer connection
        connectedPairs.set(socket.id, waitingUser.socket.id);
        connectedPairs.set(waitingUser.socket.id, socket.id);

        // Update sessions
        userSessions.set(socket.id, {
          ...userSessions.get(socket.id)!,
          peerId: waitingUser.socket.id,
          lastActivity: new Date()
        });
        userSessions.set(waitingUser.socket.id, {
          ...userSessions.get(waitingUser.socket.id)!,
          peerId: socket.id,
          lastActivity: new Date()
        });

        // Notify peers
        socket.emit('matched', { peer: waitingUser.socket.id, initiator: true });
        waitingUser.socket.emit('matched', { peer: socket.id, initiator: false });
      } else {
        log(supabase, 'User added to waiting list', { socketId: socket.id, walletAddress });
      }
    });

    socket.on('disconnect', () => {
      const session = userSessions.get(socket.id);
      log(supabase, 'Socket disconnected', { socketId: socket.id, walletAddress });
      
      // Clean up waiting list
      waitingUsers.delete(socket.id);
      userSessions.delete(socket.id);

      // Notify peer if connected
      const peerId = session?.peerId;
      if (peerId) {
        const peerSocket = io.sockets.sockets.get(peerId);
        if (peerSocket) {
          log(supabase, 'Notifying peer of disconnect', { 
            socketId: socket.id, 
            peerId,
            walletAddress: session?.walletAddress
          });
          peerSocket.emit('peer-left');
        }
        connectedPairs.delete(socket.id);
        connectedPairs.delete(peerId);
        userSessions.delete(peerId);
      }
    });

    // Log active connections every minute
    const interval = setInterval(() => {
      await log(supabase, 'Active connections', {
        waiting: waitingUsers.size,
        connected: connectedPairs.size / 2,
        total: io.engine.clientsCount
      });
    }, 60000);

    socket.on('disconnect', () => {
      clearInterval(interval);
    });
  });
};