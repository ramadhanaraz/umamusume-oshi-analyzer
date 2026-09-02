import { describe, it, expect, beforeEach } from 'vitest';
import { useSettingsStore } from '../useSettingsStore';
import { useUIStore } from '../useUIStore';
import { useRosterStore } from '../useRosterStore';
import { useSorterStore } from '../useSorterStore';
import { TRAINEES } from '../../data/trainees';

describe('Zustand Stores', () => {
  beforeEach(() => {
    useSettingsStore.setState({ weightMode: 'tiered', filterMode: 'aOnly', mode: 'global' });
    useUIStore.getState().closeAllModals();
    useRosterStore.getState().clearRoster();
    useSorterStore.setState({ hasActiveSession: false });
  });

  it('manages settings store', () => {
    const { setWeightMode, setFilterMode, setMode } = useSettingsStore.getState();
    setWeightMode('equal');
    expect(useSettingsStore.getState().weightMode).toBe('equal');

    setFilterMode('acViable');
    expect(useSettingsStore.getState().filterMode).toBe('acViable');

    setMode('jp');
    expect(useSettingsStore.getState().mode).toBe('jp');
  });

  it('manages UI store modal and navigation states', () => {
    const { setActiveTab, setIsExportOpen, closeAllModals } = useUIStore.getState();
    setActiveTab('database');
    expect(useUIStore.getState().activeTab).toBe('database');

    setIsExportOpen(true);
    expect(useUIStore.getState().isExportOpen).toBe(true);

    closeAllModals();
    expect(useUIStore.getState().isExportOpen).toBe(false);
  });

  it('manages roster store slot actions', () => {
    const { addFirstEmpty, removeByRank, autoFillRemaining } = useRosterStore.getState();

    addFirstEmpty(TRAINEES[0]);
    let activeSlots = useRosterStore.getState().slots.filter((s) => s.trainee !== null);
    expect(activeSlots.length).toBe(1);
    expect(activeSlots[0].trainee?.id).toBe(TRAINEES[0].id);

    removeByRank(1);
    activeSlots = useRosterStore.getState().slots.filter((s) => s.trainee !== null);
    expect(activeSlots.length).toBe(0);

    autoFillRemaining();
    activeSlots = useRosterStore.getState().slots.filter((s) => s.trainee !== null);
    expect(activeSlots.length).toBe(50);
  });

  it('manages sorter store session flag', () => {
    const { setHasActiveSession } = useSorterStore.getState();
    setHasActiveSession(true);
    expect(useSorterStore.getState().hasActiveSession).toBe(true);
  });

  it('restores personal calculation settings when exiting shared preview', () => {
    // 1. Setup local storage with personal calculation settings
    localStorage.setItem(
      'umamusume-top50-calc-settings',
      JSON.stringify({ weightMode: 'linear', filterMode: 'allGrades' })
    );
    useSettingsStore.getState().loadSavedSettings();
    expect(useSettingsStore.getState().weightMode).toBe('linear');
    expect(useSettingsStore.getState().filterMode).toBe('allGrades');

    // 2. Simulate opening a shared link which loads preview roster and preview calculation settings
    useRosterStore.setState({ isSharedPreview: true });
    useSettingsStore.getState().setWeightMode('equal');
    useSettingsStore.getState().setFilterMode('acViable');

    expect(useSettingsStore.getState().weightMode).toBe('equal');
    expect(useSettingsStore.getState().filterMode).toBe('acViable');

    // 3. User clicks "Restore My List"
    useRosterStore.getState().exitSharedPreview();

    // 4. Verify calculation settings and shared preview state are restored from local storage
    expect(useRosterStore.getState().isSharedPreview).toBe(false);
    expect(useSettingsStore.getState().weightMode).toBe('linear');
    expect(useSettingsStore.getState().filterMode).toBe('allGrades');
  });
});
