const { useState, useEffect } = React;

function TicTacToe() {
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [scores, setScores] = useState({ x: 0, o: 0, draw: 0 });
  const [gameHistory, setGameHistory] = useState([]);

  // Check for winner (returns {player, line} or null)
  const calculateWinner = (squares) => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
      [0, 4, 8], [2, 4, 6] // diagonals
    ];

    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return { player: squares[a], line: [a, b, c] };
      }
    }
    return null;
  };

  // Check if board is full
  const isBoardFull = (squares) => {
    return squares.every(square => square !== null);
  };

  // Handle square click
  const handleClick = (i) => {
    if (squares[i] || calculateWinner(squares)) {
      return;
    }

    const newSquares = squares.slice();
    newSquares[i] = isXNext ? 'X' : 'O';
    setSquares(newSquares);
    setIsXNext(!isXNext);
  };

  // Reset game
  const resetGame = () => {
    setSquares(Array(9).fill(null));
    setIsXNext(true);
  };

  // Reset scores
  const resetScores = () => {
    setScores({ x: 0, o: 0, draw: 0 });
    setGameHistory([]);
  };

  // Get game status
  const getGameStatus = () => {
    const result = calculateWinner(squares);
    if (result) {
      return { type: 'winner', message: `🎉 Player ${result.player} wins!`, line: result.line };
    } else if (isBoardFull(squares)) {
      return { type: 'draw', message: "🤝 It's a draw!" };
    } else {
      return { type: 'next', message: `Next player: ${isXNext ? 'X' : 'O'}` };
    }
  };

  // Update scores when game ends
  useEffect(() => {
    const result = calculateWinner(squares);
    const isDraw = isBoardFull(squares) && !result;
    
    if (result || isDraw) {
      const newScores = { ...scores };
      if (result) {
        newScores[result.player.toLowerCase()]++;
      } else if (isDraw) {
        newScores.draw++;
      }
      setScores(newScores);
      
      // Add to game history
      setGameHistory(prev => [...prev, {
        winner: result ? result.player : 'draw',
        timestamp: new Date().toLocaleTimeString(),
        moves: squares.filter(sq => sq !== null).length
      }]);
    }
  }, [squares]);

  // Render square
  const renderSquare = (i) => {
    const result = gameStatus.type === 'winner' ? gameStatus : null;
    const isWinning = result && result.line.includes(i);
    return (
      <button
        className={`square ${squares[i] ? squares[i].toLowerCase() : ''} ${isWinning ? 'win' : ''}`}
        onClick={() => handleClick(i)}
        disabled={squares[i] || calculateWinner(squares)}
      >
        {squares[i]}
      </button>
    );
  };

  const gameStatus = getGameStatus();

  return (
    <div className="game-container">
      <h1>Tic Tac Toe</h1>
      
      <div className={`status ${gameStatus.type}`}>
        {gameStatus.message}
      </div>

      <div className="board">
        {Array(9).fill(null).map((_, i) => (
          <div key={i}>
            {renderSquare(i)}
          </div>
        ))}
      </div>

      <button className="reset-btn" onClick={resetGame}>
        New Game
      </button>

      <div className="game-info">
        <h3>Score Board</h3>
        <div className="score">
          <div className="score-item x">
            <strong>Player X</strong><br />
            {scores.x} wins
          </div>
          <div className="score-item o">
            <strong>Player O</strong><br />
            {scores.o} wins
          </div>
          <div className="score-item draw">
            <strong>Draws</strong><br />
            {scores.draw}
          </div>
        </div>
        
        <button 
          className="reset-btn" 
          onClick={resetScores}
          style={{ marginTop: '10px', fontSize: '0.9rem', padding: '10px 20px' }}
        >
          Reset Scores
        </button>

        {gameHistory.length > 0 && (
          <div style={{ marginTop: '20px', textAlign: 'left' }}>
            <h4>Recent Games:</h4>
            <div style={{ maxHeight: '150px', overflowY: 'auto', fontSize: '0.9rem' }}>
              {gameHistory.slice(-5).reverse().map((game, index) => (
                <div key={index} style={{ 
                  padding: '5px', 
                  margin: '2px 0', 
                  background: '#f8f9fa', 
                  borderRadius: '5px' 
                }}>
                  {game.timestamp} - {game.winner === 'draw' ? 'Draw' : `Player ${game.winner} wins`} 
                  ({game.moves} moves)
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
