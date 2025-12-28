
export type Area = 'hub' | 'oak' | 'observatory' | 'vision' | 'ritual' | 'inventory' | 'pond' | 'apothecary' | 'library' | 'scribe' | 'vault';

export enum GrowthCategory {
  HEALTH = 'Health',
  LEARNING = 'Learning',
  SOCIAL = 'Social',
  SPIRIT = 'Spirit'
}

export type Timeframe = 'daily' | 'weekly' | 'monthly' | 'yearly';

export interface FoodEntry {
  id: string;
  text: string;
  time: string;
  type: 'wholesome' | 'neutral' | 'treat';
}

export interface VitalityMarker {
  id: string;
  label: string;
  icon: string;
}

export interface VitalityMetric {
  sleepHours: number;
  meditationMinutes: number;
  stepsCount: number;
  focusLevel: number;
  exerciseMinutes: number;
  yogaMinutes: number;
  gymMinutes: number;
  runningDistance: number;
  breathingSessions: number;
  toggles: Record<string, boolean>;
  foodLog: FoodEntry[];
  readingHours: number;
}

export interface HistoryRecord {
  date: string;
  metrics: Partial<VitalityMetric>;
  habitCompletions: string[];
  habitProgress: Record<string, number>;
}

export interface Habit {
  id: string;
  name: string;
  icon: string;
  category: GrowthCategory;
  completedToday: boolean;
  goalValue: number;
  goalUnit: string;
  timeframe: Timeframe;
  currentProgress: number;
}

export interface ApothecaryTask {
  id: string;
  category: 'mind' | 'body' | 'soul';
  text: string;
  completed: boolean;
}

export interface Milestone {
  id: string;
  title: string;
  date: string;
  type: 'Lantern' | 'Bloom' | 'Anchor';
}

export interface Book {
  id: string;
  title: string;
  author: string;
  progress: number;
  color: string;
}

export interface VisionCard {
  id: string;
  title: string;
  img: string; // Base64 or URL
  tags: string[];
  palette: string[];
}

export interface JournalEntry {
  id: string;
  date: string;
  content: string;
  mood: string;
  gratitude: string[];
}

export interface FinanceRecord {
  id: string;
  name: string;
  amount: number;
  category: 'asset' | 'debt' | 'savings' | 'investment';
  date: string;
}

export interface FinanceGoal {
  id: string;
  name: string;
  target: number;
  current: number;
}

export interface AtlasState {
  userXP: number;
  activeArea: Area;
  environment: 'spring' | 'summer' | 'autumn' | 'winter';
  habits: Habit[];
  milestones: Milestone[];
  isMoonlightMode: boolean;
  hydrationGoal: number;
  hydrationCurrent: number;
  vitalityMarkers: VitalityMarker[];
  vitalityMetrics: VitalityMetric;
  history: HistoryRecord[];
  apothecaryTasks: ApothecaryTask[];
  journalEntries: JournalEntry[];
  selectedTimeframe: Timeframe;
  books: Book[];
  visionCards: VisionCard[];
  financeRecords: FinanceRecord[];
  financeGoals: FinanceGoal[];
}
