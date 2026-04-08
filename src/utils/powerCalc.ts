import { PowerInputs, PowerResult, POWER_SPLITTER_LOSS, FIBER_LOSS_PER_KM } from '../types';

export const calculatePower = (inputs: PowerInputs): PowerResult => {
  const { inputLaser, splitterRatio, splitterPLC, distance } = inputs;

  const lossRatio = POWER_SPLITTER_LOSS[splitterRatio] || 0;
  const lossPLC = POWER_SPLITTER_LOSS[splitterPLC] || 0;
  const distanceLoss = distance * FIBER_LOSS_PER_KM;

  const outputLaser = inputLaser - lossRatio - lossPLC - distanceLoss;
  
  // Next ODP calculation: How many more 1:16 splits (14dB) can fit before -28dBm
  const remainingBudget = outputLaser - (-28);
  const nextODP = Math.max(0, Math.floor(remainingBudget / 14));

  let status: 'safe' | 'warning' | 'danger' = 'safe';
  if (outputLaser < -28) {
    status = 'danger';
  } else if (outputLaser < -20) {
    status = 'warning';
  }

  return {
    outputLaser: Number(outputLaser.toFixed(2)),
    nextODP,
    status,
  };
};
