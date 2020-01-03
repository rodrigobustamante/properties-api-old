import communeModel from '../models/commune';
import { connectToDB, disconnectFromDB } from '../services/mongo';
import splitSeparatedFields from '../utils/helpers';

const getByCommune = async (req, res): Promise<any> => {
  // Is necesary pass the portals parameters?
  // We need to remove the duplicated values?
  // Expose another endpoint to expose the portals?
  // Or show to the user the name of the commune plus the portal, e.g: Providencia - TocToc
  const { names, portals, page, pageLimit } = req.query;

  const filters = [{}];
  const parsedPage = Number(page) || 1;
  const parsedPageLimit = Number(pageLimit) || 24;


};

export default getByCommune;
