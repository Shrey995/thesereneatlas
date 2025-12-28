
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAtlas } from '../context/AtlasContext';
import { Habit, Timeframe, GrowthCategory, FoodEntry } from '../types';
import { 
  Plus, Brain, Heart, Droplets, 
  Sparkles, Activity, Trash2, BookOpen, 
  Footprints, Wind, Salad, Cookie,
  Dumbbell, Settings2, X, Check, Coffee, Sun, Zap,
  Pencil, Save, Flower2, CigaretteOff, Wine, Beer, Ghost
} from 'lucide-react';

const iconMap: Record<string, React.ReactNode> = {
  Dumbbell: <Dumbbell size={20} />,
  Footprints: <Footprints size={20} />,
  BookOpen: <BookOpen size={20} />,
  Sparkles: <Sparkles size={20} />,
  Wind: <Wind size={20} />,
  Brain: <Brain size={20} />,
  Heart: <Heart size={20} />,
  Coffee: <Coffee size={20} />,
  Activity: <Activity size={20} />,
  Sun: <Sun size={20} />,
  Zap: <Zap size={20} />,
  CigaretteOff: <CigaretteOff size={20} />,
  Cookie: <Cookie size={20} />,
  Wine: <Wine size={20} />,
  Beer: <Beer size={20} />,
  Ghost: <Ghost size={20} />
};

