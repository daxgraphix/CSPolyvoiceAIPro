import React, { useEffect, useState } from 'react';
import { Activity } from 'lucide-react';

export const SplashScreen: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 500);
          return 100;
        }
        return prev + 2;
      });
    }, 25);
    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-background z-[100] flex flex-col items-center justify-center p-8">
      <div className="relative mb-10 animate-float">
        <div className="absolute inset-0 bg-primary blur-[60px] opacity-20 rounded-full animate-pulse-slow"></div>
        <div className="relative z-10 p-8 rounded-2xl border border-white/10 bg-surface/50 backdrop-blur-2xl shadow-2xl">
          <Activity className="w-20 h-20 text-primary drop-shadow-[0_0_15px_rgba(99,102,241,0.5)]" />
        </div>
      </div>
      
      <h1 className="text-4xl font-extrabold tracking-tight text-white mb-2 text-center">
        CS PolyVoice <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">AI</span>
      </h1>
      <p className="text-slate-400 text-sm mb-16 font-mono tracking-[0.2em] text-center">NEURAL TRANSLATION LINK</p>

      <div className="w-64 h-1 bg-surfaceHighlight rounded-full overflow-hidden relative">
        <div 
          className="absolute left-0 top-0 h-full bg-gradient-to-r from-primary to-accent transition-all duration-75 shadow-[0_0_10px_#6366f1]"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="mt-4 font-mono text-[10px] text-accent/60 tracking-wider">
        INITIALIZING SYSTEM:: {progress}%
      </div>
    </div>
  );
};