import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CalculatorInputs, CalculationResult } from '../types';
import { calculateFTTH } from '../utils/calculator';
import { InputForm } from './InputForm';
import { SummarySection } from './ResultCard';
import { DistributionList } from './DistributionList';
import { Info } from 'lucide-react';

const DEFAULT_INPUTS: CalculatorInputs = {
  cores: 1,
  splitterL1: 4,
  splitterL2: 8,
  odpCapacity: 8,
  distance: 1.0,
};

export const ODPCalculator: React.FC = () => {
  const [inputs, setInputs] = useState<CalculatorInputs>(() => {
    const saved = localStorage.getItem('sipaling-teknisi-data');
    return saved ? JSON.parse(saved) : DEFAULT_INPUTS;
  });

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    localStorage.setItem('sipaling-teknisi-data', JSON.stringify(inputs));
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 300);
    return () => clearTimeout(timer);
  }, [inputs]);

  const result: CalculationResult = useMemo(() => calculateFTTH(inputs), [inputs]);

  const handleReset = () => {
    setInputs(DEFAULT_INPUTS);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="lg:col-span-4"
      >
        <InputForm 
          inputs={inputs} 
          setInputs={setInputs} 
          onReset={handleReset} 
        />
        
        <div className="mt-6 p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-xl flex gap-3">
          <Info size={20} className="text-emerald-400 shrink-0" />
          <p className="text-xs text-zinc-400 leading-relaxed">
            <strong className="text-emerald-400">Tips:</strong> Gunakan rasio splitter yang sesuai dengan standar link budget (max 28dB) untuk menjaga kualitas sinyal ONT pelanggan.
          </p>
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="lg:col-span-8 space-y-6"
      >
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-sm font-bold text-zinc-500 uppercase tracking-widest">Live Analysis</h2>
          {isLoading && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-2 text-emerald-400 text-xs"
            >
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-ping" />
              Calculating...
            </motion.div>
          )}
        </div>

        <SummarySection 
          totalCustomers={result.totalCustomers}
          odpCount={result.odpCount}
          totalLoss={result.totalLoss}
          isHighLoss={result.isHighLoss}
        />

        <AnimatePresence mode="wait">
          <DistributionList 
            key={JSON.stringify(result.distribution)}
            distribution={result.distribution} 
          />
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
