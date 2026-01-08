
import React, { useState } from 'react';
import GameCanvas from './components/GameCanvas';
import GameOverlay from './components/GameOverlay';
import DebugMenu from './components/DebugMenu';
import { GameStatus, GameConfig } from './types';
import { DEFAULT_CONFIG, WIN_SCORE } from './constants';

const App: React.FC = () => {
  const [config, setConfig] = useState<GameConfig>(DEFAULT_CONFIG);
  const [status, setStatus] = useState<GameStatus>(GameStatus.START);
  const [score, setScore] = useState(0);
  const [isDebugOpen, setIsDebugOpen] = useState(false);

  const handleStart = () => setStatus(GameStatus.PLAYING);
  
  const handleReset = () => {
    setScore(0);
    setStatus(GameStatus.PLAYING);
  };

  const handleScoreChange = (newScore: number) => setScore(newScore);
  const handleStatusChange = (newStatus: GameStatus) => setStatus(newStatus);
  const handleConfigChange = (newConfig: GameConfig) => setConfig(newConfig);

  const toggleMusic = () => {
    setConfig(prev => ({ ...prev, isMusicOn: !prev.isMusicOn }));
  };

  const colors = {
    greenClassique: '#7AC346',
    greenDark: '#469C15',
    white: '#FFFAEB',
    black: '#140004'
  };

  return (
    <div className="relative w-full h-full max-w-[440px] max-h-[956px] min-w-[375px] min-h-[812px] bg-transparent overflow-hidden flex flex-col shadow-2xl mx-auto">
      
      {/* 1. Game Base Layer (z-0) */}
      <div className="absolute inset-0 z-0">
        <GameCanvas 
          config={config} 
          status={status}
          onScoreChange={handleScoreChange}
          onStatusChange={handleStatusChange}
        />
      </div>

      {/* 2. Score Header (z-20) */}
      <div className="absolute top-0 left-0 right-0 z-20 p-6 pointer-events-none flex justify-center">
        <div 
          style={{ fontFamily: config.fontFamily }}
          className="animate-slideDown"
        >
          <span style={{ color: '#FFFAEB' }} className="text-2xl font-black tracking-widest drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
            {score} / {WIN_SCORE} <span className="text-sm opacity-60 ml-1 font-bold">KOMB</span>
          </span>
        </div>
      </div>

      {/* 3. Global Overlays (z-40) */}
      <GameOverlay 
        status={status} 
        score={score} 
        config={config}
        onStart={handleStart}
        onReset={handleReset}
      />

      {/* 4. Settings / Controls (z-30) */}
      <div className="absolute top-6 left-6 right-6 z-30 flex justify-between pointer-events-none">
        {/* Debug Menu Toggle */}
        <button 
          onClick={() => setIsDebugOpen(true)}
          className="p-3 bg-white/10 hover:bg-white/20 backdrop-blur-lg border border-white/10 text-white transition-all shadow-xl active:scale-95 pointer-events-auto"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>

        {/* Music Toggle Button (Circular Game Style) */}
        <button 
          onClick={toggleMusic}
          style={{ backgroundColor: colors.greenClassique }}
          className="w-12 h-12 flex items-center justify-center shadow-[0_4px_0_0_#469C15] active:translate-y-1 active:shadow-none transition-all pointer-events-auto"
        >
          {config.isMusicOn ? (
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
            </svg>
          ) : (
            <svg className="w-6 h-6 text-white opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
            </svg>
          )}
        </button>
      </div>

      {/* 5. Debug Menu (z-50) */}
      <DebugMenu 
        config={config} 
        isOpen={isDebugOpen}
        onClose={() => setIsDebugOpen(false)}
        onChange={handleConfigChange}
      />

      <style>{`
        @keyframes slideDown {
          from { transform: translateY(-100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes bounceIn {
          0% { transform: scale(0.3); opacity: 0; }
          50% { transform: scale(1.05); opacity: 1; }
          70% { transform: scale(0.9); }
          100% { transform: scale(1); }
        }
        .animate-slideDown { animation: slideDown 0.4s ease-out; }
        .animate-fadeIn { animation: fadeIn 0.3s ease-in-out; }
        .animate-bounceIn { animation: bounceIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
      `}</style>
    </div>
  );
};

export default App;