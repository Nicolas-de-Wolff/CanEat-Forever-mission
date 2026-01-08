
import React, { useState } from 'react';
import { GameStatus, GameConfig } from '../types';

interface GameOverlayProps {
  status: GameStatus;
  score: number;
  config: GameConfig;
  onStart: () => void;
  onReset: () => void;
}

const GameOverlay: React.FC<GameOverlayProps> = ({ status, score, config, onStart, onReset }) => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (status === GameStatus.PLAYING) return null;

  const colors = {
    greenClassique: '#7AC346',
    greenLight: '#90CD65',
    greenDark: '#469C15',
    white: '#FFFAEB',
    black: '#140004'
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      console.log('Email submitted:', email);
      setSubmitted(true);
      setEmail('');
    }
  };

  const renderContestSection = () => (
    <div className="mt-8 pt-6 border-t w-full" style={{ borderColor: `${colors.black}22` }}>
      <h3 style={{ color: colors.greenDark }} className="text-xl font-black uppercase mb-2">
        CONCOURS
      </h3>
      <p style={{ color: colors.black }} className="text-sm font-medium mb-4 opacity-90 leading-tight">
        Participe au tirage au sort pour gagner la gamme entière !
      </p>
      
      {!submitted ? (
        <form onSubmit={handleSubscribe} className="flex flex-col gap-2">
          <input 
            type="email" 
            placeholder="Ton email..."
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="px-4 py-3 border-2 text-sm focus:outline-none focus:border-[#7AC346] bg-white/50"
            style={{ borderColor: `${colors.black}33`, color: colors.black }}
          />
          <button 
            type="submit"
            style={{ backgroundColor: colors.black, color: colors.white }}
            className="py-3 text-sm font-black uppercase shadow-[0_4px_0_0_#333] active:translate-y-0.5 active:shadow-none transition-all"
          >
            S'INSCRIRE
          </button>
        </form>
      ) : (
        <div style={{ color: colors.greenDark }} className="text-sm font-bold animate-pulse">
          ✓ Inscription validée !
        </div>
      )}
    </div>
  );

  return (
    <div className="absolute inset-0 z-40 flex flex-col items-center justify-center bg-[#140004]/40 backdrop-blur-[2px] p-6 text-center animate-fadeIn overflow-y-auto">
      {status === GameStatus.START && (
        <div className="flex flex-col items-center space-y-8">
          <h1 
            style={{ color: colors.white }} 
            className="text-4xl md:text-6xl font-black drop-shadow-lg uppercase tracking-tight"
          >
            CanEat<br/>For Ever
          </h1>
          <button 
            onClick={onStart}
            style={{ backgroundColor: colors.greenClassique, color: colors.white }}
            className="px-12 py-4 text-2xl font-black shadow-[0_8px_0_0_#469C15] active:translate-y-1 active:shadow-[0_4px_0_0_#469C15] transition-all uppercase"
          >
            JOUER
          </button>
        </div>
      )}

      {status === GameStatus.WIN && (
        <div style={{ backgroundColor: colors.white }} className="flex flex-col items-center p-8 shadow-2xl w-full max-w-[320px] animate-bounceIn">
          <div style={{ backgroundColor: `${colors.greenLight}33` }} className="w-24 h-24 flex items-center justify-center mb-4">
            <img src={config.grainImageUrl} alt="Kombucha" className="w-16 h-16 object-contain drop-shadow-xl" />
          </div>
          <h2 
            style={{ color: colors.greenDark }} 
            className="text-2xl font-black uppercase mb-1"
          >
            Le Kombucha est prêt
          </h2>
          <p style={{ color: colors.black }} className="font-medium opacity-80 mb-6">Bravo ! Vous avez récolté tous les grains.</p>
          
          <button 
            onClick={onReset}
            style={{ backgroundColor: colors.greenClassique, color: colors.white }}
            className="w-full py-4 text-lg font-black shadow-[0_6px_0_0_#469C15] active:translate-y-1 active:shadow-[0_3px_0_0_#469C15] transition-all uppercase mb-2"
          >
            REJOUER
          </button>

          {renderContestSection()}
        </div>
      )}

      {status === GameStatus.GAMEOVER && (
        <div style={{ backgroundColor: colors.white }} className="flex flex-col items-center p-8 shadow-2xl w-full max-w-[320px] animate-bounceIn">
          <h2 
            style={{ color: colors.greenDark }} 
            className="text-4xl font-black uppercase mb-2"
          >
            PERDU !
          </h2>
          <p style={{ color: colors.black }} className="text-xl font-bold mb-6">Score: {score}</p>
          
          <button 
            onClick={onReset}
            style={{ backgroundColor: colors.greenClassique, color: colors.white }}
            className="w-full py-4 text-lg font-black shadow-[0_6px_0_0_#469C15] active:translate-y-1 active:shadow-[0_3px_0_0_#469C15] transition-all uppercase mb-2"
          >
            REESSAYER
          </button>
        </div>
      )}
    </div>
  );
};

export default GameOverlay;
