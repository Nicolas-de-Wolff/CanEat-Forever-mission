
export enum GameStatus {
  START = 'START',
  PLAYING = 'PLAYING',
  GAMEOVER = 'GAMEOVER',
  WIN = 'WIN'
}

export interface GameConfig {
  speed: number; // Intervalle en ms entre chaque mouvement
  fontFamily: string;
  headImageUrl: string;
  bodyImageUrl: string;
  grainImageUrl: string;
  backgroundImageUrl: string;
  musicUrl: string;
  isMusicOn: boolean;
}

export interface Position {
  x: number;
  y: number;
}

export enum Direction {
  UP = 'UP',
  DOWN = 'DOWN',
  LEFT = 'LEFT',
  RIGHT = 'RIGHT'
}
