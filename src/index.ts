import dotenv from 'dotenv';
import splitSeparatedFields from './utils/helpers';
import { connectToDB, disconnectFromDB } from './services/mongo';
import communeModel from './models/commune';
import propertyModel from './models/property';
import sendMessage from './utils/telegraf';

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

  const flattedProperties: any[] = [].concat.apply([], ...findedProperties);

  const sortedProperties = flattedProperties.sort((a, b) => Number(a.price) - Number(b.price));

  const formattedPropertiesText = sortedProperties.map(property => {
    return `Valor de la propiedad: $${property.price}\nTamaño: ${property.size}㎡\nDormitorios: ${property.rooms}\nBaños: ${property.bathrooms}\nDescripción: ${property.description}\nLink para más información: ${property.link}\n\n`;
  });

  const telegramMessage = `Se han encontrado ${sortedProperties.length} con los siguientes parámetros de búsqueda: \n\nValores entre $${fromPriceCLP} y $${toPriceCLP} \n\n${formattedPropertiesText.map((text:string) => text)}`;

  await disconnectFromDB();
  await sendMessage(telegramMessage);
})();
