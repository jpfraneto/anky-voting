import express from 'express';
import { prisma } from './lib/prismaClient.js';

const router = express.Router();

// Route to get images with 0 votes
router.get('/api/characters', async (req, res) => {
  try {
    const characters = await prisma.character.findMany({
      where: { voted: 0, world: 8 },
      include: { images: true },
      take: 10,
    });
    res.json(characters);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Route to vote for an image
router.post('/api/vote', async (req, res) => {
  try {
    const { id } = req.body;
    const updatedImage = await prisma.image.update({
      where: { id },
      data: { votes: { increment: 1 } },
    });
    await prisma.character.update({
      where: { id: updatedImage.characterId },
      data: { voted: { increment: 1 } },
    });

    res.json(updatedImage);
  } catch (error) {
    res.status(500).send(error);
  }
});

export default router;
