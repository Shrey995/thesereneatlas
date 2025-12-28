
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAtlas } from '../context/AtlasContext';
import { 
  Play, Pause, RotateCcw, Volume2, CloudRain, 
  Wind, Bell, Sparkles, Droplets, Trophy, VolumeX
} from 'lucide-react';

class ZenSynth {
  ctx: AudioContext | null = null;
  gainNodes: Record<string, GainNode> = {};
  sources: Record<string, AudioBufferSourceNode> = {};
  
  init() {
    if (this.ctx) return;
    this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    this.setupRain(); this.setupBreeze(); this.setupChimes();
  }
  
  private setupRain() {
    if (!this.ctx) return;
    const b = this.ctx.createBuffer(1, 2 * this.ctx.sampleRate, this.ctx.sampleRate);
    const d = b.getChannelData(0);
    let l = 0; for (let i = 0; i < d.length; i++) { const w = Math.random()*2-1; d[i] = (l + (0.02*w))/1.02; l=d[i]; d[i]*=3.5; }
    const s = this.ctx.createBufferSource(); s.buffer = b; s.loop = true;
    const f = this.ctx.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = 600;
    const g = this.ctx.createGain(); g.gain.value = 0;
    s.connect(f).connect(g).connect(this.ctx.destination); s.start();
    this.gainNodes['rain'] = g;
    this.sources['rain'] = s;
  }
  
  private setupBreeze() {
    if (!this.ctx) return;
    const b = this.ctx.createBuffer(1, 2*this.ctx.sampleRate, this.ctx.sampleRate);
    const d = b.getChannelData(0); for (let i=0; i<d.length; i++) d[i] = Math.random()*2-1;
    const s = this.ctx.createBufferSource(); s.buffer = b; s.loop = true;
    const f = this.ctx.createBiquadFilter(); f.type='bandpass'; f.frequency.value=1000;
    const l = this.ctx.createOscillator(); l.frequency.value=0.1; const lg = this.ctx.createGain(); lg.gain.value=400; l.connect(lg).connect(f.frequency); l.start();
    const g = this.ctx.createGain(); g.gain.value=0; s.connect(f).connect(g).connect(this.ctx.destination); s.start();
    this.gainNodes['breeze'] = g;
    this.sources['breeze'] = s;
  }
  
  private setupChimes() {
    if (!this.ctx) return;
    const g = this.ctx.createGain(); g.gain.value = 1; g.connect(this.ctx.destination);
    this.gainNodes['chimes'] = g;
  }

  playChime(vol: number) {
    if (!this.ctx || vol === 0) return;
    this.resume();
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator(); const g = this.ctx.createGain();
    osc.type = 'sine'; osc.frequency.setValueAtTime(600 + Math.random()*1500, now);
    g.gain.setValueAtTime(0, now);
    g.gain.linearRampToValueAtTime(0.2 * (vol/100), now + 0.05);
    g.gain.exponentialRampToValueAtTime(0.001, now + 5);
    osc.connect(g).connect(this.ctx.destination); osc.start(); osc.stop(now + 5);
  }

  setVolume(t: string, v: number) {
    if (this.gainNodes[t]) this.gainNodes[t].gain.setTargetAtTime(v/100, this.ctx?.currentTime || 0, 0.1);
  }

  stopAll() {
    Object.values(this.gainNodes).forEach(g => g.gain.setTargetAtTime(0, this.ctx?.currentTime || 0, 0.1));
    setTimeout(() => {
        Object.values(this.sources).forEach(s => { try { s.stop(); } catch(e) {} });
        if (this.ctx) { this.ctx.close(); this.ctx = null; }
    }, 200);
  }

  resume() { if (this.ctx?.state === 'suspended') this.ctx.resume(); }
}

const synth = new ZenSynth();

