import {
  GraphQLEnumType,
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLFloat,
  GraphQLInt,
  GraphQLBoolean, GraphQLList, GraphQLString,
} from 'graphql/index.js';
import { UUIDType } from './uuid.js';
import { PrismaClient, User, Profile } from '@prisma/client';

export const GraphQLMemberTypeId = new GraphQLEnumType({
  name: 'MemberTypeId',
  values: {
    BASIC: { value: 'BASIC' },
    BUSINESS: { value: 'BUSINESS' },
  },
});

export const MemberType = new GraphQLObjectType({
  name: 'MemberType',
  fields: {
    id: { type: new GraphQLNonNull(GraphQLMemberTypeId) },
    discount: { type: new GraphQLNonNull(GraphQLFloat) },
    postsLimitPerMonth: { type: new GraphQLNonNull(GraphQLFloat) },
  },
});

export const PostType = new GraphQLObjectType({
  name: 'Post',
  fields: {
    id: { type: new GraphQLNonNull(UUIDType) },
    title: { type: new GraphQLNonNull(UUIDType) },
    content: { type: new GraphQLNonNull(UUIDType) },
  },
});

export const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: { type: new GraphQLNonNull(UUIDType) },
    name: { type: new GraphQLNonNull(GraphQLString) },
    balance: { type: new GraphQLNonNull(GraphQLFloat) },
    profile: {
      type: ProfileType,
    },
    userSubscribedTo: {
      type: new GraphQLList(UserType),
      resolve: async (user: User, _args, context: { prisma: PrismaClient }): Promise<User[]> => {
        const subs = await context.prisma.subscribersOnAuthors.findMany({
          where: { subscriberId: user.id },
          include: { author: true },
        });
        return subs.map((s) => s.author);
      },
    },
    subscribedToUser: {
      type: new GraphQLList(UserType),
      resolve: async (user: User, _args, context: { prisma: PrismaClient }) => {
        const subs = await context.prisma.subscribersOnAuthors.findMany({
          where: { authorId: user.id },
          include: { subscriber: true },
        });
        return subs.map((s) => s.subscriber);
      },
    },

    posts: {
      type: new GraphQLList(PostType),
      resolve: (user: User, _args, context: { prisma: PrismaClient }) => {
        return context.prisma.post.findMany({ where: { authorId: user.id } });
      },
    },
  }),
});

export const ProfileType = new GraphQLObjectType({
  name: 'Profile',
  fields: {
    id: { type: new GraphQLNonNull(UUIDType) },
    isMale: { type: new GraphQLNonNull(GraphQLBoolean) },
    yearOfBirth: { type: new GraphQLNonNull(GraphQLInt) },
    userId: { type: new GraphQLNonNull(UUIDType)},
    memberTypeId: { type: new GraphQLNonNull(GraphQLMemberTypeId)},
    memberType: {
      type: MemberType,
      resolve: async (profile: Profile, _args, context: { prisma: PrismaClient }) => {
        return context.prisma.memberType.findUnique({
          where: { id: profile.memberTypeId },
        });
      },
    },
  },
});
