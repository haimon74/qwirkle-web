import React from 'react';
import { Tile } from '../game/types';

interface TileProps {
  tile: Tile;
  onClick?: () => void;
  selected?: boolean;
}

const shapeSVG = (shape: string, color: string) => {
  switch (shape) {
    case 'circle':
      return <circle cx="25" cy="25" r="18" fill={color} />;
    case 'square':
      return <rect x="10" y="10" width="30" height="30" fill={color} />;
    case 'triangle':
      return <polygon points="25,8 42,42 8,42" fill={color} />;
    case 'hexagon':
      return <polygon points="25,7 43,17 43,33 25,43 7,33 7,17" fill={color} />;
    case 'octagon':
      return <polygon points="16,7 34,7 43,16 43,34 34,43 16,43 7,34 7,16" fill={color} />;
    case 'starofdavid':
      return (
        <g fill={color}>
          <polygon points="25,8 32,21 46,21 35,30 39,43 25,35 11,43 15,30 4,21 18,21" />
          <polygon points="25,42 32,29 46,29 35,20 39,7 25,15 11,7 15,20 4,29 18,29" />
        </g>
      );
    default:
      return null;
  }
};

export const TileComponent: React.FC<TileProps> = ({ tile, onClick, selected }) => (
  <div
    onClick={onClick}
    style={{
      width: 50,
      height: 50,
      border: selected ? '3px solid #333' : '2px solid #222',
      borderRadius: 6,
      background: '#111',
      display: 'inline-block',
      margin: 4,
      cursor: onClick ? 'pointer' : 'default',
      boxShadow: selected ? '0 0 8px #333' : undefined,
    }}
  >
    <svg width={50} height={50} viewBox="0 0 50 50">
      {shapeSVG(tile.shape, tile.color)}
    </svg>
  </div>
); 