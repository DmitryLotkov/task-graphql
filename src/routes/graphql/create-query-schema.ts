import { GraphQLObjectType, GraphQLList, GraphQLNonNull } from 'graphql/index.js';
import { MemberType, GraphQLMemberTypeId, PostType, UserType, ProfileType } from './types/query-types.js';
import { PrismaClient, Prisma } from '@prisma/client';
import { MemberTypeId } from '../member-types/schemas.js';
import { UUIDType } from './types/uuid.js';

const userWithProfileAndPosts = Prisma.validator<Prisma.UserDefaultArgs>()({
  include: {
    profile: {
      include: {
        memberType: true,
      },
    },
    posts: true,
  },
});

type UserWithProfileAndPosts = Prisma.UserGetPayload<typeof userWithProfileAndPosts>;

export const createQuerySchema:() => GraphQLObjectType<Record<string, never>, {prisma: PrismaClient}> = () => {
  return new GraphQLObjectType({
    name: "RootQuery",
    fields: {
      memberTypes: {
        type: new GraphQLList(MemberType),
        resolve: async (_src, _: { id: string }, context: { prisma: PrismaClient }) => {
          return context.prisma.memberType.findMany();
        },
      },
      memberType: {
        type: MemberType,
        args: {
          id: { type: new GraphQLNonNull(GraphQLMemberTypeId) }
        },
        resolve: async (_src, args: { id: MemberTypeId }, context: { prisma: PrismaClient }) => {
          return context.prisma.memberType.findUnique({
            where: {
              id: args.id
            }
          }) ?? null
        }
      },
      posts: {
        type: new GraphQLList(PostType),
        resolve: async (_src, _, context: { prisma: PrismaClient }) => {
          return context.prisma.post.findMany();
        },
      },
      post: {
        type: PostType,
        args: {
          id: { type: new GraphQLNonNull(UUIDType) }
        },
        resolve: async (_src, args: { id: string }, context: { prisma: PrismaClient }) => {
          return (
            await context.prisma.post.findUnique({
              where: { id: args.id }
            })
          ) ?? null;
        }
      },
      users: {
        type: new GraphQLList(UserType),
        resolve: async (_src, _, context: { prisma: PrismaClient }) => {
          return context.prisma.user.findMany({
            include: {
              profile: {
                include: {
                  memberType: true,
                },
              },
              posts: true,
            },
          });
        },
      },
      user: {
        type: UserType,
        args: {
          id: { type: new GraphQLNonNull(UUIDType) },
        },
        resolve: async (_src, args: { id: string }, context: { prisma: PrismaClient }): Promise<UserWithProfileAndPosts | null> => {
          return context.prisma.user.findUnique({
            where: { id: args.id },
            include: {
              profile: {
                include: {
                  memberType: true,
                }
              },
              posts: true,
            },
          }) ?? null;
        }
      },
      profiles: {
        type: new GraphQLList(ProfileType),
        resolve: async (_src, _, context: { prisma: PrismaClient }) => {
          return context.prisma.profile.findMany();
        },
      },
      profile: {
        type: ProfileType,
        args: {
          id: { type: new GraphQLNonNull(UUIDType) },
        },
        resolve: async (_src, args: { id: string }, context: { prisma: PrismaClient }) => {
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