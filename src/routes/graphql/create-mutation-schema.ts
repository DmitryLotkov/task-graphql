import { GraphQLObjectType, GraphQLNonNull } from 'graphql/index.js';
import { PostType, UserType, ProfileType } from './types/query-types.js';
import {
  CreatePostInputType,
  CreateUserInputType,
  CreateProfileInputType,
  Context,
  PostBody, UserBody, ProfileBody,
} from './types/mutation-types.js';

export const createMutationSchema:() => GraphQLObjectType<Record<string, never>, Context> = () => {
  return new GraphQLObjectType<Record<string, never>, Context>({
    name: 'Mutation',
    fields: {
      createPost:{
          type: PostType,
          args: {
            dto: { type: new GraphQLNonNull(CreatePostInputType)}
          },
        resolve: async (_src, args: { dto: PostBody}, context: Context) => {
            return context.prisma.post.create({ data: {
              title: args.dto.title,
              content: args.dto.content,
              authorId: args.dto.authorId
            }
          }
        )
        }
      },
      createUser: {
        type: UserType,
        args: {
          dto: {
            type: new GraphQLNonNull(CreateUserInputType)
          }
        },
        resolve: async(_src, args: { dto: UserBody}, context: Context) =>{
          return context.prisma.user.create({ data: {
                name: args.dto.name,
                balance: args.dto.balance
             }
           }
          )
        }
      },
      createProfile: {
        type: ProfileType,
        args: {
          dto: { type: new GraphQLNonNull(CreateProfileInputType) }
        },
        resolve: async(_src, args: { dto: ProfileBody}, context: Context) => {
          return context.prisma.profile.create({ data: {
            isMale: args.dto.isMale,
              yearOfBirth: args.dto.yearOfBirth,
              userId: args.dto.userId,
              memberTypeId: args.dto.memberTypeId
            }
          })
        }
      }
    }
  })
}