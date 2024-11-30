-- Add trigger to update post reactions count
CREATE OR REPLACE FUNCTION update_post_reaction_counts()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    -- Increment reaction count
    UPDATE feed_posts
    SET metadata = jsonb_set(
      COALESCE(metadata, '{}'::jsonb),
      ARRAY['reaction_counts', NEW.type],
      COALESCE(
        (metadata->'reaction_counts'->NEW.type)::jsonb + '1'::jsonb,
        '1'::jsonb
      )
    )
    WHERE id = NEW.post_id;
  ELSIF TG_OP = 'DELETE' THEN
    -- Decrement reaction count
    UPDATE feed_posts
    SET metadata = jsonb_set(
      metadata,
      ARRAY['reaction_counts', OLD.type],
      (COALESCE((metadata->'reaction_counts'->OLD.type)::int, 1) - 1)::text::jsonb
    )
    WHERE id = OLD.post_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER feed_reaction_counts_trigger
  AFTER INSERT OR DELETE ON feed_reactions
  FOR EACH ROW
  EXECUTE FUNCTION update_post_reaction_counts();

-- Add trigger to initialize metadata
CREATE OR REPLACE FUNCTION initialize_post_metadata()
RETURNS TRIGGER AS $$
BEGIN
  NEW.metadata = jsonb_set(
    COALESCE(NEW.metadata, '{}'::jsonb),
    '{reaction_counts}',
    '{"like": 0, "dislike": 0, "bullish": 0, "bearish": 0}'::jsonb
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER initialize_feed_post_metadata
  BEFORE INSERT ON feed_posts
  FOR EACH ROW
  EXECUTE FUNCTION initialize_post_metadata();