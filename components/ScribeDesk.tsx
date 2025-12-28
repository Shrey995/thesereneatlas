
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAtlas } from '../context/AtlasContext';
import { 
  PenTool, Feather, Heart, Save, History, X, 
  Sparkles, ChevronRight, Flower2, Moon, Star
} from 'lucide-react';

const ScribeDesk: React.FC = () => {
  const { addJournalEntry, journalEntries } = useAtlas();
  const [content, setContent] = useState('');
  const [mood, setMood] = useState('Serene');
  const [activeTab, setActiveTab] = useState<'write' | 'history'>('write');

  const moodColorMap: Record<string, string> = {
    Serene: 'border-[var(--ink-amber)] bg-[var(--ink-amber)]/5 text-[var(--ink-amber)]',
    Charged: 'border-[var(--ink-rose)] bg-[var(--ink-rose)]/5 text-[var(--ink-rose)]',
    Vibrant: 'border-[var(--ink-emerald)] bg-[var(--ink-emerald)]/5 text-[var(--ink-emerald)]',
    Melancholy: 'border-[var(--ink-sky)] bg-[var(--ink-sky)]/5 text-[var(--ink-sky)]',
    Quiet: 'border-[var(--ink-indigo)] bg-[var(--ink-indigo)]/5 text-[var(--ink-indigo)]',
    Wild: 'border-[var(--ink-muted)] bg-[var(--ink-muted)]/5 text-[var(--ink)]',
  };

  const handleSave = () => {
    if (!content.trim()) return;
    addJournalEntry({ date: new Date().toISOString(), content, mood, gratitude: [] });
    setContent('');
    setActiveTab('history');
  };

  return (
    <div className="w-full flex flex-col gap-10 pb-32 max-w-7xl mx-auto pt-8">
      <header className="flex flex-col gap-8 border-b border-[var(--glass-border)] pb-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
          <div>
            <h2 className="text-6xl md:text-9xl handwritten text-[var(--ink)] font-bold leading-none">The Scribe Desk</h2>
            <p className="sketch-font text-2xl text-[var(--ink)] opacity-40 italic mt-2">Where the soul speaks in whispers of ink.</p>
          </div>
          <div className="flex bg-black/5 p-2 rounded-full shadow-inner border border-[var(--glass-border)]">
            <button onClick={() => setActiveTab('write')} className={`px-10 py-3 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${activeTab === 'write' ? 'bg-[var(--paper)] shadow-xl text-[var(--ink)]' : 'text-[var(--ink)] opacity-30'}`}>Inscribe</button>
            <button onClick={() => setActiveTab('history')} className={`px-10 py-3 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${activeTab === 'history' ? 'bg-[var(--paper)] shadow-xl text-[var(--ink)]' : 'text-[var(--ink)] opacity-30'}`}>Archives</button>
          </div>
        </div>

        {activeTab === 'write' && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }} 
            animate={{ opacity: 1, y: 0 }}
            className="w-full flex flex-col md:flex-row items-center gap-6 bg-[var(--header-bg)] glass p-8 rounded-[3rem] border border-[var(--glass-border)]"
          >
            <div className="flex items-center gap-3 shrink-0">
               <Heart size={20} className="text-rose-500" />
               <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--ink)] opacity-40">Choose Heart-State</span>
            </div>
            <div className="flex flex-wrap justify-center gap-3 flex-1">
              {['Serene', 'Charged', 'Vibrant', 'Melancholy', 'Quiet', 'Wild'].map(m => (
                <button 
                  key={m} 
                  onClick={() => setMood(m)} 
                  className={`px-6 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all border-2 ${mood === m ? 'bg-[var(--accent)] text-white shadow-xl border-[var(--accent)]' : 'bg-[var(--paper)]/60 text-[var(--ink)] opacity-40 border-transparent hover:border-[var(--glass-border)]'}`}
                >
                  {m}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </header>

      <div className="w-full max-w-5xl mx-auto">
        <AnimatePresence mode="wait">
          {activeTab === 'write' ? (
            <motion.div key="writer" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="space-y-8">
              <div className="relative group">
                <textarea 
                  value={content} 
                  onChange={e => setContent(e.target.value)} 
                  placeholder="Let your ephemeral truths find their way onto the parchment..." 
                  className={`w-full glass bg-[var(--paper)]/50 p-12 md:p-20 rounded-[4.5rem] min-h-[650px] scribe-font text-3xl md:text-5xl text-[var(--ink)] outline-none border-4 shadow-2xl transition-all duration-1000 focus:bg-[var(--paper)] focus:shadow-[0_0_80px_rgba(0,0,0,0.05)] ${moodColorMap[mood].split(' ')[0]}`} 
                />
                <div className="absolute top-12 right-12 text-[var(--ink)] opacity-5 pointer-events-none group-focus-within:opacity-10 transition-opacity">
                  <Feather size={120} />
                </div>
              </div>
              <motion.button 
                whileHover={{ scale: 1.02 }} 
                whileTap={{ scale: 0.98 }}
                onClick={handleSave} 
                className="w-full py-10 bg-[var(--accent)] text-white rounded-[3.5rem] font-bold uppercase tracking-[0.6em] shadow-2xl hover:brightness-110 transition-all flex items-center justify-center gap-6"
              >
                <Save size={32} /> Seal Eternal Scroll
              </motion.button>
            </motion.div>
          ) : (
            <motion.div key="history" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {journalEntries.map((entry, idx) => (
                <motion.div 
                  key={entry.id} 
                  initial={{ opacity: 0, y: 20 }} 
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className={`glass p-12 rounded-[4rem] border-2 shadow-xl relative overflow-hidden group h-fit ${moodColorMap[entry.mood] || 'border-[var(--glass-border)]'}`}
                >
                  <div className="absolute top-0 right-0 p-10 opacity-[0.03] rotate-12 group-hover:scale-125 transition-transform text-[var(--ink)]"><Star size={100}/></div>
                  <div className="flex justify-between items-center mb-8 relative z-10">
                    <div>
                      <p className="sketch-font text-xl text-[var(--ink)] opacity-30 mb-1">{new Date(entry.date).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}</p>
                      <h4 className="text-4xl handwritten font-bold text-[var(--ink)]">Moon of {entry.mood}</h4>
                    </div>
                    <span className="px-6 py-2 bg-black/5 rounded-full text-[10px] font-bold uppercase tracking-widest border border-[var(--glass-border)] text-[var(--ink)]">{entry.mood}</span>
                  </div>
                  <p className="scribe-font text-3xl md:text-4xl leading-relaxed text-[var(--ink)] opacity-80 relative z-10 line-clamp-6">{entry.content}</p>
                </motion.div>
              ))}
              {journalEntries.length === 0 && (
                <div className="col-span-full py-40 text-center text-[var(--ink)] opacity-20 italic scribe-font text-5xl">
                   <PenTool size={100} className="mx-auto mb-10" />
                   <p>The archives are waiting for your first signature.</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ScribeDesk;
