
import React, { useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AtlasProvider, useAtlas } from './context/AtlasContext';
import { Area } from './types';
import AtlasHub from './components/AtlasHub';
import GreatOak from './components/GreatOak';
import ZenPond from './components/ZenPond';
import RitualChamber from './components/RitualChamber';
import Apothecary from './components/Apothecary';
import ChronosObservatory from './components/ChronosObservatory';
import VisionSanctuary from './components/VisionSanctuary';
import InventoryOfSelf from './components/InventoryOfSelf';
import LibraryOfWhispers from './components/LibraryOfWhispers';
import ScribeDesk from './components/ScribeDesk';
import FinanceSanctuary from './components/FinanceSanctuary';
import { Sparkles, Trophy, Moon, Sun, Compass } from 'lucide-react';

const CelestialHeader: React.FC = () => {
  const { activeArea, setActiveArea, isMoonlightMode, toggleMoonlight } = useAtlas();

  return (
    <header className="fixed top-0 left-0 z-[500] p-6 pointer-events-none">
      <div className="flex flex-col gap-4 pointer-events-auto">
        {/* Navigation Button */}
        <motion.button 
          whileHover={{ scale: 1.1, rotate: 90 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setActiveArea('hub')} 
          className={`w-12 h-12 rounded-2xl shadow-xl transition-all border-2 flex items-center justify-center ${activeArea === 'hub' ? 'bg-[var(--accent)] text-white border-white/20' : 'bg-[var(--header-bg)] backdrop-blur-2xl text-[var(--ink)] border-[var(--glass-border)] hover:bg-[var(--paper)]'}`}
          title="Return to Hub"
        >
          <Compass size={24} />
        </motion.button>
        
        {/* Theme Toggle Button */}
        <motion.button 
          whileHover={{ scale: 1.1, rotate: 12 }}
          whileTap={{ scale: 0.9 }}
          onClick={toggleMoonlight} 
          className="w-12 h-12 rounded-2xl flex items-center justify-center bg-[var(--header-bg)] border-2 border-[var(--glass-border)] shadow-xl transition-all text-[var(--ink)]"
          title="Toggle Sanctuary Mode"
        >
          {isMoonlightMode ? <Moon size={22} className="text-blue-500" /> : <Sun size={22} className="text-amber-500" />}
        </motion.button>
      </div>
    </header>
  );
};

const MainContent: React.FC = () => {
  const { activeArea, environment, isMoonlightMode } = useAtlas();
  
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', environment);
    document.documentElement.setAttribute('data-moonlight', isMoonlightMode.toString());
  }, [environment, isMoonlightMode]);

  return (
    <div className="relative min-h-screen w-screen flex flex-col items-center bg-[var(--bg-world)] transition-colors duration-1000">
      <CelestialHeader />
      
      {/* Decorative World Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-30">
         <div className="absolute -left-20 top-1/4 w-[500px] h-[500px] rounded-full bg-emerald-200/50 blur-[150px] animate-pulse" />
         <div className="absolute -right-20 bottom-1/4 w-[500px] h-[500px] rounded-full bg-amber-200/50 blur-[150px] animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="relative w-full flex-1 flex flex-col items-center">
        <main className={`w-full flex-1 ${activeArea === 'hub' ? 'max-w-none' : 'max-w-7xl pt-40 md:pt-48 px-6 sm:px-10 md:px-20 lg:px-32 pb-40'}`}>
          <AnimatePresence mode="wait">
            <motion.div 
              key={activeArea} 
              initial={{ opacity: 0, y: 30 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, y: -30 }} 
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="h-full"
            >
              {activeArea === 'hub' && <AtlasHub />}
              {activeArea === 'oak' && <GreatOak />}
              {activeArea === 'pond' && <ZenPond />}
              {activeArea === 'ritual' && <RitualChamber />}
              {activeArea === 'apothecary' && <Apothecary />}
              {activeArea === 'observatory' && <ChronosObservatory />}
              {activeArea === 'vision' && <VisionSanctuary />}
              {activeArea === 'inventory' && <InventoryOfSelf />}
              {activeArea === 'library' && <LibraryOfWhispers />}
              {activeArea === 'scribe' && <ScribeDesk />}
              {activeArea === 'vault' && <FinanceSanctuary />}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

const App: React.FC = () => (
  <AtlasProvider>
    <MainContent />
  </AtlasProvider>
);

export default App;
