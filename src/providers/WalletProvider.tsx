import React, { useMemo, useCallback } from 'react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { ConnectionProvider, WalletProvider as SolanaWalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { PhantomWalletAdapter, SolflareWalletAdapter } from '@solana/wallet-adapter-wallets';
import { clusterApiUrl, Connection, Commitment } from '@solana/web3.js';

// Import wallet modal styles
import '@solana/wallet-adapter-react-ui/styles.css';

interface WalletProviderProps {
  children: React.ReactNode;
  network?: WalletAdapterNetwork;
  endpoint?: string;
  onConnected?: () => void;
  onDisconnected?: () => void;
}

interface ConnectionConfig {
  commitment: Commitment;
  wsEndpoint: string;
  confirmTransactionInitialTimeout: number;
}

export function WalletProvider({ 
  children, 
  network = WalletAdapterNetwork.Mainnet,
  endpoint: customEndpoint,
  onConnected,
  onDisconnected
}: WalletProviderProps) {
  const endpoint = useMemo(
    () => customEndpoint || clusterApiUrl(network),
    [network, customEndpoint]
  );

  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter({ network })
    ],
    [network]
  );

  const onError = useCallback((error: Error) => {
    const walletError = error as Error & { name: string };
    
    switch (walletError.name) {
      case 'WalletNotReadyError':
        console.info('Please install and connect your wallet');
        break;
      case 'WalletConnectionError':
        console.error('Failed to connect to wallet:', walletError.message);
        break;
      case 'WalletDisconnectedError':
        console.warn('Wallet disconnected:', walletError.message);
        onDisconnected?.();
        break;
      case 'WalletSignTransactionError':
        console.error('Failed to sign transaction:', walletError.message);
        break;
      default:
        console.error(`Wallet error (${walletError.name}):`, walletError.message);
    }
  }, [onDisconnected]);

  const connectionConfig = useMemo<ConnectionConfig>(() => ({
    commitment: 'confirmed',
    wsEndpoint: endpoint.replace('https', 'wss'),
    confirmTransactionInitialTimeout: 60000
  }), [endpoint]);

  const connection = useMemo(() => 
    new Connection(endpoint, connectionConfig),
    [endpoint, connectionConfig]
  );

  return (
    <ConnectionProvider endpoint={endpoint} config={connectionConfig}>
      <SolanaWalletProvider 
        wallets={wallets} 
        onError={onError} 
        autoConnect={true}
      >
        <WalletModalProvider>
          {children}
        </WalletModalProvider>
      </SolanaWalletProvider>
    </ConnectionProvider>
  );
}