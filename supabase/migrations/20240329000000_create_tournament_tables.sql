-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create tournaments table
CREATE TABLE public.tournaments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    type TEXT NOT NULL CHECK (type IN ('solo', 'team')),
    status TEXT NOT NULL CHECK (status IN ('upcoming', 'active', 'completed', 'cancelled')) DEFAULT 'upcoming',
    prize_amount DECIMAL NOT NULL,
    prize_currency TEXT NOT NULL DEFAULT 'USDC',
    entry_fee DECIMAL NOT NULL,
    max_participants INTEGER NOT NULL,
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    metadata JSONB DEFAULT '{}'::jsonb,
    
    CONSTRAINT valid_dates CHECK (end_time > start_time),
    CONSTRAINT positive_amounts CHECK (prize_amount > 0 AND entry_fee >= 0)
);

-- Create tournament_participants table
CREATE TABLE public.tournament_participants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tournament_id UUID REFERENCES public.tournaments(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    status TEXT NOT NULL CHECK (status IN ('registered', 'active', 'completed', 'disqualified')) DEFAULT 'registered',
    final_rank INTEGER,
    winnings DECIMAL DEFAULT 0,
    metadata JSONB DEFAULT '{}'::jsonb,
    
    CONSTRAINT unique_tournament_participant UNIQUE (tournament_id, user_id)
);

-- Create tournament_achievements table
CREATE TABLE public.tournament_achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    tournament_id UUID REFERENCES public.tournaments(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    awarded_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Create user_stats table
CREATE TABLE public.user_stats (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    tournaments_entered INTEGER DEFAULT 0,
    tournaments_won INTEGER DEFAULT 0,
    total_winnings DECIMAL DEFAULT 0,
    win_rate DECIMAL DEFAULT 0,
    current_streak INTEGER DEFAULT 0,
    best_streak INTEGER DEFAULT 0,
    last_updated TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Enable RLS
ALTER TABLE public.tournaments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tournament_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tournament_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_stats ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Public tournaments are viewable by everyone"
    ON public.tournaments FOR SELECT
    USING (true);

CREATE POLICY "Users can view their own tournament participation"
    ON public.tournament_participants FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own achievements"
    ON public.tournament_achievements FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own stats"
    ON public.user_stats FOR SELECT
    USING (auth.uid() = user_id);

-- Add tables to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.tournaments;
ALTER PUBLICATION supabase_realtime ADD TABLE public.tournament_participants;
ALTER PUBLICATION supabase_realtime ADD TABLE public.tournament_achievements;
ALTER PUBLICATION supabase_realtime ADD TABLE public.user_stats;