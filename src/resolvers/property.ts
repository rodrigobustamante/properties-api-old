import getProperties from '../controllers/properties';

const resolvers = {
  Query: {
    getProperties: (options = {}): any => getProperties(options),
  }
}

export default resolvers;
