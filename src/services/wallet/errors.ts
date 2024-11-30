export type WalletErrorCode = 
  | 'USER_ID_REQUIRED'
  | 'STORAGE_ERROR'
  | 'KEY_GENERATION_FAILED'
  | 'ENCRYPTION_FAILED'
  | 'MAX_RETRIES_EXCEEDED'
  | 'WALLET_EXISTS';

export class WalletError extends Error {
  constructor(
    public code: WalletErrorCode,
    public originalError?: unknown
  ) {
    super(WalletError.getErrorMessage(code));
    this.name = 'WalletError';
  }

  private static getErrorMessage(code: WalletErrorCode): string {
    const messages: Record<WalletErrorCode, string> = {
      USER_ID_REQUIRED: 'User ID is required to generate wallet',
      STORAGE_ERROR: 'Failed to access wallet storage',
      KEY_GENERATION_FAILED: 'Failed to generate wallet keys',
      ENCRYPTION_FAILED: 'Failed to encrypt wallet data',
      MAX_RETRIES_EXCEEDED: 'Maximum retry attempts exceeded',
      WALLET_EXISTS: 'Wallet already exists for this user'
    };

    return messages[code] || 'An unknown error occurred';
  }
}