import React, { useState, useRef, useEffect } from 'react';
import { Mic, StopCircle, Check, Activity, X, Play, Fingerprint } from 'lucide-react';
import { VoiceProfile } from '../types';

interface Props {
  onCloneCreate: (profile: VoiceProfile) => void;
  onCancel: () => void;
  onPreview: (baseVoice: string) => void;
}

export const VoiceCloning: React.FC<Props> = ({ onCloneCreate, onCancel, onPreview }) => {
  const [step, setStep] = useState<'intro' | 'recording' | 'processing' | 'success'>('intro');
  const [timeLeft, setTimeLeft] = useState(0);
  const [progress, setProgress] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const timerRef = useRef<number | undefined>(undefined);
  const progressRef = useRef<number | undefined>(undefined);

  const startRecording = () => {
    setStep('recording');
    setTimeLeft(5);
  };

  const stopRecording = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setStep('processing');
    simulateProcessing();
  };

  useEffect(() => {
    if (step === 'recording' && timeLeft > 0) {
      timerRef.current = window.setTimeout(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (step === 'recording' && timeLeft === 0) {
      stopRecording();
    }
    return () => clearTimeout(timerRef.current);
  }, [step, timeLeft]);

  // Biometric Visualizer
  useEffect(() => {
    if (step === 'recording' && canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      if(!ctx) return;
      
      let animId: number;
      let phase = 0;
      
      const draw = () => {
        const width = canvasRef.current!.width;
        const height = canvasRef.current!.height;
        ctx.clearRect(0, 0, width, height);
        
        // Circular Audio Wave
        const centerX = width / 2;
        const centerY = height / 2;
        const radius = 40;
        
        ctx.beginPath();
        ctx.strokeStyle = '#22d3ee'; // accent
        ctx.lineWidth = 2;
        
        for (let i = 0; i < 360; i += 5) {
            const angle = (i * Math.PI) / 180;
            // Generate noise
            const noise = Math.random() * 20 * (Math.sin(phase) + 1); 
            const x = centerX + (radius + noise) * Math.cos(angle);
            const y = centerY + (radius + noise) * Math.sin(angle);
            
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.stroke();
        
        // Inner concentric circles
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(34, 211, 238, 0.3)';
        ctx.arc(centerX, centerY, radius - 10, 0, Math.PI * 2);
        ctx.stroke();

        phase += 0.1;
        animId = requestAnimationFrame(draw);
      };
      draw();
      return () => cancelAnimationFrame(animId);
    }
  }, [step]);

  const simulateProcessing = () => {
    let p = 0;
    progressRef.current = window.setInterval(() => {
      p += 1;
      setProgress(p);
      if (p >= 100) {
        clearInterval(progressRef.current);
        setStep('success');
      }
    }, 40);
  };

  const finalize = () => {
    const newProfile: VoiceProfile = {
      id: `clone-${Date.now()}`,
      name: 'Personal Voice (Clone)',
      isCloned: true,
      baseVoiceName: 'Fenrir',
      description: 'Biometric voice twin.',
      tags: ['Personal', 'Cloned']
    };
    onCloneCreate(newProfile);
  };

  return (
    <div className="absolute inset-0 bg-background/95 backdrop-blur-xl z-50 flex flex-col p-6 animate-in slide-in-from-bottom duration-300">
      <button onClick={onCancel} className="absolute top-6 right-6 p-2 rounded-full glass-button hover:bg-white/10 transition-colors z-20">
        <X className="w-6 h-6 text-slate-400" />
      </button>

      <div className="flex-1 flex flex-col items-center justify-center text-center overflow-y-auto no-scrollbar relative">
        {/* Background Grid for High Tech Feel */}
        <div className="absolute inset-0 opacity-10 pointer-events-none cyber-grid"></div>
        
        {step === 'intro' && (
          <div className="relative z-10 w-full max-w-sm flex flex-col items-center">
            <div className="relative mb-8">
              <div className="absolute inset-0 bg-accent blur-3xl opacity-20 animate-pulse"></div>
              <div className="w-32 h-32 glass-panel rounded-full flex items-center justify-center border border-accent/30 relative z-10 group">
                <Fingerprint className="w-16 h-16 text-accent group-hover:scale-110 transition-transform duration-500" />
                {/* Rotating scanner ring */}
                <div className="absolute inset-0 border-t-2 border-accent rounded-full animate-spin duration-[3s]"></div>
              </div>
            </div>
            
            <h2 className="text-3xl font-bold mb-3 tracking-tight text-white">Voice Synthesis</h2>
            <p className="text-slate-400 mb-8 leading-relaxed">
              Initialize biometric scanning to create your neural voice twin.
            </p>
            
            <div className="glass-panel p-6 rounded-xl border-l-4 border-l-accent mb-8 text-left w-full relative overflow-hidden bg-black/20">
               <p className="text-slate-300 font-mono text-sm leading-relaxed">
                 <span className="text-accent">PASS PHRASE:</span><br/>
                 "The quick brown fox jumps over the lazy dog."
               </p>
            </div>
            
            <button 
              onClick={startRecording}
              className="w-full bg-accent text-black font-bold py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(34,211,238,0.3)] hover:shadow-[0_0_30px_rgba(34,211,238,0.5)] hover:scale-[1.02]"
            >
              INITIATE SCAN
            </button>
          </div>
        )}

        {step === 'recording' && (
          <div className="relative z-10 w-full flex flex-col items-center">
             <div className="relative mb-8">
               <div className="absolute -inset-4 bg-danger/20 rounded-full blur-xl animate-pulse"></div>
               <canvas ref={canvasRef} width={200} height={200} className="" />
               <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <Mic className="w-8 h-8 text-danger animate-pulse" />
               </div>
             </div>
            
            <h3 className="text-xl font-mono font-bold mb-2 text-danger tracking-widest uppercase">Analyzing Input</h3>
            <p className="text-slate-400 font-mono text-3xl mb-12">00:0{timeLeft}</p>
            
            <button 
              onClick={stopRecording}
              className="w-20 h-20 rounded-full bg-danger/10 border border-danger/50 flex items-center justify-center hover:scale-110 transition-transform shadow-[0_0_20px_rgba(239,68,68,0.3)]"
            >
              <div className="w-8 h-8 bg-danger rounded-sm"></div>
            </button>
          </div>
        )}

        {step === 'processing' && (
          <div className="relative z-10 w-full max-w-sm">
            <div className="flex justify-center mb-8 relative">
               <Activity className="w-20 h-20 text-accent animate-bounce" />
            </div>
            <h3 className="text-xl font-bold mb-2">Compiling Neural Map...</h3>
            <p className="text-slate-500 mb-8 text-sm">Please wait while we synthesize your profile.</p>
            
            <div className="relative w-full h-4 bg-surfaceHighlight rounded-full overflow-hidden mb-2 border border-white/10">
              <div 
                className="bg-accent h-full transition-all duration-75 relative overflow-hidden"
                style={{ width: `${progress}%` }}
              >
                <div className="absolute inset-0 bg-white/30 w-full h-full animate-scanline"></div>
              </div>
            </div>
            <div className="flex justify-between font-mono text-xs text-accent">
               <span>DATA_UPLOAD</span>
               <span>{progress}%</span>
            </div>
          </div>
        )}

        {step === 'success' && (
          <div className="relative z-10 w-full max-w-sm flex flex-col items-center animate-slide-up">
             <div className="w-24 h-24 bg-success/10 rounded-full flex items-center justify-center mb-6 border border-success/50 shadow-[0_0_30px_rgba(16,185,129,0.2)]">
              <Check className="w-12 h-12 text-success" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Identity Verified</h2>
            <p className="text-slate-400 mb-8">Your neural twin is active and ready for uplink.</p>
            
            <div className="flex flex-col gap-3 w-full">
              <button 
                onClick={() => onPreview('Fenrir')}
                className="flex items-center justify-center gap-2 w-full bg-surfaceHighlight hover:bg-surface border border-slate-700 text-white font-bold py-4 rounded-xl transition-all group"
              >
                <Play className="w-4 h-4 group-hover:text-accent" /> Test Audio Sample
              </button>

              <button 
                onClick={finalize}
                className="w-full bg-white text-background font-bold py-4 rounded-xl transition-all hover:scale-[1.02] shadow-lg"
              >
                Confirm & Activate
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};