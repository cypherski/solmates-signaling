export function setupSocketHandlers(io, sessionManager, logger) {
  return (socket) => {
    const sessionId = sessionManager.createSession(socket.id);
    logger.info(`Client connected: ${socket.id} (Session: ${sessionId})`);

    socket.on('ready', (data) => {
      try {
        if (!data?.walletAddress) {
          socket.emit('error', { message: 'Invalid wallet address' });
          return;
        }

        const walletAddress = data.walletAddress;
        logger.info(`User ${walletAddress} ready for matching (Session: ${sessionId})`);

        if (sessionManager.waitingUsers.has(walletAddress)) {
          logger.info(`User ${walletAddress} already waiting`);
          return;
        }

        const waitingUser = sessionManager.getWaitingUser(walletAddress);
        
        if (waitingUser) {
          const [peerAddress, peerData] = waitingUser;
          const peerSocket = peerData.socket;
          
          sessionManager.removeWaitingUser(peerAddress);
          sessionManager.createPeerConnection(socket.id, peerSocket.id, walletAddress, peerAddress);

          logger.info(`Matched: ${walletAddress} <-> ${peerAddress}`);

          socket.emit('matched', { peer: peerSocket.id, initiator: true });
          peerSocket.emit('matched', { peer: socket.id, initiator: false });
        } else {
          sessionManager.addWaitingUser(walletAddress, socket);
          logger.info(`Added to waiting list: ${walletAddress}`);
        }
      } catch (error) {
        logger.error('Error in ready handler:', error);
        socket.emit('error', { message: 'Failed to process ready signal' });
      }
    });

    socket.on('signal', (data) => {
      try {
        const { signal, peer } = data;
        if (!peer || !signal) return;

        const peerSocket = io.sockets.sockets.get(peer);
        if (peerSocket) {
          logger.info(`Signal: ${socket.id} -> ${peer} (${signal.type})`);
          peerSocket.emit('signal', { signal });
        }
      } catch (error) {
        logger.error('Error in signal handler:', error);
      }
    });

    socket.on('disconnect', () => {
      try {
        logger.info(`Client disconnected: ${socket.id}`);
        
        const { session, peerConnection } = sessionManager.cleanupSession(socket.id);
        
        if (peerConnection) {
          const peerSocket = io.sockets.sockets.get(peerConnection.peerId);
          if (peerSocket) {
            logger.info(`Notifying peer ${peerConnection.peerId} of disconnect`);
            peerSocket.emit('peer-left');
          }
        }
      } catch (error) {
        logger.error('Error in disconnect handler:', error);
      }
    });
  };
}