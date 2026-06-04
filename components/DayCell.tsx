'use client';

import { CellState } from '@/types';
import styles from './DayCell.module.css';

interface Props {
  state: CellState;
  onClick: () => void;
  dayLabel?: string;
  isToday?: boolean;
}

export default function DayCell({ state, onClick, isToday }: Props) {
  return (
    <button
      className={`${styles.cell} ${styles[state]} ${isToday ? styles.today : ''}`}
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
