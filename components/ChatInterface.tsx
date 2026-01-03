import React, { useEffect, useRef, useState } from 'react';
import { Message } from '../types';
import { Bot, User, Volume2, Copy, Check, Sparkles } from 'lucide-react';

interface Props {
  messages: Message[];
  onPlay: (text: string) => void;
}

export const ChatInterface: React.FC<Props> = ({ messages, onPlay }) => {
  const bottomRef = useRef<HTMLDivElement>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center opacity-50 p-8">
        <div className="relative">
          <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full"></div>
          <div className="w-24 h-24 rounded-full border border-dashed border-slate-600 mb-6 flex items-center justify-center relative bg-black/20 backdrop-blur-sm">
              <Bot className="w-10 h-10 text-slate-400" />
          </div>
        </div>
        <h3 className="font-bold text-lg text-white mb-2">Awaiting Signal</h3>
        <p className="font-mono text-xs text-slate-500 tracking-wider text-center max-w-[250px]">
          Secure channel established. Initialize voice uplink or input text to begin.
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6 no-scrollbar mask-image-gradient">
      {messages.map((msg, index) => {
        const isLatest = index === messages.length - 1;
        const isUser = msg.role === 'user';
        const isPending = isLatest && !msg.isFinal;
        
        return (
          <div
            key={msg.id}
            className={`flex items-end gap-3 animate-slide-up ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
          >
            {/* Avatar */}
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-lg border border-white/10 ${
              isUser 
                ? 'bg-primary text-white shadow-primary/20' 
                : 'bg-surfaceHighlight text-accent shadow-accent/10'
            }`}>
               {isUser ? <User size={16} strokeWidth={2.5} /> : <Bot size={16} strokeWidth={2.5} />}
            </div>

            {/* Message Bubble */}
            <div
              className={`max-w-[85%] relative group transition-all duration-300`}
            >
              <div className={`
                 rounded-2xl px-5 py-3.5 backdrop-blur-xl border shadow-sm
                 ${isUser
                    ? 'bg-primary/90 text-white rounded-br-none border-primary/50'
                    : 'bg-surfaceHighlight/80 text-slate-100 rounded-bl-none border-white/10'
                 }
                 ${isPending ? 'border-primary/50 animate-pulse' : ''}
              `}>
                <p className={`text-[15px] leading-relaxed font-normal ${isPending ? 'text-white' : ''}`}>
                  {msg.text}
                  {isPending && (
                     <span className="inline-block w-1.5 h-4 ml-1.5 bg-white animate-pulse align-middle rounded-full"></span>
                  )}
                </p>
              </div>

              {/* Action Bar (Visible on Hover/Touch) */}
              {!isPending && (
                <div className={`flex items-center gap-2 mt-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ${isUser ? 'justify-end pr-1' : 'justify-start pl-1'}`}>
                  <span className="text-[10px] text-slate-500 font-mono tracking-wide mr-2">
                    {new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </span>
                  
                  <div className="flex gap-1 bg-black/40 rounded-lg p-0.5 border border-white/5 backdrop-blur-md">
                    <button 
                      onClick={() => onPlay(msg.text)}
                      className="p-1.5 hover:text-white text-slate-400 rounded-md transition-colors"
                      title="Read Aloud"
                    >
                      <Volume2 size={12} />
                    </button>
                    <button 
                      onClick={() => handleCopy(msg.text, msg.id)}
                      className="p-1.5 hover:text-white text-slate-400 rounded-md transition-colors"
                      title="Copy"
                    >
                      {copiedId === msg.id ? <Check size={12} className="text-success" /> : <Copy size={12} />}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })}
      <div ref={bottomRef} />
    </div>
  );
};