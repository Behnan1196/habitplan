'use client';

import { HabitItem } from '@/types';
import DayCell from './DayCell';
import styles from './FocusModal.module.css';

interface Props {
  open: boolean;
  onClose: () => void;
  habits: HabitItem[];
  getCellState: (habitId: string, dayIndex: number) => string;
  onCycleCell: (habitId: string, dayIndex: number) => void;
  dayIndex: number;
}

export default function FocusModal({ open, onClose, habits, getCellState, onCycleCell, dayIndex }: Props) {
  if (!open) return null;

  // Filter only habits (not metrics or groups or separators) that are 'planned'
  const plannedHabits = habits.filter(h => {
    if (h.type !== 'habit') return false;
    const state = getCellState(h.id, dayIndex);
    return state === 'planned';
  });

  const getGroupPath = (gId: string | null): string => {
    if (!gId) return '';
    const g = habits.find(x => x.id === gId);
    if (!g) return '';
    if (!g.groupId) return g.name;
    return getGroupPath(g.groupId) + ' > ' + g.name;
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <circle cx="12" cy="12" r="6"/>
              <circle cx="12" cy="12" r="2"/>
            </svg>
            Bugünün Planı
          </h2>
          <button className={styles.closeBtn} onClick={onClose}>✕</button>
        </div>

        <div className={styles.content}>
          {plannedHabits.length === 0 ? (
            <div className={styles.emptyState}>
              <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="var(--text-muted)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                <polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
              <p>Harika! Bugün için planlanan tüm görevleri tamamladınız veya henüz plan yapmadınız.</p>
            </div>
          ) : (
            plannedHabits.map(habit => (
              <div key={habit.id} className={styles.itemRow}>
                <div className={styles.colorIndicator} style={{ backgroundColor: habit.color }} />
                <div className={styles.itemDetails}>
                  <div className={styles.itemName}>{habit.name}</div>
                  {habit.groupId && (
                    <div className={styles.groupPath}>{getGroupPath(habit.groupId)}</div>
                  )}
                </div>
                <DayCell
                  state={getCellState(habit.id, dayIndex) as any}
                  onClick={() => onCycleCell(habit.id, dayIndex)}
                  isToday={true}
                  large={true}
                />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
