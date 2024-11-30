-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing video_rooms table if it exists
DROP TABLE IF EXISTS public.video_rooms;

-- Create enhanced video_rooms table
CREATE TABLE public.video_rooms (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Room status and metadata
    status TEXT NOT NULL CHECK (status IN ('waiting', 'connected', 'ended')) DEFAULT 'waiting',
    room_type TEXT NOT NULL DEFAULT 'video',
    
    -- Participant information
    creator_wallet TEXT NOT NULL,
    joiner_wallet TEXT,
    
    -- WebRTC signaling data
    creator_signal JSONB,
    joiner_signal JSONB,
    
    -- Timestamps
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    connected_at TIMESTAMPTZ,
    ended_at TIMESTAMPTZ,
    last_activity_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    -- Room configuration
    max_participants INTEGER NOT NULL DEFAULT 2,
    is_private BOOLEAN NOT NULL DEFAULT false,
    
    -- Additional metadata
    metadata JSONB DEFAULT '{}'::jsonb,
    
    -- Constraints
    CONSTRAINT different_participants CHECK (creator_wallet != joiner_wallet)
);

-- Create indexes for better query performance
CREATE INDEX idx_video_rooms_status ON public.video_rooms(status);
CREATE INDEX idx_video_rooms_creator ON public.video_rooms(creator_wallet);
CREATE INDEX idx_video_rooms_joiner ON public.video_rooms(joiner_wallet);
CREATE INDEX idx_video_rooms_created_at ON public.video_rooms(created_at);
CREATE INDEX idx_video_rooms_last_activity ON public.video_rooms(last_activity_at);

-- Enable Row Level Security
ALTER TABLE public.video_rooms ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Anyone can create rooms"
    ON public.video_rooms FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Participants can view their rooms"
    ON public.video_rooms FOR SELECT
    USING (
        creator_wallet = current_user OR 
        joiner_wallet = current_user OR 
        status = 'waiting'
    );

CREATE POLICY "Participants can update their rooms"
    ON public.video_rooms FOR UPDATE
    USING (
        creator_wallet = current_user OR 
        joiner_wallet = current_user
    );

-- Create function to update last_activity_at
CREATE OR REPLACE FUNCTION update_room_last_activity()
RETURNS TRIGGER AS $$
BEGIN
    NEW.last_activity_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for last_activity_at
CREATE TRIGGER update_room_activity
    BEFORE UPDATE ON public.video_rooms
    FOR EACH ROW
    EXECUTE FUNCTION update_room_last_activity();

-- Add table to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.video_rooms;

-- Create function to clean up stale rooms
CREATE OR REPLACE FUNCTION cleanup_stale_rooms()
RETURNS void AS $$
BEGIN
    UPDATE public.video_rooms
    SET status = 'ended',
        ended_at = NOW()
    WHERE status != 'ended'
    AND last_activity_at < NOW() - INTERVAL '5 minutes';
END;
$$ LANGUAGE plpgsql;

-- Create a scheduled job to run cleanup (runs every 5 minutes)
SELECT cron.schedule(
    'cleanup-stale-rooms',
    '*/5 * * * *',
    'SELECT cleanup_stale_rooms();'
);