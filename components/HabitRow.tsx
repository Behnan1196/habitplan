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
  dragHandleProps?: any;
  isEditMode?: boolean;
  isChild?: boolean;
  groupColor?: string;
}

export default function HabitRow({ habit, days, getCellState, onCycleCell, onEdit, todayIndex, dragHandleProps, isEditMode, isChild, groupColor }: Props) {
  // Use group color if it's a child, else habit color
  const effectiveColor = isChild && groupColor ? groupColor : habit.color;

  return (
    <div className={`${styles.row} ${isChild ? styles.childRow : ''}`}>
      {/* Drag Handle - Only show in edit mode */}
      {isEditMode && (
        <div className={styles.dragHandle} {...dragHandleProps}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="9" cy="5" r="1"/><circle cx="9" cy="12" r="1"/><circle cx="9" cy="19" r="1"/>
            <circle cx="15" cy="5" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="15" cy="19" r="1"/>
          </svg>
        </div>
      )}

      {/* Color accent bar */}
      <div className={styles.colorBar} style={{ background: effectiveColor }} />

      {/* Name */}
      <div className={styles.nameCell}>
        <button className={styles.nameBtn} onClick={isEditMode ? onEdit : undefined} title={isEditMode ? "Düzenle" : ""}>
          <div className={styles.nameContent}>
            <div className={styles.nameTop}>
              {/* Dot removed as requested to save space */}
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
