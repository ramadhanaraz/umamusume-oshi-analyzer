import { Trainee } from '../types/trainee';
import { TraineeLedgerEntry, SorterState, Phase3MergeState } from '../types/sorter';

export const P1_QUALIFIER_THRESHOLD = 60; // Target K >= 60 for clean Phase 2 trimming

export function shuffleArray<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/**
 * Dynamically partitions candidates into clusters of primary and secondary sizes with 0 single leftovers[cite: 1].
 */
export function partitionBalanced<T>(array: T[], primarySize: number, secondarySize: number): T[][] {
  const n = array.length;
  let countPri = 0;
  let countSec = 0;
  let solved = false;

  for (let p = Math.floor(n / primarySize); p >= 0; p--) {
    const remainder = n - p * primarySize;
    if (remainder % secondarySize === 0) {
      countPri = p;
      countSec = remainder / secondarySize;
      solved = true;
      break;
    }
  }

  if (!solved) {
    countPri = Math.floor(n / primarySize);
    countSec = 0;
  }

  const groups: T[][] = [];
  let cursor = 0;
  for (let i = 0; i < countPri; i++) {
    groups.push(array.slice(cursor, cursor + primarySize));
    cursor += primarySize;
  }
  for (let i = 0; i < countSec; i++) {
    groups.push(array.slice(cursor, cursor + secondarySize));
    cursor += secondarySize;
  }
  if (cursor < n) {
    if (groups.length > 0) {
      groups[groups.length - 1].push(...array.slice(cursor));
    } else {
      groups.push(array.slice(cursor));
    }
  }
  return groups;
}

export function createInitialLedger(trainees: Trainee[]): Record<string, TraineeLedgerEntry> {
  const ledger: Record<string, TraineeLedgerEntry> = {};
  trainees.forEach((t) => {
    ledger[t.id] = {
      trainee: t,
      p1_qualified: false,
      p1_cycle: 99,
      p1_local_rank: 99,
      p2_r1: 0,
      p2_r2: 0,
      p2_r3: 0,
      p2_total: 0,
      peak: 0,
      sos1: 0,
      sos2: 0,
      opponents: [],
      status: 'Phase 1 Pool',
      finalRank: null,
    };
  });
  return ledger;
}

/**
 * Executes the 7-Layer Deterministic Cascade to rank qualifiers without interrupting the user[cite: 1].
 */
export function execute7LayerCascade(
  qualifiers: Trainee[],
  ledger: Record<string, TraineeLedgerEntry>
): Trainee[] {
  // Deduplicate qualifiers defensively by ID
  const uniqueQualifiers = Array.from(new Map(qualifiers.map((t) => [t.id, t])).values());

  // 1. Calculate Primary SOS (SOS₁)
  uniqueQualifiers.forEach((t) => {
    const entry = ledger[t.id];
    if (entry) {
      entry.sos1 = entry.opponents.reduce((acc, oppId) => acc + (ledger[oppId]?.p2_total || 0), 0);
    }
  });

  // 2. Calculate Extended SOS (SOS₂)
  uniqueQualifiers.forEach((t) => {
    const entry = ledger[t.id];
    if (entry) {
      entry.sos2 = entry.opponents.reduce((acc, oppId) => acc + (ledger[oppId]?.sos1 || 0), 0);
    }
  });

  // 3. Multi-tier deterministic sort[cite: 1]
  return [...uniqueQualifiers].sort((a, b) => {
    const da = ledger[a.id];
    const db = ledger[b.id];

    if (!da || !db) return 0;

    // Layer 1: Phase 2 Total Points (0-6 pts)[cite: 1]
    if (db.p2_total !== da.p2_total) return db.p2_total - da.p2_total;

    // Layer 2: Peak Single-Round Preference (2+0+0 beats 1+1+0)[cite: 1]
    if (db.peak !== da.peak) return db.peak - da.peak;

    // Layer 3: Primary Strength of Schedule (SOS₁)[cite: 1]
    if (db.sos1 !== da.sos1) return db.sos1 - da.sos1;

    // Layer 4: Extended Strength of Schedule (SOS₂)[cite: 1]
    if (db.sos2 !== da.sos2) return db.sos2 - da.sos2;

    // Layer 5: Phase 1 Cycle Weight (Cycle 1 > Cycle 2 > Cycle 3 > Auto-fill)[cite: 1]
    if (da.p1_cycle !== db.p1_cycle) return da.p1_cycle - db.p1_cycle;

    // Layer 6: Intra-Group Phase 1 Tap Priority[cite: 1]
    if (da.p1_local_rank !== db.p1_local_rank) return da.p1_local_rank - db.p1_local_rank;

    // Layer 7: Canonical Database ID Fallback[cite: 1]
    return da.trainee.id.localeCompare(db.trainee.id);
  });
}

