import React from 'react';
import { motion } from 'motion/react';

interface GlassSkeletonProps {
  variant?: 'card' | 'tableRow' | 'text' | 'avatar' | 'block';
  className?: string;
  count?: number;
}

export const GlassSkeleton: React.FC<GlassSkeletonProps> = ({
  variant = 'block',
  className = '',
  count = 1,
}) => {
  // Motion shimmer animation settings
  const shimmerVariants = {
    animate: {
      backgroundPosition: ['200% 0', '-200% 0'],
      transition: {
        repeat: Infinity,
        duration: 2.2,
        ease: 'linear',
      },
    },
  };

  const baseClasses = 'relative overflow-hidden bg-gradient-to-r from-white/30 via-white/55 to-white/30 backdrop-blur-md border border-white/40 rounded-2xl bg-[length:400%_100%]';

  const renderSingleSkeleton = (key: number) => {
    switch (variant) {
      case 'avatar':
        return (
          <motion.div
            key={key}
            variants={shimmerVariants}
            animate="animate"
            className={`w-12 h-12 rounded-full ${baseClasses} ${className}`}
          />
        );
      case 'card':
        return (
          <motion.div
            key={key}
            variants={shimmerVariants}
            animate="animate"
            className={`p-6 h-40 flex flex-col justify-between ${baseClasses} ${className}`}
          >
            <div className="space-y-2">
              <div className="h-3 w-1/3 bg-white/20 rounded-full" />
              <div className="h-8 w-2/3 bg-white/20 rounded-full" />
            </div>
            <div className="h-2 w-1/2 bg-white/20 rounded-full" />
          </motion.div>
        );
      case 'tableRow':
        return (
          <motion.div
            key={key}
            variants={shimmerVariants}
            animate="animate"
            className={`flex items-center justify-between p-4 border-b border-white/20 ${baseClasses} ${className}`}
          >
            <div className="flex items-center gap-3 w-1/3">
              <div className="w-9 h-9 rounded-full bg-white/20 shrink-0" />
              <div className="space-y-1.5 w-full">
                <div className="h-3 bg-white/25 rounded-full w-3/4" />
                <div className="h-2 bg-white/20 rounded-full w-1/2" />
              </div>
            </div>
            <div className="h-3 bg-white/20 rounded-full w-1/6" />
            <div className="h-3 bg-white/20 rounded-full w-1/6" />
            <div className="h-5 bg-white/20 rounded-full w-12" />
          </motion.div>
        );
      case 'text':
        return (
          <motion.div
            key={key}
            variants={shimmerVariants}
            animate="animate"
            className={`h-4 w-full bg-white/20 rounded-full ${baseClasses} ${className}`}
          />
        );
      default:
        return (
          <motion.div
            key={key}
            variants={shimmerVariants}
            animate="animate"
            className={`${baseClasses} min-h-[40px] ${className}`}
          />
        );
    }
  };

  return (
    <div className="space-y-3.5 w-full">
      {Array.from({ length: count }).map((_, i) => renderSingleSkeleton(i))}
    </div>
  );
};
