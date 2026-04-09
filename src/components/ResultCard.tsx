import React from 'react';
import { motion } from 'motion/react';
import { Users, Box, Activity, AlertTriangle } from 'lucide-react';

interface ResultCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  warning?: boolean;
  subtitle?: string;
}

export const ResultCard: React.FC<ResultCardProps> = ({ label, value, icon, color, warning, subtitle }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-zinc-900/50 border ${warning ? 'border-red-500/50' : 'border-zinc-800'} p-4 md:p-6 rounded-2xl shadow-xl backdrop-blur-sm relative overflow-hidden group hover:border-emerald-500/50 transition-colors`}
    >
      <div className={`absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity ${color}`}>
        {React.cloneElement(icon as React.ReactElement, { size: 100 })}
      </div>
      
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-3 md:mb-4">
          <div className={`p-1.5 md:p-2 rounded-lg ${color} bg-opacity-10`}>
            {React.cloneElement(icon as React.ReactElement, { size: 18, className: color })}
          </div>
          <span className="text-xs md:text-sm font-medium text-zinc-400 uppercase tracking-wider">{label}</span>
        </div>
        
        <div className="flex items-baseline gap-2">
          <h3 className="text-2xl md:text-3xl font-bold text-white">{value}</h3>
          {subtitle && <span className="text-zinc-500 text-xs md:text-sm">{subtitle}</span>}
        </div>

        {warning && (
          <div className="mt-3 flex items-center gap-2 text-red-400 text-xs font-medium animate-pulse">
            <AlertTriangle size={14} />
            Loss melebihi batas aman (28 dB)
          </div>
        )}
      </div>
    </motion.div>
  );
};

export const SummarySection: React.FC<{ 
  totalCustomers: number; 
  odpCount: number; 
  totalLoss: number; 
  isHighLoss: boolean;
}> = ({ totalCustomers, odpCount, totalLoss, isHighLoss }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <ResultCard 
        label="Total Pelanggan" 
        value={totalCustomers} 
        icon={<Users />} 
        color="text-emerald-400" 
        subtitle="User"
      />
      <ResultCard 
        label="Jumlah ODP" 
        value={odpCount} 
        icon={<Box />} 
        color="text-blue-400" 
        subtitle="Unit"
      />
      <ResultCard 
        label="Estimasi Loss" 
        value={totalLoss} 
        icon={<Activity />} 
        color={isHighLoss ? "text-red-400" : "text-amber-400"} 
        subtitle="dB"
        warning={isHighLoss}
      />
    </div>
  );
};
