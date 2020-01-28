import { flattenDeep } from 'lodash';
import communeModel from '../models/commune';
import propertyModel from '../models/property';
import { connectToDB, disconnectFromDB } from '../services/mongo';

const getProperties = async (options): Promise<any> => {
  console.log({options});

  const {
    communesIds,
    portals,
    page,
    pageLimit,
    rooms,
    bathrooms,
    fromSize,
    toSize,
    fromPrice,
    toPrice,
    orderBy = 'price',
  } = options;

  const communeFilters = [{}];
  const parsedPage = Number(page) || 1;
  const parsedPageLimit = Number(pageLimit) || 24;
  const hasPriceFilter = (Number(fromPrice) || 0) && (Number(toPrice) || 0);
  const hasSizeFilter = (Number(fromSize) || 0) && (Number(toSize) || 0);

  if (communesIds && communesIds.length) communeFilters.push({ _id: { $in: communesIds } });

  try {
    await connectToDB();

    const communes = await communeModel
      .find()
      .and(communeFilters)
      .exec();

    const findedPropertiesIds = await Promise.all(
      communes.map(async (commune) => {
        const { properties: propertiesIds } = commune.toObject();

        return propertiesIds;
      }),
    );

    try {
      const extraFilters = [];

      if (hasPriceFilter)
        extraFilters.push({ price: { $gt: Number(fromPrice), $lt: Number(toPrice) } });

      if (hasSizeFilter)
        extraFilters.push({ size: { $gt: Number(fromSize), $lt: Number(toSize) } });

      if (rooms) extraFilters.push({ rooms });

      if (bathrooms) extraFilters.push({ bathrooms });

      if (portals && portals.length) extraFilters.push({ portal: { $in: portals } });

      const flattedPropertiesIds = flattenDeep(findedPropertiesIds);

      const properties = await propertyModel
        .find()
        .and([{ _id: { $in: flattedPropertiesIds } }, ...extraFilters])
        .skip(parsedPageLimit * (parsedPage - 1))
        .limit(parsedPageLimit)
        .sort(orderBy)
        .exec();

      await disconnectFromDB();

      return properties;
    } catch (error) {
      throw new Error(error.message);
    }
  } catch (error) {
    throw new Error(error.message);
  }
}

export default getProperties;
