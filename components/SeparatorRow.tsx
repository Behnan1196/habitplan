'use client';

import { HabitItem } from '@/types';
import styles from './SeparatorRow.module.css';

interface Props {
  item: HabitItem;
  onEdit: () => void;
  dragHandleProps?: any;
  isEditMode?: boolean;
  depth?: number;
}

export default function SeparatorRow({ item, onEdit, dragHandleProps, isEditMode, depth = 0 }: Props) {
  const rowStyle: React.CSSProperties = {
    marginLeft: `${depth * 8}px`,
    width: `calc(100% - ${depth * 8}px)`,
    ...(item.backColor ? { backgroundColor: item.backColor } : {})
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
      <div className={styles.line}></div>
      <button className={styles.labelBtn} onClick={isEditMode ? onEdit : undefined} title={isEditMode ? "Ayıracı düzenle" : ""}>
        {item.name}
      </button>
      <div className={styles.line}></div>
      {isEditMode && (
        <button className={styles.editBtn} onClick={onEdit} title="Düzenle">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="1" /><circle cx="19" cy="12" r="1" /><circle cx="5" cy="12" r="1" />
          </svg>
        </button>
      )}
    </div>
  );
}
