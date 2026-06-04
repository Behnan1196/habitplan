'use client';

import { HabitItem } from '@/types';
import styles from './SeparatorRow.module.css';

interface Props {
  item: HabitItem;
  onEdit: () => void;
  dragHandleProps?: any;
}

export default function SeparatorRow({ item, onEdit, dragHandleProps }: Props) {
  return (
    <div className={styles.row}>
      <div className={styles.dragHandle} {...dragHandleProps}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="9" cy="5" r="1"/><circle cx="9" cy="12" r="1"/><circle cx="9" cy="19" r="1"/>
          <circle cx="15" cy="5" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="15" cy="19" r="1"/>
        </svg>
      </div>
      <div className={styles.line}></div>
      <button className={styles.labelBtn} onClick={onEdit} title="Ayıracı düzenle">
        {item.name}
      </button>
      <div className={styles.line}></div>
      <button className={styles.editBtn} onClick={onEdit} title="Düzenle">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="1" /><circle cx="19" cy="12" r="1" /><circle cx="5" cy="12" r="1" />
        </svg>
      </button>
    </div>
  );
}
