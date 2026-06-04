'use client';

import { useHabits } from '@/hooks/useHabits';
import { getWeekDates, formatWeekLabel } from '@/lib/storage';
import { HabitItem } from '@/types';
import { useState, useMemo } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import HabitRow from './HabitRow';
import GroupRow from './GroupRow';
import SeparatorRow from './SeparatorRow';
import WeekNavigation from './WeekNavigation';
import EditModal from './EditModal';
import { DAY_LABELS } from '@/types';
import styles from './HabitTable.module.css';

export default function HabitTable() {
  const habitsHook = useHabits();
  const {
    state, sortedHabits, currentWeek, isCurrentWeek,
    cycleCell, getCellState, toggleGroup, isCollapsed,
    addHabit, updateHabit, deleteHabit, reorderHabits, goToPrevWeek, goToNextWeek, goToCurrentWeek
  } = habitsHook;

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<Partial<HabitItem> | undefined>(undefined);
  const [isEditMode, setIsEditMode] = useState(false);

  const days = useMemo(() => getWeekDates(currentWeek), [currentWeek]);
  
  const today = new Date();
  today.setHours(0,0,0,0);
  const todayIndex = days.findIndex(d => d.getTime() === today.getTime());

  if (!state) return <div className={styles.loading}>Yükleniyor...</div>;

  const groups = sortedHabits.filter(h => h.type === 'group');
  const topLevelItems = sortedHabits.filter(h => !h.groupId);

  const openAddModal = () => {
    setEditItem(undefined);
    setEditModalOpen(true);
  };

  const openEditModal = (item: HabitItem) => {
    setEditItem(item);
    setEditModalOpen(true);
  };

  const handleSave = (data: Omit<HabitItem, 'id' | 'order'>) => {
    if (editItem?.id) {
      updateHabit(editItem.id, data);
    } else {
      addHabit(data);
    }
  };

  const onDragEnd = (result: DropResult) => {
    const { source, destination, type } = result;
    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;
    
    // type is the groupId or 'top-level'
    const groupId = type === 'top-level' ? null : type;
    reorderHabits(source.index, destination.index, groupId);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Alışkanlıklar</h1>
          <p className={styles.subtitle}>Haftanı planla ve takip et</p>
        </div>
        <div className={styles.headerActions}>
          <button 
            className={`${styles.toggleEditBtn} ${isEditMode ? styles.editActive : ''}`} 
            onClick={() => setIsEditMode(!isEditMode)}
          >
            {isEditMode ? 'Bitti' : 'Düzenle'}
          </button>
          <button className={styles.addBtn} onClick={openAddModal}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </button>
        </div>
      </div>

      <WeekNavigation
        currentWeek={currentWeek}
        isCurrentWeek={isCurrentWeek}
        onPrev={goToPrevWeek}
        onNext={goToNextWeek}
        onToday={goToCurrentWeek}
      />

      <div className={styles.tableWrapper}>
        <div className={styles.tableHeader}>
          <div className={styles.nameHeader}>Görev</div>
          <div className={styles.daysHeader}>
            {days.map((d, i) => (
              <div key={i} className={`${styles.dayLabel} ${i === todayIndex ? styles.todayLabel : ''}`}>
                <span className={styles.dayLetter}>{DAY_LABELS[i]}</span>
                <span className={styles.dayNumber}>{d.getDate()}</span>
              </div>
            ))}
          </div>
        </div>

        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="top-level" type="top-level">
            {(provided) => (
              <div className={styles.tableBody} ref={provided.innerRef} {...provided.droppableProps}>
                
                {topLevelItems.map((item, index) => (
                  <Draggable key={item.id} draggableId={item.id} index={index}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className={snapshot.isDragging ? styles.dragging : ''}
                      >
                        {item.type === 'separator' && (
                          <SeparatorRow 
                            item={item} 
                            onEdit={() => openEditModal(item)} 
                            dragHandleProps={provided.dragHandleProps} 
                            isEditMode={isEditMode}
                          />
                        )}
                        
                        {item.type === 'habit' && (
                          <HabitRow
                            habit={item}
                            days={days}
                            getCellState={getCellState}
                            onCycleCell={cycleCell}
                            onEdit={() => openEditModal(item)}
                            todayIndex={todayIndex}
                            dragHandleProps={provided.dragHandleProps}
                            isEditMode={isEditMode}
                          />
                        )}

                        {item.type === 'group' && (
                          <div className={styles.groupSection}>
                            <GroupRow
                              group={item}
                              isCollapsed={isCollapsed(item.id)}
                              childCount={sortedHabits.filter(h => h.groupId === item.id).length}
                              completedCount={sortedHabits.filter(h => h.groupId === item.id).reduce((acc, child) => {
                                let c = 0;
                                for(let i=0; i<7; i++) if (getCellState(child.id, i) === 'done') c++;
                                return acc + c;
                              }, 0)}
                              onToggle={() => toggleGroup(item.id)}
                              onEdit={() => openEditModal(item)}
                              dragHandleProps={provided.dragHandleProps}
                              isEditMode={isEditMode}
                            />
                            
                            {!isCollapsed(item.id) && (
                              <Droppable droppableId={`group-${item.id}`} type={item.id}>
                                {(providedGroup) => (
                                  <div 
                                    className={styles.groupChildren} 
                                    ref={providedGroup.innerRef} 
                                    {...providedGroup.droppableProps}
                                  >
                                    {sortedHabits.filter(h => h.groupId === item.id).map((child, childIdx) => (
                                      <Draggable key={child.id} draggableId={child.id} index={childIdx}>
                                        {(providedChild, snapshotChild) => (
                                          <div
                                            ref={providedChild.innerRef}
                                            {...providedChild.draggableProps}
                                            className={snapshotChild.isDragging ? styles.dragging : ''}
                                          >
                                            <HabitRow
                                              habit={child}
                                              days={days}
                                              getCellState={getCellState}
                                              onCycleCell={cycleCell}
                                              onEdit={() => openEditModal(child)}
                                              todayIndex={todayIndex}
                                              dragHandleProps={providedChild.dragHandleProps}
                                              isEditMode={isEditMode}
                                              isChild={true}
                                              groupColor={item.color}
                                            />
                                          </div>
                                        )}
                                      </Draggable>
                                    ))}
                                    {providedGroup.placeholder}
                                  </div>
                                )}
                              </Droppable>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
                
                {sortedHabits.length === 0 && (
                  <div className={styles.emptyState}>
                    <p>Henüz alışkanlık eklenmemiş.</p>
                    <button onClick={openAddModal}>İlk alışkanlığını ekle</button>
                  </div>
                )}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>

      <EditModal
        open={editModalOpen}
        initial={editItem}
        groups={groups}
        onSave={handleSave}
        onDelete={editItem?.id ? () => deleteHabit(editItem.id!) : undefined}
        onClose={() => setEditModalOpen(false)}
      />
    </div>
  );
}
