export type Color = 'red' | 'orange' | 'yellow' | 'green' | 'deep_sky_blue' | 'purple' | 'pink';

export type SimpleShape = '♠' | '♥' | '♦' | '♣' | '▲' | '▣' | '★';

export type Shape = SimpleShape;

export interface GameConfig {
  numColors: 6 | 7;
  numShapes: 6 | 7;
}

export interface Tile {
  color: Color;
  shape: Shape;
  id: string; // unique identifier for each tile instance
}

export interface Player {
  name: string;
  hand: Tile[];
  score: number;
  isComputer: boolean;
}

export interface GameState {
  board: Record<string, Tile>; // key: 'x,y', value: Tile
  bag: Tile[];
  players: Player[];
  currentPlayer: number;
  gameOver: boolean;
  winner?: number;
  config: GameConfig;
} 