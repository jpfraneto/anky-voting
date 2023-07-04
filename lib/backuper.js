import axios from 'axios';
import pMap from 'p-map';
import { prisma } from './prismaClient.js';
async function backupCreator() {
  try {
    // Fetch characters from API
    const { data } = await axios.get(
      'http://localhost:3001/api/characters-backup'
    );
    console.log('Received characters from the server');
    console.log('the data is: ', data.charactersForBackup.length);
    // Store characters in the database
    await pMap(
      data.charactersForBackup,
      async character => {
        try {
          // Save character and images in the database
          await prisma.character.create({
            data: {
              tokenId: character.tokenId,
              externalUrl: character.external_url,
              world: character.world,
              name: character.name,
              description: character.description,
              attributes: character.attributes,
              upscaledImageUrls: character.upscaledImageUrls,
              images: {
                create: character.upscaledImageUrls.map(imageUrl => ({
                  imageUrl: imageUrl,
                })),
              },
            },
          });
          console.log(`Stored character ${character.tokenId} in the database`);
        } catch (error) {
          console.error(
            `Error storing character ${character.tokenId} in the database: `,
            error
          );
        }
      },
      { concurrency: 20 } // Only 20 characters will be processed at a time
    );

    console.log('******All the data has been backed up*******');
  } catch (error) {
    console.error('Error fetching data from the server:', error);
  } finally {
    await prisma.$disconnect();
  }
}

export { backupCreator };
