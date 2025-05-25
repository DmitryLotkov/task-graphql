import {
  GraphQLNonNull,
  GraphQLString,
  GraphQLInputObjectType,
  GraphQLBoolean, GraphQLInt, GraphQLFloat,
} from 'graphql/index.js';
import { UUIDType } from './uuid.js';
import { GraphQLMemberTypeId } from './query-types.js';
import { MemberTypeId } from '../../member-types/schemas.js';
import { PrismaClient } from '@prisma/client';

export interface PostBody {
  title: string;
  content: string;
  authorId: string
}

export interface UserBody {
  name: string
  balance: number
}

export interface ProfileBody {
  isMale: boolean
  yearOfBirth: number
  userId: string
  memberTypeId: MemberTypeId
}

export interface ChangePostBody {
  title: string
  content: string
}

export interface ChangeProfileBody {
  isMale: boolean
  yearOfBirth: number
  memberTypeId: MemberTypeId
}

export interface ChangeUserBody {
  name: string
  balance: number
}

export type Context = { prisma: PrismaClient }

export const CreatePostInputType = new GraphQLInputObjectType ({
  name: 'CreatePostInput',
  fields: {
    title: { type: new GraphQLNonNull(GraphQLString) },
    content: { type: new GraphQLNonNull(GraphQLString) },
    authorId: { type: new GraphQLNonNull(UUIDType) }
  },
})

export const CreateUserInputType = new GraphQLInputObjectType({
  name: 'CreateUserInput',
  fields: {
    name: { type: new GraphQLNonNull(GraphQLString) },
    balance: { type: new GraphQLNonNull(GraphQLFloat) }
  }
})

export const CreateProfileInputType = new GraphQLInputObjectType({
  name: 'CreateProfileInput',
  fields: {
    isMale: { type: new GraphQLNonNull (GraphQLBoolean)},
    yearOfBirth: { type: new GraphQLNonNull (GraphQLInt)},
    userId: { type: new GraphQLNonNull(UUIDType) },
    memberTypeId: { type: new GraphQLNonNull(GraphQLMemberTypeId)}
  }
})

export const ChangePostInputType = new GraphQLInputObjectType({
  name: 'ChangePostInput',
  fields: {
    title: { type: GraphQLString },
    content: { type: GraphQLString }
  }
})

export const ChangeProfileInputType = new GraphQLInputObjectType({
  name: 'ChangeProfileInput',
  fields: {
    isMale: { type: GraphQLBoolean },
    yearOfBirth: { type: GraphQLInt },
    memberTypeId: { type: GraphQLMemberTypeId },
    userId: { type: UUIDType },
  }
})

export const ChangeUserInputType = new GraphQLInputObjectType({
  name: 'ChangeUserInput',
  fields: {
    name: { type: GraphQLString },
    balance: { type: GraphQLFloat }
  }
})
