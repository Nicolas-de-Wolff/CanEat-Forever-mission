
import React from 'react';
import { GameConfig } from '../types';
import { FONTS } from '../constants';

interface DebugMenuProps {
  config: GameConfig;
  onChange: (newConfig: GameConfig) => void;
  isOpen: boolean;
  onClose: () => void;
}

const DebugMenu: React.FC<DebugMenuProps> = ({ config, onChange, isOpen, onClose }) => {
  if (!isOpen) return null;

  const handleChange = (key: keyof GameConfig, value: any) => {
    onChange({ ...config, [key]: value });
  };

  const colors = {
    greenClassique: '#7AC346',
    greenLight: '#90CD65',
    greenDark: '#469C15',
    white: '#FFFAEB',
    black: '#140004'
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div style={{ backgroundColor: colors.white }} className="w-full max-w-md max-h-[90vh] overflow-y-auto p-6 shadow-2xl">
        <div className="flex justify-between items-center mb-6 border-b pb-4" style={{ borderColor: `${colors.black}22` }}>
          <h2 style={{ color: colors.greenDark }} className="text-2xl font-black uppercase tracking-tighter">Debug Menu</h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-200 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke={colors.black} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-6">
          <section>
            <h3 style={{ color: colors.black }} className="text-sm font-bold uppercase tracking-widest mb-3 opacity-50">Gameplay</h3>
            <div className="space-y-4">
              <div>
                <label style={{ color: colors.black }} className="block text-sm font-medium mb-1">
                  Vitesse (ms intervalle: {config.speed}ms)
                </label>
                <input 
                  type="range" 
                  min="50" 
                  max="500" 
                  step="10"
                  value={config.speed}
                  onChange={(e) => handleChange('speed', parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 appearance-none cursor-pointer"
                  style={{ accentColor: colors.greenClassique }}
                />
              </div>
            </div>
          </section>

          <section>
            <h3 style={{ color: colors.black }} className="text-sm font-bold uppercase tracking-widest mb-3 opacity-50">Design</h3>
            <div className="space-y-4">
              <div>
                <label style={{ color: colors.black }} className="block text-sm font-medium mb-1">Police d'écriture</label>
                <select 
                  value={config.fontFamily}
                  onChange={(e) => handleChange('fontFamily', e.target.value)}
                  style={{ borderColor: `${colors.black}33`, color: colors.black }}
                  className="w-full p-2 border bg-white focus:ring-2 focus:ring-[#7AC346]"
                >
                  {FONTS.map(f => <option key={f.value} value={f.value}>{f.name}</option>)}
                </select>
              </div>
              {['headImageUrl', 'bodyImageUrl', 'grainImageUrl', 'backgroundImageUrl'].map((field) => (
                <div key={field}>
                  <label style={{ color: colors.black }} className="block text-sm font-medium mb-1 uppercase text-[10px]">{field}</label>
                  <input 
                    type="text" 
                    value={(config as any)[field]}
                    onChange={(e) => handleChange(field as keyof GameConfig, e.target.value)}
                    style={{ borderColor: `${colors.black}33`, color: colors.black }}
                    className="w-full p-2 border bg-white text-xs truncate"
                  />
                </div>
              ))}
            </div>
          </section>

          <section>
            <h3 style={{ color: colors.black }} className="text-sm font-bold uppercase tracking-widest mb-3 opacity-50">Musique</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span style={{ color: colors.black }} className="text-sm font-medium">Musique ON / OFF</span>
                <button 
                  onClick={() => handleChange('isMusicOn', !config.isMusicOn)}
                  className={`relative inline-flex h-6 w-11 items-center transition-colors focus:outline-none ${config.isMusicOn ? 'bg-[#7AC346]' : 'bg-gray-200'}`}
                >
                  <span className={`inline-block h-4 w-4 transform bg-white transition-transform ${config.isMusicOn ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>
              <div>
                <label style={{ color: colors.black }} className="block text-sm font-medium mb-1 uppercase text-[10px]">URL Musique</label>
                <input 
                  type="text" 
                  value={config.musicUrl}
                  onChange={(e) => handleChange('musicUrl', e.target.value)}
                  style={{ borderColor: `${colors.black}33`, color: colors.black }}
                  className="w-full p-2 border bg-white text-xs truncate"
                />
              </div>
            </div>
          </section>
        </div>

        <button 
          onClick={onClose}
          style={{ backgroundColor: colors.greenDark, color: colors.white }}
          className="w-full mt-8 py-3 font-bold transition-all shadow-lg uppercase"
        >
          APPLIQUER & FERMER
        </button>
      </div>
    </div>
  );
};

export default DebugMenu;
