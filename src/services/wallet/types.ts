export interface WalletKeyPair {
  publicKey: string;
  privateKey: string;
}

export interface WalletData {
  wallet_address: string;
  encrypted_private_key: string;
}

export interface WalletConfig {
  maxRetries: number;
  retryDelay: number;
  keyAlgorithm: string;
  curve: string;
}