import { supabase } from './supabase';
import { Tournament, TournamentParticipant, TournamentAchievement, UserStats } from '../types/tournament';

export class TournamentService {
  static async getTournaments(): Promise<Tournament[]> {
    const { data, error } = await supabase
      .from('tournaments')
      .select('*')
      .order('start_time', { ascending: true });

    if (error) throw error;
    return data;
  }

  static async getUserStats(userId: string): Promise<UserStats | null> {
    const { data, error } = await supabase
      .from('user_stats')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  static async getAchievements(userId: string): Promise<TournamentAchievement[]> {
    const { data, error } = await supabase
      .from('tournament_achievements')
      .select('*')
      .eq('user_id', userId)
      .order('awarded_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  static async joinTournament(tournamentId: string, userId: string): Promise<TournamentParticipant> {
    const { data, error } = await supabase
      .from('tournament_participants')
      .insert([{
        tournament_id: tournamentId,
        user_id: userId
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static subscribeToTournaments(callback: (tournaments: Tournament[]) => void): () => void {
    const subscription = supabase
      .channel('tournaments')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'tournaments'
      }, async () => {
        const { data } = await supabase
          .from('tournaments')
          .select('*')
          .order('start_time', { ascending: true });
        
        if (data) callback(data);
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }

  static subscribeToUserStats(
    userId: string,
    callback: (stats: UserStats) => void
  ): () => void {
    const subscription = supabase
      .channel(`user_stats:${userId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'user_stats',
        filter: `user_id=eq.${userId}`
      }, async () => {
        const { data } = await supabase
          .from('user_stats')
          .select('*')
          .eq('user_id', userId)
          .single();
        
        if (data) callback(data);
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }
}