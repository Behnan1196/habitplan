'use client';

import { HabitItem } from '@/types';
import { useState, useEffect } from 'react';
import styles from './MetricRow.module.css';

interface Props {
  habit: HabitItem;
  days: Date[];
  getCellState: (habitId: string, dayIndex: number) => string;
  onUpdateCell: (habitId: string, dayIndex: number, text: string) => void;
  onEdit: () => void;
  todayIndex: number;
  dragHandleProps?: any;
  isEditMode?: boolean;
  depth?: number;
  groupColor?: string;
  selectedDayIndex?: number;
}

export default function MetricRow({ habit, days, getCellState, onUpdateCell, onEdit, todayIndex, dragHandleProps, isEditMode, depth = 0, groupColor, selectedDayIndex }: Props) {
  const effectiveColor = depth > 0 && groupColor ? groupColor : habit.color;

  const rowStyle: React.CSSProperties = {
    marginLeft: `${depth * 8}px`,
    width: `calc(100% - ${depth * 8}px)`,
    ...(habit.backColor ? { backgroundColor: habit.backColor } : {})
  };

  const renderInput = (dayIdx: number, isLarge: boolean) => {
    const val = getCellState(habit.id, dayIdx) || '';
    // Use local state for immediate typing feedback, then sync on blur
    return (
      <MetricInput 
        initialValue={val === 'empty' ? '' : val} 
        onBlur={(newVal) => onUpdateCell(habit.id, dayIdx, newVal)}
        isLarge={isLarge}
      />
    );
  };

  return (
    <div className={`${styles.row} ${depth > 0 ? styles.childRow : ''}`} style={rowStyle}>
      <div 
        className={styles.dragHandle} 
        {...dragHandleProps}
        style={!isEditMode ? {
          width: 0,
          padding: 0,
          margin: 0,
          opacity: 0,
          overflow: 'hidden',
          pointerEvents: 'none'
        } : undefined}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="9" cy="5" r="1"/><circle cx="9" cy="12" r="1"/><circle cx="9" cy="19" r="1"/>
          <circle cx="15" cy="5" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="15" cy="19" r="1"/>
        </svg>
      </div>

      <div className={styles.colorBar} style={{ background: effectiveColor }} />

      <div className={styles.nameCell}>
        <button className={styles.nameBtn} onClick={isEditMode ? onEdit : undefined} title={isEditMode ? "Düzenle" : ""}>
          <div className={styles.nameContent}>
            <div className={styles.nameTop}>
              <span className={styles.name}>{habit.name}</span>
            </div>
            {habit.notes && <div className={styles.notes}>{habit.notes}</div>}
          </div>
        </button>
      </div>

      <div className={styles.cells}>
        {selectedDayIndex !== undefined ? (
          <div className={styles.inputWrapperLarge}>
            {renderInput(selectedDayIndex, true)}
          </div>
        ) : (
          days.map((_, i) => (
            <div key={i} className={styles.inputWrapper}>
              {renderInput(i, false)}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// Inner component to handle local typing state vs global state sync
function MetricInput({ initialValue, onBlur, isLarge }: { initialValue: string, onBlur: (val: string) => void, isLarge: boolean }) {
  const [val, setVal] = useState(initialValue);

  // Sync if external state changes
  useEffect(() => {
    setVal(initialValue);
  }, [initialValue]);

  return (
    <input
      type="text"
      className={styles.metricInput}
      value={val}
      onChange={(e) => setVal(e.target.value)}
      onBlur={() => onBlur(val)}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          e.currentTarget.blur(); // Triggers onBlur
        }
      }}
      placeholder={isLarge ? "Değer girin..." : "-"}
    />
  );
}
