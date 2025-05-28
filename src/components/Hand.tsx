import React from 'react';
import { Tile } from '../game/types';
import { TileComponent } from './Tile';

interface HandProps {
  tiles: Tile[];
  onTileClick?: (tile: Tile) => void;
  selectedTileId?: string;
}

export const Hand: React.FC<HandProps> = ({ tiles, onTileClick, selectedTileId }) => (
  <div style={{ display: 'flex', flexDirection: 'row', margin: '12px 0' }}>
    {tiles.map(tile => (
      <TileComponent
        key={tile.id}
        tile={tile}
        onClick={onTileClick ? () => onTileClick(tile) : undefined}
        selected={selectedTileId === tile.id}
      />
    ))}
  </div>
); 