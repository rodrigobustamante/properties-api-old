import { gql } from 'apollo-server';
import communeSchema from './commune';
import propertySchema from './property';

const linkSchema = gql`
  type Query {
    getCommunes(
      names: [String]
      page: Int
      pageLimit: Int
    ) : [Commune]

    getProperties(
      communesIds: [String],
      portals: [String],
      page: Int,
      pageLimit: Int,
      rooms: Int,
      bathrooms: Int,
      fromSize: Float,
      toSize: Float,
      fromPrice: Float,
      toPrice: Float,
      orderBy: String
    ): [Property]
  }

  type Mutation {
    _: Boolean
  }

  type Subscription {
    _: Boolean
  }
`;

export default [linkSchema, communeSchema, propertySchema];
