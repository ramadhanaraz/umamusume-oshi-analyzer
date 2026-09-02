import { create } from 'zustand';
import { Trainee, WeightingMode, AptitudeFilterMode } from '../types/trainee';
import { OshiSlot } from '../utils/calculator';
import { encodeRosterToUrl, decodeRosterFromUrl } from '../utils/urlSerializer';
import { traineeRepository } from '../repositories/traineeRepository';

const TOTAL_SLOTS = 50;
const ROSTER_STORAGE_KEY = 'umamusume-top50-roster';

const createEmptySlots = (): OshiSlot[] =>
  Array.from({ length: TOTAL_SLOTS }, (_, i) => ({
    rank: i + 1,
    trainee: null,
  }));

interface RosterState {
  slots: OshiSlot[];
  isSharedPreview: boolean;
  isLoaded: boolean;
  copied: boolean;

  setSlots: (slots: OshiSlot[]) => void;
  selectTraineeForSlot: (slotRank: number, trainee: Trainee) => void;
  addFirstEmpty: (trainee: Trainee) => void;
  removeByRank: (rank: number) => void;
  reorderSlots: (sourceRank: number, targetRank: number) => void;
  reorderList: (trainees: Trainee[]) => void;
  clearRoster: () => void;
  autoFillRemaining: () => void;
  loadPreset: (type: 'spica' | 'newEra' | 'new-era' | 'random') => void;

  loadRosterFromStorage: () => void;
  loadRosterFromUrlParam: (param: string) => { weightMode?: WeightingMode; filterMode?: AptitudeFilterMode } | null;
  exitSharedPreview: () => void;
  confirmImportShared: () => void;
  handleShare: (weightMode: WeightingMode, filterMode: AptitudeFilterMode) => Promise<void>;
  exportCSV: () => void;
}

