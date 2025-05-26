import {
  GraphQLEnumType,
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLFloat,
  GraphQLInt,
  GraphQLBoolean,
  GraphQLList,
  GraphQLString,
  GraphQLFieldConfigMap,
} from 'graphql/index.js';
import { UUIDType } from './uuid.js';
import { Prisma } from '@prisma/client';
import { Context } from './context-type.js';
import {User, Profile } from '@prisma/client';
import { MemberTypeId } from '../../member-types/schemas.js';

const userWithEverything = Prisma.validator<Prisma.UserDefaultArgs>()({
  include: {
    profile: {
      include: {
        memberType: true,
      },
    },
    posts: true,
  },
});

export const profileWithMemberType = Prisma.validator<Prisma.ProfileDefaultArgs>()({
  include: { memberType: true },
});

export type ProfileWithMemberType = Prisma.ProfileGetPayload<typeof profileWithMemberType>;
export type UserWithProfileAndPosts = Prisma.UserGetPayload<typeof userWithEverything>;

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
    title: { type: new GraphQLNonNull(GraphQLString) },
    content: { type: new GraphQLNonNull(GraphQLString) },
  },
});

export const ProfileType = new GraphQLObjectType<ProfileWithMemberType, Context>({
  name: 'Profile',
  fields: {
    id: { type: new GraphQLNonNull(UUIDType) },
    isMale: { type: new GraphQLNonNull(GraphQLBoolean) },
    yearOfBirth: { type: new GraphQLNonNull(GraphQLInt) },
    userId: { type: new GraphQLNonNull(UUIDType) },
    memberTypeId: { type: new GraphQLNonNull(GraphQLMemberTypeId) },
    memberType: {
      type: MemberType,
      resolve: (profile: Profile, _args, context:Context) =>
        context.loaders.memberTypesById.load(profile.memberTypeId as MemberTypeId),
    },
  },
});

export const UserType = new GraphQLObjectType<UserWithProfileAndPosts, Context>({
  name: 'User',
  fields: (): GraphQLFieldConfigMap<UserWithProfileAndPosts, Context> => ({
    id: { type: new GraphQLNonNull(UUIDType) },
    name: { type: new GraphQLNonNull(GraphQLString) },
    balance: { type: new GraphQLNonNull(GraphQLFloat) },

    profile: {
      type: ProfileType,
      resolve: (user:User, _args, context:Context) =>
        context.loaders.userProfile.load(user.id),
    },

    posts: {
      type: new GraphQLList(PostType),
      resolve: (user:User, _args, context:Context) =>
        context.loaders.userPosts.load(user.id),
    },

    userSubscribedTo: {
      type: new GraphQLList(UserType),
      resolve: (user:User, _args, context:Context) =>
        context.loaders.userSubscribedTo.load(user.id),
    },

    subscribedToUser: {
      type: new GraphQLList(UserType),
      resolve: (user:User, _args, context:Context) =>
        context.loaders.subscribedToUser.load(user.id),
    },
  }),
});
