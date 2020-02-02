import { gql } from 'apollo-server';

const schema = gql`
  type Commune {
    name: String
  }
`;

export default schema;
