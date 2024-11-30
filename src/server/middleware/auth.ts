import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { verifyMessage } from '@solana/web3.js';

interface AuthRequest extends Request {
  user?: {
    id: string;
    walletAddress: string;
  };
}

export const verifyToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    req.user = decoded as { id: string; walletAddress: string };
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

export const verifyWalletSignature = async (
  message: string,
  signature: string,
  publicKey: string
): Promise<boolean> => {
  try {
    // Verify the signature using Solana web3.js
    const verified = await verifyMessage(
      Buffer.from(message),
      Buffer.from(signature, 'base64'),
      publicKey
    );
    return verified;
  } catch (error) {
    console.error('Signature verification failed:', error);
    return false;
  }
};