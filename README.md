# SolMates Video Chat Platform

A secure video chat platform for crypto traders built with React, WebRTC, and Solana.

## Environment Setup

Before running the application, you need to set up your environment variables:

1. Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

2. Configure the following variables in your `.env` file:

- `VITE_SUPABASE_URL`: Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY`: Your Supabase anonymous key
- `VITE_SOCKET_URL`: WebSocket server URL for video chat signaling
- `VITE_SOLANA_NETWORK`: Solana network (mainnet-beta, devnet, testnet)
- `VITE_SOLANA_RPC_HOST`: Solana RPC endpoint
- `VITE_ENCRYPTION_KEY`: 32-character encryption key for wallet data

### Encryption Key Generation

To generate a secure encryption key, use the following Node.js script:

```javascript
console.log(crypto.randomBytes(16).toString('hex'));
```

## Security Considerations

1. Environment Variables
   - Never commit `.env` file to version control
   - Keep encryption keys secure and rotate regularly
   - Use different keys for development and production

2. Wallet Security
   - Private keys are encrypted before storage
   - Rate limiting prevents brute force attempts
   - Automatic session termination after inactivity

3. Video Chat Security
   - End-to-end encrypted communication
   - Secure WebRTC signaling
   - Permission-based access control

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

3. Build for production:
```bash
npm run build
```

## Features

- Secure wallet generation and management
- Real-time video chat with WebRTC
- End-to-end encryption for messages
- Connection quality monitoring
- Automatic error recovery
- Rate limiting and spam prevention