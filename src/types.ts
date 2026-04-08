export interface CalculatorInputs {
  cores: number;
  splitterL1: number;
  splitterL2: number;
  odpCapacity: number;
  distance: number;
}

export interface CalculationResult {
  totalCustomers: number;
  odpCount: number;
  distribution: number[];
  totalLoss: number;
  isHighLoss: boolean;
}

export const SPLITTER_LOSS: Record<number, number> = {
  2: 3.5,
  4: 7,
  8: 10.5,
  16: 14,
};

export const FIBER_LOSS_PER_KM = 0.35;
export const MAX_ALLOWED_LOSS = 28;

export interface PowerInputs {
  inputLaser: number;
  splitterRatio: string;
  splitterPLC: string;
  distance: number;
}

export interface PowerResult {
  outputLaser: number;
  nextODP: number;
  status: 'safe' | 'warning' | 'danger';
}

export const POWER_SPLITTER_LOSS: Record<string, number> = {
  // PLC Splitters
  "2": 3.5,
  "4": 7,
  "8": 10.5,
  "16": 14,
  "32": 17,
  "64": 20,
  // FBT Splitters (Unbalanced)
  "1:99": 21.0,
  "2:98": 18.2,
  "3:97": 16.2,
  "5:95": 14.2,
  "10:90": 11.0,
  "15:85": 9.0,
  "20:80": 7.6,
  "25:75": 6.6,
  "30:70": 5.8,
  "35:65": 5.1,
  "40:60": 4.5,
  "45:55": 4.0,
  "50:50": 3.6,
};

export const FBT_LOSS_TABLE: Record<string, { tap: number; through: number }> = {
  "1:99": { tap: 21.0, through: 0.2 },
  "2:98": { tap: 18.2, through: 0.3 },
  "3:97": { tap: 16.2, through: 0.4 },
  "5:95": { tap: 14.2, through: 0.5 },
  "10:90": { tap: 11.0, through: 0.7 },
  "15:85": { tap: 9.0, through: 1.0 },
  "20:80": { tap: 7.6, through: 1.3 },
  "25:75": { tap: 6.6, through: 1.6 },
  "30:70": { tap: 5.8, through: 2.0 },
  "35:65": { tap: 5.1, through: 2.4 },
  "40:60": { tap: 4.5, through: 2.8 },
  "45:55": { tap: 4.0, through: 3.2 },
  "50:50": { tap: 3.6, through: 3.6 },
};

export interface CascadedStage {
  id: string;
  fbtRatio: string;
  plcRatio: string; // "none", "2", "4", "8", "16"
  distance: number;
}
