
import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  AtlasState, Area, GrowthCategory, Habit, Milestone, 
  JournalEntry, Timeframe, Book, VisionCard, VitalityMetric, 
  FoodEntry, FinanceRecord, FinanceGoal, VitalityMarker 
} from '../types';

interface AtlasContextType extends AtlasState {
  setActiveArea: (area: Area) => void;
  toggleHabit: (id: string) => void;
  addHabit: (habit: Omit<Habit, 'id' | 'completedToday' | 'currentProgress'>) => void;
  removeHabit: (id: string) => void;
  updateHabitGoal: (id: string, goal: number) => void;
  addXP: (amount: number) => void;
  toggleMoonlight: () => void;
  cycleEnvironment: () => void;
  updateHydration: (amount: number) => void;
  updateMetric: (key: keyof VitalityMetric, value: any) => void;
  toggleVitalitySeal: (markerId: string) => void;
  addFoodEntry: (text: string, type?: FoodEntry['type']) => void;
  removeFoodEntry: (id: string) => void;
  addJournalEntry: (entry: Omit<JournalEntry, 'id'>) => void;
  setTimeframe: (t: Timeframe) => void;
  addBook: (book: Omit<Book, 'id'>) => void;
  addVisionCard: (card: Omit<VisionCard, 'id'>) => void;
  addFinanceRecord: (record: Omit<FinanceRecord, 'id'>) => void;
  removeFinanceRecord: (id: string) => void;
  addFinanceGoal: (goal: Omit<FinanceGoal, 'id'>) => void;
  updateFinanceGoal: (id: string, current: number) => void;
  // Methods used in components but missing from interface
  addMilestone: (milestone: Omit<Milestone, 'id'>) => void;
  addVitalityMarker: (marker: Omit<VitalityMarker, 'id'>) => void;
  removeVitalityMarker: (id: string) => void;
}

const STORAGE_KEY = 'the_serene_atlas_v1';

const AtlasContext = createContext<AtlasContextType | undefined>(undefined);

