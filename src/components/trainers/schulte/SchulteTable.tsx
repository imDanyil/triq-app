"use client";

import { useState } from "react";
import { shuffleArray } from "@/utils/shuffleArray";

type GameState = "IDLE" | "PLAYING" | "RESULT";

export default function SchulteTable() {
  const [gameState, setGameState] = useState<GameState>("IDLE");

  const generateTable = (size: number) => {
    const totalCells = size * size;
    const initialBoard = Array.from({ length: totalCells }, (_, i) => i + 1);
    return shuffleArray(initialBoard);
  };
}
