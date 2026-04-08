import React from 'react';
import { motion } from 'motion/react';
import { List, Box } from 'lucide-react';

interface DistributionListProps {
  distribution: number[];
}

export const DistributionList: React.FC<DistributionListProps> = ({ distribution }) => {
  if (distribution.length === 0) return null;

  return (
    <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-2xl shadow-xl backdrop-blur-sm mt-6">
      <div className="flex items-center gap-2 mb-6">
        <List size={20} className="text-emerald-400" />
        <h2 className="text-xl font-semibold text-white">Distribusi ODP</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {distribution.map((count, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            className="bg-zinc-800/50 border border-zinc-700/50 p-4 rounded-xl flex items-center justify-between group hover:bg-zinc-800 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="bg-emerald-500/10 p-2 rounded-lg group-hover:bg-emerald-500/20 transition-colors">
                <Box size={16} className="text-emerald-400" />
              </div>
              <span className="text-sm font-medium text-zinc-300">ODP {index + 1}</span>
            </div>
            <span className="text-emerald-400 font-bold">{count} <span className="text-[10px] text-zinc-500 font-normal">User</span></span>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
