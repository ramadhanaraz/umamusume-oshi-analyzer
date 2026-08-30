'use client';

import React, { useState, useEffect, useRef } from 'react';
import { RotateCcw } from 'lucide-react';
import { Trainee, TerminologyMode } from '../../types/trainee';
import { SorterState, Phase3MergeState } from '../../types/sorter';
import {
  shuffleArray,
  partitionBalanced,
  createInitialLedger,
  execute7LayerCascade,
  initPhase3MergeState,
  P1_QUALIFIER_THRESHOLD,
} from '../../utils/sorterEngine';
import { ConfirmModal } from '../modals/ConfirmModal';
import { SorterIntro } from './sorter/SorterIntro';
import { Phase1Triage } from './sorter/Phase1Triage';
import { Phase2Swiss } from './sorter/Phase2Swiss';
import { Phase3Arena } from './sorter/Phase3Arena';
import { SorterResults } from './sorter/SorterResults';

const SORTER_STORAGE_KEY = 'umamusume-top50-sorter-session';

interface SorterViewProps {
  trainees: Trainee[];
  mode: TerminologyMode;
  activeCount?: number;
  onApplyRoster: (sortedTrainees: Trainee[]) => void;
}

const createDefaultState = (trainees: Trainee[]): SorterState => {
  const initialLedger = createInitialLedger(trainees);
  const shuffledPool = shuffleArray(trainees);
  const groups = partitionBalanced(shuffledPool, 5, 4);

  return {
    phase: 1,
    ledger: initialLedger,
    p1_cycle: 1,
    p1_pool: shuffledPool,
    p1_qualifiers: [],
    p1_groups: groups,
    p1_idx: 0,
    p1_current_picks: [],
    p2_qualifiers: [],
    p2_round: 1,
    p2_groups: [],
    p2_idx: 0,
    p2_current_picks: { first: null, second: null },
    p3: {
      listQueue: [],
      nextLevelQueue: [],
      currentLeft: null,
      currentRight: null,
      leftIdx: 0,
      rightIdx: 0,
      mergedAccumulator: [],
      comparisonsDone: 0,
      totalComparisonsEstimate: 42,
    },
    tier1: [],
    tier2: [],
    tier3: [],
    tier4: [],
  };
};

