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
`;

export default schema;
