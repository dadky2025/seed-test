import { describe, expect, it } from 'vitest';
import { sortByRecent, type Item } from './items';

const older: Item = { id: 'a', title: 'Older', updatedAt: new Date('2026-01-01T10:00:00Z') };
const newer: Item = { id: 'b', title: 'Newer', updatedAt: new Date('2026-03-01T10:00:00Z') };
const newest: Item = { id: 'c', title: 'Newest', updatedAt: new Date('2026-06-01T10:00:00Z') };

describe('sortByRecent', () => {
  it('orders items by update date, most recent first', () => {
    expect(sortByRecent([older, newest, newer]).map((item) => item.id)).toEqual(['c', 'b', 'a']);
  });

  it('does not mutate its input', () => {
    const input = [older, newest, newer];
    sortByRecent(input);
    expect(input.map((item) => item.id)).toEqual(['a', 'c', 'b']);
  });
});
