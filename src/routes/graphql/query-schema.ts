import { GraphQLSchema, GraphQLObjectType, GraphQLList } from 'graphql/index.js';
import { MemberType, PostType, UserType, ProfileType } from './types/query-types.js';
import { PrismaClient, Prisma } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library.js';

export const createQueryScheme = (prisma: PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>)  => {
  return new GraphQLSchema({
    query: new GraphQLObjectType({
      name: "RootQuery",
      fields: {
        memberTypes: {
          type: new GraphQLList(MemberType),
          resolve: async () => {
            return prisma.memberType.findMany();
          },
        },
        posts: {
          type: new GraphQLList(PostType),
          resolve: async () => {
            return prisma.post.findMany();
          },
        },
        users: {
          type: new GraphQLList(UserType),
          resolve: async () => {
            return prisma.user.findMany();
          },
        },
        profiles: {
          type: new GraphQLList(ProfileType),
          resolve: async () => {
            return prisma.profile.findMany();
          },
        },
      }
    })
  });
}