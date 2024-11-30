export interface Database {
  public: {
    Tables: {
      feed_posts: {
        Row: {
          id: string;
          user_id: string;
          type: 'trade' | 'analysis' | 'prediction';
          content: string;
          media: string[];
          metadata: Record<string, any>;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['feed_posts']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['feed_posts']['Insert']>;
      };
      feed_reactions: {
        Row: {
          id: string;
          post_id: string;
          user_id: string;
          type: 'like' | 'dislike' | 'bullish' | 'bearish';
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['feed_reactions']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['feed_reactions']['Insert']>;
      };
      feed_comments: {
        Row: {
          id: string;
          post_id: string;
          user_id: string;
          content: string;
          parent_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['feed_comments']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['feed_comments']['Insert']>;
      };
    };
  };
}