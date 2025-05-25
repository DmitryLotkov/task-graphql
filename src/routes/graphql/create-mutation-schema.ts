import {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLString,
  GraphQLError,
} from 'graphql/index.js';
import { PostType, UserType, ProfileType } from './types/query-types.js';
import {
  CreatePostInputType,
  CreateUserInputType,
  CreateProfileInputType,
  Context,
  PostBody,
  UserBody,
  ProfileBody,
  ChangePostInputType,
  ChangePostBody, ChangeProfileInputType, ChangeProfileBody, ChangeUserInputType, ChangeUserBody,
} from './types/mutation-types.js';
import { UUIDType } from './types/uuid.js';

export const createMutationSchema: () => GraphQLObjectType<
  Record<string, never>,
  Context
> = () => {
  return new GraphQLObjectType<Record<string, never>, Context>({
    name: 'Mutation',
    fields: {
      createPost: {
        type: PostType,
        args: {
          dto: { type: new GraphQLNonNull(CreatePostInputType) },
        },
        resolve: async (_src, args: { dto: PostBody }, context: Context) => {
          return context.prisma.post.create({
            data: {
              title: args.dto.title,
              content: args.dto.content,
              authorId: args.dto.authorId,
            },
          });
        },
      },
      createUser: {
        type: UserType,
        args: {
          dto: {
            type: new GraphQLNonNull(CreateUserInputType),
          },
        },
        resolve: async (_src, args: { dto: UserBody }, context: Context) => {
          return context.prisma.user.create({
            data: {
              name: args.dto.name,
              balance: args.dto.balance,
            },
          });
        },
      },
      createProfile: {
        type: ProfileType,
        args: {
          dto: { type: new GraphQLNonNull(CreateProfileInputType) },
        },
        resolve: async (_src, args: { dto: ProfileBody }, context: Context) => {
          return context.prisma.profile.create({
            data: {
              isMale: args.dto.isMale,
              yearOfBirth: args.dto.yearOfBirth,
              userId: args.dto.userId,
              memberTypeId: args.dto.memberTypeId,
            },
          });
        },
      },
      deletePost: {
        type: new GraphQLNonNull(GraphQLString),
        args: {
          id: { type: new GraphQLNonNull(UUIDType) },
        },
        resolve: async (_src, args: { id: string }, context: Context) => {
          const isExisting = await context.prisma.post.findUnique({
            where: { id: args.id },
          });

          if (!isExisting) {
            throw new GraphQLError(`Post with id ${args.id} not found`);
          }

          await context.prisma.post.delete({
            where: { id: args.id },
          });

          return `Post ${args.id} deleted`;
        },
      },
      deleteProfile: {
        type: new GraphQLNonNull(GraphQLString),
        args: {
          id: { type: new GraphQLNonNull(UUIDType) },
        },
        resolve: async (_src, args: { id: string }, context: Context) => {
          const isExisting = await context.prisma.profile.findUnique({
            where: { id: args.id },
          });

          if (!isExisting) {
            throw new GraphQLError(`Profile with id ${args.id} not found`);
          }

          await context.prisma.profile.delete({
            where: { id: args.id },
          });

          return `Profile ${args.id} deleted`;
        },
      },
      deleteUser: {
        type: new GraphQLNonNull(GraphQLString),
        args: {
          id: { type: new GraphQLNonNull(UUIDType) },
        },
        resolve: async (_src, args: { id: string }, context: Context) => {
          const isExisting = await context.prisma.user.findUnique({
            where: { id: args.id },
          });

          if (!isExisting) {
            throw new GraphQLError(`User with id ${args.id} not found`);
          }

          await context.prisma.user.delete({
            where: { id: args.id },
          });

          return `User ${args.id} deleted`;
        },
      },
      changePost: {
        type: PostType,
        args: {
          id: { type: new GraphQLNonNull(UUIDType) },
          dto: { type: new GraphQLNonNull(ChangePostInputType) },
        },
        resolve: async (
          _src,
          args: { id: string; dto: ChangePostBody },
          context: Context,
        ) => {
          const isExisting = await context.prisma.post.findUnique({
            where: { id: args.id },
          });

          if (!isExisting) {
            throw new GraphQLError(`Post with id ${args.id} not found`);
          }

          return context.prisma.post.update({
            where: { id: args.id },
            data: {
              title: args.dto.title,
              ...(args.dto.content !== undefined && { content: args.dto.content }),
            },
          });
        },
      },
      changeProfile: {
        type: ProfileType,
        args: {
          id: { type: new GraphQLNonNull(UUIDType) },
          dto: { type: new GraphQLNonNull(ChangeProfileInputType)}
        },
        resolve: async (_src, args: { id:string, dto: ChangeProfileBody}, context: Context) => {
          const isExisting = await context.prisma.profile.findUnique({
            where: { id: args.id }
          })

          if (!isExisting) {
            throw new GraphQLError(`Profile with id ${args.id} not found`);
          }

          return context.prisma.profile.update({
            where: { id: args.id },
            data: {
              isMale: args.dto.isMale,
              yearOfBirth: args.dto.yearOfBirth,
              memberTypeId: args.dto.memberTypeId
            }
          })
        }
      },
      changeUser: {
        type: UserType,
        args: {
          id: { type: new GraphQLNonNull(UUIDType) },
          dto: { type: new GraphQLNonNull(ChangeUserInputType)}
        },
        resolve: async (_src, args: { id:string, dto: ChangeUserBody}, context: Context) => {
          const isExisting = await context.prisma.user.findUnique({
            where: { id: args.id }
          })

          if (!isExisting) {
            throw new GraphQLError(`User with id ${args.id} not found`);
          }

          return context.prisma.user.update({
            where: { id: args.id },
            data: {
              name: args.dto.name,
              balance: args.dto.balance
            }
          })
        }
      },

    },
  });
};

