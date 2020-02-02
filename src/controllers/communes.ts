import communeModel from '../models/commune';
import { connectToDB, disconnectFromDB } from '../services/mongo';

const getCommunes = async (options): Promise<any> => {
  const { names, page = 1, pageLimit = 24 } = options;

  const filters = [{}];
  const parsedPage = Number(page) || 1;
  let parsedPageLimit = Number(pageLimit) || 24;

  if (names) {
    const namesArray = names;

    filters.push({ name: { $in: namesArray } });
  }

  if (parsedPageLimit > 50) {
    parsedPageLimit = 50;
  }

  try {
    await connectToDB();

    const communes = await communeModel
      .find()
      .and(filters)
      .skip(parsedPageLimit * (parsedPage - 1))
      .limit(parsedPageLimit)
      .select({ name: 1 })
      .exec();

    await disconnectFromDB();

    return communes;
  } catch (error) {
    throw new Error(error.message);
  }
};

export default getCommunes;
