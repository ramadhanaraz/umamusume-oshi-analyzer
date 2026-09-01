import { describe, it, expect } from 'vitest';
import {
  shuffleArray,
  partitionBalanced,
  createInitialLedger,
  execute7LayerCascade,
  initPhase3MergeState,
  processMergeChoice,
} from '../sorterEngine';
import { TRAINEES } from '../../data/trainees';

describe('Sorter Engine Logic', () => {
  it('shuffles arrays correctly', () => {
    const original = TRAINEES.slice(0, 10);
    const shuffled = shuffleArray(original);
    expect(shuffled.length).toBe(10);
    expect(shuffled).toContain(original[0]);
  });

  it('partitions candidates in balanced groups', () => {
    const sample = Array.from({ length: 15 }, (_, i) => i);
    const groups = partitionBalanced(sample, 5, 4);
    expect(groups.length).toBe(3);
    expect(groups.flat().length).toBe(15);
  });

  it('creates initial ledger', () => {
    const ledger = createInitialLedger(TRAINEES.slice(0, 5));
    expect(Object.keys(ledger).length).toBe(5);
    expect(ledger[TRAINEES[0].id].status).toBe('Phase 1 Pool');
  });

  it('executes 7-layer cascade sort', () => {
    const qualifiers = TRAINEES.slice(0, 5);
    const ledger = createInitialLedger(qualifiers);
    ledger[qualifiers[0].id].p2_total = 6;
    ledger[qualifiers[1].id].p2_total = 4;

    const ranked = execute7LayerCascade(qualifiers, ledger);
    expect(ranked[0].id).toBe(qualifiers[0].id);
    expect(ranked[1].id).toBe(qualifiers[1].id);
  });

  it('handles Phase 3 merge state initialization and choices', () => {
    const contenders = TRAINEES.slice(0, 15);
    const p3 = initPhase3MergeState(contenders);
    expect(p3.currentLeft).not.toBeNull();
    expect(p3.currentRight).not.toBeNull();

    const result = processMergeChoice(p3, 'LEFT');
    expect(result.nextState.comparisonsDone).toBe(1);
  });
});
