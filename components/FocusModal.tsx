'use client';

import { useState, useEffect } from 'react';
import { HabitItem, PRESET_TIMEBLOCKS, PRESET_TAGS } from '@/types';
import styles from './FocusModal.module.css';

interface Props {
  open: boolean;
  onClose: () => void;
  habits: HabitItem[];
  getCellState: (habitId: string, dayIndex: number) => string;
  onToggleTimeblockDone: (habitId: string, dayIndex: number, timeblockId: string) => void;
  dayIndex: number;
}

export default function FocusModal({ open, onClose, habits, getCellState, onToggleTimeblockDone, dayIndex }: Props) {
  const [tick, setTick] = useState(0);

  // Re-render when open changes so we always see fresh state
  useEffect(() => { if (open) setTick(t => t + 1); }, [open, dayIndex]);

  if (!open) return null;

  // Build a map: timblockId -> list of { habit, state }
  const timeblockMap: Record<string, { habit: HabitItem; state: 'planned' | 'done' }[]> = {};
  const legacyPlanned: HabitItem[] = []; // old-style planned/done (not JSON)

  habits.filter(h => h.type === 'habit').forEach(habit => {
    const raw = getCellState(habit.id, dayIndex);
    if (!raw || raw === 'empty') return;

    if (raw.startsWith('{') || raw.startsWith('[')) {
      try {
        const blocks: Record<string, 'planned' | 'done'> = JSON.parse(raw);
        Object.entries(blocks).forEach(([tbId, state]) => {
          if (!timeblockMap[tbId]) timeblockMap[tbId] = [];
          timeblockMap[tbId].push({ habit, state });
        });
      } catch (e) {}
    } else if (raw === 'planned' || raw === 'done') {
      legacyPlanned.push(habit);
    }
  });

  // Sort timeblocks by their preset order
  const activeTimeblocks = PRESET_TIMEBLOCKS.filter(tb => timeblockMap[tb.id]?.length > 0);
  const hasAny = activeTimeblocks.length > 0 || legacyPlanned.length > 0;

  const renderHabitEntry = (habit: HabitItem, tbId: string, state: 'planned' | 'done') => {
    const tag = PRESET_TAGS.find(t => t.id === habit.tagId);
    return (
      <div key={`${habit.id}-${tbId}`} className={`${styles.itemRow} ${state === 'done' ? styles.itemRowDone : ''}`}>
        <div className={styles.colorIndicator} style={{ backgroundColor: habit.color }} />
        <div className={styles.itemDetails}>
          <div className={styles.itemName}>
            {habit.name}
            {tag && (
              <span className={styles.tagBadge} style={{ background: tag.color + '33', color: tag.color }}>
                {tag.name}
              </span>
            )}
          </div>
          {habit.duration && (
            <div className={styles.duration}>⏱ {habit.duration} dk</div>
          )}
        </div>
        <button
          className={`${styles.doneBtn} ${state === 'done' ? styles.doneBtnActive : ''}`}
          onClick={() => onToggleTimeblockDone(habit.id, dayIndex, tbId)}
          title={state === 'done' ? 'Tamamlandı - geri al' : 'Tamamlandı işaretle'}
        >
          {state === 'done' ? (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
            </svg>
          )}
        </button>
      </div>
    );
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
          {!hasAny ? (
            <div className={styles.emptyState}>
              <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="var(--text-muted)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                <polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
              <p>Harika! Bugün için planlanan tüm görevleri tamamladınız veya henüz plan yapmadınız.</p>
              <p className={styles.emptyHint}>Bir görevin hücresine tıklayarak zaman dilimine ekleyebilirsiniz.</p>
            </div>
          ) : (
            <div className={styles.groupedList}>
              {/* Timeblock sections */}
              {activeTimeblocks.map(tb => {
                const entries = timeblockMap[tb.id];
                const doneCount = entries.filter(e => e.state === 'done').length;
                const totalCount = entries.length;
                return (
                  <div key={tb.id} className={styles.groupContainer}>
                    <div className={styles.timblockHeader}>
                      <span className={styles.timeblockName}>{tb.name}</span>
                      <span className={`${styles.tbBadge} ${doneCount === totalCount ? styles.tbBadgeDone : ''}`}>
                        {doneCount}/{totalCount}
                      </span>
                    </div>
                    {entries.map(({ habit, state }) => renderHabitEntry(habit, tb.id, state))}
                  </div>
                );
              })}

              {/* Legacy planned (old-style) */}
              {legacyPlanned.length > 0 && (
                <div className={styles.groupContainer}>
                  <div className={styles.groupHeader}>Diğer Planlar</div>
                  {legacyPlanned.map(h => {
                    const tag = PRESET_TAGS.find(t => t.id === h.tagId);
                    return (
                      <div key={h.id} className={styles.itemRow}>
                        <div className={styles.colorIndicator} style={{ backgroundColor: h.color }} />
                        <div className={styles.itemDetails}>
                          <div className={styles.itemName}>
                            {h.name}
                            {tag && <span className={styles.tagBadge} style={{ background: tag.color + '33', color: tag.color }}>{tag.name}</span>}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
