'use client';

import React, { useState, useEffect, useTransition } from 'react';
import { Search, Filter, Layers, ArrowDownUp, Plus } from 'lucide-react';
import { getCommunityPosts, GetCommunityPostsParams } from '@/app/actions/community';
import CommunityPostCard from './CommunityPostCard';
import CreatePostModal from './CreatePostModal';

interface CommunityFeedProps {
  initialPosts: any[];
}

export default function CommunityFeed({ initialPosts }: CommunityFeedProps) {
  const [posts, setPosts] = useState(initialPosts);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'recent' | 'popular'>('recent');
  const [isPending, startTransition] = useTransition();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchPosts = () => {
    startTransition(async () => {
      const result = await getCommunityPosts({ search, sortBy });
      if (result.success && result.posts) {
        setPosts(result.posts);
      }
    });
  };

  // We debounce the search to avoid spamming the server
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchPosts();
    }, 300); // 300ms debounce

    return () => clearTimeout(timer);
  }, [search, sortBy]);

  const handlePostCreated = () => {
    setIsModalOpen(false);
    fetchPosts(); // Refresh the list
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-6">
      {/* Top Header / Controls */}
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Community tab</h1>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-light transition-colors"
          >
            <Plus size={20} />
            New Post
          </button>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search Bar */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search for..."
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Filters Row */}
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
              <Layers size={16} />
              Group by
            </button>
            <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
              <Filter size={16} />
              Filter
            </button>
            
            <div className="relative">
              <select
                className="appearance-none flex items-center gap-2 pl-9 pr-8 py-2.5 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'recent' | 'popular')}
              >
                <option value="recent">Recent</option>
                <option value="popular">Popular</option>
              </select>
              <ArrowDownUp size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* Feed List */}
      <div className="flex flex-col gap-4 relative min-h-[200px]">
        {isPending && (
          <div className="absolute inset-0 bg-white/50 z-10 flex justify-center pt-8">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
        
        {posts.length > 0 ? (
          posts.map((post) => (
            <CommunityPostCard key={post.id} post={post} />
          ))
        ) : (
          <div className="py-12 text-center text-gray-500">
            <p>No community posts found matching your criteria.</p>
          </div>
        )}
      </div>

      {isModalOpen && (
        <CreatePostModal 
          onClose={() => setIsModalOpen(false)} 
          onSuccess={handlePostCreated} 
        />
      )}
    </div>
  );
}
