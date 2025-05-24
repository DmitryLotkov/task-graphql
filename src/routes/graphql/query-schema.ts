import { GraphQLSchema, GraphQLObjectType, GraphQLList, GraphQLNonNull, GraphQLString } from 'graphql/index.js';
import { MemberType, PostType, UserType, ProfileType, GraphQLMemberTypeId } from './types/query-types.js';
import { PrismaClient, Prisma } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library.js';
import { MemberTypeId } from '../member-types/schemas.js';
import { UUIDType } from './types/uuid.js';

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
        memberType: {
          type: MemberType,
          args: {
            memberTypeId: { type: new GraphQLNonNull(GraphQLMemberTypeId) }
          },
          resolve: async (_src, args: { memberTypeId: MemberTypeId }) => {
            return prisma.memberType.findUnique({
              where: {
                id: args.memberTypeId
              }
            })
          }
        },
        posts: {
          type: new GraphQLList(PostType),
          resolve: async () => {
            return prisma.post.findMany();
          },
        },
        post: {
          type: PostType,
          args: {
            postId: { type: new GraphQLNonNull(UUIDType)}
          },
          resolve: async (_src, args: { postId: string }) => {
              return prisma.post.findUnique({
                where: {
                  id : args.postId
                }
              })
          }
        },
        users: {
          type: new GraphQLList(UserType),
          resolve: async () => {
            return prisma.user.findMany();
          },
        },
        user: {
          type: UserType,
          args: {
            userId: { type: new GraphQLNonNull(UUIDType) },
          },
          resolve: async (_src, args: { userId: string }) => {
            return prisma.user.findUnique({
              where: { id: args.userId },
            });
          },
        },
        profiles: {
          type: new GraphQLList(ProfileType),
          resolve: async () => {
            return prisma.profile.findMany();
          },
        },
        profile: {
          type: ProfileType,
          args: {
            profileId: { type: new GraphQLNonNull(UUIDType) },
          },
          resolve: async (_src, args: { profileId: string }) => {
            return prisma.profile.findUnique({
              where: { id: args.profileId },
            });
          },
        },
      }
    })
  });
}