import React from 'react';

export const BackgroundOrbs: React.FC = () => {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none select-none">
      {/* Ambient glowing blobs with motion or floating classes */}
      <div 
        className="absolute top-[-10%] left-[-10%] w-[45vw] h-[45vw] bg-amber-200/25 rounded-full blur-[120px] mix-blend-multiply animate-float-slow"
        style={{ transformOrigin: 'center' }}
      />
      <div 
        className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-cyan-200/30 rounded-full blur-[140px] mix-blend-multiply animate-float-slower"
        style={{ transformOrigin: 'center' }}
      />
      <div 
        className="absolute top-[30%] right-[15%] w-[40vw] h-[40vw] bg-fuchsia-150/20 rounded-full blur-[130px] mix-blend-multiply animate-float-slow"
        style={{ animationDelay: '-6s', transformOrigin: 'center' }}
      />
      <div 
        className="absolute bottom-[20%] left-[20%] w-[42vw] h-[42vw] bg-violet-200/20 rounded-full blur-[120px] mix-blend-multiply animate-float-slower"
        style={{ animationDelay: '-12s', transformOrigin: 'center' }}
      />
    </div>
  );
};
