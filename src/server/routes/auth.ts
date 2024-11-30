import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import { verifyWalletSignature } from '../middleware/auth';
import { generateUsername } from '../../utils/usernameGenerator';

const router = Router();
const prisma = new PrismaClient();

router.post('/verify', async (req, res) => {
  const { signature, message, publicKey } = req.body;

  try {
    const isValid = await verifyWalletSignature(message, signature, publicKey);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid signature' });
    }

    // Find or create user
    let user = await prisma.user.findUnique({
      where: { walletAddress: publicKey }
    });

    if (!user) {
      // Generate unique username
      let username;
      let isUnique = false;
      
      while (!isUnique) {
        username = generateUsername();
        const existing = await prisma.user.findUnique({
          where: { username }
        });
        if (!existing) isUnique = true;
      }

      user = await prisma.user.create({
        data: {
          walletAddress: publicKey,
          username: username!
        }
      });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user.id, walletAddress: user.walletAddress },
      process.env.JWT_SECRET!,
      { expiresIn: '24h' }
    );

    res.json({ token, user });
  } catch (error) {
    console.error('Auth error:', error);
    res.status(500).json({ error: 'Authentication failed' });
  }
});

export default router;