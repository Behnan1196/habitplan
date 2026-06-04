'use client';

import { HabitItem, PRESET_COLORS } from '@/types';
import { useState, useEffect } from 'react';
import styles from './EditModal.module.css';

interface Props {
  open: boolean;
  initial?: Partial<HabitItem>;
  groups: HabitItem[];
  onSave: (item: Omit<HabitItem, 'id' | 'order'>) => void;
  onDelete?: () => void;
  onClose: () => void;
}

export default function EditModal({ open, initial, groups, onSave, onDelete, onClose }: Props) {
  const [name, setName] = useState('');
  const [type, setType] = useState<'habit' | 'group' | 'separator'>('habit');
  const [color, setColor] = useState(PRESET_COLORS[0].value);
  const [groupId, setGroupId] = useState<string | null>(null);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (open) {
      setName(initial?.name ?? '');
      setType(initial?.type ?? 'habit');
      setColor(initial?.color ?? PRESET_COLORS[0].value);
      setGroupId(initial?.groupId ?? null);
      setNotes(initial?.notes ?? '');
    }
  }, [open, initial]);

  if (!open) return null;

  const handleSave = () => {
    if (!name.trim()) return;
    onSave({ 
      name: name.trim(), 
      type, 
      color, 
      groupId: type === 'group' ? null : groupId,
      notes: notes.trim()
    });
    onClose();
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>{initial?.id ? 'Düzenle' : 'Yeni Ekle'}</h2>
          <button className={styles.closeBtn} onClick={onClose}>✕</button>
        </div>

        {/* Type toggle */}
        <div className={styles.typeToggle}>
          <button
            className={`${styles.typeBtn} ${type === 'habit' ? styles.active : ''}`}
            onClick={() => setType('habit')}
          >
            Alışkanlık
          </button>
          <button
            className={`${styles.typeBtn} ${type === 'group' ? styles.active : ''}`}
            onClick={() => setType('group')}
          >
            Grup Başlığı
          </button>
          <button
            className={`${styles.typeBtn} ${type === 'separator' ? styles.active : ''}`}
            onClick={() => setType('separator')}
          >
            Ayıraç
          </button>
        </div>

        {/* Name */}
        <label className={styles.label}>İsim</label>
        <input
          className={styles.input}
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder={type === 'group' ? 'örn. Vitaminler' : type === 'separator' ? 'örn. SABAH' : 'örn. D Vitamini'}
          autoFocus
          onKeyDown={e => e.key === 'Enter' && handleSave()}
        />

        {/* Notes */}
        <label className={styles.label}>Notlar (Opsiyonel)</label>
        <textarea
          className={styles.textarea}
          value={notes}
          onChange={e => setNotes(e.target.value)}
          placeholder="Bu alışkanlık/öğe ile ilgili ek bilgiler..."
          rows={3}
        />

        {/* Group select (only for habits) */}
        {type === 'habit' && groups.length > 0 && (
          <>
            <label className={styles.label}>Grup (opsiyonel)</label>
            <select
              className={styles.select}
              value={groupId ?? ''}
              onChange={e => setGroupId(e.target.value || null)}
            >
              <option value=''>— Gruba bağlı değil —</option>
              {groups.map(g => (
                <option key={g.id} value={g.id}>{g.name}</option>
              ))}
            </select>
          </>
        )}

        {/* Color picker */}
        <label className={styles.label}>Renk</label>
        <div className={styles.colorGrid}>
          {PRESET_COLORS.map(c => (
            <button
              key={c.value}
              className={`${styles.colorDot} ${color === c.value ? styles.selectedColor : ''}`}
              style={{ backgroundColor: c.value }}
              onClick={() => setColor(c.value)}
              title={c.label}
            />
          ))}
        </div>

        {/* Actions */}
        <div className={styles.actions}>
          {onDelete && (
            <button className={styles.deleteBtn} onClick={() => { onDelete(); onClose(); }}>
              Sil
            </button>
          )}
          <button className={styles.saveBtn} onClick={handleSave} disabled={!name.trim()}>
            Kaydet
          </button>
        </div>
      </div>
    </div>
  );
}
