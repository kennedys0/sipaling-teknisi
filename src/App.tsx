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
        <header className="text-center mb-10">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-3 bg-zinc-900 border border-zinc-800 px-4 py-2 rounded-full mb-6"
          >
            <HardHat size={18} className="text-emerald-400" />
            <span className="text-xs font-bold tracking-widest uppercase text-zinc-400">Field Technician Toolkit</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-5xl md:text-6xl font-black tracking-tighter mb-4 bg-gradient-to-b from-white to-zinc-500 bg-clip-text text-transparent"
          >
            SIPALING TEKNISI
          </motion.h1>
        </header>

        {/* Navigation Tabs */}
        <div className="flex justify-center mb-12">
          <div className="bg-zinc-900/80 border border-zinc-800 p-1.5 rounded-2xl flex gap-1 backdrop-blur-md">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`
                  relative flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all duration-300
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
        <footer className="mt-20 pt-8 border-t border-zinc-900 flex flex-col md:flex-row items-center justify-between gap-4 text-zinc-600 text-sm">
          <p>© 2026 SIPALING TEKNISI. Built for FTTH Excellence.</p>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-emerald-400 transition-colors flex items-center gap-2">
              <Github size={16} />
              Source
            </a>
            <span className="text-zinc-800">|</span>
            <p>Version 2.1.0-stable</p>
          </div>
        </footer>
      </div>
    </div>
  );
}
