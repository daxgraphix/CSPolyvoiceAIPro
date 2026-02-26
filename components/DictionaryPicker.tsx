import React, { useState } from 'react';
import { Search, BookOpen, X, ChevronDown, ChevronUp } from 'lucide-react';
import { SupportedLanguage } from '../types';
import { getDictionary, getCategories, getWordsByCategory, DictionaryWord } from '../services/dictionaryService';

interface Props {
  sourceLang: SupportedLanguage;
  onSelectWord: (word: string) => void;
  onClose: () => void;
}

export const DictionaryPicker: React.FC<Props> = ({ sourceLang, onSelectWord, onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  const words = getDictionary(sourceLang);
  const categories = getCategories(sourceLang);
  
  const filteredWords = searchQuery 
    ? words.filter(w => 
        w.word.toLowerCase().includes(searchQuery.toLowerCase()) ||
        w.translation.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : selectedCategory 
      ? getWordsByCategory(sourceLang, selectedCategory)
      : words;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center animate-fade-in">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Dictionary Panel */}
      <div className="relative w-full max-w-lg bg-surface border border-primary/30 rounded-t-3xl max-h-[70vh] flex flex-col animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-accent" />
            <span className="font-semibold text-white">Dictionary</span>
            <span className="text-xs text-slate-400">({sourceLang})</span>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>
        
        {/* Search */}
        <div className="p-3 border-b border-white/5">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search words..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-800 border border-white/20 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors"
            />
          </div>
        </div>
        
        {/* Categories */}
        {!searchQuery && (
          <div className="flex gap-2 p-3 overflow-x-auto no-scrollbar border-b border-white/5">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                selectedCategory === null 
                  ? 'bg-accent text-black' 
                  : 'bg-white/5 text-slate-400 hover:bg-white/10'
              }`}
            >
              All
            </button>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                  selectedCategory === cat 
                    ? 'bg-accent text-black' 
                    : 'bg-white/5 text-slate-400 hover:bg-white/10'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}
        
        {/* Words Grid */}
        <div className="flex-1 overflow-y-auto p-3">
          <div className="grid grid-cols-2 gap-2">
            {filteredWords.map((word, index) => (
              <button
                key={index}
                onClick={() => {
                  onSelectWord(word.word);
                  onClose();
                }}
                className="group flex flex-col items-start p-3 bg-black/20 hover:bg-primary/20 border border-white/5 hover:border-primary/30 rounded-xl transition-all text-left"
              >
                <span className="text-white font-medium text-sm group-hover:text-accent transition-colors">
                  {word.word}
                </span>
                <span className="text-slate-500 text-xs mt-0.5">
                  {word.translation}
                </span>
              </button>
            ))}
          </div>
          
          {filteredWords.length === 0 && (
            <div className="text-center py-8">
              <p className="text-slate-500 text-sm">No words found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

