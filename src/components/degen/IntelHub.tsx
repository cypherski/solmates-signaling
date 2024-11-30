import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Target, Users, Star, Swords, Clock, Coins, ChevronRight, Award, Medal, History } from 'lucide-react';
import { Brain, LineChart, Signal, TrendingUp, MessageCircle, ThumbsUp, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTournaments } from '@/hooks/useTournaments';

export function IntelHub() {
  const { tournaments, userStats, achievements, isLoading, error, joinTournament } = useTournaments();
  const [selectedTournament, setSelectedTournament] = React.useState<string | null>(null);
  const [showHistory, setShowHistory] = React.useState(false);

  const renderStatCard = (label: string, value: string | number, textColorClass: string = "text-purple-500") => (
    <div className="bg-white rounded-lg p-4 text-center border border-gray-200/50 shadow-sm">
      <p className="text-sm text-gray-500 mb-1">{label}</p>
      <p className={`text-2xl font-bold ${textColorClass}`}>
        {value}
      </p>
    </div>
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 text-sm underline hover:text-purple-500"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-7xl mx-auto space-y-6"
    >
      {/* Tournaments Section */}
      <div className="bg-white/80 backdrop-blur-lg rounded-xl border border-gray-200/50 p-6 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Trophy className="w-6 h-6 text-purple-500" />
            <h2 className="text-2xl font-bold text-gray-900">Active Tournaments</h2>
          </div>
          <button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-4 py-2 rounded-lg transition-all transform hover:scale-105">
            Create Tournament
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tournaments.map((tournament) => (
            <div
              key={tournament.id}
              onClick={() => setSelectedTournament(tournament.id === selectedTournament ? null : tournament.id)}
              className="bg-white rounded-lg p-6 border border-gray-200/50 hover:border-purple-200 transition-all cursor-pointer group shadow-sm"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center">
                    {tournament.type === 'solo' ? (
                      <Trophy className="w-5 h-5 text-purple-600" />
                    ) : (
                      <Users className="w-5 h-5 text-purple-600" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{tournament.name}</h3>
                    <div className="flex items-center gap-2">
                      <span className="text-xs px-2 py-0.5 rounded-full bg-purple-100 text-purple-600">
                        {tournament.type === 'solo' ? 'Solo Tournament' : 'Team Battle'}
                      </span>
                      <span className="text-xs text-gray-500">Entry: {tournament.entryFee} {tournament.prizeCurrency}</span>
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">
                    {new Date(tournament.endTime).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Coins className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">
                    {tournament.prizeAmount} {tournament.prizeCurrency}
                  </span>
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-500">Participants</span>
                  <span className="text-sm text-gray-900">0/{tournament.maxParticipants}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-purple-500 h-2 rounded-full transition-all"
                    style={{ width: `${(0 / tournament.maxParticipants) * 100}%` }}
                  />
                </div>
              </div>
              
              {selectedTournament === tournament.id && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-4 pt-4 border-t border-gray-100"
                >
                  <div className="flex justify-between items-center">
                    <button 
                      onClick={() => joinTournament(tournament.id)}
                      className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      Join Tournament
                    </button>
                    <button className="px-4 py-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors">
                      View Details
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          ))}
        </div>
      </div>
      
      {/* Stats Section */}
      <div className="bg-white/80 backdrop-blur-lg rounded-xl border border-gray-200/50 p-6 shadow-lg">
        <div className="flex items-center gap-2 mb-6">
          <Trophy className="w-5 h-5 text-purple-400" />
          <h2 className="text-xl font-bold text-gray-900">Your Stats</h2>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {userStats && (
            <>
              {renderStatCard("Tournaments", userStats.tournamentsEntered)}
              {renderStatCard("Wins", userStats.tournamentsWon)}
              {renderStatCard("Win Rate", `${userStats.winRate}%`, "text-green-500")}
              {renderStatCard("Total Winnings", `${userStats.totalWinnings} USDC`)}
            </>
          )}
        </div>

        {/* Achievements Section */}
        <div className="space-y-3 mt-6">
          <p className="text-sm text-gray-500">Recent Achievements</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {achievements.map((achievement) => (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-3 bg-white rounded-lg p-4 border border-gray-200/50 shadow-sm hover:border-purple-200 transition-all"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center">
                  <Award className="w-4 h-4 text-purple-400" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{achievement.title}</p>
                  <p className="text-sm text-gray-500">{achievement.description}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="flex gap-4 mt-6">
            <button 
              onClick={() => setShowHistory(!showHistory)}
              className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg py-2 transition-all transform hover:scale-105 flex items-center justify-center gap-2"
            >
              <History className="w-4 h-4" />
              View History
            </button>
            <button className="flex-1 bg-white border border-gray-200 hover:bg-gray-50 text-gray-900 rounded-lg py-2 transition-all transform hover:scale-105 flex items-center justify-center gap-2">
              <Star className="w-4 h-4" />
              All Achievements
            </button>
          </div>

          {/* History Section */}
          {showHistory && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-6 pt-6 border-t border-gray-200"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Tournament History</h3>
              <div className="space-y-4">
                {tournaments.filter(t => t.status === 'completed').map((tournament) => (
                  <div
                    key={tournament.id}
                    className="bg-white rounded-lg p-4 border border-gray-200/50 shadow-sm"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-medium text-gray-900">{tournament.name}</h4>
                        <p className="text-sm text-gray-500">
                          {new Date(tournament.endTime).toLocaleDateString()}
                        </p>
                      </div>
                      <span className="text-purple-500 font-medium">
                        {tournament.prizeAmount} {tournament.prizeCurrency}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}