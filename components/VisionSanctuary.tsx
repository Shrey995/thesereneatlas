
import React, { useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAtlas } from '../context/AtlasContext';
import { Sparkles, Plus, X, Image as ImageIcon, Camera } from 'lucide-react';

const VisionSanctuary: React.FC = () => {
  const { visionCards, addVisionCard } = useAtlas();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("Please use images smaller than 2MB for local storage efficiency.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        addVisionCard({
          title: file.name.split('.')[0] || "Manifestation",
          img: reader.result as string,
          tags: ['Manifest', 'Dream'],
          palette: ['#E0F2F1', '#E3F2FD']
        });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="h-full w-full bg-sky-50/10 p-4 md:p-12 pb-40">
      <div className="max-w-7xl mx-auto flex flex-col items-center">
        <header className="text-center mb-16">
          <h2 className="text-6xl md:text-9xl handwritten italic text-sky-900 font-bold mb-2">Manifest Gallery</h2>
          <p className="sketch-font text-sky-600/60 uppercase tracking-[0.4em] text-sm italic">Curating your future light into being.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10 w-full">
           <motion.button 
             onClick={() => fileInputRef.current?.click()}
             whileHover={{ scale: 1.02 }}
             className="glass rounded-[4rem] border-4 border-dashed border-sky-200 aspect-[4/5] flex flex-col items-center justify-center gap-6 group transition-all shadow-xl bg-white/30"
           >
              <div className="w-24 h-24 bg-sky-100 rounded-full flex items-center justify-center text-sky-600 group-hover:scale-110 group-hover:rotate-12 transition-all">
                <Plus size={48}/>
              </div>
              <div className="text-center">
                <span className="sketch-font text-2xl font-bold text-sky-900/60 block mb-1">Ink Inspiration</span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-sky-400">Upload Image</span>
              </div>
              <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
           </motion.button>

           <AnimatePresence mode="popLayout">
              {visionCards.map((card, idx) => (
                <motion.div 
                  key={card.id} 
                  initial={{ opacity: 0, scale: 0.9, y: 20 }} 
                  animate={{ opacity: 1, scale: 1, y: 0 }} 
                  exit={{ opacity: 0, scale: 0.8 }} 
                  className="glass rounded-[4rem] p-5 group relative shadow-2xl border border-white/60 bg-white/40"
                >
                   <div className="rounded-[3rem] overflow-hidden aspect-[4/5] mb-6 shadow-inner relative">
                      <img src={card.img} alt={card.title} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                      <div className="absolute inset-0 bg-sky-900/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                   </div>
                   <div className="px-4 pb-4">
                      <h4 className="text-3xl handwritten text-sky-950 font-bold mb-3">{card.title}</h4>
                      <div className="flex flex-wrap gap-2">
                        {card.tags.map(t => <span key={t} className="text-[10px] uppercase font-bold tracking-widest bg-sky-100/50 text-sky-700 px-4 py-1.5 rounded-full">{t}</span>)}
                      </div>
                   </div>
                </motion.div>
              ))}
           </AnimatePresence>
        </div>
        
        {visionCards.length === 0 && (
          <div className="mt-12 text-center opacity-30 italic sketch-font text-3xl">
             <Camera size={48} className="mx-auto mb-4" />
             <p>Your vision board is a blank canvas. Start manifesting.</p>
          </div>
        )}
      </div>
    </div>
  );
};
export default VisionSanctuary;
