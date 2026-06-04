'use client';

import { HabitItem } from '@/types';
import DayCell from './DayCell';
import { CellState } from '@/types';
import styles from './HabitRow.module.css';

interface Props {
  habit: HabitItem;
  days: Date[];
  getCellState: (habitId: string, dayIndex: number) => CellState;
  onCycleCell: (habitId: string, dayIndex: number) => void;
  onEdit: () => void;
  todayIndex: number;
}

export default function HabitRow({ habit, days, getCellState, onCycleCell, onEdit, todayIndex }: Props) {
  return (
    <div className={styles.row}>
      {/* Color accent bar */}
      <div className={styles.colorBar} style={{ background: habit.color }} />

      {/* Name */}
      <div className={styles.nameCell}>
        <button className={styles.nameBtn} onClick={onEdit} title="Düzenle">
          <div className={styles.nameContent}>
            <div className={styles.nameTop}>
              <span className={styles.dot} style={{ background: habit.color }} />
              <span className={styles.name}>{habit.name}</span>
            </div>
            {habit.notes && <div className={styles.notes}>{habit.notes}</div>}
          </div>
        </button>
      </div>

      {/* Day cells */}
      <div className={styles.cells}>
        {days.map((_, i) => (
          <DayCell
            key={i}
            state={getCellState(habit.id, i)}
            onClick={() => onCycleCell(habit.id, i)}
            isToday={i === todayIndex}
          />
        ))}
      </div>
    </div>
  );
}
