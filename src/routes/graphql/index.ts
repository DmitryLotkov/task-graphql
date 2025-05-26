import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { createGqlResponseSchema, gqlResponseSchema } from './schemas.js';
import {
  graphql,
} from 'graphql';
import { createScheme } from './root-schema.js';
import depthLimit from 'graphql-depth-limit';
import { parse, validate } from 'graphql';
import type { DocumentNode } from 'graphql/language/ast.js';
import { createLoaders } from './create-loaders.js';

const plugin: FastifyPluginAsyncTypebox = async (fastify) => {
  const { prisma } = fastify;

  fastify.route({
    url: '/',
    method: 'POST',
    schema: {
      ...createGqlResponseSchema,
      response: {
        200: gqlResponseSchema,
      },
    },
    async handler(req, reply) {
      if (!req.body || !req.body.query) {
        void reply.code(400).send({
          errors: [{ message: 'Missing query' }],
        });
        return;
      }
      const scheme = createScheme()

      try {
        const queryString = String(req.body.query);
        const documentAST: DocumentNode = parse(queryString);

        const validationErrors = validate(scheme, documentAST, [depthLimit(5)])

        if (validationErrors.length > 0) {
          return reply.status(400).send({ errors: validationErrors });
        }

        const loaders = createLoaders(prisma);

        return await graphql({
          schema: scheme,
          source: req.body.query,
          variableValues: req.body.variables,
          contextValue: {
            prisma,
            loaders,
          },
        });
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Unknown error';
        return reply.status(400).send({ errors: [{ message }] });
      }
    },
  });
};

export default plugin;
