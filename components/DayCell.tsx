'use client';

import { CellState } from '@/types';
import styles from './DayCell.module.css';

interface Props {
  state: CellState;
  onClick: (e: React.MouseEvent) => void;
  dayLabel?: string;
  isToday?: boolean;
  large?: boolean;
}

export default function DayCell({ state, onClick, isToday, large }: Props) {
  // Check if state is a complex JSON object (timeblock map)
  let isComplex = false;
  let blocks: Record<string, 'planned' | 'done'> = {};
  try {
    if (state && (state.startsWith('{') || state.startsWith('['))) {
      blocks = JSON.parse(state);
      isComplex = true;
    }
  } catch (e) {}

  if (isComplex) {
    const keys = Object.keys(blocks);
    const doneCount = keys.filter(k => blocks[k] === 'done').length;
    const allDone = doneCount === keys.length && keys.length > 0;
    const partialDone = doneCount > 0 && doneCount < keys.length;
    
    // Choose dynamic class
    const complexClass = allDone 
      ? styles.done 
      : partialDone 
        ? styles.partial 
        : styles.planned;

    return (
      <button
        className={`${styles.cell} ${complexClass} ${isToday ? styles.today : ''} ${large ? styles.large : ''}`}
        onClick={onClick}
        title={`${keys.length} Dilim Planlandı (${doneCount} Tamamlandı)`}
      >
        <span className={styles.multiDotContainer}>
          {keys.map(k => (
            <span 
              key={k} 
              className={`${styles.miniDot} ${blocks[k] === 'done' ? styles.miniDotDone : styles.miniDotPlanned}`}
            />
          ))}
        </span>
      </button>
    );
  }

  return (
    <button
      className={`${styles.cell} ${styles[state]} ${isToday ? styles.today : ''} ${large ? styles.large : ''}`}
      onClick={onClick}
      title={state === 'empty' ? 'Boş' : state === 'planned' ? 'Planlandı' : 'Tamamlandı'}
    >
      <span className={styles.icon}>
        {state === 'done' && (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        )}
        {state === 'planned' && (
          <svg viewBox="0 0 24 24" fill="currentColor">
            <circle cx="12" cy="12" r="5" />
          </svg>
        )}
      </span>
    </button>
  );
}
