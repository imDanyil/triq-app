export interface SchulteSettings {
  gridSize: number;
}

export const SCHULTE_PRESETS: Record<
  "easy" | "medium" | "hard",
  SchulteSettings
> = {
  easy: { gridSize: 3 },
  medium: { gridSize: 5 },
  hard: { gridSize: 7 },
};

export const DIFFICULTY_LABELS: Record<string, string> = {
  easy: "Легко",
  medium: "Середньо",
  hard: "Важко",
  custom: "Свій",
};
