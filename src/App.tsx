import React, { useState, useEffect } from 'react';
import { generateTiles, shuffle, drawTiles, isValidPlacement } from './game/logic';
import { GameState, Tile, Player, GameConfig } from './game/types';
import { Board } from './components/Board';
import { Hand } from './components/Hand';
import { Scoreboard } from './components/Scoreboard';

const DEFAULT_CONFIG: GameConfig = {
  numColors: 6,
  numShapes: 6,
};

function initialGameState(config: GameConfig = DEFAULT_CONFIG): GameState {
  let bag = shuffle(generateTiles(config));
  const players: Player[] = [
    { name: 'You', hand: [], score: 0, isComputer: false },
    { name: 'Computer', hand: [], score: 0, isComputer: true },
  ];
  for (let i = 0; i < 2; i++) {
    const result = drawTiles(bag, 6);
    players[i].hand = result.drawn;
    bag = result.bag;
  }
  return {
    board: {},
    bag,
    players,
    currentPlayer: 0,
    gameOver: false,
    config,
  };
}

const ConfigModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  config: GameConfig;
  onConfigChange: (key: keyof GameConfig, value: any) => void;
  onStartGame: () => void;
}> = ({ isOpen, onClose, config, onConfigChange, onStartGame }) => {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
    }}>
      <div style={{
        background: 'white',
        padding: 24,
        borderRadius: 8,
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
        minWidth: 300,
      }}>
        <h2 style={{ marginTop: 0, marginBottom: 20 }}>New Game Configuration</h2>
        
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', marginBottom: 8 }}>Number of Colors:</label>
          <div style={{ display: 'flex', gap: 16 }}>
            <label>
              <input
                type="radio"
                name="numColors"
                value={6}
                checked={config.numColors === 6}
                onChange={() => onConfigChange('numColors', 6)}
              />
              6 Colors
            </label>
            <label>
              <input
                type="radio"
                name="numColors"
                value={7}
                checked={config.numColors === 7}
                onChange={() => onConfigChange('numColors', 7)}
              />
              7 Colors
            </label>
          </div>
        </div>
        
        <div style={{ marginBottom: 24 }}>
          <label style={{ display: 'block', marginBottom: 8 }}>Number of Shapes:</label>
          <div style={{ display: 'flex', gap: 16 }}>
            <label>
              <input
                type="radio"
                name="numShapes"
                value={6}
                checked={config.numShapes === 6}
                onChange={() => onConfigChange('numShapes', 6)}
              />
              6  Shapes
            </label>
            <label>
              <input
                type="radio"
                name="numShapes"
                value={7}
                checked={config.numShapes === 7}
                onChange={() => onConfigChange('numShapes', 7)}
              />
              7 Shapes
            </label>
          </div>
        </div>

        <div style={{ 
          display: 'flex', 
          gap: 12,
          justifyContent: 'flex-end',
        }}>
          <button
            onClick={onClose}
            style={{
              padding: '8px 16px',
              borderRadius: 4,
              border: '1px solid #ccc',
              background: '#f5f5f5',
              cursor: 'pointer',
              fontSize: 16,
            }}
          >
            Cancel
          </button>
          <button
            onClick={onStartGame}
            style={{
              padding: '8px 16px',
              borderRadius: 4,
              border: '1px solid #4CAF50',
              background: '#4CAF50',
              color: 'white',
              cursor: 'pointer',
              fontSize: 16,
            }}
          >
            Start Game
          </button>
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [game, setGame] = useState<GameState>(initialGameState());
  const [selectedTileId, setSelectedTileId] = useState<string | null>(null);
  const [gameConfig, setGameConfig] = useState<GameConfig>(DEFAULT_CONFIG);
  const [showConfig, setShowConfig] = useState(false);

  const currentPlayer = game.players[game.currentPlayer];
  const isHumanTurn = !currentPlayer.isComputer && !game.gameOver;

  const checkEndGame = (newPlayers: Player[], newBag: Tile[]): { gameOver: boolean; winner?: number } => {
    const bagEmpty = newBag.length === 0;
    const playerOut = newPlayers.findIndex(p => p.hand.length === 0);
    if (bagEmpty && playerOut !== -1) {
      // Endgame bonus
      const updatedPlayers = newPlayers.map((p, idx) => idx === playerOut ? { ...p, score: p.score + 6 } : p);
      // Determine winner
      const maxScore = Math.max(...updatedPlayers.map(p => p.score));
      const winner = updatedPlayers.findIndex(p => p.score === maxScore);
      setGame(g => ({ ...g, players: updatedPlayers }));
      return { gameOver: true, winner };
    }
    return { gameOver: false };
  };

  // Computer AI move
  useEffect(() => {
    if (game.players[game.currentPlayer].isComputer && !game.gameOver) {
      const board = game.board;
      const hand = game.players[1].hand;
      // Find all empty positions adjacent to existing tiles
      const positions = new Set<string>();
      if (Object.keys(board).length === 0) {
        positions.add('0,0');
      } else {
        for (const key of Object.keys(board)) {
          const [x, y] = key.split(',').map(Number);
          for (const [dx, dy] of [[1,0],[-1,0],[0,1],[0,-1]]) {
            const nx = x + dx, ny = y + dy;
            const nkey = `${nx},${ny}`;
            if (!board[nkey]) positions.add(nkey);
          }
        }
      }
      let moveMade = false;
      for (const tile of hand) {
        for (const pos of Array.from(positions)) {
          const [x, y] = pos.split(',').map(Number);
          if (isValidPlacement(board, x, y, tile)) {
            // Make the move
            const newBoard = { ...board, [pos]: tile };
            const newHand = hand.filter(t => t.id !== tile.id);
            let newBag = game.bag;
            if (newBag.length > 0) {
              const draw = drawTiles(newBag, 1);
              newHand.push(...draw.drawn);
              newBag = draw.bag;
            }
            const newPlayers = game.players.map((p, idx) =>
              idx === 1 ? { ...p, hand: newHand } : p
            );
            const end = checkEndGame(newPlayers, newBag);
            setTimeout(() => {
              setGame({
                ...game,
                board: newBoard,
                bag: newBag,
                players: newPlayers,
                currentPlayer: 0,
                gameOver: end.gameOver,
                winner: end.winner,
              });
            }, 700);
            moveMade = true;
            break;
          }
        }
        if (moveMade) break;
      }
      if (!moveMade) {
        // No valid move, skip turn
        setTimeout(() => {
          setGame({ ...game, currentPlayer: 0, gameOver: false });
        }, 700);
      }
    }
  }, [game]);

  const handleTileClick = (tile: Tile) => {
    if (!isHumanTurn) return;
    setSelectedTileId(tile.id === selectedTileId ? null : tile.id);
  };

  const handleTilePlace = ({ x, y }: { x: number; y: number }) => {
    if (!isHumanTurn || !selectedTileId) return;
    const tile = currentPlayer.hand.find(t => t.id === selectedTileId);
    if (!tile) return;
    const key = `${x},${y}`;
    if (game.board[key]) return; // already occupied
    // Validate placement rules
    if (!isValidPlacement(game.board, x, y, tile)) {
      alert('Invalid placement!');
      return;
    }
    const newBoard = { ...game.board, [key]: tile };
    const newHand = currentPlayer.hand.filter(t => t.id !== selectedTileId);
    let newBag = game.bag;
    if (newBag.length > 0) {
      const draw = drawTiles(newBag, 1);
      newHand.push(...draw.drawn);
      newBag = draw.bag;
    }
    const newPlayers = game.players.map((p, idx) =>
      idx === game.currentPlayer ? { ...p, hand: newHand } : p
    );
    const end = checkEndGame(newPlayers, newBag);
    setGame({
      ...game,
      board: newBoard,
      bag: newBag,
      players: newPlayers,
      currentPlayer: (game.currentPlayer + 1) % 2,
      gameOver: end.gameOver,
      winner: end.winner,
    });
    setSelectedTileId(null);
  };

  const handleNewGameClick = () => {
    setShowConfig(true);
  };

  const handleConfigChange = (key: keyof GameConfig, value: any) => {
    setGameConfig(prev => ({ ...prev, [key]: value }));
  };

  const handleStartGame = () => {
    setGame(initialGameState(gameConfig));
    setSelectedTileId(null);
    setShowConfig(false);
  };

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', minHeight: '100vh', padding: 24, paddingTop: 0 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h1 style={{ margin: 0 }}>Tiling Race</h1>
        <button
          style={{ 
            padding: '8px 20px', 
            fontSize: 18, 
            borderRadius: 6, 
            border: '1px solid #888', 
            background: '#f5f5f5', 
            cursor: 'pointer',
          }}
          onClick={handleNewGameClick}
        >
          New Game
        </button>
      </div>

      <ConfigModal
        isOpen={showConfig}
        onClose={() => setShowConfig(false)}
        config={gameConfig}
        onConfigChange={handleConfigChange}
        onStartGame={handleStartGame}
      />

      {game.gameOver && (
        <div style={{ fontSize: 24, fontWeight: 'bold', color: '#ff9800', marginBottom: 16 }}>
          Game Over! Winner: {game.winner !== undefined ? game.players[game.winner].name : 'Tie!'}
        </div>
      )}

      <div>
        <Hand tiles={game.players[0].hand} onTileClick={handleTileClick} selectedTileId={selectedTileId || undefined} />
      </div>
      <Board board={game.board} onTilePlace={handleTilePlace} selectedTile={currentPlayer.hand.find(t => t.id === selectedTileId) || null} />
      <Scoreboard players={game.players} currentPlayer={game.currentPlayer} />
    </div>
  );
};

export default App;
