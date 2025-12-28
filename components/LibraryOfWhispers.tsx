
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAtlas } from '../context/AtlasContext';
import { Sparkles, X, Plus, BookOpen, Quote, Library } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

const LibraryOfWhispers: React.FC = () => {
  const { books, addBook } = useAtlas();
  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newAuthor, setNewAuthor] = useState('');
  const [museWisdom, setMuseWisdom] = useState<string | null>(null);
  const [loadingMuse, setLoadingMuse] = useState(false);

  const askTheMuse = async () => {
    setLoadingMuse(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `My library contains: ${books.map(b => b.title).join(', ')}. Act as a sage librarian. Provide one profound, short piece of advice or a literary quote related to these themes. Be brief.`;
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });
      setMuseWisdom(response.text);
    } catch (e) {
      setMuseWisdom("The Muse is deep in meditation. Try again later.");
    } finally {
      setLoadingMuse(false);
    }
  };

  const handleAddBook = () => {
    if (!newTitle.trim()) return;
    const colors = ['bg-[#2a4d44]', 'bg-[#5c3c24]', 'bg-[#1a365d]', 'bg-[#742a2a]', 'bg-[#44337a]'];
    addBook({ 
      title: newTitle, 
      author: newAuthor || 'Mysterious Author', 
      progress: 0, 
      color: colors[Math.floor(Math.random() * colors.length)] 
    });
    setNewTitle(''); setNewAuthor(''); setIsAdding(false);
  };

  return (
    <div className="h-full w-full flex flex-col items-center p-4 md:p-8 pb-32 overflow-y-auto no-scrollbar">
      <div className="max-w-7xl w-full flex flex-col lg:flex-row gap-16">
        <div className="flex-1 flex flex-col min-h-[600px]">
          <header className="flex justify-between items-center mb-16">
             <div>
                <h2 className="text-6xl md:text-9xl handwritten font-bold text-amber-950">Grand Library</h2>
                <p className="sketch-font text-2xl text-amber-900/40 italic">Where thoughts find their forever form.</p>
             </div>
             <button onClick={() => setIsAdding(true)} className="w-20 h-20 bg-amber-950 text-white rounded-[2rem] flex items-center justify-center shadow-2xl hover:rotate-12 transition-all"><Plus size={32}/></button>
          </header>
          
          <div className="flex flex-wrap items-end gap-1 px-10 border-b-[24px] border-amber-950/20 pb-1 flex-1 relative min-h-[400px]">
             {books.map(book => (
               <motion.div 
                 key={book.id} 
                 whileHover={{ y: -30, scale: 1.05 }} 
                 className={`w-28 md:w-40 ${book.color} rounded-t-2xl p-6 flex flex-col justify-between border-x-2 border-t-2 border-white/20 shadow-2xl relative group cursor-pointer transition-all`} 
                 style={{ minHeight: '350px' }}
               >
                  <div className="absolute inset-y-0 left-3 w-px bg-white/10" />
                  <div className="absolute top-6 left-0 right-0 flex justify-center opacity-40">
                    <Library size={16} className="text-white" />
                  </div>
                  <div className="h-full flex flex-col justify-between pt-8">
                    <h4 className="text-lg md:text-xl font-bold text-white leading-tight break-words pr-2 drop-shadow-md">{book.title}</h4>
                    <div>
                      <span className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] block mb-4 italic truncate">{book.author}</span>
                      <div className="h-2 bg-black/20 rounded-full overflow-hidden">
                        <div className="h-full bg-white/60" style={{ width: `${book.progress}%` }} />
                      </div>
                    </div>
                  </div>
               </motion.div>
             ))}
             {books.length === 0 && (
               <div className="absolute inset-0 flex flex-col items-center justify-center opacity-10 italic">
                  <BookOpen size={100} />
                  <p className="text-3xl sketch-font mt-4">Empty shelves are just waiting for stories.</p>
               </div>
             )}
          </div>
        </div>

        <div className="w-full lg:w-[400px] flex flex-col gap-8">
           <div className="glass rounded-[4rem] p-12 shadow-2xl border border-white/60 flex flex-col gap-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none rotate-12"><Quote size={120}/></div>
              <div className="flex items-center gap-4 text-amber-950">
                <div className="p-3 bg-amber-50 rounded-2xl"><Sparkles className="text-amber-600"/></div>
                <h3 className="text-3xl handwritten font-bold">The Muse's Oracle</h3>
              </div>
              <AnimatePresence mode="wait">
                {museWisdom ? (
                  <motion.div key="wisdom" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="relative">
                    <p className="scribe-font text-2xl text-amber-950 italic leading-relaxed">"{museWisdom}"</p>
                    <div className="w-12 h-1 bg-amber-950/10 mt-6 rounded-full" />
                  </motion.div>
                ) : (
                  <p key="placeholder" className="text-amber-900/40 sketch-font text-xl">The Oracle waits for your signal...</p>
                )}
              </AnimatePresence>
              <button 
                onClick={askTheMuse} 
                disabled={loadingMuse || books.length === 0} 
                className="w-full py-6 bg-amber-950 text-white rounded-3xl font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:scale-105 active:scale-95 disabled:opacity-30 disabled:hover:scale-100 transition-all shadow-xl"
              >
                {loadingMuse ? "Inking..." : <><Sparkles size={18}/> Consult the Archive</>}
              </button>
           </div>
        </div>
      </div>

      <AnimatePresence>
        {isAdding && (
          <div className="fixed inset-0 z-[400] bg-amber-950/20 backdrop-blur-md flex items-center justify-center p-6">
             <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} className="bg-white p-12 rounded-[4rem] max-w-lg w-full shadow-2xl relative border border-amber-100">
                <button onClick={() => setIsAdding(false)} className="absolute top-10 right-10 text-amber-900/30 hover:text-amber-950 transition-colors"><X size={32}/></button>
                <h3 className="text-5xl handwritten mb-10 text-amber-950 font-bold">Seal New Tome</h3>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest opacity-30 px-2">Book Title</label>
                    <input type="text" value={newTitle} onChange={e => setNewTitle(e.target.value)} placeholder="e.g. Meditations" className="w-full bg-amber-50 p-5 rounded-3xl sketch-font text-2xl text-amber-950 outline-none border-2 border-transparent focus:border-amber-200" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest opacity-30 px-2">The Author</label>
                    <input type="text" value={newAuthor} onChange={e => setNewAuthor(e.target.value)} placeholder="e.g. Marcus Aurelius" className="w-full bg-amber-50 p-5 rounded-3xl sketch-font text-2xl text-amber-950 outline-none border-2 border-transparent focus:border-amber-200" />
                  </div>
                  <button onClick={handleAddBook} className="w-full bg-amber-950 text-white py-6 rounded-[2.5rem] font-bold uppercase tracking-[0.3em] shadow-xl hover:scale-105 transition-all">Rest on Shelf</button>
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
export default LibraryOfWhispers;
