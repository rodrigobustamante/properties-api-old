import dotenv from 'dotenv';
import { ApolloServer } from 'apollo-server';
import typeDefs from './schemas';
import resolvers from './resolvers';

dotenv.config();

const server = new ApolloServer({ typeDefs, resolvers });

server.listen({port: process.env.PORT || 4000}).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
