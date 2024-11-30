import { PublicKey, Keypair } from '@solana/web3.js';
import { supabase } from './supabase';
import { encryptData, decryptData } from '../utils/encryption';

export class WalletService {
  private static instance: WalletService;
  private rateLimiter: Map<string, { count: number; timestamp: number }> = new Map();
  private readonly MAX_REQUESTS = 5;
  private readonly TIME_WINDOW = 60000; // 1 minute

  private constructor() {}

  static getInstance(): WalletService {
    if (!this.instance) {
      this.instance = new WalletService();
    }
    return this.instance;
  }

  private checkRateLimit(userId: string): boolean {
    const now = Date.now();
    const userLimit = this.rateLimiter.get(userId);

    if (!userLimit) {
      this.rateLimiter.set(userId, { count: 1, timestamp: now });
      return true;
    }

    if (now - userLimit.timestamp > this.TIME_WINDOW) {
      this.rateLimiter.set(userId, { count: 1, timestamp: now });
      return true;
    }

    if (userLimit.count >= this.MAX_REQUESTS) {
      return false;
    }

    userLimit.count++;
    return true;
  }

  async generateWallet(userId: string): Promise<{ publicKey: string; error?: string }> {
    try {
      if (!this.checkRateLimit(userId)) {
        throw new Error('Rate limit exceeded. Please try again later.');
      }

      // Check for existing wallet
      const { data: existingWallet } = await supabase
        .from('user_wallets')
        .select('public_key')
        .eq('user_id', userId)
        .single();

      if (existingWallet) {
        throw new Error('Wallet already exists for this user');
      }

      // Generate new keypair
      const keypair = Keypair.generate();
      const publicKey = keypair.publicKey.toString();
      const privateKey = Buffer.from(keypair.secretKey).toString('base64');

      // Encrypt private key
      const encryptedPrivateKey = await encryptData(privateKey);

      // Store wallet info
      const { error: insertError } = await supabase
        .from('user_wallets')
        .insert([
          {
            user_id: userId,
            public_key: publicKey,
            encrypted_private_key: encryptedPrivateKey
          }
        ]);

      if (insertError) throw insertError;

      return { publicKey };
    } catch (error) {
      console.error('Wallet generation error:', error);
      return {
        publicKey: '',
        error: error instanceof Error ? error.message : 'Failed to generate wallet'
      };
    }
  }

  async getWallet(userId: string): Promise<{ publicKey: string; error?: string }> {
    try {
      const { data: wallet, error } = await supabase
        .from('user_wallets')
        .select('public_key')
        .eq('user_id', userId)
        .single();

      if (error) throw error;
      if (!wallet) throw new Error('Wallet not found');

      return { publicKey: wallet.publicKey };
    } catch (error) {
      console.error('Get wallet error:', error);
      return {
        publicKey: '',
        error: error instanceof Error ? error.message : 'Failed to retrieve wallet'
      };
    }
  }

  async validateWallet(publicKey: string): Promise<boolean> {
    try {
      new PublicKey(publicKey);
      return true;
    } catch {
      return false;
    }
  }
}