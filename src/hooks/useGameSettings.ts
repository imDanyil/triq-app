"use client";

import { useState, useEffect } from "react";

export type DifficultyLevel = "easy" | "medium" | "hard" | "custom";

interface SavedState<T> {
  difficulty: DifficultyLevel;
  settings: T;
}

export function useGameSettings<T extends object>(
  presets: Record<Exclude<DifficultyLevel, "custom">, T>,
  storageKey: string,
) {
  const [difficulty, setDifficulty] = useState<DifficultyLevel>("medium");
  const [settings, setSettings] = useState<T>(presets.medium);

  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const savedItem = localStorage.getItem(storageKey);
      if (savedItem) {
        const parsed: SavedState<T> = JSON.parse(savedItem);
        if (parsed.difficulty && parsed.settings) {
          setDifficulty(parsed.difficulty);
          setSettings(parsed.settings);
        }
      }
    } catch (error) {
      console.error(`Помилка читання налаштувань для ${storageKey}:`, error);
    } finally {
      setIsLoaded(true);
    }
  }, [storageKey]);

  useEffect(() => {
    if (!isLoaded || typeof window === "undefined") return;

    try {
      const stateToSave: SavedState<T> = { difficulty, settings };
      localStorage.setItem(storageKey, JSON.stringify(stateToSave));
    } catch (error) {
      console.error(`Помилка збереження налаштувань для ${storageKey}:`, error);
    }
  }, [difficulty, settings, isLoaded, storageKey]);

  const applyPreset = (level: Exclude<DifficultyLevel, "custom">) => {
    setDifficulty(level);
    setSettings(presets[level]);
  };

  const updateSetting = <K extends keyof T>(key: K, value: T[K]) => {
    setDifficulty("custom");
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return {
    difficulty,
    settings,
    applyPreset,
    updateSetting,
    isLoaded,
  };
}
