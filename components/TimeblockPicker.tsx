'use client';

import { PRESET_TIMEBLOCKS } from '@/types';
import styles from './TimeblockPicker.module.css';

interface Props {
  habitId: string;
  dayIndex: number;
  rawState: string; // JSON string or simple string
  onToggleTimeblock: (habitId: string, dayIndex: number, timeblockId: string) => void;
  onClose: () => void;
  anchorRect: DOMRect;
}

export default function TimeblockPicker({ habitId, dayIndex, rawState, onToggleTimeblock, onClose, anchorRect }: Props) {
  let blocks: Record<string, 'planned' | 'done'> = {};
  try {
    if (rawState && (rawState.startsWith('{') || rawState.startsWith('['))) {
      blocks = JSON.parse(rawState);
    }
  } catch (e) {}

  const top = anchorRect.bottom + 8 + window.scrollY;
  const left = Math.min(anchorRect.left + window.scrollX, window.innerWidth - 200);

  return (
    <>
      {/* Backdrop */}
      <div className={styles.backdrop} onClick={onClose} />
      {/* Picker popover */}
      <div
        className={styles.picker}
        style={{ top, left }}
        onClick={e => e.stopPropagation()}
      >
        <div className={styles.pickerTitle}>Zaman Dilimine Ekle</div>
        {PRESET_TIMEBLOCKS.map(tb => {
          const state = blocks[tb.id];
          const isPlanned = state === 'planned';
          const isDone = state === 'done';
          return (
            <button
              key={tb.id}
              className={`${styles.tbRow} ${isPlanned ? styles.planned : ''} ${isDone ? styles.done : ''}`}
              onClick={() => {
                onToggleTimeblock(habitId, dayIndex, tb.id);
              }}
            >
              <span className={`${styles.dot} ${isDone ? styles.dotDone : isPlanned ? styles.dotPlanned : styles.dotEmpty}`} />
              <span className={styles.tbName}>{tb.name}</span>
              {(isPlanned || isDone) && (
                <span className={styles.checkIcon}>
                  {isDone ? '✓' : '●'}
                </span>
              )}
            </button>
          );
        })}
        <div className={styles.hint}>Tıkla: Planla / Tekrar tıkla: Kaldır</div>
      </div>
    </>
  );
}
