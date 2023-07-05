import express from 'express';
import { prisma } from './lib/prismaClient.js';

const router = express.Router();

function checkForTie(character) {
  let votesForOne = 0;

  // We count how many images have exactly 1 vote
  character.images.forEach(image => {
    if (image.votes === 1) votesForOne++;
  });

  // If more than one image has exactly 1 vote, we have a tie
  if (votesForOne > 1) return true;

  return false; // There is no tie
}

// Route to get images with 0 votes
router.get('/api/characters', async (req, res) => {
  try {
    let characters = await prisma.character.findMany({
      where: { world: 7, voted: 0 },
      include: { images: true },
      take: 10,
    });
    if (characters && characters.length) {
      res.json(characters);
    } else {
      res.json([]);
    }
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