export const SorterView: React.FC<SorterViewProps> = ({
  trainees,
  mode,
  activeCount = 0,
  onApplyRoster,
}) => {
  const [state, setState] = useState<SorterState>(() => createDefaultState(trainees));
  const [p3History, setP3History] = useState<Phase3MergeState[]>([]);
  const [isViewingIntro, setIsViewingIntro] = useState(true);
  const [hasSavedSession, setHasSavedSession] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [showOverwriteModal, setShowOverwriteModal] = useState(false);
  const [pendingRosterToApply, setPendingRosterToApply] = useState<Trainee[] | null>(null);
  const isHydratedRef = useRef(false);

  // ----------------------------------------------------------------
  // 1. Initial Hydration: Detect In-Progress Session
  // ----------------------------------------------------------------
  useEffect(() => {
    if (isHydratedRef.current) return;

    try {
      const saved = localStorage.getItem(SORTER_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.state && parsed.state.phase) {
          setState(parsed.state);
          setHasSavedSession(true);
          if (Array.isArray(parsed.p3History)) {
            setP3History(parsed.p3History);
          }
        }
      }
    } catch (e) {
      console.error('Failed to restore sorter session from LocalStorage:', e);
    }

    isHydratedRef.current = true;
  }, []);

  // ----------------------------------------------------------------
  // 2. Auto-Save Session to LocalStorage
  // ----------------------------------------------------------------
  useEffect(() => {
    if (!isHydratedRef.current) return;

    try {
      if (!isViewingIntro) {
        localStorage.setItem(
          SORTER_STORAGE_KEY,
          JSON.stringify({
            state,
            p3History,
            timestamp: Date.now(),
          })
        );
        setHasSavedSession(true);
      }
    } catch (e) {
      console.error('Failed to save sorter session to LocalStorage:', e);
    }
  }, [state, p3History, isViewingIntro]);

  // ----------------------------------------------------------------
  // SESSION CONTROLS
  // ----------------------------------------------------------------
  const handleStartFresh = () => {
    const freshState = createDefaultState(trainees);
    localStorage.removeItem(SORTER_STORAGE_KEY);
    setState(freshState);
    setP3History([]);
    setHasSavedSession(false);
    setIsViewingIntro(false);
  };

  const handleContinueSession = () => {
    setIsViewingIntro(false);
  };

  const handleRequestReset = () => {
    setShowResetModal(true);
  };

  const executeReset = () => {
    localStorage.removeItem(SORTER_STORAGE_KEY);
    setState(createDefaultState(trainees));
    setP3History([]);
    setHasSavedSession(false);
    setIsViewingIntro(true);
    setShowResetModal(false);
  };

  const handleApplyRosterAttempt = (selected50: Trainee[]) => {
    if (activeCount > 0) {
      setPendingRosterToApply(selected50);
      setShowOverwriteModal(true);
    } else {
      finalizeApply(selected50);
    }
  };

  const finalizeApply = (rosterToApply: Trainee[]) => {
    localStorage.removeItem(SORTER_STORAGE_KEY);
    onApplyRoster(rosterToApply);
    setShowOverwriteModal(false);
    setPendingRosterToApply(null);
  };

  const getSessionSummaryText = () => {
    if (state.phase === 1) {
      return `Phase 1: Quick Instinct Picks (Group ${state.p1_idx + 1} of ${state.p1_groups.length})`;
    }
    if (state.phase === 2) {
      return `Phase 2: Group Showdowns (Round ${state.p2_round}/3 • Group ${state.p2_idx + 1} of ${state.p2_groups.length})`;
    }
    if (state.phase === 3) {
      return `Phase 3: Championship Duels (${state.p3.comparisonsDone + 1} of ~${state.p3.totalComparisonsEstimate})`;
    }
    if (state.phase === 'results') {
      return 'Results Review & Finalizing';
    }
    return 'Active Matchmaker In Progress';
  };

  // ----------------------------------------------------------------
  // PHASE 1 HANDLERS
  // ----------------------------------------------------------------
  const handleP1Toggle = (id: string) => {
    setState((prev) => {
      const current = [...prev.p1_current_picks];
      const idx = current.indexOf(id);
      const group = prev.p1_groups[prev.p1_idx];
      const maxPicks = group.length === 5 ? 3 : 2;

      if (idx > -1) {
        current.splice(idx, 1);
      } else {
        if (current.length >= maxPicks) return prev;
        current.push(id);
      }
      return { ...prev, p1_current_picks: current };
    });
  };

  const handleP1ConfirmGroup = () => {
    setState((prev) => {
      const updatedLedger = { ...prev.ledger };
      const newQualifiers = [...prev.p1_qualifiers];

      prev.p1_current_picks.forEach((id, tapIdx) => {
        if (updatedLedger[id]) {
          updatedLedger[id].p1_qualified = true;
          updatedLedger[id].p1_cycle = prev.p1_cycle;
          updatedLedger[id].p1_local_rank = tapIdx + 1;
          updatedLedger[id].status = `P2 Qualifier (C${prev.p1_cycle})`;
          newQualifiers.push(updatedLedger[id].trainee);
        }
      });

      const nextIdx = prev.p1_idx + 1;

      if (nextIdx < prev.p1_groups.length) {
        return {
          ...prev,
          ledger: updatedLedger,
          p1_qualifiers: newQualifiers,
          p1_idx: nextIdx,
          p1_current_picks: [],
        };
      }

      if (newQualifiers.length >= P1_QUALIFIER_THRESHOLD) {
        return startPhase2(newQualifiers, updatedLedger);
      }

      const unpicked = trainees.filter((t) => !updatedLedger[t.id].p1_qualified);

      if (prev.p1_cycle === 1) {
        const nextPool = shuffleArray(unpicked);
        return {
          ...prev,
          ledger: updatedLedger,
          p1_cycle: 2,
          p1_pool: nextPool,
          p1_qualifiers: newQualifiers,
          p1_groups: partitionBalanced(nextPool, 5, 4),
          p1_idx: 0,
          p1_current_picks: [],
        };
      }

      if (prev.p1_cycle === 2) {
        const nextPool = shuffleArray(unpicked);
        return {
          ...prev,
          ledger: updatedLedger,
          p1_cycle: 3,
          p1_pool: nextPool,
          p1_qualifiers: newQualifiers,
          p1_groups: partitionBalanced(nextPool, 5, 4),
          p1_idx: 0,
          p1_current_picks: [],
        };
      }

      const deficit = P1_QUALIFIER_THRESHOLD - newQualifiers.length;
      const autoFills = shuffleArray(unpicked).slice(0, deficit);
      autoFills.forEach((t) => {
        updatedLedger[t.id].p1_qualified = true;
        updatedLedger[t.id].p1_cycle = 4;
        updatedLedger[t.id].p1_local_rank = 99;
        newQualifiers.push(t);
      });

      return startPhase2(newQualifiers, updatedLedger);
    });
  };

  // ----------------------------------------------------------------
  // PHASE 2 HANDLERS
  // ----------------------------------------------------------------
  function startPhase2(qualifiers: Trainee[], ledger: Record<string, any>): SorterState {
    const shuffled = shuffleArray(qualifiers);
    const groups = partitionBalanced(shuffled, 3, 4);

    return {
      ...state,
      phase: 2,
      ledger,
      p2_qualifiers: qualifiers,
      p2_round: 1,
      p2_groups: groups,
      p2_idx: 0,
      p2_current_picks: { first: null, second: null },
    };
  }

  const handleP2Pick = (id: string) => {
    setState((prev) => {
      const picks = { ...prev.p2_current_picks };
      if (picks.first === id) picks.first = null;
      else if (picks.second === id) picks.second = null;
      else if (!picks.first) picks.first = id;
      else if (!picks.second) picks.second = id;
      return { ...prev, p2_current_picks: picks };
    });
  };

  const handleP2ConfirmCluster = () => {
    setState((prev) => {
      const updatedLedger = { ...prev.ledger };
      const { first, second } = prev.p2_current_picks;
      const r = prev.p2_round;
      const currentGroup = prev.p2_groups[prev.p2_idx];

      currentGroup.forEach((t) => {
        const opps = currentGroup.filter((o) => o.id !== t.id).map((o) => o.id);
        updatedLedger[t.id].opponents.push(...opps);
      });

      if (first && updatedLedger[first]) {
        if (r === 1) updatedLedger[first].p2_r1 += 2;
        else if (r === 2) updatedLedger[first].p2_r2 += 2;
        else if (r === 3) updatedLedger[first].p2_r3 += 2;
      }
      if (second && updatedLedger[second]) {
        if (r === 1) updatedLedger[second].p2_r1 += 1;
        else if (r === 2) updatedLedger[second].p2_r2 += 1;
        else if (r === 3) updatedLedger[second].p2_r3 += 1;
      }

      prev.p2_qualifiers.forEach((t) => {
        const d = updatedLedger[t.id];
        d.p2_total = d.p2_r1 + d.p2_r2 + d.p2_r3;
        d.peak = Math.max(d.p2_r1, d.p2_r2, d.p2_r3);
      });

      const nextClusterIdx = prev.p2_idx + 1;

      if (nextClusterIdx < prev.p2_groups.length) {
        return {
          ...prev,
          ledger: updatedLedger,
          p2_idx: nextClusterIdx,
          p2_current_picks: { first: null, second: null },
        };
      }

      if (prev.p2_round < 3) {
        const nextShuffled = shuffleArray(prev.p2_qualifiers);
        return {
          ...prev,
          ledger: updatedLedger,
          p2_round: prev.p2_round + 1,
          p2_groups: partitionBalanced(nextShuffled, 3, 4),
          p2_idx: 0,
          p2_current_picks: { first: null, second: null },
        };
      }

      const ranked = execute7LayerCascade(prev.p2_qualifiers, updatedLedger);
      const top15 = ranked.slice(0, 15);
      const tier3 = ranked.slice(15, 30);
      const tier4 = ranked.slice(30, 50);
      const phase3State = initPhase3MergeState(top15);

      return {
        ...prev,
        phase: 3,
        ledger: updatedLedger,
        tier3,
        tier4,
        p3: phase3State,
      };
    });
  };

  // ----------------------------------------------------------------
  // PHASE 3 MERGE DUEL HANDLERS
  // ----------------------------------------------------------------
  const handleP3Choice = (choice: 'LEFT' | 'RIGHT' | 'TIE') => {
    setState((prev) => {
      setP3History((h) => [...h, JSON.parse(JSON.stringify(prev.p3))]);

      const p3: Phase3MergeState = {
        ...prev.p3,
        listQueue: prev.p3.listQueue.map((list) => [...list]),
        nextLevelQueue: prev.p3.nextLevelQueue.map((list) => [...list]),
        currentLeft: prev.p3.currentLeft ? [...prev.p3.currentLeft] : null,
        currentRight: prev.p3.currentRight ? [...prev.p3.currentRight] : null,
        mergedAccumulator: [...prev.p3.mergedAccumulator],
        comparisonsDone: prev.p3.comparisonsDone + 1,
      };

      if (!p3.currentLeft || !p3.currentRight) return prev;

      const leftItem = p3.currentLeft[p3.leftIdx];
      const rightItem = p3.currentRight[p3.rightIdx];

      if (choice === 'LEFT') {
        p3.mergedAccumulator.push(leftItem);
        p3.leftIdx++;
      } else if (choice === 'RIGHT') {
        p3.mergedAccumulator.push(rightItem);
        p3.rightIdx++;
      } else if (choice === 'TIE') {
        p3.mergedAccumulator.push(leftItem, rightItem);
        p3.leftIdx++;
        p3.rightIdx++;
      }

      const leftExhausted = p3.leftIdx >= p3.currentLeft.length;
      const rightExhausted = p3.rightIdx >= p3.currentRight.length;

      if (leftExhausted || rightExhausted) {
        if (!leftExhausted) {
          p3.mergedAccumulator.push(...p3.currentLeft.slice(p3.leftIdx));
        }
        if (!rightExhausted) {
          p3.mergedAccumulator.push(...p3.currentRight.slice(p3.rightIdx));
        }

        p3.nextLevelQueue.push(p3.mergedAccumulator);
        p3.currentLeft = null;
        p3.currentRight = null;
        p3.leftIdx = 0;
        p3.rightIdx = 0;
        p3.mergedAccumulator = [];

        while (p3.currentLeft === null) {
          if (p3.listQueue.length === 0) {
            p3.listQueue = p3.nextLevelQueue;
            p3.nextLevelQueue = [];
          }

          if (p3.listQueue.length === 1 && p3.nextLevelQueue.length === 0) {
            const sorted15 = p3.listQueue[0];
            return {
              ...prev,
              phase: 'results',
              tier1: sorted15.slice(0, 5),
              tier2: sorted15.slice(5, 15),
            };
          }

          if (p3.listQueue.length === 1) {
            p3.nextLevelQueue.push(p3.listQueue.shift()!);
            continue;
          }

          p3.currentLeft = p3.listQueue.shift()!;
          p3.currentRight = p3.listQueue.shift()!;
          p3.leftIdx = 0;
          p3.rightIdx = 0;
          p3.mergedAccumulator = [];
        }
      }

      return { ...prev, p3 };
    });
  };

  const handleP3Undo = () => {
    if (p3History.length === 0) return;
    const last = p3History[p3History.length - 1];
    setP3History((h) => h.slice(0, -1));
    setState((prev) => ({ ...prev, p3: last }));
  };

  return (
    <div className="max-w-6xl w-full mx-auto space-y-6">
      {/* 1. Intro View */}
      {isViewingIntro && (
        <SorterIntro
          totalTrainees={trainees.length}
          hasActiveSession={hasSavedSession}
          activeSessionSummary={getSessionSummaryText()}
          onStart={handleStartFresh}
          onContinue={handleContinueSession}
          onStartOver={handleRequestReset}
        />
      )}

      {/* 2. Active Matchmaker Views */}
      {!isViewingIntro && (
        <>
          {/* Top Status & Exit Bar */}
          <div className="flex items-center justify-between bg-slate-950/40 p-3 rounded-2xl border border-slate-800/80 text-xs">
            <div className="flex items-center gap-2 text-slate-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>
                Session auto-saved •{' '}
                {state.phase === 1 && 'Phase 1: Quick Instinct Picks'}
                {state.phase === 2 && `Phase 2: Group Showdowns (Round ${state.p2_round}/3)`}
                {state.phase === 3 && 'Phase 3: Championship Duels'}
                {state.phase === 'results' && 'Results Review'}
              </span>
            </div>

            <button
              type="button"
              onClick={handleRequestReset}
              className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-rose-950/40 border border-slate-800 hover:border-rose-500/40 text-slate-400 hover:text-rose-300 font-bold transition-all flex items-center gap-1.5 active:scale-95 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset & Exit</span>
            </button>
          </div>

          {/* Phase 1 View */}
          {state.phase === 1 && (
            <Phase1Triage
              group={state.p1_groups[state.p1_idx] || []}
              currentPicks={state.p1_current_picks}
              cycle={state.p1_cycle}
              groupIdx={state.p1_idx}
              totalGroups={state.p1_groups.length}
              totalQualified={state.p1_qualifiers.length}
              mode={mode}
              onTogglePick={handleP1Toggle}
              onConfirmGroup={handleP1ConfirmGroup}
            />
          )}

          {/* Phase 2 View */}
          {state.phase === 2 && (
            <Phase2Swiss
              group={state.p2_groups[state.p2_idx] || []}
              currentPicks={state.p2_current_picks}
              round={state.p2_round}
              clusterIdx={state.p2_idx}
              totalClusters={state.p2_groups.length}
              totalQualifiers={state.p2_qualifiers.length}
              mode={mode}
              onPick={handleP2Pick}
              onConfirmCluster={handleP2ConfirmCluster}
            />
          )}

          {/* Phase 3 View */}
          {state.phase === 3 && state.p3.currentLeft && state.p3.currentRight && (
            <Phase3Arena
              left={state.p3.currentLeft[state.p3.leftIdx]}
              right={state.p3.currentRight[state.p3.rightIdx]}
              comparisonsDone={state.p3.comparisonsDone}
              totalEstimate={state.p3.totalComparisonsEstimate}
              mode={mode}
              onChoose={handleP3Choice}
              onUndo={handleP3Undo}
              canUndo={p3History.length > 0}
            />
          )}

          {/* Results View */}
          {state.phase === 'results' && (
            <SorterResults
              tier1={state.tier1}
              tier2={state.tier2}
              tier3={state.tier3}
              tier4={state.tier4}
              mode={mode}
              onApplyToRoster={handleApplyRosterAttempt}
              onRestart={handleRequestReset}
            />
          )}
        </>
      )}

      {/* 1. Modal: Reset / Discard In-Progress Run or Results */}
      <ConfirmModal
        isOpen={showResetModal}
        title={
          state.phase === 'results'
            ? 'Discard Results & Run Sorter Again?'
            : 'Start Over & Discard Progress?'
        }
        description={
          state.phase === 'results'
            ? 'Are you sure you want to run the sorter again? Your Top 50 crowned oshis will be discarded and you will return to the setup screen.'
            : 'Are you sure you want to abandon the current tournament? Your active matchmaker session and all unapplied rankings will be permanently reset.'
        }
        confirmLabel={state.phase === 'results' ? 'Yes, Run Again' : 'Yes, Start Over'}
        cancelLabel={state.phase === 'results' ? 'Cancel & Keep Results' : 'Cancel & Keep Session'}
        variant="warning"
        onConfirm={executeReset}
        onClose={() => setShowResetModal(false)}
      />

      {/* 2. Modal: Overwrite Non-Empty Active Roster */}
      <ConfirmModal
        isOpen={showOverwriteModal}
        title="Overwrite Existing Top 50 Roster?"
        description={`You currently have ${activeCount} trainee${activeCount > 1 ? 's' : ''} assigned in your Top 50 list. Applying this oshi ranking will replace your existing oshi roster. Do you want to proceed?`}
        confirmLabel="Yes, Overwrite Roster"
        cancelLabel="Cancel & Review List"
        variant="warning"
        onConfirm={() => {
          if (pendingRosterToApply) {
            finalizeApply(pendingRosterToApply);
          }
        }}
        onClose={() => {
          setShowOverwriteModal(false);
          setPendingRosterToApply(null);
        }}
      />
    </div>
  );
};