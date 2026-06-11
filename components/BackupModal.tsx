'use client';

import { useState, useEffect } from 'react';
import { AppState } from '@/types';
import styles from './BackupModal.module.css';

interface BackupItem {
  id: string;
  timestamp: number;
  state: AppState;
}

interface Props {
  open: boolean;
  onClose: () => void;
  currentState: AppState | null;
  onRestore: (state: AppState) => void;
}

export default function BackupModal({ open, onClose, currentState, onRestore }: Props) {
  const [backups, setBackups] = useState<BackupItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const fetchBackups = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch('/api/backup');
      const data = await res.json();
      if (data.success) {
        setBackups(data.backups || []);
      } else {
        setError(data.error || 'Yedekler yüklenirken bir hata oluştu.');
      }
    } catch (err) {
      setError('Ağ hatası: Yedekler alınamadı.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      fetchBackups();
      setSuccess(null);
      setError(null);
    }
  }, [open]);

  const handleBackup = async () => {
    if (!currentState) return;
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);
      const res = await fetch('/api/backup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ state: currentState }),
      });
      const data = await res.json();
      if (data.success) {
        setBackups(data.backups || []);
        setSuccess('Verileriniz başarıyla buluta yedeklendi!');
      } else {
        setError(data.error || 'Yedekleme sırasında bir hata oluştu.');
      }
    } catch (err) {
      setError('Ağ hatası: Yedekleme yapılamadı.');
    } finally {
      setLoading(false);
    }
  };

  const handleRestore = (backup: BackupItem) => {
    if (confirm('Seçilen yedeği yüklemek istediğinize emin misiniz? Mevcut verilerinizin üzerine yazılacaktır.')) {
      onRestore(backup.state);
      setSuccess('Yedek başarıyla yüklendi!');
      setTimeout(() => {
        onClose();
      }, 1000);
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString('tr-TR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  if (!open) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>Bulut Yedekleme</h2>
          <button className={styles.closeBtn} onClick={onClose}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className={styles.content}>
          <p className={styles.description}>
            Cihazlar arasında senkronize olmak için verilerinizi buluta yedekleyebilir veya önceki bir yedeği geri yükleyebilirsiniz.
          </p>

          <button 
            className={styles.backupBtn} 
            onClick={handleBackup} 
            disabled={loading || !currentState}
          >
            {loading ? 'Yedekleniyor...' : 'Şimdi Buluta Yedekle'}
          </button>

          {success && <div className={styles.successMsg}>{success}</div>}
          {error && <div className={styles.errorMsg}>{error}</div>}

          <div className={styles.backupListSection}>
            <h3 className={styles.listTitle}>Son 3 Yedek</h3>
            {loading && backups.length === 0 ? (
              <div className={styles.loadingText}>Yedekler yükleniyor...</div>
            ) : backups.length === 0 ? (
              <div className={styles.emptyText}>Bulutta henüz kayıtlı yedek bulunmuyor.</div>
            ) : (
              <div className={styles.list}>
                {backups.map((b) => (
                  <div key={b.id} className={styles.item}>
                    <div className={styles.itemInfo}>
                      <span className={styles.itemDate}>{formatDate(b.timestamp)}</span>
                      <span className={styles.itemSummary}>
                        {b.state.habits.filter(h => h.type === 'habit').length} Alışkanlık, {b.state.habits.filter(h => h.type === 'group').length} Grup
                      </span>
                    </div>
                    <button 
                      className={styles.restoreBtn} 
                      onClick={() => handleRestore(b)}
                      disabled={loading}
                    >
                      Geri Yükle
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
