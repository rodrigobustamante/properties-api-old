import dotenv from 'dotenv';
import { ApolloServer } from 'apollo-server';
import propertiesSchema from './schemas/property';
import propertiesResolver from './resolvers/property';

dotenv.config();

const server = new ApolloServer({ typeDefs: propertiesSchema, resolvers: propertiesResolver, });

server.listen({port: process.env.PORT || 4000}).then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
