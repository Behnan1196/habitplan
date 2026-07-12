'use client';

import { HabitItem, PRESET_TAGS } from '@/types';
import DayCell from './DayCell';
import TimeblockPicker from './TimeblockPicker';
import { CellState } from '@/types';
import styles from './HabitRow.module.css';
import { useState, useCallback } from 'react';

interface Props {
  habit: HabitItem;
  days: Date[];
  getCellState: (habitId: string, dayIndex: number) => CellState;
  onCycleCell: (habitId: string, dayIndex: number) => void;
  onToggleTimeblock: (habitId: string, dayIndex: number, timeblockId: string) => void;
  onEdit: () => void;
  todayIndex: number;
  dragHandleProps?: any;
  isEditMode?: boolean;
  depth?: number;
  groupColor?: string;
  selectedDayIndex?: number;
  isFixed?: boolean;
}

export default function HabitRow({ habit, days, getCellState, onCycleCell, onToggleTimeblock, onEdit, todayIndex, dragHandleProps, isEditMode, depth = 0, groupColor, selectedDayIndex }: Props) {
  const effectiveColor = depth > 0 && groupColor ? groupColor : habit.color;

  const [pickerTarget, setPickerTarget] = useState<{ dayIndex: number; rect: DOMRect } | null>(null);

  const tag = PRESET_TAGS.find(t => t.id === habit.tagId);

  const rowStyle: React.CSSProperties = {
    marginLeft: `${depth * 8}px`,
    width: `calc(100% - ${depth * 8}px)`,
    ...(habit.backColor ? { backgroundColor: habit.backColor } : {})
  };

  const handleCellClick = useCallback((e: React.MouseEvent, dayIdx: number) => {
    const raw = getCellState(habit.id, dayIdx);
    const isComplex = raw && (raw.startsWith('{') || raw.startsWith('['));
    if (isComplex || raw === 'empty') {
      // Open timeblock picker
      setPickerTarget({ dayIndex: dayIdx, rect: (e.currentTarget as HTMLElement).getBoundingClientRect() });
    } else {
      // Old-style: cycle planned/done
      onCycleCell(habit.id, dayIdx);
    }
  }, [getCellState, habit.id, onCycleCell]);

  const renderCell = (dayIdx: number, large: boolean) => {
    const raw = getCellState(habit.id, dayIdx);
    return (
      <DayCell
        state={raw}
        onClick={(e) => handleCellClick(e, dayIdx)}
        isToday={dayIdx === todayIndex}
        large={large}
      />
    );
  };

  return (
    <>
      <div className={`${styles.row} ${depth > 0 ? styles.childRow : ''}`} style={rowStyle}>
        {/* Drag Handle */}
        <div
          className={styles.dragHandle}
          {...dragHandleProps}
          style={!isEditMode ? {
            width: 0, padding: 0, margin: 0, opacity: 0, overflow: 'hidden', pointerEvents: 'none'
          } : undefined}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="9" cy="5" r="1"/><circle cx="9" cy="12" r="1"/><circle cx="9" cy="19" r="1"/>
            <circle cx="15" cy="5" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="15" cy="19" r="1"/>
          </svg>
        </div>

        {/* Color accent bar */}
        <div className={styles.colorBar} style={{ background: effectiveColor }} />

        {/* Name */}
        <div className={styles.nameCell}>
          <button className={styles.nameBtn} onClick={onEdit} title="Detay / Düzenle">
            <div className={styles.nameContent}>
              <div className={styles.nameTop}>
                <span className={styles.name}>{habit.name}</span>
                {tag && (
                  <span className={styles.tagBadge} style={{ background: tag.color + '33', color: tag.color }}>
                    {tag.name}
                  </span>
                )}
              </div>
              {habit.notes && <div className={styles.notes}>{habit.notes}</div>}
            </div>
          </button>
        </div>

        {/* Day cells */}
        <div className={styles.cells}>
          {selectedDayIndex !== undefined ? (
            renderCell(selectedDayIndex, true)
          ) : (
            days.map((_, i) => (
              <div key={i}>
                {renderCell(i, false)}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Timeblock picker popover */}
      {pickerTarget && (
        <TimeblockPicker
          habitId={habit.id}
          dayIndex={pickerTarget.dayIndex}
          rawState={getCellState(habit.id, pickerTarget.dayIndex)}
          onToggleTimeblock={(hId, dIdx, tbId) => {
            onToggleTimeblock(hId, dIdx, tbId);
          }}
          onClose={() => setPickerTarget(null)}
          anchorRect={pickerTarget.rect}
        />
      )}
    </>
  );
}
