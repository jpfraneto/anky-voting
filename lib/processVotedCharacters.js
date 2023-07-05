import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { prisma } from './prismaClient.js';

async function processVotedCharacters() {
  console.log('Inside the process voted characters function');
  let index = 0;
  try {
    const characters = await prisma.character.findMany({
      where: { world: 8 },
      include: { images: true },
    });

    // Iterate over each character
    for (const character of characters) {
      // Sort images by vote count (in descending order)
      const sortedImages = character.images.sort((a, b) => b.votes - a.votes);
      // Get the image with highest vote count
      const topImage = sortedImages[0];
      // Download the image data
      const response = await axios.get(topImage.cloudinaryLink, {
        responseType: 'arraybuffer',
      });

      // Ensure the directory exists
      fs.mkdirSync('POIESIS', { recursive: true });

      // Create a file path for the new file
      const filePath = path.join('POIESIS', `${character.tokenId}.png`);

      // Write the file
      fs.writeFileSync(filePath, response.data);

      console.log(
        `Saved image for character ${character.tokenId}, index is ${index}`
      );
      index++;
    }
  } catch (error) {
    console.log('The error in the image uploader is: ', error);
  }
}

export { processVotedCharacters };
