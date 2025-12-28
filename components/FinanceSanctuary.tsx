
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAtlas } from '../context/AtlasContext';
import { 
  Coins, TrendingUp, TrendingDown, Target, Plus, 
  Trash2, Landmark, Wallet, Sparkles, X, Save 
} from 'lucide-react';

const FinanceSanctuary: React.FC = () => {
  const { financeRecords, addFinanceRecord, removeFinanceRecord, financeGoals, addFinanceGoal, updateFinanceGoal } = useAtlas();
  const [activeTab, setActiveTab] = useState<'ledger' | 'goals'>('ledger');
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState('');
  const [newAmount, setNewAmount] = useState(0);
  const [newCat, setNewCat] = useState<'asset' | 'debt' | 'savings' | 'investment'>('savings');

  const stats = useMemo(() => {
    const assets = financeRecords.filter(r => r.category !== 'debt').reduce((acc, r) => acc + r.amount, 0);
    const debts = financeRecords.filter(r => r.category === 'debt').reduce((acc, r) => acc + r.amount, 0);
    return { netWorth: assets - debts, assets, debts };
  }, [financeRecords]);

  const handleAdd = () => {
    if (!newName) return;
    addFinanceRecord({ name: newName, amount: newAmount, category: newCat, date: new Date().toISOString() });
    setNewName(''); setNewAmount(0); setShowAdd(false);
  };

  return (
    <div className="w-full max-w-5xl mx-auto pb-24 flex flex-col gap-10">
      <header className="flex flex-col sm:flex-row justify-between items-end gap-6 border-b border-black/5 pb-10">
        <div>
          <h2 className="text-5xl md:text-8xl handwritten font-bold text-emerald-950">Gilded Vault</h2>
          <p className="sketch-font text-xl text-black/40 italic">Mapping your worldly abundance.</p>
        </div>
        <div className="flex gap-4">
          <StatBox icon={<Landmark size={20}/>} label="Net Worth" value={`$${stats.netWorth.toLocaleString()}`} />
        </div>
      </header>

      <nav className="flex gap-4 bg-black/5 p-1.5 rounded-full w-fit mx-auto shadow-inner">
        <button onClick={() => setActiveTab('ledger')} className={`px-8 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${activeTab === 'ledger' ? 'bg-white shadow-lg text-emerald-900' : 'text-black/30'}`}>The Ledger</button>
        <button onClick={() => setActiveTab('goals')} className={`px-8 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${activeTab === 'goals' ? 'bg-white shadow-lg text-emerald-900' : 'text-black/30'}`}>Wealth Goals</button>
      </nav>

      <AnimatePresence mode="wait">
        {activeTab === 'ledger' ? (
          <motion.div key="ledger" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="flex justify-between items-center mb-6">
               <h3 className="text-2xl handwritten font-bold text-emerald-950">Treasury Records</h3>
               <button onClick={() => setShowAdd(true)} className="flex items-center gap-2 bg-emerald-950 text-white px-6 py-3 rounded-full text-xs font-bold uppercase tracking-widest shadow-xl hover:scale-105 active:scale-95 transition-all"><Plus size={16}/> New Entry</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {financeRecords.map(r => (
                <div key={r.id} className="glass p-6 rounded-[2.5rem] flex justify-between items-center border border-white/50 group hover:shadow-xl transition-all">
                  <div className="flex items-center gap-4">
                     <div className={`p-4 rounded-2xl ${r.category === 'debt' ? 'bg-rose-50 text-rose-500' : 'bg-emerald-50 text-emerald-600'}`}>
                        {r.category === 'debt' ? <TrendingDown size={20}/> : <Coins size={20}/>}
                     </div>
                     <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest opacity-30">{r.category}</p>
                        <h4 className="text-xl font-bold text-emerald-950">{r.name}</h4>
                     </div>
                  </div>
                  <div className="text-right flex items-center gap-4">
                     <p className={`text-2xl font-bold sketch-font ${r.category === 'debt' ? 'text-rose-600' : 'text-emerald-700'}`}>${r.amount.toLocaleString()}</p>
                     <button onClick={() => removeFinanceRecord(r.id)} className="opacity-0 group-hover:opacity-100 p-2 text-rose-300 hover:text-rose-600 transition-all"><Trash2 size={16}/></button>
                  </div>
                </div>
              ))}
              {financeRecords.length === 0 && (
                <div className="col-span-full py-20 border-2 border-dashed border-black/5 rounded-[3rem] text-center opacity-30">
                  <Landmark size={48} className="mx-auto mb-4" />
                  <p className="sketch-font text-2xl">The vault is quiet. Record a source of wealth.</p>
                </div>
              )}
            </div>
          </motion.div>
        ) : (
          <motion.div key="goals" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {financeGoals.map(g => (
              <div key={g.id} className="glass p-10 rounded-[4rem] border border-white/60 shadow-xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-10 opacity-[0.03] pointer-events-none group-hover:scale-110 transition-transform"><Target size={150}/></div>
                <div className="flex justify-between items-end mb-8">
                   <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest opacity-30">Fortress Goal</p>
                      <h4 className="text-3xl handwritten font-bold text-emerald-950">{g.name}</h4>
                   </div>
                   <div className="text-right">
                      <p className="text-3xl font-bold sketch-font text-emerald-950">${g.current.toLocaleString()}</p>
                      <p className="text-xs opacity-30">Target: ${g.target.toLocaleString()}</p>
                   </div>
                </div>
                <div className="h-4 w-full bg-black/5 rounded-full overflow-hidden shadow-inner border border-black/5">
                   <motion.div initial={{ width: 0 }} animate={{ width: `${Math.min(100, (g.current / g.target) * 100)}%` }} className="h-full bg-emerald-500 rounded-full shadow-lg" />
                </div>
                <div className="mt-8 flex gap-4">
                   <div className="flex-1 relative">
                      <input 
                        type="number" 
                        defaultValue={g.current}
                        onBlur={(e) => updateFinanceGoal(g.id, parseInt(e.target.value) || 0)}
                        className="w-full bg-white/40 p-4 rounded-2xl sketch-font text-xl text-emerald-950 border-none focus:ring-1 ring-emerald-300 outline-none" 
                        placeholder="Update Progress..." 
                      />
                      <Sparkles className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-200 pointer-events-none" size={16}/>
                   </div>
                </div>
              </div>
            ))}
            <button onClick={() => addFinanceGoal({ name: 'Emergency Fund', target: 10000, current: 0 })} className="border-4 border-dashed border-emerald-900/10 rounded-[4rem] p-10 flex flex-col items-center justify-center gap-4 text-emerald-900/30 hover:bg-emerald-50 transition-all">
              <Plus size={48} />
              <span className="sketch-font text-2xl">Forge New Goal</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showAdd && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[300] bg-emerald-950/20 backdrop-blur-md flex items-center justify-center p-6">
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} className="bg-white p-12 rounded-[4rem] max-w-lg w-full shadow-2xl relative border border-emerald-100">
               <button onClick={() => setShowAdd(false)} className="absolute top-10 right-10 text-black/20 hover:text-black transition-colors"><X size={32}/></button>
               <h3 className="text-4xl handwritten text-emerald-950 mb-10 font-bold">Forge New Record</h3>
               <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest opacity-30 px-2">Label</label>
                    <input type="text" value={newName} onChange={e => setNewName(e.target.value)} placeholder="e.g. Real Estate" className="w-full bg-emerald-50 p-5 rounded-3xl outline-none sketch-font text-xl text-emerald-900 border-2 border-transparent focus:border-emerald-300 transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest opacity-30 px-2">Magnitude ($)</label>
                    <input type="number" value={newAmount} onChange={e => setNewAmount(parseInt(e.target.value))} className="w-full bg-emerald-50 p-5 rounded-3xl outline-none sketch-font text-xl text-emerald-900 border-2 border-transparent focus:border-emerald-300 transition-all" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                     {['asset', 'debt', 'savings', 'investment'].map(c => (
                       <button key={c} onClick={() => setNewCat(c as any)} className={`py-4 rounded-3xl text-[10px] font-bold uppercase tracking-widest transition-all ${newCat === c ? 'bg-emerald-950 text-white shadow-xl' : 'bg-emerald-50 text-emerald-900/30'}`}>{c}</button>
                     ))}
                  </div>
                  <button onClick={handleAdd} className="w-full bg-emerald-950 text-white py-6 rounded-[2.5rem] font-bold uppercase tracking-[0.4em] shadow-xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-4"><Save size={20}/> Seal Record</button>
               </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const StatBox = ({ icon, label, value }: any) => (
  <div className="glass px-8 py-4 rounded-3xl border border-white/50 flex items-center gap-5 shadow-lg">
    <div className="w-12 h-12 bg-emerald-950 text-white rounded-2xl flex items-center justify-center shadow-emerald-200">{icon}</div>
    <div className="flex flex-col">
       <span className="text-[10px] font-bold uppercase tracking-widest opacity-30 leading-none mb-1">{label}</span>
       <span className="text-2xl font-bold sketch-font text-emerald-950">{value}</span>
    </div>
  </div>
);

export default FinanceSanctuary;
