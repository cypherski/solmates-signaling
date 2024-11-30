import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;
const RECONNECTION_ATTEMPTS = 3;
const RECONNECTION_DELAY = 2000;
const SOCKET_TIMEOUT = 60000;
const DEBUG = true;

// Track connection state
let connectionState = {
  isConnecting: false,
  lastAttempt: 0,
  retryCount: 0
};

// Track socket state
let socketState = {
  isConnected: false,
  lastPing: 0,
  latency: 0,
  reconnectAttempts: 0
};

if (!SOCKET_URL) {
  throw new Error('VITE_SOCKET_URL environment variable is not set');
}

// Track connection metrics
let connectionMetrics = {
  attempts: 0,
  lastAttempt: 0,
  successfulConnections: 0,
  failedConnections: 0
};

const log = (...args: any[]) => {
  if (DEBUG) console.log('[Socket]', ...args);
  // Send metrics to render.com
  try {
    fetch(`${SOCKET_URL}/metrics`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event: args[0],
        data: args.slice(1),
        timestamp: new Date().toISOString(),
        metrics: connectionMetrics
      })
    }).catch(console.error); // Silently handle fetch errors
  } catch (error) {
    console.error('Failed to send metrics:', error);
  }
};

// Add socket status tracking
let isSocketConnected = false;
let connectionAttempts = 0;
let isConnecting = false;
let currentPeerId: string | null = null;
let isInitiator = false;

export const socket = io(SOCKET_URL, {
  autoConnect: false,
  transports: ['websocket'],
  reconnectionAttempts: RECONNECTION_ATTEMPTS,
  reconnectionDelay: RECONNECTION_DELAY,
  timeout: SOCKET_TIMEOUT,
  forceNew: true,
  reconnection: true
});

socket.on('connect', () => {
  connectionState.isConnecting = false;
  connectionState.retryCount = 0;
  log('Connected to signaling server');
});

socket.on('connect_error', (error) => {
  log('Connection error:', error);
  if (connectionState.retryCount < RECONNECTION_ATTEMPTS) {
    connectionState.retryCount++;
    connectionState.lastAttempt = Date.now();
    setTimeout(() => {
      if (!socket.connected) {
        socket.connect();
      }
    }, RECONNECTION_DELAY * connectionState.retryCount);
  }
});
let connectionTimeout: NodeJS.Timeout;

socket.on('connect', () => {
  log('Connected to signaling server');
  isSocketConnected = true;
  isConnecting = false;
  socketState.isConnected = true;
  socketState.reconnectAttempts = 0;
  connectionMetrics.successfulConnections++;
  
  // Log successful connection
  fetch(`${SOCKET_URL}/metrics`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      event: 'socket_connected',
      timestamp: Date.now(),
      metrics: connectionMetrics
    })
  }).catch(() => {});
  
  // Start heartbeat
  startHeartbeat();
  
  if (connectionTimeout) {
    clearTimeout(connectionTimeout);
  }
});

// Add heartbeat mechanism
const startHeartbeat = () => {
  const interval = setInterval(() => {
    if (!socket.connected) {
      clearInterval(interval);
      return;
    }
    
    const start = Date.now();
    socket.emit('ping', () => {
      socketState.latency = Date.now() - start;
      socketState.lastPing = Date.now();
      log('Heartbeat latency:', socketState.latency + 'ms');
    });
  }, 5000);
};

socket.on('connect_error', (error) => {
  log('Connection error:', error);
  connectionMetrics.failedConnections++;
  if (connectionAttempts < RECONNECTION_ATTEMPTS && !isConnecting) {
    connectionAttempts++;
    connectionMetrics.attempts++;
    connectionMetrics.lastAttempt = Date.now();
    isConnecting = true;
    log(`Retrying connection (${connectionAttempts}/${RECONNECTION_ATTEMPTS})...`);
    setTimeout(() => {
      isConnecting = false;
      socket.connect();
    }, RECONNECTION_DELAY * connectionAttempts);
  } else if (connectionAttempts >= RECONNECTION_ATTEMPTS) {
    log('Max reconnection attempts reached');
  }
});

