"use client";

import { useEffect, useState } from "react";
import { shuffleArray } from "@/utils/shuffleArray";
import { useTimer } from "@/hooks/useTimer";

type GameState = "IDLE" | "PLAYING" | "RESULT";
type LastClickInfo = {
  number: number | null;
  status: "correct" | "incorrect" | null;
};

export default function SchulteTable() {
  const [gameState, setGameState] = useState<GameState>("IDLE");
  const [board, setBoard] = useState<number[]>([]);
  const [activeBoardSize, setActiveBoardSize] = useState<number>(5);
  const [currentTarget, setCurrentTarget] = useState<number>(1);
  const { time, isRunning, start, stop, reset } = useTimer();
  const [mistakes, setMistakes] = useState<number>(0);
  const [lastClick, setLastClick] = useState<LastClickInfo>({
    number: null,
    status: null,
  });

  const generateTable = (size: number) => {
    const totalCells = size * size;
    const initialBoard = Array.from({ length: totalCells }, (_, i) => i + 1);
    return shuffleArray(initialBoard);
  };

  useEffect(() => {
    if (lastClick.status) {
      const timerId = setTimeout(() => {
        setLastClick({ number: null, status: null });
      }, 200);

      return () => clearTimeout(timerId);
    }
  }, [lastClick]);

  const handleStartGame = (size: number) => {
    reset();
    setActiveBoardSize(size);
    setBoard(generateTable(size));
    setCurrentTarget(1);
    setGameState("PLAYING");
    setMistakes(0);
    setLastClick({ number: null, status: null });
  };

  const handleCellClick = (clickedNumber: number) => {
    if (!isRunning && clickedNumber === 1) {
      start();
    }
    if (clickedNumber === currentTarget) {
      setLastClick({ number: clickedNumber, status: "correct" });
      if (currentTarget === activeBoardSize * activeBoardSize) {
        stop();
        setGameState("RESULT");
      } else {
        setCurrentTarget((prev) => prev + 1);
      }
    } else {
      if (isRunning) {
        setMistakes((prev) => prev + 1);
        setLastClick({ number: clickedNumber, status: "incorrect" });
      }
    }
  };

  const handlePlayAgain = () => {
    setGameState("IDLE");
    reset();
  };

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-xl mx-auto p-4">
      {gameState === "IDLE" && (
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold">Таблиці Шульте</h2>
          <p className="text-gray-400">
            Знайдіть числа від 1 до {activeBoardSize * activeBoardSize} якомога
            швидше.
          </p>
          <button
            onClick={() => handleStartGame(5)}
            className="bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-xl font-bold transition-all"
          >
            Почати
          </button>
        </div>
      )}
      {gameState === "PLAYING" && (
        <div className="w-full space-y-4">
          <div className="text-xl font-semibold text-center">
            Помилок:
            <span className="text-red-500 text-2xl">{mistakes}</span> <br />
            Наступне число:
            <span className="text-blue-500 text-2xl">{currentTarget}</span>
          </div>

          <div
            className="grid gap-2 w-full aspect-square"
            style={{ gridTemplateColumns: `repeat(${activeBoardSize}, 1fr)` }}
          >
            {board.map((number, index) => {
              const isCorrect =
                lastClick.number === number && lastClick.status === "correct";
              const isWrong =
                lastClick.number === number && lastClick.status === "incorrect";

              return (
                <button
                  key={`${number}-${index}`}
                  onClick={() => handleCellClick(number)}
                  className={`
        border-2 transition-all duration-200 text-xl font-medium rounded-md aspect-square
        ${isCorrect ? "border-green-500 bg-green-900/20" : ""}
        ${isWrong ? "border-red-500 bg-red-900/20 animate-shake" : ""}
        ${
          !isCorrect && !isWrong
            ? "border-gray-700 bg-gray-800 hover:bg-gray-700 active:bg-blue-900"
            : ""
        }
      `}
                >
                  {number}
                </button>
              );
            })}
          </div>
          <button
            onClick={handlePlayAgain}
            className="bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-xl font-bold transition-all"
          >
            Перервати гру
          </button>
        </div>
      )}

      {gameState === "RESULT" && (
        <div>
          <p>Помилок: {mistakes}</p>
          <p>Час: {(time / 1000).toFixed(2)} с</p>
        </div>
      )}
    </div>
  );
}
