
import { GameConfig } from './types';

// Paramètres de la grille du jeu
export const GRID_SIZE = 20;
export const WIN_SCORE = 12;

// Assets par défaut
export const DEFAULT_CONFIG: GameConfig = {
  speed: 150,
  fontFamily: "'TWKBurns-Regular', sans-serif",
  headImageUrl: 'https://raw.githubusercontent.com/Nicolas-de-Wolff/CanEat-For-Ever_assets/main/image/Cannette-Kombucha-orange.png',
  bodyImageUrl: 'https://raw.githubusercontent.com/Nicolas-de-Wolff/CanEat-For-Ever_assets/main/image/Cannette-Kombucha-orange.png',
  grainImageUrl: 'https://raw.githubusercontent.com/Nicolas-de-Wolff/CanEat-For-Ever_assets/main/image/Scoby.png',
  backgroundImageUrl: 'https://raw.githubusercontent.com/Nicolas-de-Wolff/CanEat-For-Ever_assets/main/image/fond.png',
  musicUrl: 'https://raw.githubusercontent.com/Nicolas-de-Wolff/CanEat-For-Ever_assets/main/Music/Cover%20Megaman%204%20Dr%20Cossack%20Stage%203%20%26%204.mp3',
  isMusicOn: true,
};

export const FONTS = [
  { name: 'TWK Burns Regular', value: "'TWKBurns-Regular', sans-serif" },
  { name: 'TWK Burns ExtraBold', value: "'TWKBurns-ExtraBold', sans-serif" },
  { name: 'TWK Burns ExtraLight', value: "'TWKBurns-ExtraLight', sans-serif" }
];
