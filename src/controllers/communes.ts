import communeModel from '../models/commune';
import { connectToDB, disconnectFromDB } from '../services/mongo';
import splitSeparatedFields from '../utils/helpers';

const get = async (req, res): Promise<any> => {
  // Is necesary pass the portals parameters?
  // We need to remove the duplicated values?
  // Expose another endpoint to expose the portals?
  // Or show to the user the name of the commune plus the portal, e.g: Providencia - TocToc
  const { names, portals, page = 1, pageLimit = 24 } = req.query;

  const filters = [{}];
  const parsedPage = Number(page) || 1;
  let parsedPageLimit = Number(pageLimit) || 24;

  if (names) {
    const namesArray = splitSeparatedFields(names);

    filters.push({ name: { $in: namesArray } });
  }

  if (portals) {
    const portalsArray = splitSeparatedFields(portals);

    filters.push({ portal: { $in: portalsArray } });
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
      .select({ name: 1, portal: 1 })
      .exec();

    await disconnectFromDB();

    res.send(communes).status(200);
  } catch (error) {
    res.send({ message: error.messsage }).status(500);
  }
};

export default get;