export const useRosterStore = create<RosterState>((set, get) => ({
  slots: createEmptySlots(),
  isSharedPreview: false,
  isLoaded: false,
  copied: false,

  setSlots: (slots) => {
    set({ slots });
    const { isLoaded, isSharedPreview } = get();
    if (isLoaded && !isSharedPreview && typeof window !== 'undefined') {
      try {
        const ids = slots.map((s) => s.trainee?.id || '');
        localStorage.setItem(ROSTER_STORAGE_KEY, JSON.stringify(ids));
      } catch (e) {
        console.error('Failed to save roster to LocalStorage', e);
      }
    }
  },

  selectTraineeForSlot: (slotRank, trainee) => {
    const { slots, setSlots } = get();
    const current = slots.filter((s) => s.trainee !== null).map((s) => s.trainee!);
    const existingIndex = current.findIndex((t) => t.id === trainee.id);

    if (existingIndex !== -1) {
      if (slotRank <= current.length) {
        const temp = current[slotRank - 1];
        current[slotRank - 1] = current[existingIndex];
        current[existingIndex] = temp;
      } else {
        current.splice(existingIndex, 1);
        current.push(trainee);
      }
    } else {
      if (slotRank <= current.length) {
        current[slotRank - 1] = trainee;
      } else {
        current.push(trainee);
      }
    }

    const newSlots = Array.from({ length: TOTAL_SLOTS }, (_, i) => ({
      rank: i + 1,
      trainee: current[i] || null,
    }));
    setSlots(newSlots);
  },

  addFirstEmpty: (trainee) => {
    const { slots, setSlots } = get();
    const active = slots.filter((s) => s.trainee !== null).map((s) => s.trainee!);
    if (active.length >= TOTAL_SLOTS) {
      alert('Your Top 50 roster is full!');
      return;
    }
    const exists = active.some((t) => t.id === trainee.id);
    if (exists) {
      alert(`${trainee.nameEn} is already in your Top 50!`);
      return;
    }
    active.push(trainee);
    setSlots(Array.from({ length: TOTAL_SLOTS }, (_, i) => ({ rank: i + 1, trainee: active[i] || null })));
  },

  removeByRank: (rank) => {
    const { slots, setSlots } = get();
    const current = slots.filter((s) => s.trainee !== null).map((s) => s.trainee!);
    current.splice(rank - 1, 1);
    setSlots(Array.from({ length: TOTAL_SLOTS }, (_, i) => ({ rank: i + 1, trainee: current[i] || null })));
  },

  reorderSlots: (sourceRank, targetRank) => {
    const { slots, setSlots } = get();
    const activeCount = slots.filter((s) => s.trainee !== null).length;
    if (sourceRank === targetRank || targetRank < 1 || targetRank > activeCount) return;

    const current = slots.filter((s) => s.trainee !== null).map((s) => s.trainee!);
    const [moved] = current.splice(sourceRank - 1, 1);
    current.splice(targetRank - 1, 0, moved);
    setSlots(Array.from({ length: TOTAL_SLOTS }, (_, i) => ({ rank: i + 1, trainee: current[i] || null })));
  },

  reorderList: (trainees) => {
    const { setSlots } = get();
    setSlots(Array.from({ length: TOTAL_SLOTS }, (_, i) => ({ rank: i + 1, trainee: trainees[i] || null })));
  },

  clearRoster: () => {
    const { setSlots } = get();
    setSlots(createEmptySlots());
  },

  autoFillRemaining: () => {
    const { slots, setSlots } = get();
    const currentList = slots.filter((s) => s.trainee !== null).map((s) => s.trainee!);
    if (currentList.length >= TOTAL_SLOTS) return;

    const allTrainees = traineeRepository.getAllTraineesSync();
    const chosenIds = new Set(currentList.map((t) => t.id));
    const available = allTrainees.filter((t) => !chosenIds.has(t.id)).sort(() => 0.5 - Math.random());
    const needed = TOTAL_SLOTS - currentList.length;
    const toAdd = available.slice(0, needed);
    const fullList = [...currentList, ...toAdd];

    setSlots(Array.from({ length: TOTAL_SLOTS }, (_, i) => ({ rank: i + 1, trainee: fullList[i] || null })));
  },

  loadPreset: (type) => {
    const { setSlots } = get();
    const allTrainees = traineeRepository.getAllTraineesSync();
    let selected: Trainee[] = [];

    if (type === 'newEra' || type === 'new-era') {
      const ids = [
        'epiphaneia', 'fusaichi-pandora', 'rulership', 'curren-bouquetdor', 'gentildonna',
        'red-desire', 'daring-heart', 'admire-groove', 'lucky-lilac', 'north-flight',
        'victoire-pisa', 'loves-only-you', 'almond-eye', 'sounds-of-earth', 'kiseki',
        'bubble-gum-fellow', 'stay-gold', 'nakayama-festa', 'dream-journey', 'buena-vista',
      ];
      selected = allTrainees.filter((t) => ids.includes(t.id));
    } else if (type === 'spica') {
      const ids = [
        'special-week', 'silence-suzuka', 'tokai-teio', 'vodka', 'daiwa-scarlet',
        'gold-ship', 'mejiro-mcqueen', 'symboli-rudolf', 'air-groove', 'narita-brian',
        'rice-shower', 'grass-wonder', 'el-condor-pasa', 'taiki-shuttle', 'oguri-cap',
        'twin-turbo', 'nice-nature', 'king-halo', 'winning-ticket', 'agnes-tachyon',
      ];
      selected = allTrainees.filter((t) => ids.includes(t.id));
    } else {
      selected = [...allTrainees].sort(() => 0.5 - Math.random()).slice(0, TOTAL_SLOTS);
    }
    setSlots(Array.from({ length: TOTAL_SLOTS }, (_, i) => ({ rank: i + 1, trainee: selected[i] || null })));
  },

  loadRosterFromStorage: () => {
    if (typeof window === 'undefined') return;
    try {
      const savedRoster = localStorage.getItem(ROSTER_STORAGE_KEY);
      const allTrainees = traineeRepository.getAllTraineesSync();
      const map = new Map(allTrainees.map((t) => [t.id, t]));

      if (savedRoster) {
        const parsedIds: string[] = JSON.parse(savedRoster);
        const loadedSlots = Array.from({ length: TOTAL_SLOTS }, (_, i) => ({
          rank: i + 1,
          trainee: parsedIds[i] ? map.get(parsedIds[i]) || null : null,
        }));
        set({ slots: loadedSlots, isSharedPreview: false, isLoaded: true });
      } else {
        set({ slots: createEmptySlots(), isSharedPreview: false, isLoaded: true });
      }
    } catch (e) {
      console.error('Failed to load roster from LocalStorage', e);
      set({ slots: createEmptySlots(), isSharedPreview: false, isLoaded: true });
    }
  },

  loadRosterFromUrlParam: (param) => {
    const allTrainees = traineeRepository.getAllTraineesSync();
    const decoded = decodeRosterFromUrl(param, allTrainees);

    if (decoded && decoded.trainees.length > 0) {
      const incomingSlots: OshiSlot[] = Array.from({ length: TOTAL_SLOTS }, (_, i) => ({
        rank: i + 1,
        trainee: decoded.trainees[i] || null,
      }));

      set({ slots: incomingSlots, isSharedPreview: true, isLoaded: true });
      return { weightMode: decoded.weightMode, filterMode: decoded.filterMode };
    }
    return null;
  },

  exitSharedPreview: () => {
    const { loadRosterFromStorage } = get();
    loadRosterFromStorage();
  },

  confirmImportShared: () => {
    const { slots, setSlots } = get();
    set({ isSharedPreview: false });
    setSlots(slots);
  },

  handleShare: async (weightMode, filterMode) => {
    if (typeof window === 'undefined') return;
    const { slots } = get();
    const compressed = encodeRosterToUrl(slots, weightMode, filterMode);
    const url = `${window.location.origin}${window.location.pathname}?roster=${compressed}`;

    try {
      await navigator.clipboard.writeText(url);
      set({ copied: true });
      setTimeout(() => set({ copied: false }), 2000);
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  },

  exportCSV: () => {
    const { slots } = get();
    const active = slots.filter((s): s is { rank: number; trainee: Trainee } => s.trainee !== null);
    const headers = ['Rank', 'Name (EN)', 'Name (JP)', 'Turf', 'Dirt', 'Short', 'Mile', 'Medium', 'Long', 'Front', 'Pace', 'Late', 'End'];
    const rows = active.map((s) => [
      s.rank, `"${s.trainee.nameEn}"`, `"${s.trainee.nameJp}"`,
      s.trainee.surface.turf, s.trainee.surface.dirt,
      s.trainee.distance.short, s.trainee.distance.mile,
      s.trainee.distance.medium, s.trainee.distance.long,
      s.trainee.style.front, s.trainee.style.pace,
      s.trainee.style.late, s.trainee.style.end,
    ]);
    const link = document.createElement('a');
    link.href = encodeURI('data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n'));
    link.download = 'umamusume_top50_oshis.csv';
    link.click();
  },
}));
