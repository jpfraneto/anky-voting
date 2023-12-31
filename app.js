import('dotenv').then(dotenv => dotenv.config());

import express from 'express';
import { backupCreator } from './lib/backuper.js';
import { imageUploader } from './lib/uploadToCloudinary.js';
import { processVotedCharacters } from './lib/processVotedCharacters.js';
import { prisma } from './lib/prismaClient.js';
import routes from './routes.js';

const app = express();
const port = 3001;

app.use(express.json());
app.use(routes);
app.set('view engine', 'ejs');
app.use(express.static('public'));

// backupCreator();
// imageUploader(6);
// main();
// processVotedCharacters();

async function main() {
  console.log('inside the main function');
  const characters = await prisma.character.findMany({
    where: { world: 6 },
  });
  console.log(`There are ${characters.length} characters in the 6 world.`);
  const notVotedCharacters = characters.filter(x => x.voted === 0);
  console.log(
    `Out of these, ${notVotedCharacters.length} have not been voted.`
  );
}

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

app.get('/', async (req, res) => {
  let characters = await prisma.character.findMany({
    where: { world: 6, voted: 0 },
    include: { images: true },
    take: 10,
  });
  if (characters && characters.length) {
    res.render('index', { characters });
  } else {
    res.send('Gracias por tu ayuda');
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
