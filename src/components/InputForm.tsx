import React from 'react';
import { CalculatorInputs } from '../types';
import { Settings2, Layers, Users, Zap, Ruler, HelpCircle } from 'lucide-react';
import { Tooltip } from './Tooltip';

interface InputFormProps {
  inputs: CalculatorInputs;
  setInputs: (inputs: CalculatorInputs) => void;
  onReset: () => void;
}

export const InputForm: React.FC<InputFormProps> = ({ inputs, setInputs, onReset }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const numValue = parseFloat(value) || 0;
    
    // Validation: No negative values
    const validatedValue = numValue < 0 ? 0 : numValue;

    setInputs({
      ...inputs,
      [name]: validatedValue,
    });
  };

  return (
    <div className="bg-zinc-900/50 border border-zinc-800 p-4 md:p-6 rounded-2xl shadow-xl backdrop-blur-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg md:text-xl font-semibold text-emerald-400 flex items-center gap-2">
          <Settings2 size={18} className="md:w-5 md:h-5" />
          Konfigurasi
        </h2>
        <button 
          onClick={onReset}
          className="text-[10px] md:text-xs text-zinc-500 hover:text-emerald-400 transition-colors uppercase tracking-wider font-bold"
        >
          Reset
        </button>
      </div>

      <div className="space-y-4 md:space-y-5">
        <div>
          <label className="block text-xs md:text-sm font-medium text-zinc-400 mb-2 flex items-center gap-2">
            <Zap size={14} className="text-emerald-500" />
            Jumlah Core
            <Tooltip content="Jumlah core kabel fiber optik utama yang digunakan dari OLT.">
              <HelpCircle size={12} className="text-zinc-600 hover:text-zinc-400 cursor-help" />
            </Tooltip>
          </label>
          <input
            type="number"
            name="cores"
            value={inputs.cores || ''}
            onChange={handleChange}
            placeholder="Contoh: 1"
            className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 md:py-3 text-sm md:text-base text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs md:text-sm font-medium text-zinc-400 mb-2 flex items-center gap-2">
              <Layers size={14} className="text-emerald-500" />
              Splitter L1
              <Tooltip content="Splitter tingkat pertama, biasanya berada di dalam ODC atau di awal jalur.">
                <HelpCircle size={12} className="text-zinc-600 hover:text-zinc-400 cursor-help" />
              </Tooltip>
            </label>
            <select
              name="splitterL1"
              value={inputs.splitterL1}
              onChange={handleChange}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 md:py-3 text-sm md:text-base text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all appearance-none"
            >
              <option value={2}>1:2</option>
              <option value={4}>1:4</option>
              <option value={8}>1:8</option>
            </select>
          </div>
          <div>
            <label className="block text-xs md:text-sm font-medium text-zinc-400 mb-2 flex items-center gap-2">
              <Layers size={14} className="text-emerald-500" />
              Splitter L2
              <Tooltip content="Splitter tingkat kedua, biasanya berada di dalam box ODP.">
                <HelpCircle size={12} className="text-zinc-600 hover:text-zinc-400 cursor-help" />
              </Tooltip>
            </label>
            <select
              name="splitterL2"
              value={inputs.splitterL2}
              onChange={handleChange}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 md:py-3 text-sm md:text-base text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all appearance-none"
            >
              <option value={4}>1:4</option>
              <option value={8}>1:8</option>
              <option value={16}>1:16</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs md:text-sm font-medium text-zinc-400 mb-2 flex items-center gap-2">
            <Users size={14} className="text-emerald-500" />
            Kapasitas ODP
            <Tooltip content="Jumlah port maksimal yang tersedia pada satu box ODP (umumnya 8 atau 16).">
              <HelpCircle size={12} className="text-zinc-600 hover:text-zinc-400 cursor-help" />
            </Tooltip>
          </label>
          <input
            type="number"
            name="odpCapacity"
            value={inputs.odpCapacity || ''}
            onChange={handleChange}
            placeholder="Contoh: 8 atau 16"
            className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 md:py-3 text-sm md:text-base text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
          />
        </div>

        <div className="pt-4 border-t border-zinc-800">
          <div className="flex items-center justify-between mb-2">
            <label className="block text-xs md:text-sm font-medium text-zinc-400 flex items-center gap-2">
              <Ruler size={14} className="text-emerald-500" />
              Jarak Kabel (km)
            </label>
            <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full font-bold uppercase">PRO</span>
          </div>
          <input
            type="number"
            step="0.1"
            name="distance"
            value={inputs.distance || ''}
            onChange={handleChange}
            placeholder="Contoh: 2.5"
            className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 md:py-3 text-sm md:text-base text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
          />
        </div>
      </div>
    </div>
  );
};
