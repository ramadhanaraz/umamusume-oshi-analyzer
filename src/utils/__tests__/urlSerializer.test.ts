import { describe, it, expect } from 'vitest';
import { encodeRosterToUrl, decodeRosterFromUrl } from '../urlSerializer';
import { TRAINEES } from '../../data/trainees';

describe('URL Serializer', () => {
  it('encodes and decodes a roster correctly', () => {
    const slots = Array.from({ length: 50 }, (_, i) => ({
      rank: i + 1,
      trainee: i < 3 ? TRAINEES[i] : null,
    }));

    const encoded = encodeRosterToUrl(slots, 'tiered', 'aOnly');
    expect(typeof encoded).toBe('string');
    expect(encoded.length).toBeGreaterThan(0);

    const decoded = decodeRosterFromUrl(encoded, TRAINEES);
    expect(decoded).not.toBeNull();
    expect(decoded.weightMode).toBe('tiered');
    expect(decoded.filterMode).toBe('aOnly');
    expect(decoded.trainees.length).toBe(50);
    expect(decoded.trainees[0]?.id).toBe(TRAINEES[0].id);
    expect(decoded.trainees[1]?.id).toBe(TRAINEES[1].id);
    expect(decoded.trainees[2]?.id).toBe(TRAINEES[2].id);
    expect(decoded.trainees[3]).toBeNull();
  });

  it('handles invalid or empty serialized string gracefully', () => {
    const emptyResult = decodeRosterFromUrl('', TRAINEES);
    expect(emptyResult.trainees).toEqual([]);

    const invalidResult = decodeRosterFromUrl('invalid-compressed-data!!!', TRAINEES);
    expect(invalidResult.trainees).toEqual([]);
  });
});
