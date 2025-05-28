export type Color = 'red' | 'orange' | 'yellow' | 'green' | 'blue' | 'purple';
export type Shape = 'circle' | 'square' | 'triangle' | 'hexagon' | 'octagon' | 'starofdavid';

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
} 