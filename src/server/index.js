@@ .. @@
 const waitingUsers = new Map(); // walletAddress -> socket
 const connectedPairs = new Map(); // socketId -> socketId
+const userSessions = new Map(); // socketId -> { walletAddress, peerId }
 
 io.on('connection', (socket) => {
   console.log('User connected:', socket.id);
 
   socket.on('ready', ({ walletAddress }) => {
+    console.log(`User ${walletAddress} is ready for matching`);
+
     // Don't add if already waiting
     if (waitingUsers.has(walletAddress)) return;
 
     // Find a match if there are waiting users
     const waitingUser = Array.from(waitingUsers.entries()).find(([addr]) => addr !== walletAddress);
     
     if (waitingUser) {
       const [peerAddress, peerSocket] = waitingUser;
       waitingUsers.delete(peerAddress);
       
+      // Store session information
+      userSessions.set(socket.id, { walletAddress, peerId: peerSocket.id });
+      userSessions.set(peerSocket.id, { walletAddress: peerAddress, peerId: socket.id });
+
       // Set up the peer connection
       connectedPairs.set(socket.id, peerSocket.id);
       connectedPairs.set(peerSocket.id, socket.id);
 
+      console.log(`Matched users: ${walletAddress} <-> ${peerAddress}`);
+
       // Notify both peers
       socket.emit('matched', { peer: peerSocket.id, initiator: true });
       peerSocket.emit('matched', { peer: socket.id, initiator: false });
     } else {
       // Add to waiting list if no match found
       waitingUsers.set(walletAddress, socket);
+      console.log(`User ${walletAddress} added to waiting list`);
     }
   });
 
   socket.on('signal', ({ signal, peer }) => {
     const targetSocket = io.sockets.sockets.get(peer);
     if (targetSocket) {
+      console.log(`Forwarding signal from ${socket.id} to ${peer}`);
       targetSocket.emit('signal', { signal });
     }
   });
 
   socket.on('next', ({ walletAddress }) => {
+    console.log(`User ${walletAddress} requesting next peer`);
+
     const currentPeer = connectedPairs.get(socket.id);
     if (currentPeer) {
       const peerSocket = io.sockets.sockets.get(currentPeer);
       if (peerSocket) {
         peerSocket.emit('peer-left');
       }
       connectedPairs.delete(socket.id);
       connectedPairs.delete(currentPeer);
+      
+      // Clean up session information
+      userSessions.delete(socket.id);
+      userSessions.delete(currentPeer);
     }
 
     // Look for a new match
     socket.emit('ready', { walletAddress });
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
+      
+      // Clean up session information
+      userSessions.delete(socket.id);
+      userSessions.delete(peerId);
     }
   });
 });