const ZenPond: React.FC = () => {
  const { addXP } = useAtlas();
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [ripples, setRipples] = useState<{ id: number, x: number, y: number }[]>([]);
  const [volumes, setVolumes] = useState({ rain: 0, breeze: 0, chimes: 0 });
  const timerRef = useRef<any>(null);

  useEffect(() => {
    return () => {
      synth.stopAll();
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) { handleComplete(); return 0; }
          if (prev % 60 === 0 && volumes.chimes > 0) synth.playChime(volumes.chimes);
          return prev - 1;
        });
      }, 1000);
    } else clearInterval(timerRef.current);
    return () => clearInterval(timerRef.current);
  }, [isActive, volumes.chimes]);

  const handleComplete = () => { setIsActive(false); addXP(300); createRipple(50, 50); };
  
  const createRipple = (cx?: number, cy?: number) => {
    const x = cx ?? (20 + Math.random()*60); const y = cy ?? (20 + Math.random()*60);
    const id = Date.now() + Math.random(); setRipples(p => [...p, { id, x, y }]);
    setTimeout(() => setRipples(p => p.filter(r => r.id !== id)), 4000);
  };

  const toggle = () => { synth.init(); synth.resume(); setIsActive(!isActive); createRipple(); };
  
  const hvc = (t: string, v: number) => { 
    synth.init(); synth.resume(); 
    setVolumes(p => ({ ...p, [t]: v })); 
    synth.setVolume(t, v); 
    if (t === 'chimes' && v > 0) synth.playChime(v);
  };

  const silenceAll = () => {
    setVolumes({ rain: 0, breeze: 0, chimes: 0 });
    synth.setVolume('rain', 0);
    synth.setVolume('breeze', 0);
    synth.setVolume('chimes', 0);
  };

  return (
    <div className="h-full w-full flex flex-col items-center justify-start pt-40 md:pt-52 p-4 md:p-10 pb-40 overflow-y-auto no-scrollbar">
      <header className="mb-12 text-center relative z-20 shrink-0">
        <h2 className="text-7xl md:text-[10rem] handwritten text-[var(--ink)] mb-1 font-bold leading-none">Zen Pond</h2>
        <p className="sketch-font text-2xl md:text-3xl text-[var(--ink)] opacity-60 italic">Focus is a ripple that finds its shore.</p>
      </header>

      <div className="relative w-full max-w-7xl flex flex-col-reverse lg:flex-row gap-12 min-h-[600px] z-10">
        {/* Interaction Core */}
        <div 
          className="flex-[2] relative rounded-[5rem] shadow-2xl border-4 border-[var(--glass-border)] overflow-hidden cursor-pointer bg-[var(--paper)]/20 min-h-[500px]" 
          onClick={(e) => { 
            const r = e.currentTarget.getBoundingClientRect(); 
            createRipple(((e.clientX-r.left)/r.width)*100, ((e.clientY-r.top)/r.height)*100); 
            synth.resume(); 
            if (volumes.chimes > 0) synth.playChime(volumes.chimes); 
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--ink-sky)]/5 to-[var(--ink-emerald)]/5" />
          <AnimatePresence>
            {ripples.map(r => (
              <motion.div 
                key={r.id} 
                initial={{ scale: 0, opacity: 0.6 }} 
                animate={{ scale: 18, opacity: 0 }} 
                transition={{ duration: 5, ease: 'easeOut' }} 
                className="absolute rounded-full border-[2px] border-[var(--ink-sky)]/40 pointer-events-none" 
                style={{ left: `${r.x}%`, top: `${r.y}%`, width: '40px', height: '40px', marginLeft: '-20px', marginTop: '-20px' }} 
              />
            ))}
          </AnimatePresence>

          <div className="absolute inset-0 flex flex-col items-center justify-center z-20 pointer-events-none">
             <motion.h3 
               animate={isActive ? { scale: [1, 1.05, 1] } : {}}
               transition={{ duration: 4, repeat: Infinity }}
               className="text-[10rem] md:text-[15rem] font-bold font-mono text-[var(--ink)] opacity-20 tracking-tighter"
             >
               {Math.floor(timeLeft/60)}:{(timeLeft%60).toString().padStart(2, '0')}
             </motion.h3>
             <div className="flex gap-10 pointer-events-auto">
                <button onClick={(e) => { e.stopPropagation(); toggle(); }} className={`w-28 h-28 rounded-[3rem] shadow-2xl flex items-center justify-center transition-all ${isActive ? 'bg-rose-500 text-white' : 'bg-[var(--paper)] text-[var(--ink)]'}`}>
                  {isActive ? <Pause size={48}/> : <Play size={48} className="ml-1"/>}
                </button>
                <button onClick={(e) => { e.stopPropagation(); setTimeLeft(25*60); setIsActive(false); }} className="w-28 h-28 bg-[var(--header-bg)] backdrop-blur-md rounded-[3rem] flex items-center justify-center text-[var(--ink)]">
                  <RotateCcw size={48}/>
                </button>
             </div>
          </div>
        </div>

        {/* Ambient Controls */}
        <div className="flex-1 glass p-10 md:p-14 rounded-[5rem] shadow-2xl flex flex-col justify-center gap-12">
          <header className="flex items-center justify-between text-[var(--ink-muted)] mb-4 border-b border-[var(--glass-border)] pb-6">
            <div className="flex items-center gap-4">
               <Volume2 size={24} /> <span className="text-[12px] font-bold uppercase tracking-[0.3em]">Ambient Synthesis</span>
            </div>
            <button onClick={silenceAll} className="p-3 hover:bg-[var(--ink)]/5 rounded-full transition-colors text-[var(--ink)]"><VolumeX size={20} /></button>
          </header>
          <SynthSlider icon={<CloudRain size={24}/>} label="Downpour" val={volumes.rain} onChange={v => hvc('rain', v)} color="bg-sky-400" />
          <SynthSlider icon={<Wind size={24}/>} label="Windswept" val={volumes.breeze} onChange={v => hvc('breeze', v)} color="bg-emerald-400" />
          <SynthSlider icon={<Bell size={24}/>} label="Sanctuary Chimes" val={volumes.chimes} onChange={v => hvc('chimes', v)} color="bg-amber-400" />
        </div>
      </div>
    </div>
  );
};

const SynthSlider = ({ icon, label, val, onChange, color }: any) => (
  <div className="w-full">
    <div className="flex justify-between items-center mb-5 text-[var(--ink)]">
      <div className="flex items-center gap-5">
        <div className={`p-4 rounded-[1.5rem] transition-all duration-500 ${val > 0 ? 'bg-[var(--paper)] shadow-xl text-[var(--accent)] scale-110' : 'bg-[var(--paper)]/20 opacity-30'}`}>{icon}</div>
        <span className="text-sm font-bold uppercase tracking-widest opacity-60">{label}</span>
      </div>
      <span className="text-sm font-mono font-bold">{val}%</span>
    </div>
    <div className="h-4 w-full bg-black/5 rounded-full relative cursor-pointer overflow-hidden border border-[var(--glass-border)]" onClick={e => { 
      const r = e.currentTarget.getBoundingClientRect(); 
      onChange(Math.round(((e.clientX-r.left)/r.width)*100)); 
    }}>
      <motion.div animate={{ width: `${val}%` }} className={`h-full ${color} rounded-full shadow-lg relative`}>
        <div className="absolute inset-0 bg-white/20 mix-blend-overlay" />
      </motion.div>
    </div>
  </div>
);

export default ZenPond;
