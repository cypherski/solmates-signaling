import { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { TournamentService } from '../services/tournament';
import { Tournament, UserStats, TournamentAchievement } from '../types/tournament';

export function useTournaments() {
  const { publicKey } = useWallet();
  const [tournaments, setTournaments] = useState<Tournament[]>([
    {
      id: '1',
      name: 'Weekly Trading Championship',
      type: 'solo',
      status: 'active',
      prizeAmount: 1000,
      prizeCurrency: 'USDC',
      entryFee: 50,
      maxParticipants: 100,
      startTime: new Date(),
      endTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '2',
      name: 'Team Trading League',
      type: 'team',
      status: 'upcoming',
      prizeAmount: 5000,
      prizeCurrency: 'USDC',
      entryFee: 100,
      maxParticipants: 50,
      startTime: new Date(Date.now() + 24 * 60 * 60 * 1000),
      endTime: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ]);
  const [userStats, setUserStats] = useState<UserStats | null>({
    userId: publicKey?.toString() || '',
    tournamentsEntered: 5,
    tournamentsWon: 2,
    totalWinnings: 1500,
    winRate: 40,
    currentStreak: 1,
    bestStreak: 3,
    lastUpdated: new Date()
  });
  const [achievements, setAchievements] = useState<TournamentAchievement[]>([
    {
      id: '1',
      userId: publicKey?.toString() || '',
      tournamentId: '1',
      type: 'win',
      title: 'First Victory',
      description: 'Won your first tournament',
      awardedAt: new Date()
    },
    {
      id: '2',
      userId: publicKey?.toString() || '',
      tournamentId: '2',
      type: 'streak',
      title: 'Win Streak',
      description: 'Won 3 tournaments in a row',
      awardedAt: new Date()
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    let unsubscribeTournaments: (() => void) | undefined;
    let unsubscribeStats: (() => void) | undefined;

    const loadData = async () => {
      if (!publicKey) return;

      try {
        setIsLoading(true);
        setError(null);

        // Load initial data
        const [tournamentsData, statsData, achievementsData] = await Promise.all([
          TournamentService.getTournaments(),
          TournamentService.getUserStats(publicKey.toString()),
          TournamentService.getAchievements(publicKey.toString())
        ]);

        if (mounted) {
          setTournaments(tournamentsData);
          setUserStats(statsData);
          setAchievements(achievementsData);
        }

        // Subscribe to real-time updates
        unsubscribeTournaments = TournamentService.subscribeToTournaments(
          (updatedTournaments) => {
            if (mounted) setTournaments(updatedTournaments);
          }
        );

        unsubscribeStats = TournamentService.subscribeToUserStats(
          publicKey.toString(),
          (updatedStats) => {
            if (mounted) setUserStats(updatedStats);
          }
        );

      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err.message : 'Failed to load tournament data');
        }
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    loadData();

    return () => {
      mounted = false;
      if (unsubscribeTournaments) unsubscribeTournaments();
      if (unsubscribeStats) unsubscribeStats();
    };
  }, [publicKey]);

  const joinTournament = async (tournamentId: string) => {
    if (!publicKey) throw new Error('Wallet not connected');

    try {
      await TournamentService.joinTournament(tournamentId, publicKey.toString());
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to join tournament');
    }
  };

  return {
    tournaments,
    userStats,
    achievements,
    isLoading,
    error,
    joinTournament
  };
}