const Apothecary: React.FC = () => {
  const { 
    hydrationCurrent, hydrationGoal, updateHydration,
    habits, toggleHabit, addHabit, removeHabit, updateHabitGoal,
    vitalityMarkers, vitalityMetrics, toggleVitalitySeal, addVitalityMarker, removeVitalityMarker,
    addFoodEntry, removeFoodEntry
  } = useAtlas();

  const [isCreating, setIsCreating] = useState(false);
  const [newHabitName, setNewHabitName] = useState('');
  const [newHabitGoal, setNewHabitGoal] = useState(1);
  const [newHabitPeriod, setNewHabitPeriod] = useState<Timeframe>('daily');
  const [newHabitCategory, setNewHabitCategory] = useState<GrowthCategory>(GrowthCategory.HEALTH);
  const [newHabitIcon, setNewHabitIcon] = useState('Activity');
  
  const [isAddingMarker, setIsAddingMarker] = useState(false);
  const [markerLabel, setMarkerLabel] = useState('');
  const [markerIcon, setMarkerIcon] = useState('Sparkles');

  const [foodInput, setFoodInput] = useState('');

  const handleCreateHabit = () => {
    if (!newHabitName.trim()) return;
    addHabit({
      name: newHabitName,
      icon: newHabitIcon,
      category: newHabitCategory,
      goalValue: newHabitGoal,
      goalUnit: 'units',
      timeframe: newHabitPeriod
    });
    setNewHabitName('');
    setNewHabitGoal(1);
    setIsCreating(false);
  };

  const handleCreateMarker = () => {
    if (!markerLabel.trim()) return;
    addVitalityMarker({ label: markerLabel, icon: markerIcon });
    setMarkerLabel('');
    setIsAddingMarker(false);
  };

  return (
    <div className="w-full flex flex-col gap-8 md:gap-12 animate-ink pb-32">
      
      {/* Primary Action Header */}
      <header className="flex flex-col gap-6 border-b border-[var(--glass-border)] pb-12">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
           <div>
             <h2 className="text-5xl sm:text-7xl md:text-8xl handwritten text-[var(--ink-emerald)] font-bold">Vitality Lab</h2>
             <p className="sketch-font text-lg sm:text-2xl text-[var(--ink)] opacity-40 italic mt-2">Precision alchemy for your daily evolution.</p>
           </div>
           <motion.button 
             whileHover={{ scale: 1.05, y: -2 }}
             whileTap={{ scale: 0.95 }}
             onClick={() => setIsCreating(true)}
             className="group flex items-center gap-5 bg-[var(--accent)] text-white px-10 py-5 rounded-[2.5rem] shadow-2xl hover:brightness-110 transition-all w-full sm:w-auto justify-center"
           >
             <div className="bg-white/20 p-2 rounded-full group-hover:rotate-90 transition-transform">
               <Plus size={24} />
             </div>
             <span className="text-sm font-bold uppercase tracking-[0.3em]">Inscribe Intention</span>
           </motion.button>
        </div>
      </header>

      {/* Responsive Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-16">
        
        {/* Left Section: Hydration & Habits */}
        <div className="lg:col-span-8 flex flex-col gap-10 md:gap-16">
          
          {/* Hydration Wells */}
          <section className="bg-[var(--ink-sky)]/5 p-8 sm:p-12 rounded-[4rem] border border-[var(--ink-sky)]/10 shadow-inner relative overflow-hidden">
             <div className="absolute top-0 right-0 p-8 opacity-5 text-[var(--ink-sky)]">
                <Droplets size={160} />
             </div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-8 mb-10 relative z-10">
               <div className="flex items-center gap-6">
                  <div className="p-5 bg-[var(--paper)] rounded-3xl text-sky-500 shadow-xl border border-[var(--glass-border)]"><Droplets size={32}/></div>
                  <div>
                    <h3 className="text-4xl handwritten text-[var(--ink-sky)] leading-none mb-2 font-bold">Daily Wells</h3>
                    <p className="sketch-font text-lg text-[var(--ink-sky)] opacity-40 italic">Nourishing the internal tides.</p>
                  </div>
               </div>
               <div className="text-left sm:text-right">
                  <p className="text-5xl font-bold text-[var(--ink-sky)] leading-none mb-3">{hydrationCurrent} <span className="text-2xl opacity-30">/ {hydrationGoal} ml</span></p>
                  <div className="flex items-center gap-3 sm:justify-end">
                    <span className="w-2.5 h-2.5 rounded-full bg-sky-400 animate-pulse" />
                    <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-sky-400">Biological Balance</p>
                  </div>
               </div>
            </div>
            
            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-4 relative z-10">
               {[...Array(Math.floor(hydrationGoal / 250))].map((_, i) => {
                 const isFilled = (i + 1) * 250 <= hydrationCurrent;
                 return (
                   <button 
                    key={i} 
                    onClick={() => updateHydration(isFilled ? -250 : 250)}
                    className={`aspect-square rounded-[1.8rem] flex items-center justify-center transition-all duration-700 border ${ isFilled ? 'bg-sky-500 text-white shadow-2xl border-sky-400 scale-110 rotate-3' : 'bg-[var(--paper)]/60 text-sky-200 border-[var(--glass-border)] hover:bg-[var(--paper)] hover:scale-105' }`}
                   >
                     <Droplets size={isFilled ? 28 : 22} />
                   </button>
                 );
               })}
            </div>
          </section>

          {/* Intention Garden (Habits) */}
          <section className="flex flex-col gap-10">
             <div className="flex items-center justify-between px-4">
                <h3 className="text-4xl handwritten text-[var(--ink-emerald)] font-bold">Active Intentions</h3>
                <span className="text-[10px] font-bold text-[var(--ink)] opacity-30 uppercase tracking-[0.4em]">{habits.length} Anchors Placed</span>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {habits.map(habit => (
                  <HabitSticker 
                   key={habit.id} 
                   habit={habit} 
                   onToggle={() => toggleHabit(habit.id)} 
                   onDelete={() => removeHabit(habit.id)}
                   onUpdateGoal={(g) => updateHabitGoal(habit.id, g)}
                  />
                ))}
             </div>
          </section>
        </div>

        {/* Right Section: Sidebar Logs */}
        <div className="lg:col-span-4 flex flex-col gap-10 md:gap-16">
           {/* Vitality Seals */}
           <section className="bg-[var(--paper)] p-10 rounded-[4rem] border border-[var(--glass-border)] shadow-2xl space-y-8">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-3xl handwritten text-[var(--ink-emerald)] flex items-center gap-4 font-bold">Vitality Seals</h4>
                <button 
                  onClick={() => setIsAddingMarker(true)}
                  className="p-3 text-[var(--ink-emerald)] opacity-40 hover:opacity-100 transition-all"
                >
                  <Plus size={24}/>
                </button>
              </div>

              <div className="space-y-5">
                {vitalityMarkers.map(m => (
                  <div key={m.id} className="bg-[var(--bg-world)]/30 p-5 rounded-[2.5rem] border border-[var(--glass-border)] flex justify-between items-center group relative overflow-hidden transition-all hover:shadow-lg">
                    <div className="flex items-center gap-5">
                      <div className={`p-4 rounded-2xl transition-all duration-700 ${vitalityMetrics.toggles[m.id] ? 'bg-emerald-500 text-white' : 'bg-[var(--paper)] text-[var(--ink)] opacity-20'}`}>
                        {iconMap[m.icon] || <Sparkles size={24}/>}
                      </div>
                      <div>
                        <span className="sketch-font text-xl font-bold text-[var(--ink)]">{m.label}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <button onClick={() => removeVitalityMarker(m.id)} className="opacity-0 group-hover:opacity-100 p-2 text-rose-400 hover:text-rose-500 transition-all">
                        <Trash2 size={16}/>
                      </button>
                      <button 
                        onClick={() => toggleVitalitySeal(m.id)}
                        className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all shadow-xl ${vitalityMetrics.toggles[m.id] ? 'bg-emerald-600 text-white shadow-emerald-100' : 'bg-[var(--paper)] border border-[var(--glass-border)] text-[var(--ink)] opacity-20'}`}
                      >
                        {vitalityMetrics.toggles[m.id] ? <Check size={24} strokeWidth={4}/> : <Zap size={20}/>}
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <AnimatePresence>
                {isAddingMarker && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="pt-6 border-t border-[var(--glass-border)] overflow-hidden">
                    <div className="flex flex-col gap-5">
                      <input 
                        type="text" value={markerLabel} 
                        onChange={(e) => setMarkerLabel(e.target.value)}
                        placeholder="Tag Label"
                        className="w-full bg-[var(--bg-world)]/40 p-5 rounded-3xl sketch-font text-xl text-[var(--ink)] outline-none border-2 border-transparent focus:border-[var(--ink-emerald)] transition-all shadow-inner"
                      />
                      <button 
                        onClick={handleCreateMarker}
                        className="w-full bg-[var(--accent)] text-white py-5 rounded-[2rem] text-xs font-bold uppercase tracking-[0.3em] shadow-xl active:scale-95 transition-all"
                      >
                        Seal Integrity
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
           </section>
        </div>
      </div>
    </div>
  );
};

// Interface for HabitSticker props
interface HabitStickerProps {
  habit: Habit;
  onToggle: () => void;
  onDelete: () => void;
  onUpdateGoal: (goal: number) => void;
}

const HabitSticker: React.FC<HabitStickerProps> = ({ habit, onToggle, onDelete, onUpdateGoal }) => {
  const [isEditing, setIsEditing] = useState(false);
  const progressPercent = Math.min(100, (habit.currentProgress / habit.goalValue) * 100);

  return (
    <div className={`relative bg-[var(--paper)] border border-[var(--glass-border)] p-10 rounded-[4rem] shadow-xl group transition-all duration-700 flex flex-col justify-between overflow-hidden ${habit.completedToday ? 'rotate-1 border-emerald-500/20' : 'hover:scale-[1.02]'}`}>
      <div className="flex justify-between items-start mb-10 relative z-10">
        <div className={`p-6 rounded-3xl transition-all duration-700 ${habit.completedToday ? 'bg-emerald-600 text-white rotate-12 scale-125 shadow-2xl' : 'bg-[var(--bg-world)]/50 text-[var(--ink)] opacity-30 group-hover:rotate-6'}`}>
          {iconMap[habit.icon] || <Activity size={28} />}
        </div>
        <button 
          onClick={(e) => { e.stopPropagation(); onToggle(); }}
          className={`w-16 h-16 rounded-full border-4 flex items-center justify-center transition-all duration-700 ${habit.completedToday ? 'bg-emerald-600 border-emerald-600 text-white shadow-2xl rotate-12' : 'bg-transparent border-[var(--ink)]/10 text-[var(--ink)]/10 hover:border-[var(--ink)]/40 hover:text-[var(--ink)] hover:scale-110'}`}
        >
          <Check size={habit.completedToday ? 32 : 28} strokeWidth={habit.completedToday ? 4 : 2}/>
        </button>
      </div>
      <div className="relative z-10">
        <div className="pr-12 mb-8">
           <h4 className={`text-4xl handwritten leading-tight transition-all duration-700 ${habit.completedToday ? 'text-[var(--ink-emerald)] font-bold' : 'text-[var(--ink)]'}`}>{habit.name}</h4>
           <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--ink-muted)] mt-2">{habit.timeframe} Cadence</p>
        </div>
        <div className="w-full h-5 bg-black/5 rounded-full overflow-hidden border border-black/5 relative shadow-inner mb-6">
           <motion.div 
             initial={{ width: 0 }} animate={{ width: `${progressPercent}%` }} transition={{ duration: 2, ease: "circOut" }}
             className={`h-full relative transition-colors duration-1000 ${progressPercent >= 100 ? 'bg-emerald-600' : 'bg-[var(--accent)]'}`} 
           />
        </div>
      </div>
      <div className="flex justify-between items-center mt-6 relative z-10">
         <div className="flex gap-5">
           <button onClick={() => setIsEditing(!isEditing)} className="p-4 text-[var(--ink)] opacity-10 hover:opacity-100 hover:bg-[var(--bg-world)] rounded-2xl transition-all"><Settings2 size={24}/></button>
           <button onClick={onDelete} className="p-4 text-rose-900 opacity-10 hover:opacity-100 hover:bg-rose-50 rounded-2xl transition-all"><Trash2 size={24}/></button>
         </div>
         {habit.completedToday && (
           <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-3 bg-emerald-500/10 px-5 py-2.5 rounded-full">
              <div className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-700 italic">Anchored Today</span>
           </motion.div>
         )}
      </div>
    </div>
  );
};

export default Apothecary;
