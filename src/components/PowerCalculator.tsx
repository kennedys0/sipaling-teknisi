import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'motion/react';
import { PowerInputs } from '../types';
import { calculatePower } from '../utils/powerCalc';
import { Radio, Zap, Ruler, Layers, Activity, Info, HelpCircle } from 'lucide-react';
import { Tooltip } from './Tooltip';

const DEFAULT_POWER_INPUTS: PowerInputs = {
  inputLaser: 2,
  splitterRatio: "8",
  splitterPLC: "8",
  distance: 1.0,
};

export const PowerCalculator: React.FC = () => {
  const [inputs, setInputs] = useState<PowerInputs>(() => {
    const saved = localStorage.getItem('sipaling-teknisi-power');
    return saved ? JSON.parse(saved) : DEFAULT_POWER_INPUTS;
  });

  useEffect(() => {
    localStorage.setItem('sipaling-teknisi-power', JSON.stringify(inputs));
  }, [inputs]);

  const result = useMemo(() => calculatePower(inputs), [inputs]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setInputs({
      ...inputs,
      [name]: (name === 'splitterRatio' || name === 'splitterPLC') ? value : (parseFloat(value) || 0),
    });
  };

  const statusColors = {
    safe: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    warning: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    danger: 'text-red-400 bg-red-500/10 border-red-500/20',
  };

  const statusLabels = {
    safe: 'Aman (> -20 dBm)',
    warning: 'Warning (-20 s/d -28 dBm)',
    danger: 'Tidak Layak (< -28 dBm)',
  };

  return (
    <div className="bg-zinc-900/50 border border-zinc-800 p-4 md:p-6 rounded-2xl shadow-xl backdrop-blur-sm mt-8">
      <div className="flex items-center gap-2 mb-6">
        <Radio size={18} className="text-blue-400 md:w-5 md:h-5" />
        <h2 className="text-lg md:text-xl font-semibold text-white">Optical Power Calculator</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        {/* Inputs */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs md:text-sm font-medium text-zinc-400 mb-2 flex items-center gap-2">
              <Zap size={14} className="text-blue-400" />
              Input Laser (dBm)
              <Tooltip content="Daya laser awal yang keluar dari SFP OLT atau titik ukur sebelumnya.">
                <HelpCircle size={12} className="text-zinc-600 hover:text-zinc-400 cursor-help" />
              </Tooltip>
            </label>
            <input
              type="number"
              name="inputLaser"
              value={inputs.inputLaser}
              onChange={handleChange}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 md:py-3 text-sm md:text-base text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs md:text-sm font-medium text-zinc-400 mb-2 flex items-center gap-2">
                <Layers size={14} className="text-blue-400" />
                Splitter Ratio
              </label>
              <select
                name="splitterRatio"
                value={inputs.splitterRatio}
                onChange={handleChange}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 md:py-3 text-sm md:text-base text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all appearance-none"
              >
                <optgroup label="PLC Splitter" className="bg-zinc-900">
                  {["2", "4", "8", "16", "32", "64"].map(val => (
                    <option key={val} value={val}>1:{val}</option>
                  ))}
                </optgroup>
                <optgroup label="FBT Splitter (Unbalanced)" className="bg-zinc-900">
                  {["1:99", "2:98", "3:97", "5:95", "10:90", "15:85", "20:80", "25:75", "30:70", "35:65", "40:60", "45:55", "50:50"].map(val => (
                    <option key={val} value={val}>{val}</option>
                  ))}
                </optgroup>
              </select>
            </div>
            <div>
              <label className="block text-xs md:text-sm font-medium text-zinc-400 mb-2 flex items-center gap-2">
                <Layers size={14} className="text-blue-400" />
                Splitter PLC
              </label>
              <select
                name="splitterPLC"
                value={inputs.splitterPLC}
                onChange={handleChange}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 md:py-3 text-sm md:text-base text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all appearance-none"
              >
                {["2", "4", "8", "16"].map(val => (
                  <option key={val} value={val}>1:{val}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs md:text-sm font-medium text-zinc-400 mb-2 flex items-center gap-2">
              <Ruler size={14} className="text-blue-400" />
              Jarak (km)
            </label>
            <input
              type="number"
              step="0.1"
              name="distance"
              value={inputs.distance}
              onChange={handleChange}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 md:py-3 text-sm md:text-base text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
            />
          </div>
        </div>

        {/* Results */}
        <div className="flex flex-col justify-center space-y-4">
          <div className={`p-4 md:p-6 rounded-2xl border ${statusColors[result.status]} transition-colors`}>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs md:text-sm font-bold uppercase tracking-wider opacity-70">Output Laser</span>
              <Activity size={18} />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl md:text-4xl font-black">{result.outputLaser}</span>
              <span className="text-base md:text-lg font-medium opacity-70">dBm</span>
            </div>
            <div className="mt-4 text-[10px] md:text-xs font-bold uppercase tracking-widest">
              Status: {statusLabels[result.status]}
            </div>
          </div>

          <div className="bg-zinc-800/50 border border-zinc-700 p-4 md:p-6 rounded-2xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs md:text-sm font-bold text-zinc-500 uppercase tracking-wider">Next ODP Capability</span>
              <Info size={16} className="text-zinc-600" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl md:text-3xl font-bold text-white">{result.nextODP}</span>
              <span className="text-xs md:text-sm text-zinc-500">Kali Split (1:16)</span>
            </div>
            <p className="text-[10px] text-zinc-600 mt-2 italic">
              *Estimasi berdasarkan sisa power budget hingga -28 dBm.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
