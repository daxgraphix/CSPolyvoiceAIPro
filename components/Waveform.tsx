import React from 'react';

export const Waveform: React.FC<{ active: boolean }> = ({ active }) => {
  if (!active) return (
    <div className="h-16 w-full flex flex-col items-center justify-center opacity-60">
      <div className="w-1 h-1 bg-slate-500 rounded-full mb-2"></div>
      <span className="text-xs font-mono text-slate-500 tracking-widest uppercase">System Standby</span>
    </div>
  );

  return (
    <div className="h-16 flex items-center justify-center gap-1.5 w-full max-w-[200px]">
      {[...Array(7)].map((_, i) => (
        <div
          key={i}
          className="w-2 bg-gradient-to-t from-primary to-accent rounded-full animate-equalizer shadow-[0_0_10px_rgba(99,102,241,0.5)]"
          style={{ 
            animationDuration: `${0.4 + Math.random() * 0.4}s`,
            animationDelay: `${Math.random() * 0.2}s`,
            height: '40%'
          }}
        />
      ))}
    </div>
  );
};