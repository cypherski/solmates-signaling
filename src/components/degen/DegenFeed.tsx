import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Plus, Share2, ThumbsUp, ThumbsDown } from 'lucide-react';
import { format } from 'date-fns';
import { supabase } from '@/services/supabase';
import { CreatePostModal } from './feed/CreatePostModal';
import { PostCard } from './feed/PostCard';
import { usePostStore } from '@/store/usePostStore';
import { cn } from '@/lib/utils';

export function DegenFeed() {
  const [isCreateModalOpen, setCreateModalOpen] = React.useState(false);
  const [filter, setFilter] = React.useState('all');
  const { posts, addPost, addReaction, removeReaction, fetchPosts } = usePostStore();

  // Initial fetch
  React.useEffect(() => {
    fetchPosts().catch(console.error);
  }, [fetchPosts]);

  // Real-time updates subscription
  React.useEffect(() => {
    const subscription = supabase
      .channel('posts')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'feed_posts'
      }, () => {
        fetchPosts().catch(console.error);
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [fetchPosts]);

  const handleCreatePost = (post: any) => {
    try {
      addPost({
        ...post,
        media: post.media || [],
        metadata: post.metadata || {}
      });
      setCreateModalOpen(false);
    } catch (error) {
      console.error('Failed to create post:', error);
      // You could add error handling UI here
    }
  };

  const handleReaction = (postId: string, type: 'like' | 'dislike' | 'bullish' | 'bearish') => {
    const post = posts.find(p => p.id === postId);
    if (!post) return;

    if (post.userReaction === type) {
      removeReaction(postId).catch(console.error);
    } else {
      addReaction(postId, type).catch(console.error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-[1400px] mx-auto space-y-6"
    >
      <div className="bg-white/50 backdrop-blur-sm rounded-xl border border-gray-200/50 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-gray-600" />
            <h2 className="text-xl font-bold text-gray-900">Degen Feed</h2>
          </div>
          <div className="flex gap-2">
            <select 
              value={filter} 
              onChange={(e) => setFilter(e.target.value)} 
              className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600"
            >
              <option value="all">All Posts</option>
              <option value="trade">Trades</option>
              <option value="analysis">Analysis</option>
              <option value="prediction">Predictions</option>
            </select>
            <button 
              onClick={() => setCreateModalOpen(true)}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-4 py-2 rounded-lg transition-all transform hover:scale-105 flex items-center gap-2"
            >
              <span>New Post</span>
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>
        <div className="space-y-4">
          {posts
            .filter(post => filter === 'all' || post.type === filter)
            .map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onReact={handleReaction}
              />
            ))}
        </div>
      </div>
      <CreatePostModal
        isOpen={isCreateModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSubmit={handleCreatePost}
      />
    </motion.div>
  );
}