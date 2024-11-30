const ENCRYPTION_KEY = import.meta.env.VITE_ENCRYPTION_KEY;

if (!ENCRYPTION_KEY) {
  throw new Error('VITE_ENCRYPTION_KEY environment variable is required');
}

export async function encryptData(data: string): Promise<string> {
  try {
    const encoder = new TextEncoder();
    const keyData = encoder.encode(ENCRYPTION_KEY);
    const key = await crypto.subtle.importKey(
      'raw',
      keyData,
      { name: 'AES-GCM' },
      false,
      ['encrypt']
    );

    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encryptedData = await crypto.subtle.encrypt(
      {
        name: 'AES-GCM',
        iv
      },
      key,
      encoder.encode(data)
    );

    const encryptedArray = new Uint8Array(encryptedData);
    const resultArray = new Uint8Array(iv.length + encryptedArray.length);
    resultArray.set(iv);
    resultArray.set(encryptedArray, iv.length);

    return Buffer.from(resultArray).toString('base64');
  } catch (error) {
    console.error('Encryption error:', error);
    throw new Error('Failed to encrypt data');
  }
}

export async function decryptData(encryptedData: string): Promise<string> {
  try {
    const decoder = new TextDecoder();
    const keyData = new TextEncoder().encode(ENCRYPTION_KEY);
    const key = await crypto.subtle.importKey(
      'raw',
      keyData,
      { name: 'AES-GCM' },
      false,
      ['decrypt']
    );

    const encryptedArray = Buffer.from(encryptedData, 'base64');
    const iv = encryptedArray.slice(0, 12);
    const data = encryptedArray.slice(12);

    const decryptedData = await crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv
      },
      key,
      data
    );

    return decoder.decode(decryptedData);
  } catch (error) {
    console.error('Decryption error:', error);
    throw new Error('Failed to decrypt data');
  }
}