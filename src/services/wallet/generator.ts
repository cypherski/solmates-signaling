import { WalletKeyPair } from './types';
import { walletConfig } from './config';
import { WalletError } from './errors';

export class WalletGenerator {
  static async generateKeyPair(): Promise<WalletKeyPair> {
    try {
      const keyPair = await window.crypto.subtle.generateKey(
        {
          name: walletConfig.keyAlgorithm,
          namedCurve: walletConfig.curve
        },
        true,
        ['sign', 'verify']
      );

      const [publicKey, privateKey] = await Promise.all([
        window.crypto.subtle.exportKey('raw', keyPair.publicKey),
        window.crypto.subtle.exportKey('pkcs8', keyPair.privateKey)
      ]);

      return {
        publicKey: Buffer.from(publicKey).toString('hex'),
        privateKey: Buffer.from(privateKey).toString('hex')
      };
    } catch (error) {
      throw new WalletError('KEY_GENERATION_FAILED', error);
    }
  }
}