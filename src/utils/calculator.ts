import { 
  CalculatorInputs, 
  CalculationResult, 
  SPLITTER_LOSS, 
  FIBER_LOSS_PER_KM, 
  MAX_ALLOWED_LOSS 
} from '../types';

export const calculateFTTH = (inputs: CalculatorInputs): CalculationResult => {
  const { cores, splitterL1, splitterL2, odpCapacity, distance } = inputs;

  const totalCustomers = cores * splitterL1 * splitterL2;
  const odpCount = Math.ceil(totalCustomers / odpCapacity) || 0;

  // Distribution logic
  const distribution: number[] = [];
  let remaining = totalCustomers;
  for (let i = 0; i < odpCount; i++) {
    const currentODP = Math.min(remaining, odpCapacity);
    distribution.push(currentODP);
    remaining -= currentODP;
  }

  // Loss Calculation
  const lossL1 = SPLITTER_LOSS[splitterL1] || 0;
  const lossL2 = SPLITTER_LOSS[splitterL2] || 0;
  const distanceLoss = distance * FIBER_LOSS_PER_KM;
  const totalLoss = lossL1 + lossL2 + distanceLoss;

  return {
    totalCustomers,
    odpCount,
    distribution,
    totalLoss: Number(totalLoss.toFixed(2)),
    isHighLoss: totalLoss > MAX_ALLOWED_LOSS,
  };
};
