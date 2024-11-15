import React, { useState, useEffect, useRef } from 'react';
import { Timer, Trophy, Play, RefreshCw, Keyboard } from 'lucide-react';

const GAME_DURATION = 30;
const WORDS = [
  'typescript', 'javascript', 'react', 'programming', 'developer',
  'interface', 'component', 'function', 'variable', 'constant',
  'algorithm', 'database', 'frontend', 'backend', 'fullstack',
  'application', 'framework', 'library', 'module', 'package'
];

function App() {
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'finished'>('idle');
  const [currentWord, setCurrentWord] = useState('');
  const [input, setInput] = useState('');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [mistakes, setMistakes] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const [wordsPerMinute, setWordsPerMinute] = useState(0);

  useEffect(() => {
    if (gameState === 'playing') {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            endGame();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [gameState]);

  useEffect(() => {
    if (gameState === 'playing') {
      generateNewWord();
    }
  }, [gameState]);

  const startGame = () => {
    setGameState('playing');
    setTimeLeft(GAME_DURATION);
    setScore(0);
    setMistakes(0);
    setInput('');
    inputRef.current?.focus();
  };

  const endGame = () => {
    setGameState('finished');
    setWordsPerMinute(Math.round((score / GAME_DURATION) * 60));
  };

  const generateNewWord = () => {
    const randomIndex = Math.floor(Math.random() * WORDS.length);
    setCurrentWord(WORDS[randomIndex]);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInput(value);

    if (value === currentWord) {
      setScore((prev) => prev + 1);
      setInput('');
      generateNewWord();
    } else if (value.length === currentWord.length && value !== currentWord) {
      setMistakes((prev) => prev + 1);
      setInput('');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-purple-100 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Keyboard className="w-8 h-8 text-indigo-600" />
            <h1 className="text-4xl font-bold text-gray-800">Speed Typer</h1>
          </div>
          <p className="text-gray-600">Test your typing speed and accuracy</p>
        </div>

        {gameState === 'idle' && (
          <button
            onClick={startGame}
            className="w-full py-4 bg-indigo-600 text-white rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-indigo-700 transition-colors"
          >
            <Play className="w-5 h-5" />
            Start Game
          </button>
        )}

        {gameState === 'playing' && (
          <>
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2">
                <Timer className="w-5 h-5 text-indigo-600" />
                <span className="text-xl font-semibold">{timeLeft}s</span>
              </div>
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-indigo-600" />
                <span className="text-xl font-semibold">{score}</span>
              </div>
            </div>

            <div className="relative mb-6">
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-indigo-600 transition-all duration-1000"
                  style={{ width: `${(timeLeft / GAME_DURATION) * 100}%` }}
                />
              </div>
            </div>

            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">{currentWord}</h2>
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={handleInputChange}
                className="w-full text-center text-xl p-4 rounded-lg border-2 border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 transition-colors"
                placeholder="Type the word here..."
                autoFocus
              />
            </div>

            <div className="text-center text-gray-600">
              Mistakes: {mistakes}
            </div>
          </>
        )}

        {gameState === 'finished' && (
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Game Over!</h2>
            <div className="space-y-2 mb-6">
              <p className="text-xl">Words Per Minute: <span className="font-bold text-indigo-600">{wordsPerMinute}</span></p>
              <p className="text-xl">Words Typed: <span className="font-bold text-indigo-600">{score}</span></p>
              <p className="text-xl">Accuracy: <span className="font-bold text-indigo-600">
                {score + mistakes === 0 ? '0' : Math.round((score / (score + mistakes)) * 100)}%
              </span></p>
            </div>
            <button
              onClick={startGame}
              className="w-full py-4 bg-indigo-600 text-white rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-indigo-700 transition-colors"
            >
              <RefreshCw className="w-5 h-5" />
              Play Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;