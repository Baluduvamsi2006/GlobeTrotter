'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export type GetCommunityPostsParams = {
  search?: string;
  sortBy?: 'recent' | 'popular';
};

export async function getCommunityPosts(params?: GetCommunityPostsParams) {
  try {
    const { search, sortBy = 'recent' } = params || {};

    let orderBy: any = { createdAt: 'desc' };
    if (sortBy === 'popular') {
      orderBy = { likeCount: 'desc' };
    }

    let where: any = {};
    if (search) {
      where = {
        OR: [
          { title: { contains: search, mode: 'insensitive' } },
          { body: { contains: search, mode: 'insensitive' } },
        ],
      };
    }

    const posts = await prisma.communityPost.findMany({
      where,
      orderBy,
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            username: true,
            profilePhotoUrl: true,
          },
        },
        _count: {
          select: { comments: true, likes: true },
        },
      },
    });

    return { success: true, posts };
  } catch (error: any) {
    console.error('Error fetching community posts:', error);
    return { success: false, error: 'Failed to fetch community posts' };
  }
}

export async function createCommunityPost(data: { title: string; body: string; userId?: string }) {
  try {
    let finalUserId = data.userId;
    
    // Fallback: If no valid userId is provided, grab the first user in the DB for prototyping.
    if (!finalUserId || finalUserId === '00000000-0000-0000-0000-000000000000') {
      const fallbackUser = await prisma.user.findFirst();
      if (!fallbackUser) {
        return { success: false, error: 'No users exist in the database to assign this post to.' };
      }
      finalUserId = fallbackUser.id;
    }

    const post = await prisma.communityPost.create({
      data: {
        title: data.title,
        body: data.body,
        userId: finalUserId,
      },
    });
    revalidatePath('/community');
    return { success: true, post };
  } catch (error: any) {
    console.error('Error creating post:', error);
    return { success: false, error: 'Failed to create post' };
  }
}
