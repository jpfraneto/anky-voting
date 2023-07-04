import express from 'express';
import { backupCreator } from './lib/backuper.js';
import { imageUploader } from './lib/uploadToCloudinary.js';
import { prisma } from './lib/prismaClient.js';
import routes from './routes.js';

const app = express();
const port = 3000;

app.use(express.json());
app.use(routes);
app.set('view engine', 'ejs');
app.use(express.static('public'));

// backupCreator();
// imageUploader(8);

app.get('/', async (req, res) => {
  const characters = await prisma.character.findMany({
    where: { voted: 0 },
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
