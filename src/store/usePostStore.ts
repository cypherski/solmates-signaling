import { create } from 'zustand';
import { supabase } from '../services/supabase';
import { format } from 'date-fns';

interface Post {
  id: string;
  user_id: string;
  user: string;
  type: 'trade' | 'analysis' | 'prediction';
  content: string;
  media: string[];
  metadata: Record<string, any>;
  created_at: string;
  reactions?: {
    likes: number;
    dislikes: number;
    bullish: number;
    bearish: number;
  };
  userReaction?: 'like' | 'dislike' | 'bullish' | 'bearish' | null;
}

interface PostState {
  posts: Post[];
  isLoading: boolean;
  error: string | null;
  fetchPosts: () => Promise<void>;
  addPost: (post: Omit<Post, 'id' | 'user_id' | 'created_at'>) => Promise<void>;
  addReaction: (postId: string, type: Post['userReaction']) => Promise<void>;
  removeReaction: (postId: string) => Promise<void>;
}

export const usePostStore = create<PostState>((set, get) => ({
  posts: [],
  isLoading: false,
  error: null,

  fetchPosts: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data: posts, error } = await supabase
        .from('feed_posts')
        .select(`
          *,
          reactions:feed_reactions(*),
          user_reactions:feed_reactions(*)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const { data: { user } } = await supabase.auth.getUser();
      const processedPosts = posts?.map(post => ({
        ...post,
        reactions: {
          likes: post.reactions?.filter(r => r.type === 'like').length || 0,
          dislikes: post.reactions?.filter(r => r.type === 'dislike').length || 0,
          bullish: post.reactions?.filter(r => r.type === 'bullish').length || 0,
          bearish: post.reactions?.filter(r => r.type === 'bearish').length || 0
        },
        userReaction: user ? post.user_reactions?.find(r => r.user_id === user.id)?.type || null : null
      })) || [];

      set({ posts: processedPosts, isLoading: false });
    } catch (error) {
      console.error('Failed to fetch posts:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch posts',
        isLoading: false 
      });
    }
  },

  addPost: async (post) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user?.id) throw new Error('Not authenticated');

      // Get user profile for display name
      const { data: profile } = await supabase
        .from('profiles')
        .select('username')
        .eq('user_id', user.id)
        .single();

      const { data, error } = await supabase
        .from('feed_posts')
        .insert([{
          ...post,
          user_id: user.id,
          user: profile?.username || 'Anonymous',
          created_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) throw error;

      set(state => ({
        posts: [
          { 
            ...data, 
            user: profile?.username || 'Anonymous',
            reactions: { likes: 0, dislikes: 0, bullish: 0, bearish: 0 },
            userReaction: null
          }, 
          ...state.posts
        ]
      }));
    } catch (error) {
      console.error('Failed to add post:', error);
      throw new Error('Failed to create post');
    }
  },

  addReaction: async (postId, type) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { error } = await supabase
      .from('feed_reactions')
      .upsert({
        post_id: postId,
        user_id: user.id,
        type
      });

    if (error) throw error;
    await get().fetchPosts();
  },

  removeReaction: async (postId) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { error } = await supabase
      .from('feed_reactions')
      .delete()
      .match({ post_id: postId, user_id: user.id });

    if (error) throw error;
    await get().fetchPosts();
  }
}));