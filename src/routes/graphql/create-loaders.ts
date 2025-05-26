import DataLoader from 'dataloader';
import { PrismaClient } from '@prisma/client';
import { MemberTypeId } from '../member-types/schemas.js';

export function createLoaders(prisma: PrismaClient) {
  return {
    userPosts: new DataLoader(async (userIds: readonly string[]) => {
      const posts = await prisma.post.findMany({
        where: { authorId: { in: [...userIds] } },
      });

      return userIds.map((id) =>
        posts.filter((post) => post.authorId === id)
      );
    }),

    userProfile: new DataLoader(async (userIds: readonly string[]) => {
      const profiles = await prisma.profile.findMany({
        where: { userId: { in: [...userIds] } },
        include: { memberType: true }
      });

      return userIds.map((id) =>
        profiles.find((profile) => profile.userId === id) || null
      );
    }),

    userSubscribedTo: new DataLoader(async (subscriberIds: readonly string[]) => {
      const subs = await prisma.subscribersOnAuthors.findMany({
        where: { subscriberId: { in: [...subscriberIds] } },
      });

      const users = await prisma.user.findMany({
        where: {
          id: { in: subs.map((s) => s.authorId) },
        },
      });

      return subscriberIds.map((id) =>
        users.filter((u) =>
          subs.find((s) => s.subscriberId === id && s.authorId === u.id)
        )
      );
    }),

    subscribedToUser: new DataLoader(async (authorIds: readonly string[]) => {
      const subs = await prisma.subscribersOnAuthors.findMany({
        where: { authorId: { in: [...authorIds] } },
      });

      const users = await prisma.user.findMany({
        where: {
          id: { in: subs.map((s) => s.subscriberId) },
        },
      });

      return authorIds.map((id) =>
        users.filter((u) =>
          subs.find((s) => s.subscriberId === u.id && s.authorId === id)
        )
      );
    }),

    memberTypesById: new DataLoader(async (ids: readonly MemberTypeId[]) => {
      const types = await prisma.memberType.findMany({
        where: { id: { in: [...ids] } },
      });

      return ids.map((id) => types.find((t) => t.id === String(id)) ?? null);
    }),
  };
}




