import React from 'react';

interface GlassPanelProps {
  children: React.ReactNode;
  className?: string;
  noPadding?: boolean;
}

export const GlassPanel: React.FC<GlassPanelProps> = ({ 
  children, 
  className = '',
  noPadding = false
}) => {
  return (
    <div className={`glass-panel bg-white/40 border border-white rounded-3xl ${noPadding ? '' : 'p-6 md:p-8'} ${className}`}>
      {children}
    </div>
  );
};
