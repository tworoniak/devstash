import { describe, it, expect } from 'vitest';
import { formatDate } from './utils';

describe('formatDate', () => {
  it('formats a date as "Mon DD"', () => {
    const date = new Date('2024-03-15T12:00:00Z');
    expect(formatDate(date)).toBe('Mar 15');
  });

  it('formats single-digit days without padding', () => {
    const date = new Date('2024-01-05T12:00:00Z');
    expect(formatDate(date)).toBe('Jan 5');
  });
});