export const AtlasProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // --- INITIAL STATE ---
  const [state, setState] = useState<AtlasState>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
    
    return {
      userXP: 0,
      activeArea: 'hub',
      environment: 'spring',
      isMoonlightMode: false,
      hydrationGoal: 3000,
      hydrationCurrent: 1200,
      selectedTimeframe: 'daily',
      habits: [
        { id: '1', name: 'Morning Movement', icon: 'Dumbbell', category: GrowthCategory.HEALTH, completedToday: false, goalValue: 1, goalUnit: 'sessions', timeframe: 'daily', currentProgress: 0 },
        { id: '2', name: 'Inner Silence', icon: 'Sparkles', category: GrowthCategory.SPIRIT, completedToday: false, goalValue: 1, goalUnit: 'sessions', timeframe: 'daily', currentProgress: 0 }
      ],
      vitalityMarkers: [{ id: 'm1', label: 'Sugar Free', icon: 'Cookie' }],
      vitalityMetrics: { 
        sleepHours: 7, meditationMinutes: 0, stepsCount: 0, focusLevel: 50, 
        exerciseMinutes: 0, yogaMinutes: 0, gymMinutes: 0, runningDistance: 0, 
        breathingSessions: 0, toggles: {}, foodLog: [], readingHours: 0 
      },
      milestones: [],
      history: [],
      apothecaryTasks: [],
      journalEntries: [],
      books: [],
      visionCards: [],
      financeRecords: [],
      financeGoals: []
    };
  });

  // --- PERSISTENCE ---
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  // --- ACTIONS ---
  const addXP = (amt: number) => setState(s => ({ ...s, userXP: s.userXP + amt }));
  
  const setActiveArea = (activeArea: Area) => setState(s => ({ ...s, activeArea }));

  const toggleHabit = (id: string) => {
    setState(s => ({
      ...s,
      habits: s.habits.map(h => {
        if (h.id === id) {
          const completed = !h.completedToday;
          if (completed) addXP(50);
          return { ...h, completedToday: completed, currentProgress: completed ? h.currentProgress + 1 : Math.max(0, h.currentProgress - 1) };
        }
        return h;
      })
    }));
  };

  const addHabit = (h: any) => setState(s => ({ ...s, habits: [...s.habits, { ...h, id: Date.now().toString(), completedToday: false, currentProgress: 0 }] }));
  const removeHabit = (id: string) => setState(s => ({ ...s, habits: s.habits.filter(h => h.id !== id) }));
  const updateHabitGoal = (id: string, goalValue: number) => setState(s => ({ ...s, habits: s.habits.map(h => h.id === id ? { ...h, goalValue } : h) }));

  const addJournalEntry = (e: any) => {
    setState(s => ({ ...s, journalEntries: [{ ...e, id: Date.now().toString() }, ...s.journalEntries] }));
    addXP(150);
  };

  const addVisionCard = (c: any) => {
    setState(s => ({ ...s, visionCards: [...s.visionCards, { ...c, id: Date.now().toString() }] }));
    addXP(100);
  };

  const addFinanceRecord = (r: any) => {
    setState(s => ({ ...s, financeRecords: [...s.financeRecords, { ...r, id: Date.now().toString() }] }));
    addXP(100);
  };

  const removeFinanceRecord = (id: string) => setState(s => ({ ...s, financeRecords: s.financeRecords.filter(r => r.id !== id) }));
  
  const addFinanceGoal = (g: any) => {
    setState(s => ({ ...s, financeGoals: [...s.financeGoals, { ...g, id: Date.now().toString() }] }));
    addXP(200);
  };

  const updateFinanceGoal = (id: string, current: number) => setState(s => ({ ...s, financeGoals: s.financeGoals.map(g => g.id === id ? { ...g, current } : g) }));

  const addBook = (b: any) => setState(s => ({ ...s, books: [...s.books, { ...b, id: Date.now().toString() }] }));

  // Implement vitality marker management
  const addVitalityMarker = (marker: Omit<VitalityMarker, 'id'>) => {
    setState(s => ({
      ...s,
      vitalityMarkers: [...s.vitalityMarkers, { ...marker, id: Date.now().toString() }]
    }));
    addXP(50);
  };

  const removeVitalityMarker = (id: string) => {
    setState(s => ({
      ...s,
      vitalityMarkers: s.vitalityMarkers.filter(m => m.id !== id)
    }));
  };

  return (
    <AtlasContext.Provider value={{
      ...state,
      setActiveArea,
      toggleHabit,
      addHabit,
      removeHabit,
      updateHabitGoal,
      addXP,
      toggleMoonlight: () => setState(s => ({ ...s, isMoonlightMode: !s.isMoonlightMode })),
      cycleEnvironment: () => setState(s => ({ ...s, environment: s.environment === 'spring' ? 'summer' : s.environment === 'summer' ? 'autumn' : 'spring' })),
      updateHydration: (amt) => setState(s => ({ ...s, hydrationCurrent: Math.max(0, s.hydrationCurrent + amt) })),
      updateMetric: (k, v) => setState(s => ({ ...s, vitalityMetrics: { ...s.vitalityMetrics, [k]: v } })),
      toggleVitalitySeal: (id) => setState(s => ({ ...s, vitalityMetrics: { ...s.vitalityMetrics, toggles: { ...s.vitalityMetrics.toggles, [id]: !s.vitalityMetrics.toggles[id] } } })),
      addFoodEntry: (text, type: any) => setState(s => ({ ...s, vitalityMetrics: { ...s.vitalityMetrics, foodLog: [...s.vitalityMetrics.foodLog, { id: Date.now().toString(), text, type, time: new Date().toLocaleTimeString() }] } })),
      removeFoodEntry: (id) => setState(s => ({ ...s, vitalityMetrics: { ...s.vitalityMetrics, foodLog: s.vitalityMetrics.foodLog.filter(f => f.id !== id) } })),
      addJournalEntry,
      setTimeframe: (t: any) => setState(s => ({ ...s, selectedTimeframe: t })),
      addBook,
      addVisionCard,
      addMilestone: (m: any) => setState(s => ({ ...s, milestones: [{ ...m, id: Date.now().toString() }, ...s.milestones] })),
      addFinanceRecord,
      removeFinanceRecord,
      addFinanceGoal,
      updateFinanceGoal,
      addVitalityMarker,
      removeVitalityMarker
    }}>
      {children}
    </AtlasContext.Provider>
  );
};

export const useAtlas = () => {
  const context = useContext(AtlasContext);
  if (!context) throw new Error('useAtlas must be used within AtlasProvider');
  return context;
};
