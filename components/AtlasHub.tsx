
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAtlas } from '../context/AtlasContext';
import { Area } from '../types';
import { 
  Compass, Mountain, TreePine, Droplets, BookOpen, 
  PenTool, Sparkles, Eye, Flower2, Package, Landmark, Trophy,
  Star, Anchor, Milestone as MilestoneIcon, ChevronDown, Award
} from 'lucide-react';

const AtlasHub: React.FC = () => {
  const { setActiveArea, userXP, habits, journalEntries, books, milestones } = useAtlas();
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  // Landmarks defined by their vertical sequence
  const sanctuaries = [
    { id: 'vision', name: 'Vision Peaks', side: 'right', icon: <Mountain />, desc: 'Future Manifestations' },
    { id: 'pond', name: 'Zen Pond', side: 'left', icon: <Droplets />, desc: 'Focus & Stillness' },
    { id: 'observatory', name: 'Chronos Vault', side: 'right', icon: <Eye />, desc: 'Temporal Records' },
    { id: 'ritual', name: 'Daily Rituals', side: 'left', icon: <Sparkles />, desc: 'Habit Sanctum' },
    { id: 'oak', name: 'The Great Oak', side: 'right', icon: <TreePine />, desc: 'Synthesis of Growth' },
    { id: 'inventory', name: 'Self Garden', side: 'left', icon: <Package />, desc: 'Core Identity' },
    { id: 'library', name: 'Whisper Library', side: 'right', icon: <BookOpen />, desc: 'Wisdom Archive' },
    { id: 'scribe', name: "Scribe's Desk", side: 'left', icon: <PenTool />, desc: 'Journal & Truth' },
    { id: 'apothecary', name: 'Vitality Lab', side: 'right', icon: <Flower2 />, desc: 'Alchemy of Health' },
    { id: 'vault', name: 'Gilded Vault', side: 'left', icon: <Landmark />, desc: 'Material Abundance' },
  ];

  const level = Math.floor(userXP / 1000) + 1;
  const progressToNext = ((userXP % 1000) / 1000) * 100;

  // Generate a wavy path for the resonance string
  const wavyPath = useMemo(() => {
    const segments = sanctuaries.length * 2;
    const spacing = 250; // Distance between points
    const amplitude = 40; // Wave width
    let d = "M 500 0";
    for (let i = 1; i <= segments; i++) {
      const y = i * spacing;
      const x = 500 + (i % 2 === 0 ? amplitude : -amplitude);
      d += ` Q ${i % 2 === 0 ? 500 + amplitude * 2 : 500 - amplitude * 2} ${y - spacing / 2}, ${x} ${y}`;
    }
    return d;
  }, [sanctuaries.length]);

  return (
    <div className="w-full flex flex-col items-center pt-24 pb-96">
      {/* Introduction Gamification */}
      <header className="mb-32 text-center relative z-10 px-4">
        <motion.div 
          initial={{ y: -20, opacity: 0 }} 
          animate={{ y: 0, opacity: 1 }}
          className="inline-flex items-center gap-3 px-8 py-3 bg-[var(--header-bg)] glass rounded-full border border-[var(--glass-border)] shadow-2xl mb-8"
        >
          <Trophy size={20} className="text-amber-500" />
          <div className="flex flex-col items-start">
             <span className="text-[10px] font-bold uppercase tracking-[0.4em] leading-none text-[var(--ink)]">Architect Level {level}</span>
             <div className="w-32 h-1.5 bg-black/5 rounded-full overflow-hidden mt-1.5 shadow-inner">
                <motion.div 
                  initial={{ width: 0 }} 
                  animate={{ width: `${progressToNext}%` }} 
                  className="h-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" 
                />
             </div>
          </div>
        </motion.div>
        
        <h1 className="text-7xl md:text-[10rem] handwritten font-bold text-[var(--ink)] mb-6 leading-none select-none">
          The Serene Atlas
        </h1>
        <div className="flex items-center justify-center gap-6">
           <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={16} className={i < Math.floor(userXP/2000) ? "text-amber-400 fill-amber-400" : "text-[var(--dots)]"} />
              ))}
           </div>
           <p className="sketch-font text-2xl text-[var(--ink)] opacity-60 italic">Scroll to traverse your ascending spirit.</p>
        </div>
        <motion.div 
          animate={{ y: [0, 15, 0] }} 
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          className="mt-16 opacity-40 flex flex-col items-center gap-2 text-[var(--ink)]"
        >
          <span className="text-[10px] font-bold uppercase tracking-[0.5em]">Descent</span>
          <ChevronDown size={32} />
        </motion.div>
      </header>

      {/* The Vertical Path Container */}
      <div className="relative w-full max-w-5xl px-4 flex flex-col items-center">
        
        {/* The Wavy Resonance String */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-full pointer-events-none opacity-[0.2]">
          <svg viewBox="0 0 1000 5000" className="w-full h-full overflow-visible" preserveAspectRatio="none">
            <path 
              d={wavyPath} 
              fill="none" 
              stroke="var(--ink)" 
              strokeWidth="4" 
              strokeDasharray="12 12" 
              className="wavy-line"
            />
          </svg>
        </div>
        
        {/* Landmarking the Ascending Spine */}
        <div className="w-full flex flex-col gap-60 md:gap-80 relative">
          {sanctuaries.map((loc, idx) => {
            const isHovered = hoveredId === loc.id;
            const milestoneIndex = Math.floor(idx / 2);
            const currentMilestone = milestones[milestoneIndex];

            return (
              <React.Fragment key={loc.id}>
                {/* Milestone Node Interleaved */}
                {idx > 0 && idx % 2 === 0 && currentMilestone && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, margin: "-100px" }}
                    className="relative z-30 flex flex-col items-center py-20"
                  >
                    <div className="group relative">
                        <div className="absolute inset-0 bg-amber-400/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="bg-[var(--header-bg)] glass px-8 py-5 rounded-[2.5rem] border-2 border-amber-200 shadow-2xl flex items-center gap-4 relative z-10 transition-transform group-hover:scale-110">
                           <div className="p-3 bg-amber-50 rounded-2xl text-amber-600 shadow-inner">
                              <Award size={20} />
                           </div>
                           <div className="flex flex-col">
                             <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-amber-500 leading-none mb-1">Soul Milestone</span>
                             <span className="text-xl font-bold sketch-font text-[var(--ink-amber)] leading-none">{currentMilestone.title}</span>
                             <span className="text-[10px] text-[var(--ink-muted)] font-bold mt-1 uppercase tracking-widest">{currentMilestone.date}</span>
                           </div>
                        </div>
                    </div>
                  </motion.div>
                )}

                <motion.div 
                  initial={{ opacity: 0, x: loc.side === 'left' ? -80 : 80 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-150px" }}
                  className={`flex w-full ${loc.side === 'left' ? 'justify-start md:pr-[45%]' : 'justify-end md:pl-[45%]'}`}
                >
                  <div className="relative flex flex-col items-center group">
                    {/* Horizontal Connector Line to center */}
                    <div className={`absolute top-1/2 -translate-y-1/2 w-32 md:w-64 h-px bg-[var(--ink)] opacity-[0.2] pointer-events-none ${loc.side === 'left' ? 'left-full' : 'right-full'}`} />
                    
                    <button
                      onMouseEnter={() => setHoveredId(loc.id)}
                      onMouseLeave={() => setHoveredId(null)}
                      onClick={() => setActiveArea(loc.id as Area)}
                      className="relative z-20 flex flex-col items-center"
                    >
                      <div className={`w-28 h-28 md:w-48 md:h-48 bg-[var(--paper)] text-[var(--ink)] rounded-[3.5rem] md:rounded-[6rem] border-4 border-[var(--paper)] flex items-center justify-center shadow-2xl transition-all duration-700 ${isHovered ? 'bg-[var(--accent)] text-white rotate-12 scale-110 shadow-[0_0_80px_rgba(0,0,0,0.15)]' : 'group-hover:rotate-6'}`}>
                        {React.cloneElement(loc.icon as React.ReactElement, { size: isHovered ? 72 : 56, strokeWidth: 1.2 })}
                      </div>
                      
                      <div className={`mt-8 transition-all duration-700 ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-90 translate-y-3'}`}>
                        <div className="bg-[var(--header-bg)] px-10 py-4 rounded-[2rem] shadow-2xl border border-[var(--glass-border)] text-center min-w-[240px]">
                          <span className="sketch-font text-2xl md:text-4xl font-bold whitespace-nowrap block leading-tight text-[var(--ink)]">{loc.name}</span>
                          <AnimatePresence>
                            {isHovered && (
                              <motion.span 
                                initial={{ opacity: 0, height: 0 }} 
                                animate={{ opacity: 1, height: 'auto' }} 
                                exit={{ opacity: 0, height: 0 }}
                                className="text-[10px] font-bold uppercase tracking-widest text-[var(--ink-muted)] block mt-2"
                              >
                                {loc.desc}
                              </motion.span>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>
                    </button>
                  </div>
                </motion.div>
              </React.Fragment>
            );
          })}
        </div>
      </div>
      
      {/* Terminal Landmark - The Final Ascent */}
      <footer className="mt-80 text-center opacity-60 flex flex-col items-center gap-10">
         <div className="relative">
            <div className="absolute inset-0 bg-[var(--paper)] blur-3xl rounded-full scale-150" />
            <div className="w-32 h-32 bg-[var(--paper)] rounded-full flex items-center justify-center shadow-2xl border border-[var(--glass-border)] relative z-10 text-[var(--ink)]">
               <Compass size={56} className="animate-[spin_12s_linear_infinite]" />
            </div>
         </div>
         <div className="flex flex-col items-center gap-6">
            <h3 className="handwritten text-4xl text-[var(--ink)]">The Final Horizon</h3>
            <div className="flex items-center gap-12 text-[10px] font-bold uppercase tracking-[0.6em] text-[var(--ink-muted)]">
              <span>Eternal Garden</span>
              <div className="w-2 h-2 rounded-full bg-[var(--ink-muted)] opacity-20" />
              <span>Soul Ledger</span>
            </div>
         </div>
      </footer>
    </div>
  );
};

export default AtlasHub;
