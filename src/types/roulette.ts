export type RouletteCell = {
  id: number;
  value: number;
  color: 'red' | 'black';
};

export type RouletteResult = {
  cell: RouletteCell;
  timestamp: number;
};

export type RouletteState = {
  isSpinning: boolean;
  countdown: number;
  currentResult: RouletteResult | null;
  history: RouletteResult[];
  nextAutoSpin: number;
};