'use client';

import React from 'react';
import { Trainee } from '../types/trainee';
import { OshiSlot, AnalysisResult } from '../utils/calculator';
import { ExportCardModal } from './modals/ExportCardModal';
import { TraineeModal } from './modals/TraineeModal';
import { CardActionModal } from './modals/CardActionModal';
import { ConfirmModal } from './modals/ConfirmModal';

interface ModalContainerProps {
  // Trainee Data
  trainees: Trainee[];
  slots: OshiSlot[];
  activeCount: number;
  activeTraineeRanks: Record<string, number>;
  analysis: AnalysisResult;

  // Export Card Modal
  isExportOpen: boolean;
  onCloseExport: () => void;

  // Trainee Selection Modal
  activeSlotRank: number | null;
  openedFromActionMenu: boolean;
  onSelectTrainee: (trainee: Trainee) => void;
  onCloseTraineeModal: () => void;
  onBackToActionMenu?: () => void;

  // Card Action Modal
  actionMenuRank: number | null;
  activeMenuTrainee: Trainee | null;
  onCloseActionMenu: () => void;
  onChangeTraineeFromAction: (rank: number) => void;
  onMoveToRank: (sourceRank: number, targetRank: number) => void;
  onRemoveTrainee: (rank: number) => void;

  // Clear Roster Confirmation Modal
  isClearModalOpen: boolean;
  onCloseClearModal: () => void;
  onConfirmClear: () => void;

  // Overwrite Local Roster Confirmation Modal
  isImportConfirmOpen: boolean;
  onCloseImportConfirm: () => void;
  onConfirmImportShared: () => void;
}

export const ModalContainer: React.FC<ModalContainerProps> = ({
  trainees,
  slots,
  activeCount,
  activeTraineeRanks,
  analysis,
  isExportOpen,
  onCloseExport,
  activeSlotRank,
  openedFromActionMenu,
  onSelectTrainee,
  onCloseTraineeModal,
  onBackToActionMenu,
  actionMenuRank,
  activeMenuTrainee,
  onCloseActionMenu,
  onChangeTraineeFromAction,
  onMoveToRank,
  onRemoveTrainee,
  isClearModalOpen,
  onCloseClearModal,
  onConfirmClear,
  isImportConfirmOpen,
  onCloseImportConfirm,
  onConfirmImportShared,
}) => {
  return (
    <>
      {/* 1. Share / Export Summary Card */}
      <ExportCardModal
        isOpen={isExportOpen}
        onClose={onCloseExport}
        slots={slots}
        archetype={analysis?.archetype}
        strategyScores={analysis?.style || analysis?.strategy}
        distanceScores={analysis?.distance}
      />

      {/* 2. Trainee Selection Picker */}
      {activeSlotRank !== null && (
        <TraineeModal
          rank={activeSlotRank}
          trainees={trainees}
          activeTraineeRanks={activeTraineeRanks}
          onSelect={onSelectTrainee}
          onClose={onCloseTraineeModal}
          onBack={openedFromActionMenu ? onBackToActionMenu : undefined}
        />
      )}

      {/* 3. Card Slot Action Menu */}
      {actionMenuRank !== null && activeMenuTrainee && (
        <CardActionModal
          rank={actionMenuRank}
          trainee={activeMenuTrainee}
          totalCount={activeCount}
          onClose={onCloseActionMenu}
          onChangeTrainee={onChangeTraineeFromAction}
          onMoveToRank={onMoveToRank}
          onRemove={onRemoveTrainee}
        />
      )}

      {/* 4. Clear Roster Confirmation */}
      <ConfirmModal
        isOpen={isClearModalOpen}
        title="Clear Top 50 Roster?"
        description="Are you sure you want to remove all trainees from your Top 50 list? This action will reset all assigned slots and cannot be undone."
        confirmLabel="Clear All Slots"
        cancelLabel="Cancel"
        variant="danger"
        onConfirm={onConfirmClear}
        onClose={onCloseClearModal}
      />

      {/* 5. Overwrite Local Storage Confirmation */}
      <ConfirmModal
        isOpen={isImportConfirmOpen}
        title="Replace Your Top 50 Roster?"
        description="Saving this shared roster will overwrite your personal Top 50 list stored in this browser. Are you sure you want to proceed?"
        confirmLabel="Save & Overwrite"
        cancelLabel="Keep My List"
        variant="danger"
        onConfirm={onConfirmImportShared}
        onClose={onCloseImportConfirm}
      />
    </>
  );
};