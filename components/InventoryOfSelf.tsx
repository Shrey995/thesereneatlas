
import React from 'react';
import { motion } from 'framer-motion';
import { Sprout, Leaf, Flower2, Heart, ShieldAlert, Sparkles, BookOpen } from 'lucide-react';

const InventoryOfSelf: React.FC = () => {
  const traits = [
    { name: "Stoic Calm", level: "Sprout", xp: 450, icon: <Sprout className="text-emerald-500" /> },
    { name: "Deep Empathy", level: "Bloom", xp: 1200, icon: <Flower2 className="text-rose-400" /> },
    { name: "Creative Fire", level: "Leaf", xp: 780, icon: <Leaf className="text-teal-400" /> },
    { name: "Rational Mind", level: "Sprout", xp: 200, icon: <BookOpen className="text-sky-400" /> },
  ];

  return (
    <div className="h-full w-full flex flex-col items-center justify-center p-4 md:p-12 bg-teal-50/10 pb-40 overflow-y-auto no-scrollbar">
      <header className="mb-16 text-center">
        <h2 className="text-6xl md:text-9xl handwritten font-bold text-teal-950 mb-2">Self Garden</h2>
        <p className="sketch-font text-2xl text-teal-900/40 italic">Nurturing the eternal traits of your identity.</p>
      </header>

      <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-3 gap-16">
        {/* Explanation Section */}
        <div className="lg:col-span-1 space-y-8">
           <div className="glass p-10 rounded-[3.5rem] border border-white/60 shadow-xl space-y-6">
              <h3 className="text-3xl handwritten text-teal-950 font-bold">What is this?</h3>
              <p className="sketch-font text-xl text-teal-900/60 leading-relaxed">
                 The Self Garden is a repository for your <strong>Inner Identity</strong>. While habits are what you <em>do</em>, these are the seeds of who you <em>are</em>. 
              </p>
              <div className="space-y-4">
                 <div className="flex gap-4 items-center">
                    <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600"><Sprout size={16}/></div>
                    <span className="text-xs font-bold uppercase tracking-widest text-teal-950/40">Sprout: Potential</span>
                 </div>
                 <div className="flex gap-4 items-center">
                    <div className="w-8 h-8 rounded-full bg-teal-50 flex items-center justify-center text-teal-600"><Leaf size={16}/></div>
                    <span className="text-xs font-bold uppercase tracking-widest text-teal-950/40">Leaf: Practice</span>
                 </div>
                 <div className="flex gap-4 items-center">
                    <div className="w-8 h-8 rounded-full bg-rose-50 flex items-center justify-center text-rose-600"><Flower2 size={16}/></div>
                    <span className="text-xs font-bold uppercase tracking-widest text-teal-950/40">Bloom: Mastery</span>
                 </div>
              </div>
           </div>
        </div>

        {/* The Skill Garden */}
        <div className="lg:col-span-2 glass rounded-[4rem] p-12 shadow-2xl overflow-hidden relative border-4 border-white/40">
          <div className="flex items-center justify-between mb-12 relative z-10">
             <h2 className="text-5xl handwritten text-teal-950 font-bold">The Trait Garden</h2>
             <div className="px-6 py-2 bg-emerald-100/50 text-emerald-800 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-sm">
                4 Active Seeds
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
             {traits.map((skill, i) => (
               <motion.div
                 key={skill.name}
                 initial={{ opacity: 0, scale: 0.9 }}
                 whileInView={{ opacity: 1, scale: 1 }}
                 className="p-8 bg-white/40 backdrop-blur-md rounded-[3rem] border border-teal-100 flex items-center gap-6 group hover:shadow-2xl hover:scale-[1.03] transition-all"
               >
                 <div className="w-20 h-20 rounded-[2.2rem] glass flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all border-2 border-white">
                    {React.cloneElement(skill.icon as React.ReactElement, { size: 32 })}
                 </div>
                 <div className="flex-1">
                    <h4 className="text-2xl font-bold text-teal-950">{skill.name}</h4>
                    <p className="text-[10px] text-teal-600/40 mb-3 font-bold uppercase tracking-widest">{skill.level}</p>
                    <div className="w-full bg-black/5 rounded-full h-2 shadow-inner border border-black/5 overflow-hidden">
                       <motion.div 
                        initial={{ width: 0 }} 
                        whileInView={{ width: `${(skill.xp / 1500) * 100}%` }} 
                        className="h-full bg-teal-500 rounded-full shadow-lg" 
                       />
                    </div>
                 </div>
               </motion.div>
             ))}
          </div>

          <div className="absolute -bottom-20 -right-20 opacity-5 pointer-events-none">
             <Sprout size={350} className="text-teal-900" />
          </div>
        </div>
      </div>
    </div>
  );
};
export default InventoryOfSelf;
