import React from 'react';
import Image from 'next/image';
import { MessageSquare, Heart } from 'lucide-react';

interface CommunityPostCardProps {
  post: {
    id: string;
    title: string;
    body: string | null;
    createdAt: Date;
    user: {
      id: string;
      firstName: string;
      lastName: string;
      username: string | null;
      profilePhotoUrl: string | null;
    };
    _count: {
      comments: number;
      likes: number;
    };
  };
}

export default function CommunityPostCard({ post }: CommunityPostCardProps) {
  const authorInitials = `${post.user.firstName[0]}${post.user.lastName[0]}`;
  const displayName = post.user.username || `${post.user.firstName} ${post.user.lastName}`;

  return (
    <div className="flex gap-4 p-4 border border-gray-200 rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow">
      {/* Avatar column */}
      <div className="flex-shrink-0 flex flex-col items-center">
        {post.user.profilePhotoUrl ? (
          <Image
            src={post.user.profilePhotoUrl}
            alt={displayName}
            width={48}
            height={48}
            className="rounded-full object-cover w-12 h-12 border border-gray-200"
          />
        ) : (
          <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold border border-primary/20">
            {authorInitials}
          </div>
        )}
      </div>

      {/* Content column */}
      <div className="flex-1 flex flex-col">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-semibold text-gray-900">{displayName}</span>
          <span className="text-sm text-gray-500">· {new Date(post.createdAt).toLocaleDateString()}</span>
        </div>
        
        <h3 className="text-lg font-bold text-gray-900 mb-2">{post.title}</h3>
        {post.body && (
          <p className="text-gray-700 line-clamp-3 mb-4">{post.body}</p>
        )}
        
        {/* Interaction bar */}
        <div className="flex items-center gap-6 mt-auto text-sm text-gray-500 font-medium">
          <button className="flex items-center gap-1.5 hover:text-primary transition-colors">
            <Heart size={18} />
            <span>{post._count.likes}</span>
          </button>
          <button className="flex items-center gap-1.5 hover:text-primary transition-colors">
            <MessageSquare size={18} />
            <span>{post._count.comments}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
