import dotenv from 'dotenv';
import express from 'express';
import communes from './routes/communes';
// import { flattenDeep } from 'lodash';
// import splitSeparatedFields from './utils/helpers';
// import { connectToDB, disconnectFromDB } from './services/mongo';
// import communeModel from './models/commune';
// import propertyModel from './models/property';
// import sendMessage from './utils/telegraf';

dotenv.config();

const { PORT } = process.env;
const app = express();

(async (): Promise<void> => {
  app.use('/communes', communes);

  app.listen(PORT, () => console.log(`Listen port ${PORT}!`))
})();
