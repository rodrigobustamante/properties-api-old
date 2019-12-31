import dotenv from 'dotenv';
import { flattenDeep } from 'lodash';
import splitSeparatedFields from './utils/helpers';
import { connectToDB, disconnectFromDB } from './services/mongo';
import communeModel from './models/commune';
import propertyModel from './models/property';
import sendMessage from './utils/telegraf';

dotenv.config();

(async (): Promise<void> => {
  const communesInput = splitSeparatedFields(process.env.COMMUNES);
  const portals = splitSeparatedFields(process.env.PORTALS);
  const fromPriceCLP = process.env.FROM_PRICE_CLP || 0;
  const toPriceCLP = process.env.TO_PRICE_CLP || 0;
  const fromSize = process.env.FROM_SIZE || 0;
  const toSize = process.env.TO_SIZE || 0;
  const rooms = process.env.ROOMS || 0;
  const bathrooms = process.env.BATHROOMS || 0;

  const hasPriceFilter = fromPriceCLP && toPriceCLP;
  const hasSizeFilter = fromSize && toSize;

  if (!communesInput.length) return;

  await connectToDB();

  const communes = await communeModel
    .find()
    .and([
      { name: { $in: communesInput } },
      { portal: { $in: portals } },
    ]).exec();

  const findedProperties = await Promise.all(communes.map(async (commune) => {
    const { properties: propertiesIds } = commune.toObject();
    const extraFilters = [];

    if (hasPriceFilter)
      extraFilters.push({ price: { $gt: Number(fromPriceCLP), $lt: Number(toPriceCLP) } });

    if (hasSizeFilter)
      extraFilters.push({ size: { $gt: Number(fromSize), $lt: Number(toSize) } });

    if (rooms)
      extraFilters.push({ rooms });

    if (bathrooms)
      extraFilters.push({ bathrooms });

    const properties = propertyModel
      .find()
      .and([
        { _id: { $in: propertiesIds } },
        ...extraFilters,
      ]).exec();

    return properties;
  }));

  const flattedProperties: any[] = flattenDeep(findedProperties);
  const sortedProperties = flattedProperties.sort((a, b) => Number(a.price) - Number(b.price));

  const formattedPropertiesText = sortedProperties.map((property) => {
    return `Valor de la propiedad: $${property.price}\nTamaño: ${property.size}㎡\nDormitorios: ${property.rooms}\nBaños: ${property.bathrooms}\nDescripción: ${property.description}\nLink para más información: ${property.link}\n\n`;
  });

  const filterMessages = [];

  if (hasPriceFilter)
    filterMessages.push(`\n- Valores entre $${fromPriceCLP} y $${toPriceCLP}`);

  if (hasSizeFilter)
    filterMessages.push(`\n- Tamaño entre ${fromSize} y ${toSize} (m²)`);

  if (rooms)
    filterMessages.push(`\n- Cantidad de habitaciones: ${rooms}`);

  if (bathrooms)
    filterMessages.push(`\n- Cantidad de baños: ${bathrooms}`);

  const telegramMessage = `Se han encontrado ${sortedProperties.length} con los siguientes parámetros de búsqueda:${filterMessages.map((message: string) => message)}`;

  await sendMessage(telegramMessage);
  await Promise.all(formattedPropertiesText.map(async (text: string) => {
    await sendMessage(text);
  }));

  await disconnectFromDB();
})();
