import React from 'react';
import { ArrowRightLeft, BookOpen } from 'lucide-react';
import { SupportedLanguage } from '../types';
import { LANGUAGES } from '../constants';

interface Props {
  source: SupportedLanguage;
  target: SupportedLanguage;
  onSourceChange: (lang: SupportedLanguage) => void;
  onTargetChange: (lang: SupportedLanguage) => void;
  onSwap: () => void;
  onDictionary?: () => void;
  disabled?: boolean;
}

export const LanguageSelector: React.FC<Props> = ({
  source,
  target,
  onSourceChange,
  onTargetChange,
  onSwap,
  onDictionary,
  disabled
}) => {
  return (
    <div className="flex items-center justify-between glass-panel p-4 rounded-3xl relative overflow-hidden group">
      {/* Decorative scanline */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary to-transparent opacity-50"></div>

      <div className="flex-1 relative z-10">
        <label className="block text-[10px] font-mono text-accent uppercase tracking-widest mb-1 ml-1 opacity-70">Source Input</label>
        <div className="relative">
          <select
            value={source}
            onChange={(e) => onSourceChange(e.target.value as SupportedLanguage)}
            disabled={disabled}
            className="w-full bg-slate-800 text-white font-bold text-base px-3 py-2 pr-8 rounded-xl border border-white/20 focus:outline-none focus:border-purple-500 cursor-pointer disabled:opacity-50"
            style={{ appearance: 'none', WebkitAppearance: 'none', backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E\")", backgroundRepeat: 'no-repeat', backgroundPosition: 'right 8px center' }}
          >
            {LANGUAGES.map(lang => (
              <option key={lang} value={lang} className="bg-slate-800 text-white">{lang}</option>
            ))}
          </select>
        </div>
      </div>

      <button
        onClick={onSwap}
        disabled={disabled}
        className="p-3 mx-1 rounded-full border border-primary/30 bg-primary/10 hover:bg-primary/20 hover:scale-110 hover:shadow-[0_0_15px_rgba(124,58,237,0.5)] transition-all disabled:opacity-50 group-hover:border-primary/50"
      >
        <ArrowRightLeft className="w-5 h-5 text-primaryGlow" />
      </button>

      {onDictionary && (
        <button
          onClick={onDictionary}
          disabled={disabled}
          className="p-3 mx-1 rounded-full border border-accent/30 bg-accent/10 hover:bg-accent/20 hover:scale-110 hover:shadow-[0_0_15px_rgba(34,211,238,0.5)] transition-all disabled:opacity-50"
          title="Dictionary"
        >
          <BookOpen className="w-5 h-5 text-accent" />
        </button>
      )}

      <div className="flex-1 text-right relative z-10">
        <label className="block text-[10px] font-mono text-accent uppercase tracking-widest mb-1 mr-1 opacity-70">Target Output</label>
        <div className="relative">
          <select
            value={target}
            onChange={(e) => onTargetChange(e.target.value as SupportedLanguage)}
            disabled={disabled}
            className="w-full bg-slate-800 text-white font-bold text-base px-3 py-2 pr-8 rounded-xl border border-white/20 focus:outline-none focus:border-purple-500 cursor-pointer text-right disabled:opacity-50"
            style={{ appearance: 'none', WebkitAppearance: 'none', backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E\")", backgroundRepeat: 'no-repeat', backgroundPosition: 'right 8px center' }}
          >
            {LANGUAGES.map(lang => (
              <option key={lang} value={lang} className="bg-slate-800 text-white">{lang}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};