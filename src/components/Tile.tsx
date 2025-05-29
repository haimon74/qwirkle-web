import React from 'react';
import { Tile, Color } from '../game/types';
import { COLOR_TO_HEX } from '../game/colors';

interface TileProps {
  tile: Tile;
  onClick?: () => void;
  selected?: boolean;
}

export const TileComponent: React.FC<TileProps> = ({ tile, onClick, selected }) => {
  return (
    <div
      onClick={onClick}
      style={{
        width: 50,
        height: 50,
        border: selected ? '3px solid #333' : '2px solid #222',
        borderRadius: 6,
        background: '#111',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: 4,
        cursor: onClick ? 'pointer' : 'default',
        boxShadow: selected ? '0 0 8px #333' : undefined,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div style={{
        width: '90%',
        height: '90%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <div style={{
          fontSize: '42px',
          color: COLOR_TO_HEX[tile.color],
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '100%',
          userSelect: 'none',
          transform: 'scale(1.1) translateY(-3px)',
          lineHeight: '1',
          textAlign: 'center',
        }}>
          {tile.shape}
        </div>
      </div>
    </div>
  );
}; 