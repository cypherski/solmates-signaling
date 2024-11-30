-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create video_rooms table
CREATE TABLE video_rooms (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    status TEXT NOT NULL CHECK (status IN ('waiting', 'connected', 'ended')),
    session_id TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    connected_by TEXT,
    connected_at TIMESTAMPTZ,
    signal JSONB,
    last_signal_at TIMESTAMPTZ,
    metadata JSONB DEFAULT '{}'::jsonb,
    
    CONSTRAINT different_sessions CHECK (session_id != connected_by)
);

-- Enable RLS but with more permissive policies for testing
ALTER TABLE video_rooms ENABLE ROW LEVEL SECURITY;

-- Create policies that allow all operations during testing
-- Allow users to create rooms
CREATE POLICY "Users can create rooms"
    ON video_rooms FOR INSERT
    WITH CHECK (true);

-- Allow users to view rooms they're part of
CREATE POLICY "Users can view their rooms"
    ON video_rooms FOR SELECT
    USING (true);

-- Allow users to update rooms they're part of
CREATE POLICY "Users can update their rooms"
    ON video_rooms FOR UPDATE
    USING (true);

-- Create indexes
CREATE INDEX idx_video_rooms_status ON video_rooms(status);
CREATE INDEX idx_video_rooms_session ON video_rooms(session_id);
CREATE INDEX idx_video_rooms_connection ON video_rooms(connected_by);

-- Add realtime replication
ALTER PUBLICATION supabase_realtime ADD TABLE video_rooms;