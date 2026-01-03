import React from 'react';
import { ArrowRightLeft } from 'lucide-react';
import { SupportedLanguage } from '../types';
import { LANGUAGES } from '../constants';

interface Props {
  source: SupportedLanguage;
  target: SupportedLanguage;
  onSourceChange: (lang: SupportedLanguage) => void;
  onTargetChange: (lang: SupportedLanguage) => void;
  onSwap: () => void;
  disabled?: boolean;
}

export const LanguageSelector: React.FC<Props> = ({
  source,
  target,
  onSourceChange,
  onTargetChange,
  onSwap,
  disabled
}) => {
  return (
    <div className="flex items-center justify-between glass-panel p-4 rounded-3xl relative overflow-hidden group">
      {/* Decorative scanline */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary to-transparent opacity-50"></div>

      <div className="flex-1 relative z-10">
        <label className="block text-[10px] font-mono text-accent uppercase tracking-widest mb-1 ml-1 opacity-70">Source Input</label>
        <select
          value={source}
          onChange={(e) => onSourceChange(e.target.value as SupportedLanguage)}
          disabled={disabled}
          className="w-full bg-transparent text-white font-bold text-lg focus:outline-none appearance-none cursor-pointer hover:text-primaryGlow transition-colors disabled:opacity-50"
        >
          {LANGUAGES.map(lang => (
            <option key={lang} value={lang} className="bg-surface text-white">{lang}</option>
          ))}
        </select>
      </div>

      <button
        onClick={onSwap}
        disabled={disabled}
        className="p-3 mx-2 rounded-full border border-primary/30 bg-primary/10 hover:bg-primary/20 hover:scale-110 hover:shadow-[0_0_15px_rgba(124,58,237,0.5)] transition-all disabled:opacity-50 group-hover:border-primary/50"
      >
        <ArrowRightLeft className="w-5 h-5 text-primaryGlow" />
      </button>

      <div className="flex-1 text-right relative z-10">
        <label className="block text-[10px] font-mono text-accent uppercase tracking-widest mb-1 mr-1 opacity-70">Target Output</label>
        <select
          value={target}
          onChange={(e) => onTargetChange(e.target.value as SupportedLanguage)}
          disabled={disabled}
          className="w-full bg-transparent text-white font-bold text-lg focus:outline-none appearance-none text-right cursor-pointer hover:text-primaryGlow transition-colors disabled:opacity-50"
        >
          {LANGUAGES.map(lang => (
            <option key={lang} value={lang} className="bg-surface text-white">{lang}</option>
          ))}
        </select>
      </div>
    </div>
  );
};