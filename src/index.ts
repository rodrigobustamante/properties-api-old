import dotenv from 'dotenv';
import express from 'express';
import communes from './routes/communes';
import properties from './routes/properties';

dotenv.config();

const { PORT } = process.env;
const app = express();

(async (): Promise<void> => {
  app.use(express.json());

  app.use('/communes', communes);
  app.use('/properties', properties);

  app.listen(PORT, () => console.log(`Listen port ${PORT}!`))
})();
