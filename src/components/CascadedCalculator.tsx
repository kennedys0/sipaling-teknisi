import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CascadedStage, FBT_LOSS_TABLE, POWER_SPLITTER_LOSS, FIBER_LOSS_PER_KM } from '../types';
import { GitBranch, Plus, Trash2, ArrowDown, Zap, Ruler, Layers, Users, Activity, Table, X, HelpCircle, Server, Cable, Monitor, Download } from 'lucide-react';
import { Tooltip } from './Tooltip';
import { toPng } from 'html-to-image';
import { useRef, useCallback } from 'react';

export const CascadedCalculator: React.FC = () => {
  const [initialPower, setInitialPower] = useState<number>(2);
  const [showTable, setShowTable] = useState(false);
  const [viewMode, setViewMode] = useState<'config' | 'visual'>('config');
  const [stages, setStages] = useState<CascadedStage[]>([
    { id: '1', fbtRatio: '10:90', plcRatio: '8', distance: 0.5 }
  ]);

  const visualRef = useRef<HTMLDivElement>(null);

  const handleDownload = useCallback(() => {
    if (visualRef.current === null) return;

    toPng(visualRef.current, { cacheBust: true, backgroundColor: '#09090b' })
      .then((dataUrl) => {
        const link = document.createElement('a');
        link.download = `sipaling-teknisi-diagram-${new Date().getTime()}.png`;
        link.href = dataUrl;
        link.click();
      })
      .catch((err) => {
        console.error('oops, something went wrong!', err);
      });
  }, [visualRef]);

  const addStage = () => {
    const newId = (stages.length + 1).toString();
    setStages([...stages, { id: newId, fbtRatio: '10:90', plcRatio: '8', distance: 0.5 }]);
  };

  const removeStage = (id: string) => {
    setStages(stages.filter(s => s.id !== id));
  };

  const updateStage = (id: string, updates: Partial<CascadedStage>) => {
    setStages(stages.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  const calculatedStages = useMemo(() => {
    let currentPower = initialPower;
    return stages.map((stage) => {
      const distanceLoss = stage.distance * FIBER_LOSS_PER_KM;
      const powerAfterFiber = currentPower - distanceLoss;
      
      const fbtLoss = FBT_LOSS_TABLE[stage.fbtRatio] || { tap: 0, through: 0 };
      const tapPower = powerAfterFiber - fbtLoss.tap;
      const throughPower = powerAfterFiber - fbtLoss.through;

      const plcLoss = stage.plcRatio !== 'none' ? (POWER_SPLITTER_LOSS[stage.plcRatio] || 0) : 0;
      const userPower = tapPower - plcLoss;

      const result = {
        ...stage,
        inputPower: currentPower,
        powerAfterFiber,
        tapPower,
        throughPower,
        userPower,
        status: userPower < -28 ? 'danger' : userPower < -20 ? 'warning' : 'safe'
      };

      currentPower = throughPower; // Next stage starts from this through power
      return result;
    });
  }, [initialPower, stages]);

  const getStatusColor = (status: string) => {
    if (status === 'danger') return 'text-red-400';
    if (status === 'warning') return 'text-amber-400';
    return 'text-emerald-400';
  };

  return (
    <div className="bg-zinc-900/50 border border-zinc-800 p-4 md:p-6 rounded-2xl shadow-xl backdrop-blur-sm mt-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-2">
          <GitBranch size={20} className="text-purple-400" />
          <h2 className="text-lg md:text-xl font-semibold text-white">Cascaded FBT Designer</h2>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="bg-zinc-800 p-1 rounded-xl border border-zinc-700 flex gap-1">
            <button
              onClick={() => setViewMode('config')}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all ${viewMode === 'config' ? 'bg-purple-500 text-white shadow-lg' : 'text-zinc-500 hover:text-zinc-300'}`}
            >
              Config
            </button>
            <button
              onClick={() => setViewMode('visual')}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all ${viewMode === 'visual' ? 'bg-purple-500 text-white shadow-lg' : 'text-zinc-500 hover:text-zinc-300'}`}
            >
              Visual
            </button>
          </div>
          <button
            onClick={() => setShowTable(true)}
            className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-3 py-2 rounded-xl border border-zinc-700 transition-colors text-[10px] md:text-xs font-bold uppercase tracking-wider"
          >
            <Table size={14} className="text-purple-400" />
            Ratio Table
          </button>
          <div className="flex items-center gap-2 bg-zinc-800 p-1.5 md:p-2 rounded-xl border border-zinc-700">
            <span className="text-[10px] font-bold text-zinc-500 uppercase px-1 md:px-2">Initial</span>
            <input 
              type="number" 
              value={initialPower}
              onChange={(e) => setInitialPower(parseFloat(e.target.value) || 0)}
              className="w-12 md:w-16 bg-transparent text-white font-bold focus:outline-none text-center text-xs md:text-sm"
            />
            <span className="text-[10px] text-zinc-500 pr-1 md:pr-2">dBm</span>
          </div>
        </div>
      </div>

      {/* Modal Table */}
      <AnimatePresence>
        {showTable && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowTable(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl bg-zinc-900 border border-zinc-800 rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="flex items-center justify-between p-6 border-b border-zinc-800">
                <div className="flex items-center gap-3">
                  <Table className="text-purple-400" />
                  <h3 className="text-xl font-bold text-white">FBT Splitter Ratio Table</h3>
                </div>
                <button 
                  onClick={() => setShowTable(false)}
                  className="p-2 hover:bg-zinc-800 rounded-full text-zinc-500 hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="p-6 max-h-[60vh] overflow-y-auto custom-scrollbar">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="text-zinc-500 text-[10px] uppercase tracking-widest border-b border-zinc-800">
                      <th className="py-3 px-4 font-black">Ratio</th>
                      <th className="py-3 px-4 font-black">Tap Loss (dB)</th>
                      <th className="py-3 px-4 font-black">Through Loss (dB)</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    {Object.entries(FBT_LOSS_TABLE).map(([ratio, loss]) => (
                      <tr key={ratio} className="border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-colors group">
                        <td className="py-3 px-4 text-white font-bold">{ratio}</td>
                        <td className="py-3 px-4 text-emerald-400 font-mono">{loss.tap.toFixed(1)}</td>
                        <td className="py-3 px-4 text-blue-400 font-mono">{loss.through.toFixed(1)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="p-6 bg-zinc-950/50 border-t border-zinc-800 text-center">
                <p className="text-xs text-zinc-500 italic">
                  *Nilai loss di atas adalah estimasi standar industri untuk splitter FBT unbalanced.
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="space-y-6">
        <AnimatePresence mode="wait">
          {viewMode === 'config' ? (
            <motion.div
              key="config"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-6"
            >
              <AnimatePresence mode="popLayout">
                {calculatedStages.map((stage, index) => (
                  <motion.div 
                    key={stage.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="relative"
                  >
                    {index > 0 && (
                      <div className="absolute -top-6 left-1/2 -translate-x-1/2 flex flex-col items-center">
                        <div className="w-px h-6 bg-zinc-800" />
                        <ArrowDown size={12} className="text-zinc-700" />
                      </div>
                    )}

                    <div className="bg-zinc-800/30 border border-zinc-800 rounded-2xl p-5 hover:border-purple-500/30 transition-colors">
                      <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
                        <div className="flex items-center gap-3">
                          <div className="bg-purple-500/10 p-2 rounded-lg">
                            <span className="text-purple-400 font-bold text-sm">Stage {index + 1}</span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">Input Power</span>
                            <span className="text-sm font-mono text-white">{stage.inputPower.toFixed(2)} dBm</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => removeStage(stage.id)}
                            className="p-2 text-zinc-600 hover:text-red-400 transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* FBT Config */}
                        <div className="space-y-4">
                          <div>
                            <label className="text-[10px] text-zinc-500 uppercase font-bold mb-2 block">Jarak dari sebelumnya (km)</label>
                            <div className="flex items-center gap-2 bg-zinc-900/50 p-2 rounded-lg border border-zinc-800">
                              <Ruler size={14} className="text-purple-400" />
                              <input 
                                type="number" 
                                step="0.1"
                                value={stage.distance}
                                onChange={(e) => updateStage(stage.id, { distance: parseFloat(e.target.value) || 0 })}
                                className="bg-transparent text-sm text-white w-full focus:outline-none"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="text-[10px] text-zinc-500 uppercase font-bold mb-2 block flex items-center gap-1">
                              FBT Ratio
                              <Tooltip content="Rasio pembagian daya pada splitter FBT. Port Tap untuk user, Port Through diteruskan ke stage berikutnya.">
                                <HelpCircle size={10} className="text-zinc-600 hover:text-zinc-400 cursor-help" />
                              </Tooltip>
                            </label>
                            <div className="flex items-center gap-2 bg-zinc-900/50 p-2 rounded-lg border border-zinc-800">
                              <Layers size={14} className="text-purple-400" />
                              <select 
                                value={stage.fbtRatio}
                                onChange={(e) => updateStage(stage.id, { fbtRatio: e.target.value })}
                                className="bg-transparent text-sm text-white w-full focus:outline-none appearance-none"
                              >
                                {Object.keys(FBT_LOSS_TABLE).map(ratio => (
                                  <option key={ratio} value={ratio} className="bg-zinc-900">{ratio}</option>
                                ))}
                              </select>
                            </div>
                          </div>
                        </div>

                        {/* Tap Output (To Users) */}
                        <div className="bg-zinc-900/40 rounded-xl p-4 border border-zinc-800/50">
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-[10px] text-emerald-400 uppercase font-bold tracking-widest">Tap Output (User)</span>
                            <Users size={14} className="text-emerald-400" />
                          </div>
                          <div className="space-y-3">
                            <div className="flex justify-between text-xs">
                              <span className="text-zinc-500">Tap Power:</span>
                              <span className="text-zinc-300 font-mono">{stage.tapPower.toFixed(2)} dBm</span>
                            </div>
                            <div className="flex items-center gap-2 bg-zinc-800/50 p-1.5 rounded-lg border border-zinc-700">
                              <select 
                                value={stage.plcRatio}
                                onChange={(e) => updateStage(stage.id, { plcRatio: e.target.value })}
                                className="bg-transparent text-[10px] text-white w-full focus:outline-none appearance-none text-center"
                              >
                                <option value="none" className="bg-zinc-900">No PLC</option>
                                <option value="2" className="bg-zinc-900">PLC 1:2</option>
                                <option value="4" className="bg-zinc-900">PLC 1:4</option>
                                <option value="8" className="bg-zinc-900">PLC 1:8</option>
                                <option value="16" className="bg-zinc-900">PLC 1:16</option>
                              </select>
                            </div>
                            <div className="pt-2 border-t border-zinc-800">
                              <div className="flex justify-between items-baseline">
                                <span className="text-[10px] text-zinc-500 uppercase font-bold">Final Power</span>
                                <span className={`text-lg font-black font-mono ${getStatusColor(stage.status)}`}>
                                  {stage.userPower.toFixed(2)}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Through Output (To Next) */}
                        <div className="bg-zinc-900/40 rounded-xl p-4 border border-zinc-800/50">
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-[10px] text-blue-400 uppercase font-bold tracking-widest">Through Output</span>
                            <Activity size={14} className="text-blue-400" />
                          </div>
                          <div className="flex flex-col justify-center h-full pb-4">
                            <div className="text-center">
                              <span className="text-2xl font-black text-white font-mono">{stage.throughPower.toFixed(2)}</span>
                              <span className="text-xs text-zinc-500 ml-1">dBm</span>
                            </div>
                            <p className="text-[9px] text-zinc-600 text-center mt-2 uppercase tracking-tighter">Sinyal diteruskan ke stage berikutnya</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={addStage}
                className="w-full py-4 border-2 border-dashed border-zinc-800 rounded-2xl text-zinc-500 hover:text-purple-400 hover:border-purple-500/50 hover:bg-purple-500/5 transition-all flex items-center justify-center gap-2 font-bold uppercase text-xs tracking-widest"
              >
                <Plus size={16} />
                Tambah Stage Berikutnya
              </motion.button>
            </motion.div>
          ) : (
            <motion.div
              key="visual"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="relative group/visual"
            >
              <div className="absolute top-4 right-4 z-20 flex flex-col md:flex-row gap-2">
                <button
                  onClick={() => {
                    // Simple reset logic by re-mounting or just state if we had one
                    setViewMode('config');
                    setTimeout(() => setViewMode('visual'), 10);
                  }}
                  className="bg-zinc-800 hover:bg-zinc-700 text-zinc-400 px-3 py-2 rounded-xl border border-zinc-700 transition-all font-bold text-[10px] uppercase tracking-wider"
                >
                  Reset View
                </button>
                <button
                  onClick={handleDownload}
                  className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-xl shadow-lg transition-all font-bold text-xs uppercase tracking-wider"
                >
                  <Download size={16} />
                  Save PNG
                </button>
              </div>

              <div className="bg-zinc-950 rounded-3xl border border-zinc-800 min-h-[600px] overflow-hidden cursor-grab active:cursor-grabbing relative">
                <div className="absolute inset-0 opacity-20 pointer-events-none" 
                     style={{ backgroundImage: 'radial-gradient(circle, #27272a 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
                
                <motion.div 
                  drag
                  dragMomentum={false}
                  ref={visualRef}
                  className="p-12 md:p-24 flex flex-col items-center min-w-max"
                >
                  {/* Transmitter */}
                  <div className="flex flex-col items-center mb-12">
                <div className="bg-emerald-500/10 border-2 border-emerald-500/30 p-6 rounded-2xl shadow-[0_0_30px_rgba(16,185,129,0.1)] flex flex-col items-center">
                  <Server size={32} className="text-emerald-400 mb-2" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500/70">Transmitter</span>
                  <span className="text-2xl font-black text-white">{initialPower} dBm</span>
                </div>
                <div className="w-px h-12 bg-gradient-to-b from-emerald-500/50 to-purple-500/50" />
              </div>

              {/* Stages */}
              <div className="space-y-0 flex flex-col items-center w-full">
                {calculatedStages.map((stage, index) => (
                  <div key={stage.id} className="flex flex-col items-center w-full">
                    {/* Cable Segment */}
                    <div className="flex flex-col items-center relative">
                      <div className="absolute -left-16 top-1/2 -translate-y-1/2 flex items-center gap-2">
                        <Cable size={14} className="text-zinc-600" />
                        <span className="text-[10px] font-bold text-zinc-500">{stage.distance} km</span>
                      </div>
                      <div className="w-px h-16 bg-zinc-800" />
                    </div>

                    {/* Splitter Node */}
                    <div className="relative flex items-center justify-center w-full max-w-md">
                      {/* Main Node */}
                      <div className="z-10 bg-zinc-900 border-2 border-purple-500/50 w-24 h-24 rounded-full flex flex-col items-center justify-center shadow-[0_0_40px_rgba(168,85,247,0.15)]">
                        <span className="text-[8px] font-bold text-purple-400 uppercase mb-1">Splitter</span>
                        <span className="text-sm font-black text-white">{stage.fbtRatio}</span>
                        <div className="mt-1 px-2 py-0.5 bg-purple-500/20 rounded text-[8px] font-bold text-purple-300">
                          {stage.powerAfterFiber.toFixed(1)} dBm
                        </div>
                      </div>

                      {/* Tap Branch (Left) */}
                      <div className="absolute right-1/2 mr-12 flex items-center">
                        <div className="w-24 h-px bg-gradient-to-l from-purple-500/50 to-emerald-500/50" />
                        <div className="flex flex-col items-end mr-4">
                          <div className="bg-zinc-900 border border-emerald-500/30 p-3 rounded-xl shadow-lg flex items-center gap-3">
                            <div className="flex flex-col items-end">
                              <span className="text-[8px] font-bold text-emerald-500 uppercase">User Output</span>
                              <span className={`text-sm font-black ${getStatusColor(stage.status)}`}>{stage.userPower.toFixed(2)} dBm</span>
                              {stage.plcRatio !== 'none' && (
                                <span className="text-[8px] text-zinc-500">via PLC 1:{stage.plcRatio}</span>
                              )}
                            </div>
                            <Monitor size={20} className="text-emerald-400/50" />
                          </div>
                        </div>
                      </div>

                      {/* Through Branch (Right) */}
                      {index < calculatedStages.length - 1 && (
                        <div className="absolute left-1/2 ml-12 flex items-center">
                          <div className="w-12 h-px bg-zinc-800" />
                          <div className="flex flex-col ml-4">
                            <span className="text-[8px] font-bold text-blue-400 uppercase">Through</span>
                            <span className="text-xs font-bold text-zinc-400">{stage.throughPower.toFixed(2)} dBm</span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Connection to next stage */}
                    {index < calculatedStages.length - 1 && (
                      <div className="w-px h-12 bg-zinc-800" />
                    )}
                  </div>
                ))}
              </div>

              {/* End Point */}
                <div className="mt-12 flex flex-col items-center">
                  <div className="w-px h-8 bg-zinc-800" />
                  <div className="bg-zinc-900 border border-zinc-800 px-4 py-2 rounded-full text-[10px] font-bold text-zinc-600 uppercase tracking-widest">
                    End of Chain
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
