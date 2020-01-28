import { gql } from 'apollo-server';

const schema = gql`
  type Commune {
    name: String
    properties: [Property]
  }
`;

export default schema;
