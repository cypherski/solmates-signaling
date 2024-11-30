import { WalletConfig } from './types';

export const walletConfig: WalletConfig = {
  maxRetries: 3,
  retryDelay: 1000,
  keyAlgorithm: 'ECDSA',
  curve: 'P-256'
};