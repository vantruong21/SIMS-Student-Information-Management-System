import React from 'react';
import { motion } from 'motion/react';
import { LucideIcon, Database } from 'lucide-react';

interface GlassEmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
  className?: string;
}

export const GlassEmptyState: React.FC<GlassEmptyStateProps> = ({
  icon: Icon = Database,
  title,
  description,
  actionText,
  onAction,
  className = '',
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`glass-panel border border-white/60 backdrop-blur-2xl bg-white/60 rounded-3xl p-12 text-center flex flex-col items-center justify-center space-y-5 max-w-lg mx-auto shadow-[0_12px_40px_rgba(79,70,229,0.06)] ${className}`}
    >
      <div className="w-16 h-16 rounded-2xl bg-indigo-50/50 border border-white flex items-center justify-center text-indigo-500 shadow-inner">
        <Icon className="w-8 h-8" strokeWidth={1.5} />
      </div>

      <div className="space-y-1.5 text-center">
        <h4 className="font-display text-lg font-extrabold text-indigo-950">{title}</h4>
        <p className="text-xs text-gray-500 leading-relaxed max-w-sm">{description}</p>
      </div>

      {actionText && onAction && (
        <button
          onClick={onAction}
          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs shadow-md hover:shadow-indigo-500/10 active:scale-95 transition-all cursor-pointer"
        >
          {actionText}
        </button>
      )}
    </motion.div>
  );
};
