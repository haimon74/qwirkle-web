import React from 'react';
import { Player } from '../game/types';

interface ScoreboardProps {
  players: Player[];
  currentPlayer: number;
}

export const Scoreboard: React.FC<ScoreboardProps> = ({ players, currentPlayer }) => (
  <div style={{ display: 'flex', gap: 24, margin: '12px 0' }}>
    {players.map((player, idx) => (
      <div key={player.name} style={{ fontWeight: idx === currentPlayer ? 'bold' : 'normal' }}>
        {player.name} {player.isComputer ? '(Computer)' : ''}: {player.score}
      </div>
    ))}
  </div>
); 