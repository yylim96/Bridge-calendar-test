
import React, { useState, useEffect } from 'react';
import { Sparkles, Send, X, Loader2 } from 'lucide-react';
import { parseEventWithAI } from '../services/aiService';

interface AIAssistantProps {
  onEventCreated: (event: any) => void;
  onClose: () => void;
}

const AIAssistant: React.FC<AIAssistantProps> = ({ onEventCreated, onClose }) => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    setLoading(true);
    const result = await parseEventWithAI(input);
    setLoading(false);

    if (result) {
      onEventCreated(result);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] animate-in fade-in duration-300" 
        onClick={onClose} 
      />
      
      {/* Bottom Sheet */}
      <div className="relative w-full max-w-lg bg-white rounded-t-3xl shadow-2xl p-6 pb-10 md:mb-8 md:rounded-3xl animate-in slide-in-from-bottom duration-300 ease-out">
        {/* Handle for drag intuition */}
        <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-6 md:hidden" onClick={onClose} />
        
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-100">
              <Sparkles size={22} className="animate-pulse" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800">Bridge AI</h3>
              <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Natural Language Sync</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full transition-colors">
            <X size={22} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <textarea
              autoFocus
              rows={3}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="e.g. 'Coffee with Sarah at 9am tomorrow, mark as shared'"
              className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-base focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all resize-none"
            />
            <button 
              disabled={loading || !input.trim()}
              className="absolute right-3 bottom-3 p-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:bg-slate-300 transition-all shadow-lg shadow-indigo-100"
            >
              {loading ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
            </button>
          </div>
          
          <div className="grid grid-cols-1 gap-2">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider px-1">Tips</p>
            <div className="flex flex-wrap gap-2">
              {["'Mark as shared'", "'Every Friday'", "'Set for next week'"].map(tip => (
                <button 
                  key={tip}
                  type="button"
                  onClick={() => setInput(tip.replace(/'/g, ''))}
                  className="px-3 py-1.5 bg-slate-100 rounded-full text-xs font-medium text-slate-600 hover:bg-slate-200 transition-colors"
                >
                  {tip}
                </button>
              ))}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AIAssistant;
