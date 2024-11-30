import { supabase } from '../supabase';
import { encryptData } from '../../utils/encryption';
import { WalletError } from './walletErrors';

export class WalletService {
  private static readonly MAX_RETRIES = 3;
  private static readonly RETRY_DELAY = 1000;

  static async generateWallet(userId: string): Promise<string> {
    if (!userId) {
      throw new WalletError('USER_ID_REQUIRED');
    }

    let attempts = 0;
    
    while (attempts < this.MAX_RETRIES) {
      try {
        const { data: existingWallet } = await supabase
          .from('user_wallets')
          .select('wallet_address')
          .eq('user_id', userId)
          .single();

        if (existingWallet?.wallet_address) {
          return existingWallet.wallet_address;
        }

        const { publicKey, privateKey } = await this.createKeyPair();
        const encryptedPrivateKey = await encryptData(privateKey);

        const { data, error } = await supabase
          .from('user_wallets')
          .insert([{
            user_id: userId,
            wallet_address: publicKey,
            encrypted_private_key: encryptedPrivateKey
          }])
          .select()
          .single();

        if (error) throw error;
        return data.wallet_address;

      } catch (error) {
        attempts++;
        if (attempts === this.MAX_RETRIES) {
          throw new WalletError('GENERATION_FAILED', error);
        }
        await new Promise(resolve => setTimeout(resolve, this.RETRY_DELAY * attempts));
      }
    }

    throw new WalletError('MAX_RETRIES_EXCEEDED');
  }

  private static async createKeyPair(): Promise<{ publicKey: string; privateKey: string }> {
    // Implementation would depend on your specific wallet requirements
    // This is a placeholder that should be replaced with actual wallet generation logic
    const keyPair = await window.crypto.subtle.generateKey(
      {
        name: 'ECDSA',
        namedCurve: 'P-256'
      },
      true,
      ['sign', 'verify']
    );

    const publicKey = await window.crypto.subtle.exportKey('raw', keyPair.publicKey);
    const privateKey = await window.crypto.subtle.exportKey('pkcs8', keyPair.privateKey);

    return {
      publicKey: Buffer.from(publicKey).toString('hex'),
      privateKey: Buffer.from(privateKey).toString('hex')
    };
  }
}