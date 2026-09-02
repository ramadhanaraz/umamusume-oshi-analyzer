import { describe, it, expect } from 'vitest';
import { calculateAnalysis, getRankWeight } from '../calculator';
import { TRAINEES } from '../../data/trainees';

describe('Calculator Utilities', () => {
  it('calculates correct rank weights', () => {
    expect(getRankWeight(1, 'tiered')).toBe(4.0);
    expect(getRankWeight(10, 'tiered')).toBe(2.5);
    expect(getRankWeight(20, 'tiered')).toBe(1.5);
    expect(getRankWeight(35, 'tiered')).toBe(1.0);

    expect(getRankWeight(1, 'equal')).toBe(1.0);
    expect(getRankWeight(50, 'equal')).toBe(1.0);

    expect(getRankWeight(1, 'linear')).toBe(50);
    expect(getRankWeight(50, 'linear')).toBe(1);
  });

  it('calculates empty analysis correctly', () => {
    const emptySlots = Array.from({ length: 50 }, (_, i) => ({ rank: i + 1, trainee: null }));
    const result = calculateAnalysis(emptySlots);

    expect(result.activeCount).toBe(0);
    expect(result.turfCount).toBe(0);
    expect(result.dirtCount).toBe(0);
    expect(result.archetype.badge).toContain('Stable Initializing');
  });

  it('calculates active roster analysis correctly', () => {
    const slots = Array.from({ length: 50 }, (_, i) => ({
      rank: i + 1,
      trainee: i < 2 ? TRAINEES[i] : null,
    }));
    const result = calculateAnalysis(slots, 'global', 'tiered', 'aOnly');

    expect(result.activeCount).toBe(2);
    expect(result.turfCount).toBeGreaterThan(0);
  });
});