/**
 * Initializes the disjoint Phase 3 Bottom-Up Merge Sort state[cite: 1].
 */
export function initPhase3MergeState(contenders15: Trainee[]): Phase3MergeState {
  const uniqueContenders = Array.from(
    new Map(contenders15.map((t) => [t.id, t])).values()
  ).slice(0, 15);

  const listQueue = uniqueContenders.map((t) => [t]);
  const left = listQueue.shift() || null;
  const right = listQueue.shift() || null;

  return {
    listQueue,
    nextLevelQueue: [],
    currentLeft: left,
    currentRight: right,
    leftIdx: 0,
    rightIdx: 0,
    mergedAccumulator: [],
    comparisonsDone: 0,
    totalComparisonsEstimate: 42,
  };
}

export interface MergeStepResult {
  nextState: Phase3MergeState;
  isFinished: boolean;
  sortedResult?: Trainee[];
}

/**
 * Step function for human-in-the-loop pairwise merge sort.
 * Guaranteed to never compare an item against itself or enter an infinite loop[cite: 1].
 */
export function processMergeChoice(
  p3: Phase3MergeState,
  choice: 'LEFT' | 'RIGHT' | 'TIE'
): MergeStepResult {
  const next: Phase3MergeState = {
    ...p3,
    listQueue: [...p3.listQueue],
    nextLevelQueue: [...p3.nextLevelQueue],
    mergedAccumulator: [...p3.mergedAccumulator],
    comparisonsDone: p3.comparisonsDone + 1,
  };

  const leftItem = next.currentLeft![next.leftIdx];
  const rightItem = next.currentRight![next.rightIdx];

  if (choice === 'LEFT') {
    next.mergedAccumulator.push(leftItem);
    next.leftIdx++;
  } else if (choice === 'RIGHT') {
    next.mergedAccumulator.push(rightItem);
    next.rightIdx++;
  } else if (choice === 'TIE') {
    next.mergedAccumulator.push(leftItem, rightItem);
    next.leftIdx++;
    next.rightIdx++;
  }

  const leftExhausted = next.leftIdx >= next.currentLeft!.length;
  const rightExhausted = next.rightIdx >= next.currentRight!.length;

  if (leftExhausted || rightExhausted) {
    // Flush remaining uncompared items from non-exhausted sublist[cite: 1]
    if (!leftExhausted) {
      next.mergedAccumulator.push(...next.currentLeft!.slice(next.leftIdx));
    }
    if (!rightExhausted) {
      next.mergedAccumulator.push(...next.currentRight!.slice(next.rightIdx));
    }

    next.nextLevelQueue.push(next.mergedAccumulator);
    next.currentLeft = null;
    next.currentRight = null;
    next.leftIdx = 0;
    next.rightIdx = 0;
    next.mergedAccumulator = [];

    // Advance queue to find the next pairwise matchup[cite: 1]
    while (next.currentLeft === null) {
      if (next.listQueue.length === 0) {
        next.listQueue = next.nextLevelQueue;
        next.nextLevelQueue = [];
      }

      // Termination Condition: exactly one unified list remaining[cite: 1]
      if (next.listQueue.length === 1 && next.nextLevelQueue.length === 0) {
        return {
          nextState: next,
          isFinished: true,
          sortedResult: next.listQueue[0],
        };
      }

      // Odd leftover carry-forward to the next level[cite: 1]
      if (next.listQueue.length === 1) {
        next.nextLevelQueue.push(next.listQueue.shift()!);
        continue;
      }

      // Pop next two disjoint sublists[cite: 1]
      next.currentLeft = next.listQueue.shift()!;
      next.currentRight = next.listQueue.shift()!;
      next.leftIdx = 0;
      next.rightIdx = 0;
      next.mergedAccumulator = [];
    }
  }

  return {
    nextState: next,
    isFinished: false,
  };
}