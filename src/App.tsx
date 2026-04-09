/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ODPCalculator } from './components/ODPCalculator';
import { PowerCalculator } from './components/PowerCalculator';
import { CascadedCalculator } from './components/CascadedCalculator';
import { HardHat, Github, Calculator, Zap, GitBranch } from 'lucide-react';

type TabType = 'odp' | 'power' | 'cascaded';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('odp');

  const tabs = [
    { id: 'odp', label: 'ODP Calc', icon: <Calculator size={18} /> },
    { id: 'power', label: 'Power Calc', icon: <Zap size={18} /> },
    { id: 'cascaded', label: 'Cascaded FBT', icon: <GitBranch size={18} /> },
  ];

  return (
    <div className="min-h-screen bg-black text-zinc-100 font-sans selection:bg-emerald-500/30">
      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/5 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-8 md:py-12">
        {/* Header */}
        <header className="text-center mb-8 md:mb-10">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-3 bg-zinc-900 border border-zinc-800 px-4 py-2 rounded-full mb-6"
          >
            <img src="/logo.png" alt="Logo" className="w-5 h-5 object-contain" referrerPolicy="no-referrer" />
            <span className="text-[10px] md:text-xs font-bold tracking-widest uppercase text-zinc-400">Field Technician Toolkit</span>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="flex flex-col items-center mb-4"
          >
            <img src="/logo.png" alt="Sipaling Teknisi Logo" className="w-20 h-20 md:w-24 md:h-24 mb-4 drop-shadow-[0_0_15px_rgba(16,185,129,0.2)]" referrerPolicy="no-referrer" />
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter bg-gradient-to-b from-white to-zinc-500 bg-clip-text text-transparent">
              SIPALING TEKNISI
            </h1>
          </motion.div>
        </header>

        {/* Navigation Tabs */}
        <div className="flex justify-center mb-8 md:mb-12 overflow-x-auto pb-4 md:pb-0 no-scrollbar">
          <div className="bg-zinc-900/80 border border-zinc-800 p-1.5 rounded-2xl flex gap-1 backdrop-blur-md whitespace-nowrap">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`
                  relative flex items-center gap-2 px-4 md:px-6 py-2.5 md:py-3 rounded-xl text-xs md:text-sm font-bold transition-all duration-300
                  ${activeTab === tab.id ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'}
                `}
              >
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-zinc-800 rounded-xl shadow-lg border border-zinc-700"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <span className="relative z-10">{tab.icon}</span>
                <span className="relative z-10">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Main Content Area */}
        <main>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === 'odp' && <ODPCalculator />}
              {activeTab === 'power' && <PowerCalculator />}
              {activeTab === 'cascaded' && <CascadedCalculator />}
            </motion.div>
          </AnimatePresence>
        </main>

        {/* Footer */}
        <footer className="mt-16 md:mt-20 pt-8 border-t border-zinc-900">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="space-y-4">
              <h3 className="text-zinc-400 font-bold uppercase text-[10px] md:text-xs tracking-widest">Tentang SIPALING TEKNISI</h3>
              <p className="text-zinc-600 text-xs md:text-sm leading-relaxed">
                SIPALING TEKNISI adalah platform <strong>FO Calculator</strong> dan <strong>Optic Calculator</strong> profesional yang dirancang untuk memudahkan teknisi lapangan dalam melakukan perhitungan link budget. 
                Dilengkapi dengan <strong>Ratio Calculator</strong> untuk splitter FBT, alat ini membantu optimasi jaringan FTTH dengan akurasi tinggi. 
                Gunakan <strong>Kalkulator Fiber Optik</strong> kami untuk menghitung redaman, kapasitas ODP, dan desain cascaded splitter secara instan.
              </p>
            </div>
            <div className="flex flex-col md:items-end justify-center gap-4">
              <div className="flex flex-wrap items-center gap-4 md:gap-6 text-zinc-600 text-xs md:text-sm">
                <a href="#" className="hover:text-emerald-400 transition-colors flex items-center gap-2">
                  <Github size={16} />
                  Source
                </a>
                <span className="hidden md:inline text-zinc-800">|</span>
                <p>Version 2.1.0-stable</p>
              </div>
              <p className="text-zinc-600 text-[10px] md:text-sm text-center md:text-right">© 2026 SIPALING TEKNISI. Built for FTTH Excellence.</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
