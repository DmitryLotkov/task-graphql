import DataLoader from 'dataloader';
import { PrismaClient, Post, Profile, MemberType, User } from '@prisma/client';
import { MemberTypeId } from '../member-types/schemas.js';

export function createLoaders(prisma: PrismaClient) {
  const memberTypesById = new DataLoader<MemberTypeId, MemberType | null>(async (ids) => {
    const types = await prisma.memberType.findMany({ where: { id: { in: [...ids] } } });
    return ids.map((id) => types.find((t) => t.id === String(id)) ?? null);
  })

  const userProfile = new DataLoader<string, (Profile & { memberType: MemberType }) | null>(async (userIds) => {
    const profiles = await prisma.profile.findMany({
      where: { userId: { in: [...userIds] } },
      include: { memberType: true },
    })

    return await Promise.all(userIds.map(async (id) => {
      const profile = profiles.find((p) => p.userId === id) ?? null;
      if (profile) await memberTypesById.load(<MemberTypeId>profile.memberType.id);
      return profile;
    }))
  })

  const userPosts = new DataLoader<string, Post[]>(async (userIds) => {
    const posts = await prisma.post.findMany({
      where: { authorId: { in: [...userIds] } },
    })

    return userIds.map((id) => posts.filter((p) => p.authorId === id));
  })


  const subsLoader = new DataLoader<
    { id: string; mode: 'subscribedTo' | 'subscribedBy' },
    User[]
  >(async (requests) => {
    const subscriberIds = requests.filter(r => r.mode === 'subscribedTo').map(r => r.id);
    const authorIds = requests.filter(r => r.mode === 'subscribedBy').map(r => r.id);

    const subs = await prisma.subscribersOnAuthors.findMany({
      where: {
        OR: [
          { subscriberId: { in: subscriberIds } },
          { authorId: { in: authorIds } },
        ],
      },
    })

    const userIds = [
      ...subs.map(s => s.subscriberId),
      ...subs.map(s => s.authorId)
    ];
    const users = await prisma.user.findMany({
      where: { id: { in: userIds } },
    })

    return requests.map(({ id, mode }) => {
      const relevantSubs = subs.filter(s =>
        mode === 'subscribedTo' ? s.subscriberId === id : s.authorId === id
      );

      return relevantSubs
        .map(s => {
          const targetId = mode === 'subscribedTo' ? s.authorId : s.subscriberId;
          return users.find(u => u.id === targetId) ?? null;
        })
        .filter((u): u is User => u !== null);
    })
  })

  const userSubscribedTo = new DataLoader<string, User[]>(async (ids) => {
    return subsLoader.loadMany(ids.map(id => ({ id, mode: 'subscribedTo' })));
  })

  const subscribedToUser = new DataLoader<string, User[]>(async (ids) => {
    return subsLoader.loadMany(ids.map(id => ({ id, mode: 'subscribedBy' })));
  })

  return {
    userPosts,
    userProfile,
    userSubscribedTo,
    subscribedToUser,
    memberTypesById,
  }
}
