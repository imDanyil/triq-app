"use client";

import { useEffect, useState } from "react";
import { shuffleArray } from "@/utils/shuffleArray";
import { useTimer } from "@/hooks/useTimer";
import { useGameSettings } from "@/hooks/useGameSettings";
import {
  SCHULTE_PRESETS,
  DIFFICULTY_LABELS,
  type SchulteSettings,
} from "./config";

type GameState = "IDLE" | "PLAYING" | "RESULT";
type LastClickInfo = {
  number: number | null;
  status: "correct" | "incorrect" | null;
};

export default function SchulteTable() {
  const [gameState, setGameState] = useState<GameState>("IDLE");

  const { difficulty, settings, applyPreset, isLoaded } =
    useGameSettings<SchulteSettings>(
      SCHULTE_PRESETS,
      "triq-schulte-settings-v1",
    );

  const [board, setBoard] = useState<number[]>([]);
  const [currentTarget, setCurrentTarget] = useState<number>(1);
  const [mistakes, setMistakes] = useState<number>(0);
  const [lastClick, setLastClick] = useState<LastClickInfo>({
    number: null,
    status: null,
  });

  const { time, isRunning, start, stop, reset } = useTimer();

  const generateTable = (size: number) => {
    const totalCells = size * size;
    const initialBoard = Array.from({ length: totalCells }, (_, i) => i + 1);
    return shuffleArray(initialBoard);
  };

  useEffect(() => {
    if (lastClick.status) {
      const timerId = setTimeout(
        () => setLastClick({ number: null, status: null }),
        200,
      );
      return () => clearTimeout(timerId);
    }
  }, [lastClick]);

  const handleStartGame = () => {
    reset();
    setBoard(generateTable(settings.gridSize));
    setCurrentTarget(1);
    setGameState("PLAYING");
    setMistakes(0);
    setLastClick({ number: null, status: null });
  };

  const handleCellClick = (clickedNumber: number) => {
    if (!isRunning && clickedNumber === 1 && currentTarget === 1) {
      start();
    }

    if (clickedNumber === currentTarget) {
      setLastClick({ number: clickedNumber, status: "correct" });

      const totalCells = settings.gridSize * settings.gridSize;

      if (currentTarget === totalCells) {
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

  if (!isLoaded)
    return (
      <div className="min-h-[300px] flex items-center justify-center">
        Завантаження...
      </div>
    );

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-xl mx-auto p-4">
      {gameState === "IDLE" && (
        <div className="text-center space-y-6 w-full">
          <h2 className="text-3xl font-bold">Таблиці Шульте</h2>

          <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-2xl space-y-4">
            <p className="text-gray-500 font-medium">Оберіть складність:</p>
            <div className="flex justify-center gap-2 flex-wrap">
              {(
                Object.keys(SCHULTE_PRESETS) as Array<
                  keyof typeof SCHULTE_PRESETS
                >
              ).map((level) => (
                <button
                  key={level}
                  onClick={() => applyPreset(level)}
                  className={`px-4 py-2 rounded-xl border-2 transition-all font-medium ${
                    difficulty === level
                      ? "border-blue-500 bg-blue-500 text-white shadow-lg shadow-blue-500/30"
                      : "border-gray-300 dark:border-gray-600 hover:border-blue-400"
                  }`}
                >
                  {DIFFICULTY_LABELS[level]}
                </button>
              ))}
            </div>
            <p className="text-sm text-gray-400">
              Поле: {settings.gridSize}x{settings.gridSize} • Чисел:{" "}
              {settings.gridSize ** 2}
            </p>
          </div>

          <button
            onClick={handleStartGame}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-bold text-xl transition-transform active:scale-95 shadow-xl shadow-blue-600/20"
          >
            Почати тренування
          </button>
        </div>
      )}

      {gameState === "PLAYING" && (
        <div className="w-full space-y-4 animate-in fade-in zoom-in duration-300">
          <div className="flex justify-between items-center bg-gray-100 dark:bg-gray-800 p-4 rounded-xl">
            <div className="text-center">
              <span className="text-xs text-gray-500 uppercase font-bold">
                Ціль
              </span>
              <div className="text-3xl font-bold text-blue-500">
                {currentTarget}
              </div>
            </div>

            <div className="text-center">
              <span className="text-xs text-gray-500 uppercase font-bold">
                Час
              </span>
              <div className="text-2xl font-mono">
                {(time / 1000).toFixed(2)}s
              </div>
            </div>

            <div className="text-center">
              <span className="text-xs text-gray-500 uppercase font-bold">
                Помилки
              </span>
              <div
                className={`text-2xl font-bold ${mistakes > 0 ? "text-red-500" : "text-gray-400"}`}
              >
                {mistakes}
              </div>
            </div>
          </div>

          <div
            className="grid gap-2 w-full aspect-square"
            style={{ gridTemplateColumns: `repeat(${settings.gridSize}, 1fr)` }}
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
                    border-2 transition-all duration-100 text-xl sm:text-2xl font-bold rounded-xl flex items-center justify-center
                    ${isCorrect ? "border-green-500 bg-green-500/50 text-white scale-95" : ""}
                    ${isWrong ? "border-red-500 bg-red-500/50 text-white animate-shake" : ""}
                    ${
                      !isCorrect && !isWrong
                        ? "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 active:scale-95 shadow-sm"
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
            className="w-full py-3 text-gray-500 hover:text-red-500 transition-colors"
          >
            Здатись
          </button>
        </div>
      )}

      {gameState === "RESULT" && (
        <div className="text-center space-y-6 w-full animate-in slide-in-from-bottom-10 fade-in duration-500">
          <div className="text-6xl">🏆</div>
          <h2 className="text-3xl font-bold">Результат</h2>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-2xl">
              <div className="text-sm text-gray-500">Час</div>
              <div className="text-3xl font-bold">
                {(time / 1000).toFixed(2)} с
              </div>
            </div>
            <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-2xl">
              <div className="text-sm text-gray-500">Помилки</div>
              <div className="text-3xl font-bold text-red-500">{mistakes}</div>
            </div>
          </div>

          <button
            onClick={handlePlayAgain}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-bold text-xl"
          >
            Грати ще раз
          </button>
        </div>
      )}
    </div>
  );
}
