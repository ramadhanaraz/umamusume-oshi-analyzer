import React from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import { Trainee, TerminologyMode } from '../../../types/trainee';
import { OshiSlot } from '../../../utils/calculator';
import { OshiCard } from '../../OshiCard';
import { Plus } from 'lucide-react';

interface RosterGridProps {
  slots: OshiSlot[];
  mode: TerminologyMode;
  isReadOnly?: boolean;
  onSelectSlot: (rank: number) => void;
  onOpenActionMenu: (rank: number) => void;
  onRemove: (rank: number) => void;
  onReorderList: (newTrainees: Trainee[]) => void;
}

export const RosterGrid: React.FC<RosterGridProps> = ({
  slots,
  mode,
  isReadOnly = false,
  onSelectSlot,
  onOpenActionMenu,
  onRemove,
  onReorderList,
}) => {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const activeTrainees = slots
    .filter((s): s is { rank: number; trainee: Trainee } => s.trainee !== null)
    .map((s) => s.trainee);

  const activeIds = activeTrainees.map((t) => t.id);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = activeIds.indexOf(active.id as string);
    const newIndex = activeIds.indexOf(over.id as string);

    if (oldIndex !== -1 && newIndex !== -1) {
      const updated = [...activeTrainees];
      const [moved] = updated.splice(oldIndex, 1);
      updated.splice(newIndex, 0, moved);
      onReorderList(updated);
    }
  };

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={activeIds} strategy={rectSortingStrategy}>
        <div className="space-y-3">
          {slots.map((slot) => {
            if (slot.trainee) {
              return (
                <OshiCard
                  key={slot.rank}
                  rank={slot.rank}
                  trainee={slot.trainee}
                  mode={mode}
                  totalCount={activeTrainees.length}
                  isReadOnly={isReadOnly}
                  onOpenActionMenu={onOpenActionMenu}
                  onRemove={onRemove}
                />
              );
            }

            return (
              <div
                key={slot.rank}
                onClick={() => !isReadOnly && onSelectSlot(slot.rank)}
                className={`p-3.5 rounded-3xl border border-dashed border-slate-800 bg-slate-900/30 flex items-center justify-between transition-colors ${
                  isReadOnly
                    ? 'cursor-default opacity-50'
                    : 'cursor-pointer hover:bg-slate-900/60 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-xl bg-slate-800/80 border border-slate-700/60 text-slate-400 text-xs font-black flex items-center justify-center">
                    #{slot.rank}
                  </span>
                  <span className="text-xs font-bold text-slate-500">
                    {isReadOnly ? `Empty Slot #${slot.rank}` : `Tap to assign Trainee #${slot.rank}`}
                  </span>
                </div>

                {!isReadOnly && (
                  <span className="p-1.5 rounded-xl bg-slate-800/80 text-slate-400 flex items-center justify-center">
                    <Plus className="w-4 h-4" />
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </SortableContext>
    </DndContext>
  );
};
