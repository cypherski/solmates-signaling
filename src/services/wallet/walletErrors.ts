export class WalletError extends Error {
  constructor(
    public code: WalletErrorCode,
    public originalError?: unknown
  ) {
    super(WalletError.getErrorMessage(code));
    this.name = 'WalletError';
  }

  private static getErrorMessage(code: WalletErrorCode): string {
    switch (code) {
      case 'USER_ID_REQUIRED':
        return 'User ID is required to generate wallet';
      case 'GENERATION_FAILED':
        return 'Failed to generate wallet';
      case 'MAX_RETRIES_EXCEEDED':
        return 'Maximum retry attempts exceeded';
      default:
        return 'An unknown error occurred';
    }
  }
}

export type WalletErrorCode = 
  | 'USER_ID_REQUIRED'
  | 'GENERATION_FAILED'
  | 'MAX_RETRIES_EXCEEDED';