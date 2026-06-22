'use client';

import { useState, useEffect } from 'react';
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
  const [activeHabitIds, setActiveHabitIds] = useState<string[]>([]);

  useEffect(() => {
    if (open) {
      const ids = habits
        .filter(h => h.type === 'habit' && getCellState(h.id, dayIndex) === 'planned')
        .map(h => h.id);
      setActiveHabitIds(ids);
    } else {
      setActiveHabitIds([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, dayIndex]);

  if (!open) return null;

  // Filter habits that were 'planned' when the modal opened
  const plannedHabits = habits.filter(h => activeHabitIds.includes(h.id));

  const getGroup = (gId: string) => habits.find(x => x.id === gId);

  const groupedHabits: Record<string, HabitItem[]> = {};
  const noGroupHabits: HabitItem[] = [];

  plannedHabits.forEach(h => {
    if (h.groupId) {
      const topLevelGroupId = h.groupId; // We could resolve the ultimate top-level group, but the immediate parent group is fine since the user said "ait olduğu grup". 
      // Actually, if we just use immediate parent, we might have multiple subgroups. Let's just group by immediate parent.
      if (!groupedHabits[topLevelGroupId]) groupedHabits[topLevelGroupId] = [];
      groupedHabits[topLevelGroupId].push(h);
    } else {
      noGroupHabits.push(h);
    }
  });

  const renderHabitRow = (habit: HabitItem) => (
    <div key={habit.id} className={styles.itemRow}>
      <div className={styles.colorIndicator} style={{ backgroundColor: habit.color }} />
      <div className={styles.itemDetails}>
        <div className={styles.itemName}>{habit.name}</div>
        {habit.notes && <div className={styles.notes}>{habit.notes}</div>}
      </div>
      <DayCell
        state={getCellState(habit.id, dayIndex) as any}
        onClick={() => onCycleCell(habit.id, dayIndex)}
        isToday={true}
        large={true}
      />
    </div>
  );

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
            <div className={styles.groupedList}>
              {Object.entries(groupedHabits).map(([groupId, items]) => {
                const group = getGroup(groupId);
                return (
                  <div key={groupId} className={styles.groupContainer}>
                    <div className={styles.groupHeader} style={{ color: group?.color || 'var(--text-primary)' }}>
                      {group ? group.name : 'Bilinmeyen Grup'}
                    </div>
                    {items.map(renderHabitRow)}
                  </div>
                );
              })}
              
              {noGroupHabits.length > 0 && (
                <div className={styles.groupContainer}>
                  {Object.keys(groupedHabits).length > 0 && (
                    <div className={styles.groupHeader}>Diğer Görevler</div>
                  )}
                  {noGroupHabits.map(renderHabitRow)}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
