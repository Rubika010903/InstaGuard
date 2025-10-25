import React from 'react';
import { Post as PostType, User } from '../types';

interface PostProps {
  post: PostType;
  author: User | undefined;
  onViewAnalysis: (post: PostType) => void;
}

const Post: React.FC<PostProps> = ({ post, author, onViewAnalysis }) => {

  return (
    <div className="bg-brand-card rounded-lg overflow-hidden shadow-lg flex flex-col">
      <div className="relative aspect-video bg-brand-sidebar">
        <img src={post.imageUrl} alt={post.caption} className="w-full h-full object-cover" />
        {post.isTampered && (
            <span className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full">TAMPERED</span>
        )}
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <div className="flex items-center space-x-2 mb-2">
            <img src={author?.avatar} alt={author?.name} className="h-6 w-6 rounded-full" />
            <span className="text-brand-text-secondary font-semibold text-sm">{author?.name}</span>
        </div>
        <p className="text-brand-text text-sm mb-4 flex-grow">{post.caption}</p>

        {post.analysis && (
            <button
            onClick={() => onViewAnalysis(post)}
            className="w-full text-center mt-auto bg-transparent border border-brand-border text-brand-text-secondary font-bold py-2 px-4 rounded-lg hover:bg-brand-border/50 transition-colors"
            >
            View Analysis Report
            </button>
        )}
      </div>
    </div>
  );
};

export default Post;