import { supabase } from '../supabase';
import { WalletData } from './types';
import { WalletError } from './errors';

export class WalletStorage {
  static async getWallet(userId: string): Promise<WalletData | null> {
    const { data, error } = await supabase
      .from('user_wallets')
      .select('wallet_address, encrypted_private_key')
      .eq('user_id', userId)
      .single();

    if (error) {
      throw new WalletError('STORAGE_ERROR', error);
    }

    return data;
  }

  static async saveWallet(
    userId: string,
    walletAddress: string,
    encryptedPrivateKey: string
  ): Promise<WalletData> {
    const { data, error } = await supabase
      .from('user_wallets')
      .insert([{
        user_id: userId,
        wallet_address: walletAddress,
        encrypted_private_key: encryptedPrivateKey
      }])
      .select()
      .single();

    if (error) {
      throw new WalletError('STORAGE_ERROR', error);
    }

    return data;
  }
}