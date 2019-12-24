import dotenv from 'dotenv';
import { connectToDB, disconnectFromDB } from './services/mongo';

dotenv.config();

(async (): Promise<void> => {
  await connectToDB();



  await disconnectFromDB();
})();
