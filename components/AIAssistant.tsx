import React, { useState } from 'react';
import { Sparkles, Send, X, Loader2, AlertCircle } from 'lucide-react';
import { parseEventWithAI } from '../services/aiService';

interface AIAssistantProps {
  onEventCreated: (event: any) => void;
  onClose: () => void;
}

const AIAssistant: React.FC<AIAssistantProps> = ({ onEventCreated, onClose }) => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    setLoading(true);
    setError(null);
    try {
      const result = await parseEventWithAI(input);
      if (result) {
        onEventCreated(result);
      } else {
        setError("I couldn't quite parse those details. Try being a bit more specific with dates and times!");
      }
    } catch (err) {
      setError("Sync interrupted. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-[4px] animate-in fade-in duration-500" 
        onClick={onClose} 
      />
      
      {/* Bottom Sheet */}
      <div className="relative w-full max-w-lg bg-white rounded-t-[40px] shadow-2xl p-8 pb-12 md:mb-8 md:rounded-[40px] animate-in slide-in-from-bottom duration-500 cubic-bezier(0.16, 1, 0.3, 1)">
        <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-8 md:hidden opacity-50" onClick={onClose} />
        
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-indigo-200">
              <Sparkles size={24} className={loading ? 'animate-spin' : 'animate-pulse'} />
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-900 tracking-tight">Sync Assistant</h3>
              <p className="text-[10px] text-slate-400 uppercase tracking-widest font-black">Powered by Gemini AI</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-300 hover:text-slate-600 hover:bg-slate-50 rounded-full transition-all">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative group">
            <textarea
              autoFocus
              rows={3}
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                if (error) setError(null);
              }}
              placeholder="e.g. 'Coffee with Sarah at 9am tomorrow, mark as shared'"
              className={`w-full px-6 py-6 bg-slate-50 border-2 rounded-[32px] text-base font-medium focus:ring-4 focus:ring-indigo-500/5 focus:bg-white focus:border-indigo-500 outline-none transition-all resize-none shadow-inner ${error ? 'border-red-100 bg-red-50/30' : 'border-transparent'}`}
            />
            <button 
              disabled={loading || !input.trim()}
              className="absolute right-4 bottom-4 p-4 bg-indigo-600 text-white rounded-2xl hover:bg-indigo-700 disabled:opacity-50 disabled:bg-slate-200 transition-all shadow-xl shadow-indigo-100 active:scale-95"
            >
              {loading ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
            </button>
          </div>

          {error && (
            <div className="flex items-start gap-3 p-4 bg-red-50 rounded-2xl border border-red-100 animate-in fade-in slide-in-from-top-2">
              <AlertCircle size={18} className="text-red-500 shrink-0 mt-0.5" />
              <p className="text-xs font-bold text-red-600 leading-relaxed">{error}</p>
            </div>
          )}
          
          <div className="space-y-3">
            <p className="text-[10px] text-slate-300 font-black uppercase tracking-[0.2em] px-1">Sync Shortcuts</p>
            <div className="flex flex-wrap gap-2">
              {["'Mark as shared'", "'Every Friday'", "'Set for next week'"].map(tip => (
                <button 
                  key={tip}
                  type="button"
                  onClick={() => setInput(tip.replace(/'/g, ''))}
                  className="px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-[11px] font-black text-slate-500 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-100 transition-all uppercase tracking-wider"
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