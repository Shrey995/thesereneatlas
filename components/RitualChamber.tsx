
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAtlas } from '../context/AtlasContext';
import { CheckCircle2, Circle, Sparkles, Clock } from 'lucide-react';

const RitualChamber: React.FC = () => {
  const { habits, toggleHabit, selectedTimeframe, setTimeframe } = useAtlas();
  const filtered = habits.filter(h => h.timeframe === selectedTimeframe);

  const completionRate = filtered.length > 0 
    ? Math.round((filtered.filter(h => h.completedToday).length / filtered.length) * 100) 
    : 0;

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 pb-40">
      <header className="mb-20 text-center relative z-10">
        <div className="inline-flex items-center gap-3 px-6 py-2 bg-amber-50 rounded-full border border-amber-100 text-amber-600 text-[10px] font-bold uppercase tracking-[0.3em] mb-6 shadow-sm">
           <Clock size={14} /> The Daily Unfolding
        </div>
        <h2 className="text-6xl md:text-9xl handwritten font-bold text-amber-950 mb-10">Ritual Chamber</h2>
        <div className="flex gap-4 bg-black/5 p-2 rounded-full w-fit mx-auto shadow-inner border border-black/5">
          {['daily', 'weekly', 'monthly'].map(t => (
            <button 
              key={t} 
              onClick={() => setTimeframe(t as any)} 
              className={`px-10 py-3 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${selectedTimeframe === t ? 'bg-white shadow-xl text-amber-900' : 'text-black/30 hover:text-black'}`}
            >
              {t}
            </button>
          ))}
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        <div className="lg:col-span-8 space-y-6">
          <AnimatePresence mode="popLayout">
            {filtered.map((habit, idx) => (
              <motion.div 
                key={habit.id} 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                onClick={() => toggleHabit(habit.id)} 
                className={`glass p-8 md:p-10 rounded-[3rem] flex items-center justify-between border-4 cursor-pointer hover:shadow-2xl group transition-all duration-500 ${habit.completedToday ? 'border-emerald-100 bg-emerald-50/20' : 'border-white bg-white/40 hover:scale-[1.02]'}`}
              >
                 <div className="flex items-center gap-8">
                    <div className={`w-16 h-16 rounded-[1.8rem] flex items-center justify-center transition-all duration-700 ${habit.completedToday ? 'bg-emerald-500 text-white rotate-12 scale-110 shadow-xl' : 'bg-white text-black/10 border border-black/5'}`}>
                       {habit.completedToday ? <CheckCircle2 size={32} strokeWidth={3}/> : <Circle size={32} strokeWidth={2}/>}
                    </div>
                    <div>
                       <h4 className={`text-3xl md:text-4xl handwritten transition-all duration-500 ${habit.completedToday ? 'text-emerald-950 opacity-40 line-through' : 'text-amber-950 font-bold'}`}>
                         {habit.name}
                       </h4>
                       <div className="flex items-center gap-3 mt-2">
                          <span className="text-[10px] font-bold uppercase tracking-widest opacity-30">{habit.category}</span>
                          <span className="w-1 h-1 bg-black/10 rounded-full" />
                          <span className="text-[10px] font-bold uppercase tracking-widest text-amber-600 italic">Target: {habit.goalValue} {habit.goalUnit}</span>
                       </div>
                    </div>
                 </div>
                 {habit.completedToday && (
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex items-center gap-2 bg-emerald-500 text-white px-5 py-2 rounded-full shadow-lg">
                       <Sparkles size={14}/>
                       <span className="text-[10px] font-bold uppercase tracking-widest">Etched</span>
                    </motion.div>
                 )}
              </motion.div>
            ))}
          </AnimatePresence>
          
          {filtered.length === 0 && (
            <div className="py-32 text-center opacity-10 italic sketch-font text-4xl border-4 border-dashed border-black/5 rounded-[4rem]">
               <Sparkles size={64} className="mx-auto mb-6" />
               <p>No rituals mapped for this cycle.</p>
            </div>
          )}
        </div>

        <div className="lg:col-span-4 sticky top-32">
           <div className="glass p-12 rounded-[4rem] border border-white/60 shadow-2xl space-y-10 text-center">
              <div>
                 <h4 className="text-3xl handwritten text-amber-950 font-bold mb-2">Soul Harmony</h4>
                 <p className="sketch-font text-xl text-black/30">Current cycle alignment</p>
              </div>
              
              <div className="relative w-48 h-48 mx-auto flex items-center justify-center">
                 <svg className="absolute inset-0 w-full h-full -rotate-90">
                    <circle cx="96" cy="96" r="80" fill="none" stroke="currentColor" strokeWidth="12" className="text-black/5" />
                    <motion.circle 
                      cx="96" cy="96" r="80" fill="none" stroke="currentColor" strokeWidth="12" 
                      strokeDasharray="502.6" 
                      initial={{ strokeDashoffset: 502.6 }}
                      animate={{ strokeDashoffset: 502.6 - (502.6 * completionRate) / 100 }}
                      className="text-amber-500" 
                    />
                 </svg>
                 <span className="text-6xl font-bold sketch-font text-amber-950">{completionRate}%</span>
              </div>
              
              <p className="text-xs text-black/40 italic leading-relaxed px-4">
                 "Consistency is the steady breath that sustains the fire of the spirit."
              </p>
           </div>
        </div>
      </div>
    </div>
  );
};
export default RitualChamber;
