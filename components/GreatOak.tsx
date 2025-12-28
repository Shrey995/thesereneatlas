
import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAtlas } from '../context/AtlasContext';
import { GrowthCategory } from '../types';
import { Sparkles, Leaf, TreePine, Info, X, Zap, Heart, Brain, Flower2 } from 'lucide-react';

const GreatOak: React.FC = () => {
  const { habits, environment, userXP, isMoonlightMode } = useAtlas();
  const [showInfo, setShowInfo] = useState(false);

  const stats = useMemo(() => {
    return habits.reduce((acc, h) => {
      if (h.completedToday) acc[h.category] = (acc[h.category] || 0) + 1;
      return acc;
    }, { [GrowthCategory.HEALTH]: 0, [GrowthCategory.LEARNING]: 0, [GrowthCategory.SOCIAL]: 0, [GrowthCategory.SPIRIT]: 0 } as any);
  }, [habits]);

  const total = Object.values(stats).reduce((a: any, b: any) => a + b, 0);

  return (
    <div className="h-full flex flex-col items-center justify-center py-4 overflow-hidden relative">
      <header className="mb-4 text-center relative z-20 shrink-0">
        <h2 className="text-6xl md:text-[10rem] handwritten mb-1 text-[var(--ink)] font-bold">The Great Oak</h2>
        <div className="flex items-center justify-center gap-6">
           <p className="sketch-font text-2xl text-[var(--ink)] opacity-40">Your discipline, translated into nature.</p>
           <button onClick={() => setShowInfo(true)} className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl shadow-sm hover:scale-110 transition-all"><Info size={20}/></button>
        </div>
      </header>

      <div className="relative w-full max-w-4xl aspect-square flex items-center justify-center">
        <svg viewBox="0 0 800 800" className="w-full h-full z-20 overflow-visible">
          {/* Trunk */}
          <path d="M380,720 Q400,680 400,500 T400,220" fill="none" stroke={isMoonlightMode ? "#1c2128" : "#3e2c1c"} strokeWidth="50" strokeLinecap="round" />
          
          <CleanBranch origin={[400, 520]} angle={-35} length={160} count={stats[GrowthCategory.HEALTH]} label="Vitality" env={environment} isMoon={isMoonlightMode} />
          <CleanBranch origin={[400, 420]} angle={45} length={150} count={stats[GrowthCategory.LEARNING]} label="Wisdom" env={environment} isMoon={isMoonlightMode} />
          <CleanBranch origin={[400, 300]} angle={-15} length={170} count={stats[GrowthCategory.SPIRIT]} label="Soul" env={environment} isMoon={isMoonlightMode} />
          <CleanBranch origin={[400, 580]} angle={-150} length={130} count={stats[GrowthCategory.SOCIAL]} label="Kinship" env={environment} isMoon={isMoonlightMode} />
        </svg>

        <div className="absolute bottom-6 flex flex-wrap justify-center gap-6 w-full px-8">
          <RefinedBadge label="Canopy Density" value={total} icon={<Leaf size={16}/>} />
          <RefinedBadge label="Spirit XP" value={userXP} icon={<Sparkles size={16}/>} />
        </div>
      </div>

      <AnimatePresence>
        {showInfo && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[200] bg-emerald-950/20 backdrop-blur-md flex items-center justify-center p-6">
             <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} className="bg-white p-12 rounded-[4rem] max-w-xl w-full shadow-2xl relative border border-emerald-100">
                <button onClick={() => setShowInfo(false)} className="absolute top-10 right-10 text-emerald-900/30 hover:text-emerald-900"><X size={32}/></button>
                <h3 className="text-5xl handwritten text-emerald-950 mb-8 font-bold text-center">Tree of Unfolding</h3>
                <div className="space-y-10">
                   <LegendItem icon={<Heart className="text-rose-500"/>} label="Health Habits" desc="Strengthens the Vitality (low-left) branches." />
                   <LegendItem icon={<Brain className="text-amber-500"/>} label="Learning Habits" desc="Grows the Wisdom (mid-right) branches." />
                   <LegendItem icon={<Zap className="text-blue-500"/>} label="Spirit Habits" desc="Fuels the Soul (high-left) canopy." />
                   <LegendItem icon={<Flower2 className="text-emerald-500"/>} label="Social Habits" desc="Expands the Kinship (low-right) base." />
                   <div className="pt-6 border-t border-emerald-50 text-center sketch-font text-xl text-emerald-900/40">
                      "A tree is only as strong as the roots you water today."
                   </div>
                </div>
             </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const LegendItem = ({ icon, label, desc }: any) => (
  <div className="flex gap-6 items-start">
    <div className="w-12 h-12 bg-white rounded-2xl shadow-md border border-black/5 flex items-center justify-center shrink-0">{icon}</div>
    <div>
      <h4 className="font-bold text-emerald-950 text-xl">{label}</h4>
      <p className="sketch-font text-lg text-emerald-900/60 leading-tight">{desc}</p>
    </div>
  </div>
);

const CleanBranch = ({ origin, angle, length, count, label, env, isMoon }: any) => {
  const palette = {
    spring: ['#86efac', '#22c55e'],
    summer: ['#4ade80', '#166534'],
    autumn: ['#fb923c', '#ea580c'],
    winter: ['#cbd5e1', '#94a3b8']
  }[env as keyof typeof palette] || ['#22c55e', '#166534'];

  return (
    <motion.g initial={{ rotate: angle, opacity: 0 }} animate={{ rotate: angle, opacity: 1 }} style={{ originX: `${origin[0]}px`, originY: `${origin[1]}px` }}>
      <path d={`M${origin[0]},${origin[1]} L${origin[0] + length},${origin[1] - 40}`} fill="none" stroke={isMoon ? "#21262d" : "#3e2c1c"} strokeWidth="10" strokeLinecap="round" />
      {[...Array(Math.min(12, count + 2))].map((_, i) => (
        <circle 
          key={i} 
          cx={origin[0] + (i * (length / 12))} 
          cy={origin[1] - (i * 3) - (i % 2 === 0 ? 12 : -12)} 
          r={6 + Math.random()*4} 
          fill={palette[i % 2]} 
          className="shadow-sm"
        />
      ))}
      <g transform={`rotate(${-angle}, ${origin[0] + length + 20}, ${origin[1] - 50})`}>
        <text x={origin[0] + length + 20} y={origin[1] - 50} className="sketch-font text-xl font-bold opacity-30 fill-[var(--ink)]">{label}</text>
      </g>
    </motion.g>
  );
};

const RefinedBadge = ({ label, value, icon }: any) => (
  <div className="glass px-8 py-3 rounded-full shadow-xl border border-white/60 flex items-center gap-4 bg-white/40">
    <div className="w-10 h-10 bg-[var(--paper)] rounded-full flex items-center justify-center shadow-md text-emerald-600 border border-white">{icon}</div>
    <div className="flex flex-col">
      <span className="text-[10px] font-bold uppercase tracking-widest opacity-30 leading-none mb-1">{label}</span>
      <span className="text-xl font-bold sketch-font text-emerald-950">{value}</span>
    </div>
  </div>
);

export default GreatOak;
