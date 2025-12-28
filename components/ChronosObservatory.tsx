
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAtlas } from '../context/AtlasContext';
import { Habit, HistoryRecord, Milestone, VitalityMarker } from '../types';
import { 
  Eye, Milestone as MilestoneIcon, Anchor, 
  Sparkles, History, Calendar, LayoutGrid, 
  CheckCircle2, TrendingUp, ChevronRight,
  Dumbbell, Footprints, BookOpen, Activity, Moon, Plus, CigaretteOff, Cookie, X, Save,
  Wine, Beer, Ghost, ShieldCheck, Zap, Flame, Award, Timer
} from 'lucide-react';

const iconMap: Record<string, React.ReactNode> = {
  Dumbbell: <Dumbbell size={16} />,
  Footprints: <Footprints size={16} />,
  BookOpen: <BookOpen size={16} />,
  Activity: <Activity size={16} />,
  Cookie: <Cookie size={16}/>,
  CigaretteOff: <CigaretteOff size={16}/>,
  Wine: <Wine size={16}/>,
  Beer: <Beer size={16}/>,
  Ghost: <Ghost size={16}/>,
  Sparkles: <Sparkles size={16}/>,
  Zap: <Zap size={16} />,
  Flame: <Flame size={16} />
};

const ChronosObservatory: React.FC = () => {
  const { milestones, history, habits, addMilestone, vitalityMarkers, vitalityMetrics } = useAtlas();
  const [view, setView] = useState<'timeline' | 'archive' | 'tapestry' | 'yearly'>('timeline');
  const [selectedHabitId, setSelectedHabitId] = useState<string | 'all'>(habits[0]?.id || 'all');
  const [isAddingMilestone, setIsAddingMilestone] = useState(false);
  
  const [newMTitle, setNewMTitle] = useState('');
  const [newMDate, setNewMDate] = useState(new Date().toISOString().split('T')[0]);
  const [newMType, setNewMType] = useState<'Lantern' | 'Bloom' | 'Anchor'>('Bloom');

  // Calculate Streaks for Vitality Markers
  const streaks = useMemo(() => {
    return vitalityMarkers.map(marker => {
      let currentStreak = 0;
      let longestStreak = 0;
      let tempStreak = 0;

      // Check current day first
      const isTodayActive = vitalityMetrics.toggles[marker.id];
      if (isTodayActive) currentStreak = 1;

      // Iterate history (which is sorted date descending: [yesterday, day-before, ...])
      for (let i = 0; i < history.length; i++) {
        const wasActive = history[i].metrics.toggles?.[marker.id];
        if (wasActive) {
          if (i === tempStreak && isTodayActive) {
            currentStreak++;
          }
          tempStreak++;
          longestStreak = Math.max(longestStreak, tempStreak);
        } else {
          // Break temp streak
          tempStreak = 0;
          // If we find a break, current streak calculation is done
          if (i >= currentStreak - 1) break; 
        }
      }

      return {
        ...marker,
        currentStreak,
        longestStreak,
        isActive: isTodayActive
      };
    });
  }, [vitalityMarkers, vitalityMetrics, history]);

  const handleSaveMilestone = () => {
    if (!newMTitle.trim()) return;
    addMilestone({ title: newMTitle, date: newMDate, type: newMType });
    setNewMTitle('');
    setIsAddingMilestone(false);
  };

  return (
    <div className="h-full w-full bg-indigo-50/10 overflow-y-auto no-scrollbar p-4 sm:p-8 md:p-12 pb-40">
      <div className="max-w-6xl mx-auto flex flex-col items-center">
        
        <header className="text-center mb-12 w-full">
          <h2 className="text-5xl md:text-7xl handwritten font-bold text-indigo-950 mb-8">Chronos Observatory</h2>
          <nav className="flex flex-wrap justify-center gap-4 bg-white/60 p-1.5 rounded-full border border-black/5 backdrop-blur-md w-fit mx-auto shadow-sm">
            <NavBtn active={view === 'timeline'} onClick={() => setView('timeline')} icon={<Sparkles size={16}/>} label="Timeline" />
            <NavBtn active={view === 'archive'} onClick={() => setView('archive')} icon={<History size={16}/>} label="Archive" />
            <NavBtn active={view === 'tapestry' || view === 'yearly'} onClick={() => setView('tapestry')} icon={<LayoutGrid size={16}/>} label="Tapestry" />
          </nav>
        </header>

        <AnimatePresence mode="wait">
          {view === 'timeline' && (
            <motion.div key="timeline" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full flex flex-col items-center">
              
              {/* Resilience Streaks Dashboard */}
              <div className="w-full mb-12 space-y-6">
                <div className="flex items-center justify-between px-6">
                  <h3 className="text-2xl handwritten text-indigo-950 font-bold">Resilience Streaks</h3>
                  <div className="flex items-center gap-2 opacity-30">
                    <Timer size={14}/>
                    <span className="text-[10px] font-bold uppercase tracking-widest">Calculated by Moon Cycles</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {streaks.map(s => (
                    <motion.div 
                      key={s.id}
                      whileHover={{ y: -5 }}
                      className={`glass rounded-[3rem] p-8 border border-white/50 shadow-xl relative overflow-hidden flex flex-col justify-between min-h-[220px] transition-all ${s.isActive ? 'ring-2 ring-emerald-400/20' : ''}`}
                    >
                      {/* Decorative Background Icon */}
                      <div className="absolute -right-4 -top-4 opacity-[0.03] scale-150 rotate-12 pointer-events-none">
                        {iconMap[s.icon] || <Sparkles size={100}/>}
                      </div>

                      <div className="flex justify-between items-start relative z-10">
                        <div className={`p-4 rounded-2xl ${s.isActive ? 'bg-indigo-950 text-white' : 'bg-indigo-50 text-indigo-300'}`}>
                          {iconMap[s.icon] || <ShieldCheck size={20}/>}
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-300 block mb-1">Current Soul-Streak</span>
                          <div className="flex items-center gap-2 justify-end">
                            {s.isActive && (
                              <motion.div 
                                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                                transition={{ duration: 2, repeat: Infinity }}
                              >
                                <Flame className="text-orange-500" size={18} fill="currentColor" />
                              </motion.div>
                            )}
                            <span className="text-4xl font-bold sketch-font text-indigo-950">{s.currentStreak}</span>
                            <span className="text-sm font-bold text-indigo-300">days</span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-8 relative z-10">
                        <div className="flex justify-between items-center mb-4">
                           <h4 className="text-lg handwritten font-bold text-indigo-900">{s.label}</h4>
                           <div className="flex items-center gap-1">
                              <Award size={12} className="text-amber-500" />
                              <span className="text-[10px] font-bold text-indigo-300">PB: {s.longestStreak}</span>
                           </div>
                        </div>
                        
                        {/* Mini Streak Heatmap */}
                        <div className="flex gap-1">
                           {[...Array(14)].map((_, i) => {
                             const historyIndex = 13 - i;
                             const wasActive = history[historyIndex]?.metrics.toggles?.[s.id];
                             return (
                               <div 
                                 key={i} 
                                 className={`flex-1 h-1.5 rounded-full transition-all ${
                                   wasActive ? 'bg-indigo-950 scale-y-125' : 'bg-indigo-50'
                                 }`} 
                               />
                             );
                           })}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                  
                  {streaks.length === 0 && (
                    <div className="col-span-full py-12 border-2 border-dashed border-indigo-100 rounded-[3rem] flex flex-col items-center justify-center opacity-30 italic">
                      <p className="sketch-font text-xl">No disciplines inked in the lab yet.</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Central Observatory Rings */}
              <div className="w-full glass rounded-[4rem] p-10 md:p-16 mb-20 flex flex-col items-center shadow-xl border border-white/40">
                <div className="w-full flex justify-between items-start mb-12">
                   <div>
                      <h3 className="text-3xl handwritten text-indigo-950 font-bold">The Yearly Rings</h3>
                      <p className="sketch-font text-indigo-900/40 italic">Nature's record of your resilience.</p>
                   </div>
                   <div className="p-4 bg-indigo-50 rounded-full text-indigo-600 shadow-inner"><Eye size={24} /></div>
                </div>
                <div className="relative w-64 h-64 md:w-96 md:h-96 flex items-center justify-center">
                  {[...Array(6)].map((_, i) => (
                    <motion.div key={i} className="absolute border-[3px] border-indigo-200/30 rounded-full" style={{ width: `${(i+1)*16.6}%`, height: `${(i+1)*16.6}%` }} />
                  ))}
                  <div className="text-center z-10 bg-white/80 backdrop-blur-md p-8 rounded-full shadow-2xl">
                    <span className="text-3xl font-bold text-indigo-950 sketch-font">2024</span>
                  </div>
                </div>
              </div>

              {/* Timeline Milestones */}
              <div className="w-full space-y-24 mt-20 relative">
                <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px bg-indigo-100" />
                {milestones.map((m, i) => (
                   <motion.div key={m.id} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className={`flex items-center gap-12 ${i % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                      <div className="flex-1 text-right">
                         {i % 2 === 0 && (
                            <div className="glass p-8 rounded-[3rem] inline-block max-w-sm text-left">
                               <p className="text-[10px] font-bold text-indigo-300 uppercase tracking-widest">{m.date}</p>
                               <h4 className="text-2xl handwritten font-bold text-indigo-950">{m.title}</h4>
                            </div>
                         )}
                      </div>
                      <div className="w-12 h-12 bg-white rounded-full border-4 border-indigo-50 shadow-lg z-10 flex items-center justify-center text-indigo-600">
                         {m.type === 'Anchor' ? <Anchor size={20}/> : (m.type === 'Lantern' ? <MilestoneIcon size={20}/> : <Sparkles size={20}/>)}
                      </div>
                      <div className="flex-1">
                         {i % 2 !== 0 && (
                            <div className="glass p-8 rounded-[3rem] inline-block max-w-sm">
                               <p className="text-[10px] font-bold text-indigo-300 uppercase tracking-widest">{m.date}</p>
                               <h4 className="text-2xl handwritten font-bold text-indigo-950">{m.title}</h4>
                            </div>
                         )}
                      </div>
                   </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {view === 'archive' && (
            <motion.div key="archive" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full space-y-8">
              {history.map((record, i) => (
                <HistoryCard key={record.date} record={record} habits={habits} vitalityMarkers={vitalityMarkers} index={i} />
              ))}
            </motion.div>
          )}

          {view === 'tapestry' && (
            <motion.div key="tapestry" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="w-full flex flex-col gap-12">
              <div className="flex flex-wrap justify-center gap-4 bg-white/40 p-2 rounded-[2.5rem] border border-black/5 backdrop-blur-sm shadow-inner">
                 <button onClick={() => setSelectedHabitId('all')} className={`px-6 py-3 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${selectedHabitId === 'all' ? 'bg-indigo-950 text-white shadow-xl' : 'text-indigo-900/40 hover:bg-white'}`}>All Stems</button>
                 {habits.map(h => (
                   <button key={h.id} onClick={() => setSelectedHabitId(h.id)} className={`flex items-center gap-3 px-6 py-3 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${selectedHabitId === h.id ? 'bg-indigo-950 text-white shadow-xl' : 'text-indigo-900/40 hover:bg-white'}`}>
                     {iconMap[h.icon] || <Activity size={16} />} {h.name}
                   </button>
                 ))}
              </div>
              <div className="grid grid-cols-1 gap-12">
                {selectedHabitId === 'all' ? habits.map(habit => <IntentionTapestry key={habit.id} habit={habit} history={history} onShowYearly={() => setView('yearly')} />) : <IntentionTapestry habit={habits.find(h => h.id === selectedHabitId)!} history={history} isFocus onShowYearly={() => setView('yearly')} />}
              </div>
            </motion.div>
          )}

          {view === 'yearly' && (
            <motion.div key="yearly" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="w-full">
               <YearlyCanopy habits={habits} history={history} onBack={() => setView('tapestry')} />
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-20 w-full flex justify-center">
          <motion.button 
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setIsAddingMilestone(true)}
            className="group flex items-center gap-4 bg-indigo-950 text-white px-12 py-6 rounded-full shadow-2xl transition-all"
          >
            <div className="p-2 bg-white/20 rounded-full group-hover:rotate-12 transition-transform"><Plus size={24} /></div>
            <span className="text-sm font-bold uppercase tracking-[0.3em]">Etch New Milestone</span>
          </motion.button>
        </div>
      </div>

      {/* Milestone Modal */}
      <AnimatePresence>
        {isAddingMilestone && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[200] bg-indigo-950/20 backdrop-blur-md flex items-center justify-center p-6">
             <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="bg-white rounded-[3rem] p-10 max-w-lg w-full shadow-2xl border border-indigo-100 relative">
                <button onClick={() => setIsAddingMilestone(false)} className="absolute top-8 right-8 text-indigo-900/40 hover:text-indigo-950 transition-colors"><X size={24} /></button>
                <h3 className="text-4xl handwritten text-indigo-950 mb-8 font-bold">Ink a Milestone</h3>
                <div className="space-y-6">
                   <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-indigo-600 px-2">Achievement Title</label>
                      <input type="text" value={newMTitle} onChange={(e) => setNewMTitle(e.target.value)} placeholder="e.g. Completed the First Scroll" className="w-full bg-indigo-50/50 p-4 rounded-2xl outline-none focus:ring-2 ring-indigo-200 transition-all sketch-font text-lg text-indigo-950 placeholder:text-indigo-300" />
                   </div>
                   <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-indigo-600 px-2">Cycle Date</label>
                        <input type="date" value={newMDate} onChange={(e) => setNewMDate(e.target.value)} className="w-full bg-indigo-50/50 p-4 rounded-2xl outline-none focus:ring-2 ring-indigo-200 transition-all sketch-font text-sm text-indigo-950" />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-indigo-600 px-2">Soul Signature</label>
                        <select value={newMType} onChange={(e) => setNewMType(e.target.value as any)} className="w-full bg-indigo-50/50 p-4 rounded-2xl outline-none focus:ring-2 ring-indigo-200 transition-all sketch-font text-sm text-indigo-950">
                          <option value="Bloom">Bloom (Growth)</option>
                          <option value="Lantern">Lantern (Vision)</option>
                          <option value="Anchor">Anchor (Stability)</option>
                        </select>
                      </div>
                   </div>
                   <button onClick={handleSaveMilestone} className="w-full bg-indigo-950 text-white py-5 rounded-2xl font-bold uppercase tracking-[0.2em] shadow-xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 mt-4"><Save size={18} /> Seal Chronicle</button>
                </div>
             </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Supporting Components remains the same or slightly optimized for the new layout
const NavBtn = ({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: any, label: string }) => (
  <button onClick={onClick} className={`flex items-center gap-2 px-6 py-2 rounded-full transition-all text-sm font-bold uppercase tracking-widest ${active ? 'bg-indigo-950 text-white shadow-md' : 'text-indigo-900/40 hover:text-indigo-900'}`}>{icon} {label}</button>
);

// Fix: Add explicit typing and use React.FC for HistoryCard to resolve key prop mismatch error
interface HistoryCardProps {
  record: any;
  habits: any[];
  index: number;
  vitalityMarkers: VitalityMarker[];
}

const HistoryCard: React.FC<HistoryCardProps> = ({ record, habits, index, vitalityMarkers }) => (
  <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.05 }} className="glass rounded-[3rem] p-8 md:p-10 shadow-lg border border-white/50 relative overflow-hidden group hover:shadow-2xl transition-all">
    <div className="absolute top-0 left-0 w-2 h-full bg-indigo-950/5" />
    <div className="flex flex-col md:flex-row gap-8 justify-between">
       <div className="flex-1">
          <div className="flex items-center gap-3 mb-4"><div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-900 shadow-inner"><span className="text-xl font-bold sketch-font">{record.date.split('-')[2]}</span></div><div><h4 className="text-2xl font-bold text-indigo-950 leading-none mb-1">{new Date(record.date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</h4></div></div>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8">
             <MetricBadge icon={<Footprints size={14}/>} value={`${Math.round(record.metrics.stepsCount)}`} label="Steps" />
             <MetricBadge icon={<Moon size={14}/>} value={`${record.metrics.sleepHours.toFixed(1)}h`} label="Rest" />
             {vitalityMarkers.map(m => (
               <MetricBadge 
                key={m.id} 
                icon={iconMap[m.icon] || <Sparkles size={14}/>} 
                value={record.metrics.toggles?.[m.id] ? 'Seal' : 'Void'} 
                label={m.label.split(' ')[0]} 
                isSeal={record.metrics.toggles?.[m.id]}
               />
             ))}
          </div>
       </div>
       <div className="flex-1 bg-white/30 rounded-[2.5rem] p-6 border border-indigo-100/50">
          <h5 className="text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-400 mb-4 flex items-center gap-2"><CheckCircle2 size={12}/> Seals</h5>
          <div className="flex flex-wrap gap-2">{record.habitCompletions.map((hid: string) => (<div key={hid} className="px-4 py-2 bg-indigo-950 text-white rounded-full text-[10px] font-bold shadow-sm">{habits.find(h => h.id === hid)?.name || 'Echo'}</div>))}</div>
       </div>
    </div>
  </motion.div>
);

// Fix: Add explicit typing and use React.FC for MetricBadge to resolve key prop mismatch error
interface MetricBadgeProps {
  icon: any;
  value: string;
  label: string;
  isSeal?: boolean;
}

const MetricBadge: React.FC<MetricBadgeProps> = ({ icon, value, label, isSeal }) => (
  <div className="flex flex-col gap-1">
    <div className={`flex items-center gap-2 ${isSeal ? 'text-indigo-950' : 'text-indigo-950/40'}`}>
      {icon}
      <span className="text-[8px] font-bold uppercase tracking-widest">{label}</span>
    </div>
    <span className={`text-xl font-bold sketch-font ${isSeal ? 'text-indigo-950' : 'text-indigo-950/30'}`}>{value}</span>
  </div>
);

// Fix: Add explicit typing and use React.FC for IntentionTapestry to resolve key prop mismatch error
interface IntentionTapestryProps {
  habit: Habit;
  history: HistoryRecord[];
  isFocus?: boolean;
  onShowYearly: () => void;
}

const IntentionTapestry: React.FC<IntentionTapestryProps> = ({ habit, history, isFocus = false, onShowYearly }) => {
  const last30Days = history.slice(0, 30).reverse();
  const last7Days = history.slice(0, 7).reverse();
  return (
    <motion.div layout initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className={`glass rounded-[4rem] p-8 sm:p-12 border border-white/50 shadow-xl overflow-hidden relative ${isFocus ? 'ring-2 ring-indigo-950/5' : ''}`}>
      <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">{iconMap[habit.icon] && React.cloneElement(iconMap[habit.icon] as React.ReactElement<any>, { size: 120 })}</div>
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 mb-12">
        <div className="flex items-center gap-6">
           <div className="p-6 bg-white rounded-[2rem] text-indigo-950 shadow-lg border border-indigo-50">{iconMap[habit.icon] || <Activity size={24} />}</div>
           <div><h3 className="text-3xl md:text-4xl handwritten text-indigo-950 font-bold">{habit.name}</h3><p className="sketch-font text-indigo-400 italic">Historical Bloom in {habit.category}</p></div>
        </div>
        <div className="text-right"><span className="text-[10px] font-bold uppercase tracking-widest text-indigo-300 block mb-1">Weekly Stretch</span><div className="flex items-center gap-2"><TrendingUp size={14} className="text-emerald-500" /><span className="text-xl font-bold sketch-font text-indigo-950">+12% consistency</span></div></div>
      </header>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-8">
           <div className="flex items-center justify-between mb-6 px-2"><h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-indigo-900/40">Monthly Ink Reservoir</h4><span className="text-[10px] font-bold text-indigo-300">Last 30 Rotations</span></div>
           <div className="grid grid-cols-5 sm:grid-cols-10 gap-3 bg-white/30 p-6 rounded-[2.5rem] border border-indigo-50 shadow-inner">
              {last30Days.map((d, i) => {
                const prog = d.habitProgress?.[habit.id] || 0;
                const isComplete = d.habitCompletions.includes(habit.id);
                const fillRatio = Math.min(1, prog / habit.goalValue);
                return (
                  <div key={i} className="flex flex-col items-center gap-1.5 group cursor-help">
                    <motion.div whileHover={{ scale: 1.1 }} className={`relative w-full aspect-square rounded-xl overflow-hidden border transition-all ${isComplete ? 'bg-indigo-950 border-indigo-950 shadow-md' : fillRatio > 0 ? 'bg-indigo-400/40 border-indigo-200' : 'bg-white/60 border-indigo-50'}`}>
                      {!isComplete && fillRatio > 0 && <div className="absolute bottom-0 left-0 right-0 bg-indigo-950 opacity-20" style={{ height: `${fillRatio * 100}%` }} />}
                      {isComplete && <CheckCircle2 size={12} className="absolute top-1 right-1 text-white opacity-40" />}
                    </motion.div>
                  </div>
                );
              })}
           </div>
        </div>
        <div className="lg:col-span-4 flex flex-col gap-6">
           <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-indigo-900/40 px-2">Weekly Stem Growth</h4>
           <div className="flex-1 flex flex-col justify-between bg-white/30 p-8 rounded-[2.5rem] border border-indigo-50 shadow-inner min-h-[220px]">
              {last7Days.map((d, i) => {
                 const prog = d.habitProgress?.[habit.id] || 0;
                 const ratio = Math.min(1, prog / habit.goalValue);
                 return (
                   <div key={i} className="flex items-center gap-4">
                      <span className="text-[9px] font-bold uppercase text-indigo-300 w-8">{new Date(d.date).toLocaleDateString('en-US', { weekday: 'short' })}</span>
                      <div className="flex-1 h-2 bg-indigo-950/5 rounded-full overflow-hidden relative shadow-inner"><motion.div initial={{ width: 0 }} animate={{ width: `${ratio * 100}%` }} className={`h-full relative ${ratio >= 1 ? 'bg-indigo-950' : 'bg-indigo-400'}`} /></div>
                      <span className="text-[10px] sketch-font font-bold text-indigo-950/40">{Math.round(ratio * 100)}%</span>
                   </div>
                 );
              })}
           </div>
        </div>
      </div>
      <footer className="mt-10 pt-8 border-t border-indigo-950/5 flex justify-between items-center">
         <div className="flex items-center gap-3"><div className="w-10 h-10 rounded-full border border-indigo-100 flex items-center justify-center text-indigo-300"><TrendingUp size={16} /></div><p className="sketch-font text-indigo-900/40 italic">Inked consistency has increased by 14% this month.</p></div>
         <button onClick={onShowYearly} className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-indigo-400 hover:text-indigo-950 transition-colors">View Yearly Canopy <ChevronRight size={14}/></button>
      </footer>
    </motion.div>
  );
};

const YearlyCanopy = ({ habits, history, onBack }: { habits: Habit[], history: HistoryRecord[], onBack: () => void }) => {
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  return (
    <div className="w-full glass rounded-[4rem] p-12 border border-indigo-100 shadow-2xl animate-ink">
       <header className="flex justify-between items-center mb-16 px-4">
          <div><h3 className="text-4xl handwritten text-indigo-950 font-bold">The Yearly Canopy</h3><p className="sketch-font text-indigo-400 italic">Twelve moons of growth etched into your soul.</p></div>
          <button onClick={onBack} className="px-8 py-3 bg-indigo-950 text-white rounded-full text-xs font-bold uppercase tracking-widest shadow-xl">Back to Stems</button>
       </header>
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {months.map((month, mIdx) => (
            <div key={month} className="space-y-4">
               <div className="flex justify-between items-center border-b border-indigo-50 pb-2"><h4 className="text-sm font-bold uppercase tracking-[0.2em] text-indigo-950">{month}</h4><span className="text-[10px] text-indigo-300">2024</span></div>
               <div className="grid grid-cols-7 gap-1.5">
                  {[...Array(30)].map((_, dIdx) => {
                    const isHistoryMonth = mIdx < 4;
                    const intensity = isHistoryMonth ? (Math.random() > 0.4 ? 'high' : (Math.random() > 0.5 ? 'low' : 'none')) : 'none';
                    return <div key={dIdx} className={`aspect-square rounded-[4px] border border-black/5 transition-all ${intensity === 'high' ? 'bg-indigo-950' : intensity === 'low' ? 'bg-indigo-300' : 'bg-white/50'}`} />;
                  })}
               </div>
            </div>
          ))}
       </div>
    </div>
  );
};

export default ChronosObservatory;
