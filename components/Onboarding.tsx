import React, { useState, useEffect } from "react";
import {
  Fingerprint,
  Globe,
  Zap,
  ChevronRight,
  Cpu,
  Radio,
  ShieldCheck,
} from "lucide-react";

interface Props {
  onComplete: () => void;
}

type Stage = "boot" | "intro" | "calibration" | "network" | "ready";

// Typewriter Component
const TypewriterText = ({
  text,
  delay = 30,
  onComplete,
  start = true,
}: {
  text: string;
  delay?: number;
  onComplete?: () => void;
  start?: boolean;
}) => {
  const [displayed, setDisplayed] = useState("");
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    if (!start || isFinished) return;

    let i = 0;
    const interval = setInterval(() => {
      setDisplayed(text.substring(0, i + 1));
      i++;
      if (i >= text.length) {
        clearInterval(interval);
        setIsFinished(true);
        onComplete?.();
      }
    }, delay);

    return () => clearInterval(interval);
  }, [text, delay, start, isFinished, onComplete]);

  return (
    <span>
      {displayed}
      {!isFinished && start && <span className="animate-pulse">_</span>}
    </span>
  );
};

export const Onboarding: React.FC<Props> = ({ onComplete }) => {
  const [stage, setStage] = useState<Stage>("boot");
  const [calibrationProgress, setCalibrationProgress] = useState(0);
  const [introSequence, setIntroSequence] = useState(0);

  // Boot auto-advance
  useEffect(() => {
    if (stage === "boot") {
      const timer = setTimeout(() => setStage("intro"), 2500);
      return () => clearTimeout(timer);
    }
  }, [stage]);

  const handleCalibration = () => {
    if (calibrationProgress >= 100) return;

    const interval = setInterval(() => {
      setCalibrationProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setStage("network"), 500);
          return 100;
        }
        return prev + 2;
      });
    }, 20);
  };

  return (
    <div className="absolute inset-0 z-50 bg-black flex flex-col items-center justify-center p-6 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_#000000_100%)] pointer-events-none" />

      {/* BOOT */}
      {stage === "boot" && (
        <div className="font-mono text-xs text-green-500 space-y-1 opacity-70 w-full max-w-xs">
          <p>{"> KERNEL_INIT..."}</p>
          <p className="animate-pulse delay-75">
            {"> LOADING_NEURAL_MODULES..."}
          </p>
          <p className="animate-pulse delay-150">
            {"> BYPASSING_LANGUAGE_PROTOCOLS..."}
          </p>
          <p className="animate-pulse delay-300 text-accent">
            {"> ESTABLISHING_SECURE_LINK..."}
          </p>
        </div>
      )}

      {/* INTRO */}
      {stage === "intro" && (
        <div className="max-w-md w-full animate-in fade-in zoom-in duration-1000 flex flex-col items-center text-center">
          <div className="w-24 h-24 mb-8 relative">
            <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full animate-pulse-slow" />
            <Globe className="w-full h-full text-primary relative z-10 animate-float" />
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-white mb-6 tracking-tight min-h-[4rem]">
            <TypewriterText
              text="The Tower of Babel has fallen."
              onComplete={() => setIntroSequence(1)}
            />
          </h1>

          <div className="h-32 flex items-center justify-center">
            <p className="text-slate-400 text-lg leading-relaxed max-w-sm">
              <TypewriterText
                text="We have entered an era of universal understanding. Distance is irrelevant. Language is no longer a barrier. You are now part of the Grid."
                delay={20}
                start={introSequence >= 1}
                onComplete={() => setIntroSequence(2)}
              />
            </p>
          </div>

          <button
            onClick={() => setStage("calibration")}
            disabled={introSequence < 2}
            className={`mt-12 group flex items-center gap-3 px-8 py-4 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 hover:border-primary/50 transition-all ${
              introSequence < 2
                ? "opacity-0"
                : "opacity-100 animate-slide-up"
            }`}
          >
            <span className="text-sm font-mono tracking-widest uppercase">
              Initialize System
            </span>
            <ChevronRight className="w-4 h-4 text-primary group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      )}

      {/* CALIBRATION */}
      {stage === "calibration" && (
        <div className="max-w-md w-full flex flex-col items-center text-center animate-in fade-in slide-in-from-bottom duration-500">
          <div className="w-32 h-32 mb-8 relative flex items-center justify-center">
            <div className="absolute inset-0 border border-dashed border-slate-700 rounded-full animate-[spin_10s_linear_infinite]" />
            <button
              onMouseDown={handleCalibration}
              onTouchStart={handleCalibration}
              className="w-24 h-24 rounded-full bg-accent/10 border border-accent/50 flex items-center justify-center relative overflow-hidden group active:scale-95 transition-transform"
            >
              <Fingerprint className="w-10 h-10 text-accent relative z-10" />
              <div
                className="absolute bottom-0 left-0 w-full bg-accent/30 transition-all duration-75 ease-linear"
                style={{ height: `${calibrationProgress}%` }}
              />
            </button>
          </div>

          <h2 className="text-2xl font-bold text-white mb-4">
            Biometric Calibration
          </h2>
          <p className="text-slate-400 mb-8 max-w-xs">
            Press and hold the sensor to sync your neural signature with the
            translation engine.
          </p>

          <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden max-w-xs">
            <div
              className="h-full bg-accent shadow-[0_0_10px_#22d3ee] transition-all duration-75"
              style={{ width: `${calibrationProgress}%` }}
            />
          </div>

          <p className="mt-4 font-mono text-xs text-accent">
            SYNC: {calibrationProgress}%
          </p>
        </div>
      )}

      {/* NETWORK */}
      {stage === "network" && (
        <div className="max-w-md w-full flex flex-col items-center text-center animate-in fade-in duration-700">
          <div className="grid grid-cols-2 gap-4 mb-8">
            {[
              { icon: Radio, label: "REAL-TIME", color: "text-primary" },
              { icon: Cpu, label: "AI CORE", color: "text-accent" },
              { icon: Zap, label: "LOW LATENCY", color: "text-yellow-400" },
              {
                icon: ShieldCheck,
                label: "SECURE",
                color: "text-green-400",
              },
            ].map((item, i) => (
              <div
                key={item.label}
                className="p-4 bg-surfaceHighlight rounded-2xl border border-white/5 flex flex-col items-center gap-2 animate-slide-up"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <item.icon className={`w-8 h-8 ${item.color}`} />
                <span className="text-xs font-mono text-slate-300">
                  {item.label}
                </span>
              </div>
            ))}
          </div>

          <h2 className="text-2xl font-bold text-white mb-4">
            Modules Online
          </h2>
          <p className="text-slate-400 mb-8">
            The PolyVoice Neural Network is active. You can now transmit and
            receive data across 7 major linguistic protocols instantly.
          </p>

          <button
            onClick={() => setStage("ready")}
            className="px-8 py-3 bg-white text-black font-bold rounded-xl hover:scale-105 transition-transform shadow-[0_0_20px_rgba(255,255,255,0.3)]"
          >
            Continue
          </button>
        </div>
      )}

      {/* READY */}
      {stage === "ready" && (
        <div className="max-w-md w-full flex flex-col items-center text-center animate-in zoom-in duration-500">
          <div className="relative mb-10">
            <div className="absolute -inset-10 bg-primary/20 blur-[50px] rounded-full animate-pulse" />
            <div className="relative z-10 w-32 h-32 rounded-full border-2 border-primary/50 flex items-center justify-center bg-black">
              <Zap className="w-16 h-16 text-white" />
            </div>
          </div>

          <h2 className="text-4xl font-black text-white mb-6 uppercase tracking-tighter">
            System Ready
          </h2>
          <p className="text-slate-400 mb-10 text-lg">
            Protocol engaged. Good luck, traveler.
          </p>

          <button
            onClick={onComplete}
            className="w-full max-w-xs py-4 bg-gradient-to-r from-primary to-accent text-white font-bold rounded-xl shadow-lg hover:shadow-[0_0_30px_rgba(99,102,241,0.6)] transition-all active:scale-95 text-lg tracking-widest"
          >
            ENTER UPLINK
          </button>
        </div>
      )}

      {/* Progress */}
      <div className="absolute bottom-10 flex gap-2">
        {["boot", "intro", "calibration", "network", "ready"].map((s, i) => {
          const idx = ["boot", "intro", "calibration", "network", "ready"].indexOf(
            stage
          );
          return (
            <div
              key={s}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i <= idx ? "w-8 bg-white" : "w-2 bg-white/20"
              }`}
            />
          );
        })}
      </div>
    </div>
  );
};
