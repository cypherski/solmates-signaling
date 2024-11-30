-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create user_wallets table
CREATE TABLE user_wallets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    public_key TEXT NOT NULL UNIQUE,
    encrypted_private_key TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    CONSTRAINT user_wallets_public_key_check CHECK (
        length(public_key) > 0 AND 
        length(encrypted_private_key) > 0
    )
);

-- Add indexes
CREATE INDEX idx_user_wallets_user_id ON user_wallets(user_id);
CREATE INDEX idx_user_wallets_public_key ON user_wallets(public_key);

-- Add RLS policies
ALTER TABLE user_wallets ENABLE ROW LEVEL SECURITY;

-- Users can only read their own wallet
CREATE POLICY "Users can view own wallet" ON user_wallets
    FOR SELECT USING (auth.uid() = user_id);

-- Users can only update their own wallet
CREATE POLICY "Users can update own wallet" ON user_wallets
    FOR UPDATE USING (auth.uid() = user_id);

-- Users can only insert their own wallet
CREATE POLICY "Users can insert own wallet" ON user_wallets
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Add triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_user_wallets_updated_at
    BEFORE UPDATE ON user_wallets
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();