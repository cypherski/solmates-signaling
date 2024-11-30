import { WalletGenerator } from './generator';
import { WalletStorage } from './storage';
import { WalletError } from './errors';
import { walletConfig } from './config';
import { encryptData } from '../../utils/encryption';

export class WalletService {
  static async generateWallet(userId: string): Promise<string> {
    if (!userId) {
      throw new WalletError('USER_ID_REQUIRED');
    }

    let attempts = 0;
    
    while (attempts < walletConfig.maxRetries) {
      try {
        // Check for existing wallet
        const existingWallet = await WalletStorage.getWallet(userId);
        if (existingWallet?.wallet_address) {
          return existingWallet.wallet_address;
        }

        // Generate new wallet
        const { publicKey, privateKey } = await WalletGenerator.generateKeyPair();
        const encryptedPrivateKey = await encryptData(privateKey);

        // Save wallet
        const wallet = await WalletStorage.saveWallet(
          userId,
          publicKey,
          encryptedPrivateKey
        );

        return wallet.wallet_address;

      } catch (error) {
        attempts++;
        if (attempts === walletConfig.maxRetries) {
          throw error instanceof WalletError ? error : new WalletError('KEY_GENERATION_FAILED', error);
        }
        await new Promise(resolve => setTimeout(resolve, walletConfig.retryDelay * attempts));
      }
    }

    throw new WalletError('MAX_RETRIES_EXCEEDED');
  }
}