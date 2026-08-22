import React from 'react';
import { getCommunityPosts } from '@/app/actions/community';
import CommunityFeed from '@/components/community/CommunityFeed';

export const metadata = {
  title: 'Community | GlobeTrotter',
  description: 'Share your experiences and discover what others are doing.',
};

export default async function CommunityPage() {
  // Fetch initial posts on the server
  const result = await getCommunityPosts({ sortBy: 'recent' });
  const initialPosts = result.success && result.posts ? result.posts : [];

  return (
    <main className="min-h-screen bg-[#F7F9FA] py-10 px-4 sm:px-6 lg:px-8">
      <CommunityFeed initialPosts={initialPosts} />
    </main>
  );
}
