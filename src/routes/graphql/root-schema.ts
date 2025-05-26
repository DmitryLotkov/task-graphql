import { GraphQLSchema } from 'graphql/index.js';
import { createQuerySchema } from './create-query-schema.js';
import { createMutationSchema } from './create-mutation-schema.js';



export const createScheme = ()  => {
  return new GraphQLSchema({
    query: createQuerySchema(),
    mutation: createMutationSchema()
  });
}