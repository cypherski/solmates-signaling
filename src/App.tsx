import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/navigation/Navbar';
import { Home } from './pages/Home';
import { VideoChat } from './pages/VideoChat';
import { WatchTower } from './pages/degen/WatchTower';
import { DegenFeed } from './pages/degen/DegenFeed';
import { BattleStation } from './pages/degen/BattleStation';
import { IntelHub } from './pages/degen/IntelHub';
import { DegenDen } from './pages/DegenDen';
import { Features } from './pages/Features';
import { ProtectedRoute } from './components/ProtectedRoute';

export function App() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="min-h-screen">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route 
            path="/video" 
            element={
              <ProtectedRoute>
                <VideoChat />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/degen/*" 
            element={
              <ProtectedRoute>
                <Routes>
                  <Route index element={<DegenDen />} />
                  <Route path="watchtower" element={<WatchTower />} />
                  <Route path="feed" element={<DegenFeed />} />
                  <Route path="battle" element={<BattleStation />} />
                  <Route path="intel" element={<IntelHub />} />
                </Routes>
              </ProtectedRoute>
            }
          />
          <Route path="/features" element={<Features />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}