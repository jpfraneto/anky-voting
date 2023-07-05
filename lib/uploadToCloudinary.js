import axios from 'axios';
import pMap from 'p-map';
import { prisma } from './prismaClient.js';
import { v2 as cloudinary } from 'cloudinary';

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function uploadImagesForCharacter(character) {
  let cloudinaryLinks = [];
  await pMap(
    character.upscaledImageUrls,
    async (imageUrl, index) => {
      const responseFromCloudinary = await cloudinary.uploader.upload(
        imageUrl,
        {
          public_id: `${character.name}-${character.tokenId}-${index}.png`,
        }
      );

      const cloudinaryLink = responseFromCloudinary.secure_url;
      cloudinaryLinks.push(cloudinaryLink);

      // update Image with cloudinary link
      await prisma.image.updateMany({
        where: { characterId: character.id, imageUrl: imageUrl },
        data: { cloudinaryLink },
      });

      console.log(
        `The image number ${index + 1} for character number ${
          character.tokenId
        } was added to cloudinary`
      );
    },
    { concurrency: 4 } // Only 4 images will be processed at a time
  );

  // Update the character in the database with the new links
  const updatedCharacter = await prisma.character.update({
    where: { id: character.id },
    data: { cloudinaryLinks },
  });

  console.log(
    `The character ${character.tokenId} was updated with the 4 links to cloudinary.`
  );
}

async function imageUploader(worldNumber) {
  console.log(
    'Inside the image uploader function for world number ',
    worldNumber
  );
  cloudinary.config({
    cloud_name: 'anky',
    api_key: '837825237122531',
    api_secret: 'GVigF_V7Arcc_oYKG9t8r82yWZM',
  });

  try {
    const characters = await prisma.character.findMany({
      where: { world: worldNumber },
    });
    if (!characters) {
      console.log('No characters found in the database.');
      return;
    }
    console.log(
      `There are ${characters.length} characters in world number ${worldNumber}`
    );
    const filteredCharacters = characters.filter(
      x => x.cloudinaryLinks.length !== 4
    );
    await pMap(
      filteredCharacters,
      async character => {
        await uploadImagesForCharacter(character);
      },
      { concurrency: 20 } // Only 20 characters will be processed at a time
    );
    console.log(
      `All the images for world ${worldNumber} were added to the DB. They are ${
        4 * filteredCharacters.length
      }`
    );
  } catch (error) {
    console.log('The error in the image uploader is: ', error);
  }
}

export { imageUploader };
