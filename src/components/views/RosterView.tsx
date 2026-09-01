'use client';

import React from 'react';
import { Trainee, TerminologyMode } from '../../types/trainee';
import { OshiSlot } from '../../utils/calculator';
import { RosterHeaderControls } from './roster/RosterHeaderControls';
import { RosterGrid } from './roster/RosterGrid';

interface RosterViewProps {
  slots: OshiSlot[];
  activeCount: number;
  mode: TerminologyMode;
  isReadOnly?: boolean;
  copied?: boolean;
  onSelectSlot: (rank: number) => void;
  onOpenActionMenu: (rank: number) => void;
  onRemove: (rank: number) => void;
  onReorderList: (newTrainees: Trainee[]) => void;
  onAutoFillRemaining: () => void;
  onClear: () => void;
  onShare: () => void;
  onExportCSV: () => void;
  onOpenExportCard: () => void;
}

export const RosterView: React.FC<RosterViewProps> = ({
  slots,
  activeCount,
  mode,
  isReadOnly = false,
  copied = false,
  onSelectSlot,
  onOpenActionMenu,
  onRemove,
  onReorderList,
  onAutoFillRemaining,
  onClear,
  onShare,
  onExportCSV,
  onOpenExportCard,
}) => {
  return (
    <div className="space-y-6 animate-fadeIn">
      <RosterHeaderControls
        activeCount={activeCount}
        totalSlots={50}
        isReadOnly={isReadOnly}
        copied={copied}
        onAutoFill={onAutoFillRemaining}
        onClear={onClear}
        onShare={onShare}
        onExportCSV={onExportCSV}
        onOpenExportCard={onOpenExportCard}
      />

      <RosterGrid
        slots={slots}
        mode={mode}
        isReadOnly={isReadOnly}
        onSelectSlot={onSelectSlot}
        onOpenActionMenu={onOpenActionMenu}
        onRemove={onRemove}
        onReorderList={onReorderList}
      />
    </div>
  );
};
