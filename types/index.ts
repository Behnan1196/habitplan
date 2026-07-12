export type CellState = string;

export type HabitType = 'group' | 'habit' | 'metric';

export interface Tag {
  id: string;
  name: string;
  color: string;
}

export interface Timeblock {
  id: string;
  name: string;
  order: number;
}

export interface HabitItem {
  id: string;
  type: HabitType;
  name: string;
  color: string;
  backColor?: string;
  groupId: string | null; // null = top level
  order: number;
  notes?: string;
  isFixed?: boolean; // true = persistent across weeks (todo-style)
  // KPI range for metric items
  min?: number;
  max?: number;
  // Tags, duration and timeblocks
  tagId?: string; // Links to predefined tags
  duration?: number; // Estimated duration in minutes
  defaultTimeblockId?: string; // Optional default timeblock link
}

export interface WeeklyData {
  // weekKey -> habitId -> dayIndex (0=Mon..6=Sun) -> state
  [weekKey: string]: {
    [habitId: string]: {
      [dayIndex: number]: CellState;
    };
  };
}

export interface AppState {
  habits: HabitItem[];
  collapsedGroups: string[]; // group ids that are collapsed
  weeklyData: WeeklyData;
}

export const PRESET_COLORS = [
  { label: 'İndigo',   value: '#6366f1' },
  { label: 'Mor',      value: '#a855f7' },
  { label: 'Pembe',    value: '#ec4899' },
  { label: 'Kırmızı', value: '#ef4444' },
  { label: 'Turuncu', value: '#f97316' },
  { label: 'Sarı',    value: '#eab308' },
  { label: 'Yeşil',   value: '#22c55e' },
  { label: 'Teal',    value: '#14b8a6' },
  { label: 'Mavi',    value: '#3b82f6' },
  { label: 'Gri',     value: '#6b7280' },
  { label: 'Beyaz',   value: '#ffffff' },
];

export const PRESET_TAGS: Tag[] = [
  { id: 'tag-mental', name: 'Mental', color: '#6366f1' },
  { id: 'tag-work', name: 'İş', color: '#3b82f6' },
  { id: 'tag-workout', name: 'Workout', color: '#ef4444' },
  { id: 'tag-social', name: 'Sosyal', color: '#ec4899' },
  { id: 'tag-fun', name: 'Eğlence', color: '#f97316' },
];

export const PRESET_TIMEBLOCKS: Timeblock[] = [
  { id: 'tb-morning', name: 'Sabah Rutini', order: 1 },
  { id: 'tb-work1', name: 'Çalışma Bloğu-1', order: 2 },
  { id: 'tb-work2', name: 'Çalışma Bloğu-2', order: 3 },
  { id: 'tb-workout', name: 'Workout-Akşam', order: 4 },
  { id: 'tb-night', name: 'Gece/Kapanış', order: 5 },
];

export const DAY_LABELS = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];
export const DAY_LABELS_FULL = ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar'];
