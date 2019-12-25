import dotenv from 'dotenv';
import splitSeparatedFields from './utils/helpers';
import { connectToDB, disconnectFromDB } from './services/mongo';
import communeModel from './models/commune';
import neigborhoodModel from './models/neigborhood';
import propertyModel from './models/property';

dotenv.config();

(async (): Promise<void> => {
  const communesInput = splitSeparatedFields(process.env.COMMUNES);
  const fromPriceCLP = splitSeparatedFields(process.env.FROM_PRICE_CLP);
  const toPriceCLP = splitSeparatedFields(process.env.TO_PRICE_CLP);

  if (!communesInput.length) return;

  await connectToDB();

  const communes = await communeModel.find({ name: { $in: communesInput } }).populate('neigborhoods');

  const findedProperties = await Promise.all(communes.map(async (commune) => {
    const { neigborhoods } = commune.toObject();

    const neigborhoodProperties = await Promise.all(neigborhoods.map(async (neigborhood) => {
      const propertiesIds = neigborhood.properties;

      const properties = propertyModel
        .find()
        .and([
          { _id: { $in: propertiesIds } },
          { price: { $gt: Number(fromPriceCLP), $lt: Number(toPriceCLP) } }
        ]).exec();

      return properties;
    }));

    return neigborhoodProperties;
  }));

  findedProperties.forEach(property => {
    console.log(property);
  })

  await disconnectFromDB();
})();
