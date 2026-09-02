import { describe, it, expect } from 'vitest';
import { StaticTraineeRepository } from '../traineeRepository';
import { TRAINEES } from '../../data/trainees';

describe('Trainee Repository Layer', () => {
  const repo = new StaticTraineeRepository();

  it('fetches all trainees', async () => {
    const list = await repo.getAllTrainees();
    expect(list.length).toBe(TRAINEES.length);
  });

  it('fetches trainee by ID', async () => {
    const trainee = await repo.getTraineeById('special-week');
    expect(trainee).not.toBeNull();
    expect(trainee?.nameEn).toBe('Special Week');
  });

  it('searches trainees by name/id', async () => {
    const results = await repo.searchTrainees('silence');
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].id).toBe('silence-suzuka');
  });

  it('provides portrait URL fallback', () => {
    const fallback = repo.getPortraitUrl(undefined);
    expect(fallback).toBe('/images/trainees/default.jpg');
  });
});
