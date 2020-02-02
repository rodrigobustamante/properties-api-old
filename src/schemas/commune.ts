import { gql } from 'apollo-server';

const schema = gql`
  type Commune {
    _id: String
    name: String
  }
`;

export default schema;
