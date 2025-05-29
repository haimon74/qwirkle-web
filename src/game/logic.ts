import { Color, Shape, Tile, GameConfig, SimpleShape } from './types';

const ALL_COLORS: Color[] = ['red', 'orange', 'yellow', 'green', 'deep_sky_blue', 'purple', 'pink'];
const ALL_SIMPLE_SHAPES: SimpleShape[] = ['♠', '♥', '♦', '♣', '▲', '▣', '★'];

export function generateTiles(config: GameConfig): Tile[] {
  const tiles: Tile[] = [];
  const colors = ALL_COLORS.slice(0, config.numColors);
  const shapes = ALL_SIMPLE_SHAPES.slice(0, config.numShapes);
  for (const color of colors) {
    for (const shape of shapes) {
      for (let i = 0; i < 3; i++) {
        tiles.push({ 
          color, 
          shape, 
          id: `${color}-${shape}-${i}` 
        });
      }
    }
  }
  return tiles;
}

export function shuffle<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

export function drawTiles(bag: Tile[], count: number): { drawn: Tile[]; bag: Tile[] } {
  const drawn = bag.slice(0, count);
  const newBag = bag.slice(count);
  return { drawn, bag: newBag };
}

// Helper to get neighbors
function getNeighbors(board: Record<string, Tile>, x: number, y: number) {
  return [
    board[`${x-1},${y}`],
    board[`${x+1},${y}`],
    board[`${x},${y-1}`],
    board[`${x},${y+1}`],
  ];
}

// Helper to get a line in a direction
function getLine(board: Record<string, Tile>, x: number, y: number, dx: number, dy: number) {
  const line: Tile[] = [];
  let nx = x + dx, ny = y + dy;
  while (board[`${nx},${ny}`]) {
    line.push(board[`${nx},${ny}`]);
    nx += dx;
    ny += dy;
  }
  return line;
}

// Validate placement for a single tile
export function isValidPlacement(board: Record<string, Tile>, x: number, y: number, tile: Tile): boolean {
  // First move: allow anywhere
  if (Object.keys(board).length === 0) return true;
  // Must be adjacent to at least one tile
  const neighbors = getNeighbors(board, x, y).filter(Boolean);
  if (neighbors.length === 0) return false;
  // Check both row and column
  for (const [dx, dy] of [[1,0],[0,1]]) {
    const line = [
      ...getLine(board, x, y, -dx, -dy).reverse(),
      tile,
      ...getLine(board, x, y, dx, dy),
    ];
    if (line.length > 1) {
      const allSameColor = line.every(t => t.color === tile.color);
      const allSameShape = line.every(t => t.shape === tile.shape);
      if (!(allSameColor || allSameShape)) return false;
      // No duplicates
      const seen = new Set();
      for (const t of line) {
        const key = allSameColor ? t.shape : t.color;
        if (seen.has(key)) return false;
        seen.add(key);
      }
      if (line.length > 6) return false;
    }
  }
  return true;
} 