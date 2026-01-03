import React from 'react';
import { Message } from '../types';
import { Trash2, ArrowLeft, Bot, User, Play, Clock } from 'lucide-react';

interface Props {
  history: Message[];
  onBack: () => void;
  onClear: () => void;
  onPlay: (text: string) => void;
}

export const HistoryView: React.FC<Props> = ({ history, onBack, onClear, onPlay }) => {
  return (
    <div className="flex flex-col h-full animate-in slide-in-from-right duration-300">
      <div className="p-6 flex items-center justify-between bg-surface/80 backdrop-blur-md z-10 border-b border-white/5">
        <button 
          onClick={onBack}
          className="p-2 -ml-2 rounded-full text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h2 className="text-xl font-bold tracking-tight">Neural Memory</h2>
        <button 
          onClick={() => {
            if(window.confirm('Purge all conversation logs? This cannot be undone.')) {
              onClear();
            }
          }}
          className="p-2 -mr-2 rounded-full text-danger/70 hover:text-danger hover:bg-danger/10 transition-colors"
          title="Purge Memory"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
        {history.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-500 opacity-60">
            <Clock className="w-12 h-12 mb-4" />
            <p className="font-mono text-xs uppercase tracking-widest">Memory Empty</p>
          </div>
        ) : (
          history.map((msg) => (
            <div key={msg.id} className="glass-panel p-4 rounded-xl border border-white/5 relative group">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-xs font-mono px-2 py-0.5 rounded ${
                    msg.role === 'user' ? 'bg-primary/20 text-primaryGlow' : 'bg-accent/20 text-accent'
                  }`}>
                    {msg.role === 'user' ? 'USER_INPUT' : 'AI_RESPONSE'}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">
                    {new Date(msg.timestamp).toLocaleString()}
                  </span>
                </div>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onPlay(msg.text);
                  }}
                  className="opacity-0 group-hover:opacity-100 p-2 rounded-full bg-white/5 hover:bg-white/10 text-slate-300 transition-all"
                >
                  <Play className="w-4 h-4" />
                </button>
              </div>
              <p className="text-slate-300 text-sm leading-relaxed">{msg.text}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};