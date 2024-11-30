-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create feed_posts table
CREATE TABLE public.feed_posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('trade', 'analysis', 'prediction')),
    content TEXT NOT NULL,
    media JSONB DEFAULT '[]'::jsonb,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    CONSTRAINT content_length CHECK (char_length(content) > 0)
);

-- Create feed_reactions table
CREATE TABLE public.feed_reactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    post_id UUID REFERENCES public.feed_posts(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('like', 'dislike', 'bullish', 'bearish')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    CONSTRAINT unique_reaction UNIQUE (post_id, user_id, type)
);

-- Create feed_comments table
CREATE TABLE public.feed_comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    post_id UUID REFERENCES public.feed_posts(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    parent_id UUID REFERENCES public.feed_comments(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    CONSTRAINT content_length CHECK (char_length(content) > 0)
);

-- Enable RLS
ALTER TABLE public.feed_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feed_reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feed_comments ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Anyone can read feed posts"
    ON public.feed_posts FOR SELECT
    USING (true);

CREATE POLICY "Users can create feed posts"
    ON public.feed_posts FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own feed posts"
    ON public.feed_posts FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own feed posts"
    ON public.feed_posts FOR DELETE
    USING (auth.uid() = user_id);

-- Add tables to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.feed_posts;
ALTER PUBLICATION supabase_realtime ADD TABLE public.feed_reactions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.feed_comments;