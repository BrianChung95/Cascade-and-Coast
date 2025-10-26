import { describe, expect, it } from 'vitest';
import {
  filterMenuItems,
  formatCurrency,
  paginateItems,
  parsePageParam,
  sortMenuItems,
  isCategory,
  normalizeQueryParam
} from '../../../src/lib/utils';
import type { MenuItem } from '../../../src/lib/types';

describe('utils', () => {
  const items: MenuItem[] = [
    {
      id: '1',
      title: 'Seawall Burger',
      description: 'Smoked cheddar, crispy onions, garlic aioli.',
      price: 23,
      category: 'burgers'
    },
    {
      id: '2',
      title: 'Granville Greens',
      description: 'Organic kale, citrus segments, toasted almonds.',
      price: 19,
      category: 'sides'
    },
    {
      id: '3',
      title: 'Coal Harbour Old Fashioned',
      description: 'Maple, bitters, barrel-aged rye.',
      price: 17,
      category: 'beverages'
    }
  ];

  it('formats currency and handles null gracefully', () => {
    expect(formatCurrency(25)).toBe('$25.00');
    expect(formatCurrency(null)).toBe('Market Price');
  });

  it('filters items by category and search keyword', () => {
    const filtered = filterMenuItems(items, { category: 'burgers', search: 'smoked' });
    expect(filtered).toHaveLength(1);
    expect(filtered[0].id).toBe('1');
  });

  it('sorts items by price ascending and descending', () => {
    const asc = sortMenuItems(items, 'price_asc');
    const desc = sortMenuItems(items, 'price_desc');
    expect(asc[0].id).toBe('3');
    expect(desc[0].id).toBe('1');
  });

  it('paginates items with a default window', () => {
    const page = paginateItems(items, 2, 2);
    expect(page).toHaveLength(1);
    expect(page[0].id).toBe('3');
  });

  it('validates category strings and parses page parameters', () => {
    expect(isCategory('burgers')).toBe(true);
    expect(isCategory('pizza')).toBe(false);
    expect(parsePageParam('3')).toBe(3);
    expect(parsePageParam('-5')).toBe(1);
  });

  it('normalizes query params without stripping interior whitespace', () => {
    expect(normalizeQueryParam('  ')).toBeUndefined();
    expect(normalizeQueryParam(' salmon ')).toBe(' salmon ');
  });
});
