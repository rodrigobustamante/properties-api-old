import dotenv from 'dotenv';
import express from 'express';
import { ApolloServer, gql } from 'apollo-server';
import communes from './routes/communes';
import properties from './routes/properties';
import propertiesSchema from './schemas/property';
import propertiesResolver from './resolvers/property';

const server = new ApolloServer({ typeDefs: propertiesSchema, resolvers: propertiesResolver });

// The `listen` method launches a web server.
server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});

dotenv.config();

// const { PORT } = process.env;
// const app = express();

// (async (): Promise<void> => {
//   app.use(express.json());

//   app.use('/communes', communes);
//   app.use('/properties', properties);

//   app.listen(PORT, () => console.log(`Listen port ${PORT}!`))
// })();
