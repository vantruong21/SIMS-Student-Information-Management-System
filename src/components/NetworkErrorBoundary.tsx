import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { WifiOff } from 'lucide-react';
import { useNetwork } from '../hooks/useNetwork';

export const NetworkErrorBoundary: React.FC = () => {
  const isOnline = useNetwork();

  return (
    <AnimatePresence>
      {!isOnline && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-3 px-6 py-3 rounded-2xl bg-orange-100/80 backdrop-blur-xl border border-orange-200 shadow-xl shadow-orange-500/10 text-orange-800"
        >
          <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center animate-pulse shrink-0">
            <WifiOff className="w-4 h-4 text-orange-600" />
          </div>
          <div className="text-left">
            <p className="text-sm font-black">Connection Lost</p>
            <p className="text-[10px] font-bold opacity-80">You are operating in offline mode. Changes will not be saved.</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
