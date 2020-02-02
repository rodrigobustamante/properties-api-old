import getCommunes from '../controllers/communes';

const resolvers = {
  Query: {
    getCommunes: (parent, options = {}): any => getCommunes(options),
  }
}

export default resolvers;
