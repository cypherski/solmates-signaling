import { useCallback, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { supabase } from '../services/supabase';

export function useWalletAuth() {
  const { publicKey, signMessage, connected, connecting } = useWallet();
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const authenticate = useCallback(async () => {
    if (!publicKey || !signMessage) {
      setError('Wallet not connected');
      return false;
    }

    if (isAuthenticated) {
      return true;
    }

    try {
      setIsAuthenticating(true);
      setError(null);

      const nonce = Date.now().toString();
      const message = `Sign this message to authenticate with SolMates\nNonce: ${nonce}`;
      const encodedMessage = new TextEncoder().encode(message);
      
      let signature;
      try {
        signature = await signMessage(encodedMessage);
      } catch (signError) {
        throw new Error('Failed to sign message with wallet');
      }
      
      const { error: authError } = await supabase.auth.signInWithOAuth({
        provider: 'custom',
        options: {
          scopes: publicKey.toString(),
          queryParams: {
            signature: Buffer.from(signature).toString('base64'),
            wallet: publicKey.toString(),
            nonce
          }
        }
      });

      if (authError) {
        throw authError;
      }

      setIsAuthenticated(true);
      return true;

    } catch (err) {
      console.error('Authentication error:', err);
      setError(err instanceof Error ? err.message : 'Authentication failed');
      return false;
    } finally {
      setIsAuthenticating(false);
    }
  }, [publicKey, signMessage]);

  return {
    authenticate,
    isAuthenticating,
    isAuthenticated,
    error,
    isConnected: connected,
    isConnecting: connecting,
    publicKey: publicKey?.toString()
  };
}