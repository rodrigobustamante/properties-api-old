import { gql } from 'apollo-server';

const schema = gql`
  type Property {
    bathrooms: Int
    price: Float
    size: Float
    rooms: Int
    description: String
    link: String
    portal: String
  }

  type Query {
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
`;

export default schema;
