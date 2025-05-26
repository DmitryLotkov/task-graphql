import { GraphQLObjectType, GraphQLList, GraphQLNonNull } from 'graphql/index.js';
import { MemberType, GraphQLMemberTypeId, PostType, UserType, ProfileType } from './types/query-types.js';
import { MemberTypeId } from '../member-types/schemas.js';
import { UUIDType } from './types/uuid.js';
import { Context } from './types/context-type.js';

export const createQuerySchema: () => GraphQLObjectType<Record<string, never>, Context> = () => {
  return new GraphQLObjectType({
    name: "RootQuery",
    fields: {
      memberTypes: {
        type: new GraphQLList(MemberType),
        resolve: async (_src, _args, context: Context) => {
          return context.prisma.memberType.findMany();
        },
      },
      memberType: {
        type: MemberType,
        args: {
          id: { type: new GraphQLNonNull(GraphQLMemberTypeId) }
        },
        resolve: async (_src, args: { id: MemberTypeId }, context: Context) => {
          return context.prisma.memberType.findUnique({
            where: {
              id: args.id
            }
          }) ?? null;
        }
      },
      posts: {
        type: new GraphQLList(PostType),
        resolve: async (_src, _args, context: Context) => {
          return context.prisma.post.findMany();
        },
      },
      post: {
        type: PostType,
        args: {
          id: { type: new GraphQLNonNull(UUIDType) }
        },
        resolve: async (_src, args: { id: string }, context: Context) => {
          return (
            await context.prisma.post.findUnique({
              where: { id: args.id }
            })
          ) ?? null;
        }
      },
      users: {
        type: new GraphQLList(UserType),
        resolve: async (_src, _args, context: Context) => {
          return context.prisma.user.findMany();
        },
      },
      user: {
        type: UserType,
        args: {
          id: { type: new GraphQLNonNull(UUIDType) },
        },
        resolve: async (_src, args: { id: string }, context: Context) => {
          return context.prisma.user.findUnique({
            where: { id: args.id },
          }) ?? null;
        }
      },
      profiles: {
        type: new GraphQLList(ProfileType),
        resolve: async (_src, _args, context: Context) => {
          return context.prisma.profile.findMany();
        },
      },
      profile: {
        type: ProfileType,
        args: {
          id: { type: new GraphQLNonNull(UUIDType) },
        },
        resolve: async (_src, args: { id: string }, context: Context) => {
          return (
            await context.prisma.profile.findUnique({
              where: { id: args.id },
            })
          ) ?? null;
        },
      },
    }
  })
}
