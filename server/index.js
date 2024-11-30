import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { config } from './config/index.js';
import { SessionManager } from './services/SessionManager.js';
import { setupSocketHandlers } from './handlers/socketHandlers.js';
import { Logger } from './utils/logger.js';

const app = express();
const httpServer = createServer(app);
const logger = new Logger();

// Enable CORS for health checks
app.use(cors());

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy' });
});

const io = new Server(httpServer, {
  cors: config.cors,
  pingTimeout: config.socket.pingTimeout,
  pingInterval: config.socket.pingInterval
});

const sessionManager = new SessionManager();

// Cleanup inactive sessions periodically
setInterval(() => {
  sessionManager.cleanupInactiveSessions(config.session.maxInactiveTime);
}, config.session.cleanupInterval);

// Setup socket handlers
io.on('connection', setupSocketHandlers(io, sessionManager, logger));

httpServer.listen(config.port, () => {
  logger.info(`Signaling server running on port ${config.port}`);
});