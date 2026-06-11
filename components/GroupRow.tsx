'use client';

import { HabitItem } from '@/types';
import styles from './GroupRow.module.css';

interface Props {
  group: HabitItem;
  isCollapsed: boolean;
  childCount: number;
  completedCount: number;
  onToggle: () => void;
  onEdit: () => void;
  dragHandleProps?: any;
  isEditMode?: boolean;
}

export default function GroupRow({ group, isCollapsed, childCount, completedCount, onToggle, onEdit, dragHandleProps, isEditMode }: Props) {
  return (
    <div className={styles.groupRow} style={{ '--group-color': group.color } as React.CSSProperties}>
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
      <div className={styles.colorBar} style={{ background: group.color }} />
      <button className={styles.toggleBtn} onClick={onToggle} title={isCollapsed ? 'Genişlet' : 'Daralt'}>
        <svg
          className={`${styles.chevron} ${isCollapsed ? styles.collapsed : ''}`}
          viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
          strokeLinecap="round" strokeLinejoin="round"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
        <span className={styles.groupName} style={{ color: group.color }}>{group.name}</span>
        <span className={styles.badge}>
          {completedCount}/{childCount}
        </span>
      </button>
      {isEditMode && (
        <button className={styles.editBtn} onClick={onEdit} title="Grubu düzenle">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="1" /><circle cx="19" cy="12" r="1" /><circle cx="5" cy="12" r="1" />
          </svg>
        </button>
      )}
    </div>
  );
}
