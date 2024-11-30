export interface Tournament {
  id: string;
  name: string;
  description?: string;
  type: 'solo' | 'team';
  status: 'upcoming' | 'active' | 'completed' | 'cancelled';
  prizeAmount: number;
  prizeCurrency: string;
  entryFee: number;
  maxParticipants: number;
  startTime: Date;
  endTime: Date;
  createdAt: Date;
  updatedAt: Date;
  metadata?: Record<string, any>;
}

export interface TournamentParticipant {
  id: string;
  tournamentId: string;
  userId: string;
  joinedAt: Date;
  status: 'registered' | 'active' | 'completed' | 'disqualified';
  finalRank?: number;
  winnings: number;
  metadata?: Record<string, any>;
}

export interface TournamentAchievement {
  id: string;
  userId: string;
  tournamentId: string;
  type: string;
  title: string;
  description?: string;
  awardedAt: Date;
  metadata?: Record<string, any>;
}

export interface UserStats {
  userId: string;
  tournamentsEntered: number;
  tournamentsWon: number;
  totalWinnings: number;
  winRate: number;
  currentStreak: number;
  bestStreak: number;
  lastUpdated: Date;
  metadata?: Record<string, any>;
}