socket.on('disconnect', (reason) => {
  log('Disconnected from signaling server:', reason);
  isSocketConnected = false;
  currentPeerId = null;
  isInitiator = false;
  if ((reason === 'transport close' || reason === 'transport error') && connectionAttempts < RECONNECTION_ATTEMPTS) {
    connectionAttempts++;
    socket.connect();
  }
});

socket.on('connect_error', (error) => {
  console.error('Connection error:', error);
  if (connectionAttempts < RECONNECTION_ATTEMPTS) {
    connectionAttempts++;
    setTimeout(() => socket.connect(), RECONNECTION_DELAY);
  }
});

socket.on('matched', ({ peer, initiator }) => {
  currentPeerId = peer;
  isInitiator = initiator;
  log(`Matched with peer: ${peer}, initiator: ${initiator}`);
  
  // Log match metrics
  try {
    fetch(`${SOCKET_URL}/metrics`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event: 'peer_matched',
        data: { peer, initiator, timestamp: Date.now() },
        socketState
      })
    }).catch(() => {}); // Silently handle fetch errors
  } catch (error) {
    console.error('Failed to log match metrics:', error);
  }
});

socket.on('peer-left', () => {
  currentPeerId = null;
  isInitiator = false;
  console.log('Peer disconnected');
});

export const connectToSignalingServer = () => {
  if (!socket.connected) {
    log('Attempting to connect to signaling server...');
    
    // Add connection metrics
    const metrics = {
      timestamp: Date.now(),
      attempts: connectionMetrics.attempts + 1,
      lastAttempt: Date.now()
    };

    // Send connection attempt metric to render.com
    fetch(`${SOCKET_URL}/metrics`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event: 'connection_attempt',
        data: metrics
      })
    }).catch(() => {}); // Silently handle fetch errors
    
    if (!SOCKET_URL) {
      console.error('Missing SOCKET_URL environment variable');
      return false;
    }

    if (isConnecting) {
      log('Connection attempt already in progress...');
      return false;
    }
    
    // Send connection attempt metric
    fetch(`${SOCKET_URL}/metrics`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event: 'connection_attempt',
        timestamp: Date.now(),
        metrics: connectionMetrics
      })
    }).catch(() => {}); // Silently handle fetch errors

    connectionMetrics.attempts++;
    connectionMetrics.lastAttempt = Date.now();
    isConnecting = true;

    socket.connect();

    connectionTimeout = setTimeout(() => {
      if (!socket.connected) {
        log('Connection timeout, retrying...');
        isConnecting = false;
        isSocketConnected = false;
        socket.disconnect();
        setTimeout(() => socket.connect(), RECONNECTION_DELAY);
      }
    }, SOCKET_TIMEOUT);
  }
  return isSocketConnected;
};

export const emitReady = (walletAddress: string) => {
  log('Emitting ready signal with wallet:', walletAddress);
  
  // Track wallet connection attempt
  fetch(`${SOCKET_URL}/metrics`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      event: 'wallet_ready',
      data: { walletAddress },
      timestamp: Date.now()
    })
  }).catch(() => {}); // Silently handle fetch errors
  // Track wallet connection attempt
  log('Wallet connection attempt', { walletAddress, timestamp: Date.now() });

  if (!socket.connected) {
    connectToSignalingServer();
  }
  socket.emit('ready', { walletAddress });
};

export const emitNext = (walletAddress: string) => {
  log('Requesting next peer with wallet:', walletAddress);
  socket.emit('next', { walletAddress });
};

export const emitSignal = (signal: any) => {
  if (currentPeerId) {
    log('Emitting signal:', signal.type);
    socket.emit('signal', { signal, peer: currentPeerId });
  }
};