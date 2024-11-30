-- Function to get post reactions count
CREATE OR REPLACE FUNCTION get_post_reactions(post_id UUID)
RETURNS TABLE (
    type TEXT,
    count BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT r.type, COUNT(*)::BIGINT
    FROM feed_reactions r
    WHERE r.post_id = $1
    GROUP BY r.type;
END;
$$ LANGUAGE plpgsql;

-- Function to get user reaction for a post
CREATE OR REPLACE FUNCTION get_user_reaction(post_id UUID, user_id UUID)
RETURNS TEXT AS $$
DECLARE
    reaction_type TEXT;
BEGIN
    SELECT type INTO reaction_type
    FROM feed_reactions
    WHERE post_id = $1 AND user_id = $2
    LIMIT 1;
    
    RETURN reaction_type;
END;
$$ LANGUAGE plpgsql;

-- Function to toggle reaction
CREATE OR REPLACE FUNCTION toggle_reaction(
    _post_id UUID,
    _user_id UUID,
    _type TEXT
)
RETURNS VOID AS $$
BEGIN
    -- Delete existing reaction if same type
    DELETE FROM feed_reactions
    WHERE post_id = _post_id 
    AND user_id = _user_id 
    AND type = _type;
    
    -- If no rows were deleted, insert new reaction
    IF NOT FOUND THEN
        -- First remove any other reactions from this user on this post
        DELETE FROM feed_reactions
        WHERE post_id = _post_id 
        AND user_id = _user_id;
        
        -- Insert new reaction
        INSERT INTO feed_reactions (post_id, user_id, type)
        VALUES (_post_id, _user_id, _type);
    END IF;
END;
$$ LANGUAGE plpgsql;