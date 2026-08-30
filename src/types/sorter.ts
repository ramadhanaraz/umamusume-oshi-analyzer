import { Trainee } from './trainee';

export type SorterPhase = 'intro' | 1 | 2 | 3 | 'results';

export interface TraineeLedgerEntry {
  trainee: Trainee;
  p1_qualified: boolean;
  p1_cycle: number;
  p1_local_rank: number;
  p2_r1: number;
  p2_r2: number;
  p2_r3: number;
  p2_total: number;
  peak: number;
  sos1: number;
  sos2: number;
  opponents: string[];
  status: string;
  finalRank: number | null;
}

export interface Phase3MergeState {
  listQueue: Trainee[][];
  nextLevelQueue: Trainee[][];
  currentLeft: Trainee[] | null;
  currentRight: Trainee[] | null;
  leftIdx: number;
  rightIdx: number;
  mergedAccumulator: Trainee[];
  comparisonsDone: number;
  totalComparisonsEstimate: number;
}

export interface SorterState {
  phase: SorterPhase;
  ledger: Record<string, TraineeLedgerEntry>;
  p1_cycle: number;
  p1_pool: Trainee[];
  p1_qualifiers: Trainee[];
  p1_groups: Trainee[][];
  p1_idx: number;
  p1_current_picks: string[];
  p2_qualifiers: Trainee[];
  p2_round: number;
  p2_groups: Trainee[][];
  p2_idx: number;
  p2_current_picks: { first: string | null; second: string | null };
  p3: Phase3MergeState;
  tier1: Trainee[];
  tier2: Trainee[];
  tier3: Trainee[];
  tier4: Trainee[];
}