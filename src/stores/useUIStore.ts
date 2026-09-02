import { create } from 'zustand';
import { TabType } from '../components/Header';

interface UIState {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;

  activeSlotRank: number | null;
  actionMenuRank: number | null;
  openedFromActionMenu: boolean;
  setActiveSlotRank: (rank: number | null) => void;
  setActionMenuRank: (rank: number | null) => void;
  setOpenedFromActionMenu: (val: boolean) => void;

  isClearModalOpen: boolean;
  isImportConfirmOpen: boolean;
  isExportOpen: boolean;
  setIsClearModalOpen: (open: boolean) => void;
  setIsImportConfirmOpen: (open: boolean) => void;
  setIsExportOpen: (open: boolean) => void;

  closeAllModals: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  activeTab: 'dashboard',
  setActiveTab: (activeTab) => set({ activeTab }),

  activeSlotRank: null,
  actionMenuRank: null,
  openedFromActionMenu: false,
  setActiveSlotRank: (activeSlotRank) => set({ activeSlotRank }),
  setActionMenuRank: (actionMenuRank) => set({ actionMenuRank }),
  setOpenedFromActionMenu: (openedFromActionMenu) => set({ openedFromActionMenu }),

  isClearModalOpen: false,
  isImportConfirmOpen: false,
  isExportOpen: false,
  setIsClearModalOpen: (isClearModalOpen) => set({ isClearModalOpen }),
  setIsImportConfirmOpen: (isImportConfirmOpen) => set({ isImportConfirmOpen }),
  setIsExportOpen: (isExportOpen) => set({ isExportOpen }),

  closeAllModals: () =>
    set({
      activeSlotRank: null,
      actionMenuRank: null,
      openedFromActionMenu: false,
      isClearModalOpen: false,
      isImportConfirmOpen: false,
      isExportOpen: false,
    }),
}));
