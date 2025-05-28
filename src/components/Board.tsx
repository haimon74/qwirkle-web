import React from 'react';
import { Tile } from '../game/types';
import { TileComponent } from './Tile';

interface BoardProps {
  board: Record<string, Tile>;
  onTilePlace?: (pos: { x: number; y: number }) => void;
  selectedTile?: Tile | null;
}

// Find board bounds
function getBoardBounds(board: Record<string, Tile>) {
  const positions = Object.keys(board).map(key => key.split(',').map(Number));
  if (positions.length === 0) return { minX: 0, maxX: 5, minY: 0, maxY: 5 };
  const xs = positions.map(([x]) => x);
  const ys = positions.map(([, y]) => y);
  return {
    minX: Math.min(...xs, 0) - 2,
    maxX: Math.max(...xs, 5) + 2,
    minY: Math.min(...ys, 0) - 2,
    maxY: Math.max(...ys, 5) + 2,
  };
}

export const Board: React.FC<BoardProps> = ({ board, onTilePlace, selectedTile }) => {
  const { minX, maxX, minY, maxY } = getBoardBounds(board);
  const rows = [];
  for (let y = minY; y <= maxY; y++) {
    const cells = [];
    for (let x = minX; x <= maxX; x++) {
      const key = `${x},${y}`;
      const tile = board[key];
      if (tile) {
        cells.push(<td key={key}><TileComponent tile={tile} /></td>);
      } else {
        cells.push(
          <td
            key={key}
            style={{ width: 54, height: 54, background: '#fff', border: '1px solid #333', cursor: selectedTile && onTilePlace ? 'pointer' : 'default' }}
            onClick={selectedTile && onTilePlace ? () => onTilePlace({ x, y }) : undefined}
          />
        );
      }
    }
    rows.push(<tr key={y}>{cells}</tr>);
  }
  return (
    <table style={{ borderCollapse: 'collapse', margin: '16px 0' }}>
      <tbody>{rows}</tbody>
    </table>
  );
}; 