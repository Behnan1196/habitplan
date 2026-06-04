'use client';

import { formatWeekLabel, getWeekKey } from '@/lib/storage';
import styles from './WeekNavigation.module.css';

interface Props {
  currentWeek: string;
  isCurrentWeek: boolean;
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
}

export default function WeekNavigation({ currentWeek, isCurrentWeek, onPrev, onNext, onToday }: Props) {
  return (
    <div className={styles.nav}>
      <button className={styles.arrowBtn} onClick={onPrev} title="Önceki hafta">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>

      <div className={styles.center}>
        <span className={styles.weekLabel}>{formatWeekLabel(currentWeek)}</span>
        {!isCurrentWeek && (
          <button className={styles.todayBtn} onClick={onToday}>Bu Hafta</button>
        )}
        {isCurrentWeek && (
          <span className={styles.currentBadge}>Bu Hafta</span>
        )}
      </div>

      <button className={styles.arrowBtn} onClick={onNext} title="Sonraki hafta">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>
    </div>
  );
}
