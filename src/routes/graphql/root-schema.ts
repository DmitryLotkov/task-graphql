import { GraphQLSchema } from 'graphql/index.js';
import { createQuerySchema } from './create-query-schema.js';



export const createScheme = ()  => {
  return new GraphQLSchema({
    query: createQuerySchema(),
  });
}