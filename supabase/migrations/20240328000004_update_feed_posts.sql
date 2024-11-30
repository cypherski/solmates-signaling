-- Add user column to feed_posts
ALTER TABLE public.feed_posts
ADD COLUMN user TEXT NOT NULL;

-- Add indexes for better performance
CREATE INDEX idx_feed_posts_created_at ON public.feed_posts(created_at DESC);
CREATE INDEX idx_feed_posts_user_id ON public.feed_posts(user_id);
CREATE INDEX idx_feed_reactions_post_id ON public.feed_reactions(post_id);

-- Update RLS policies
DROP POLICY IF EXISTS "Anyone can read feed posts" ON public.feed_posts;
DROP POLICY IF EXISTS "Users can create feed posts" ON public.feed_posts;

CREATE POLICY "Anyone can read feed posts"
    ON public.feed_posts FOR SELECT
    USING (true);

CREATE POLICY "Authenticated users can create feed posts"
    ON public.feed_posts FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

-- Add policies for reactions
CREATE POLICY "Anyone can read reactions"
    ON public.feed_reactions FOR SELECT
    USING (true);

CREATE POLICY "Authenticated users can add reactions"
    ON public.feed_reactions FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can remove their reactions"
    ON public.feed_reactions FOR DELETE
    USING (auth.uid() = user_id);