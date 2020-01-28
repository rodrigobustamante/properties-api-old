import getProperties from '../controllers/properties';

const resolvers = {
  Query: {
    getProperties: (parent, options = {}): any => getProperties(options),
  }
}

export default resolvers;
