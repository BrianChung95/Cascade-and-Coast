/**
 * Utility Functions
 *
 * Core helper functions for the application:
 * - Currency formatting
 * - Menu filtering and sorting
 * - Pagination
 * - Type guards and validators
 *
 * These utilities are used primarily in MenuPage.tsx for data transformation. I 
 * know it's not a good practice to include filtering, sorting, and pagination logic
 * in frontend, but just to show a POC I include the logic here.
 */

import type { Category, MenuFilters, MenuItem } from './types';

/**
 * Format price as Canadian currency
 *
 * Examples:
 * - 24.5 → "$24.50"
 * - null → "Market Price"
 * - NaN → "Market Price"
 *
 * Uses Intl.NumberFormat for proper currency formatting (handles decimals, thousands separators)
 */
export function formatCurrency(value: number | null): string {
  if (value === null || Number.isNaN(value)) {
    return 'Market Price';
  }

  return new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency: 'CAD'
  }).format(value);
}

/**
 * Normalize URL query parameter
 *
 * Converts null/undefined/empty strings to undefined for consistent handling
 *
 * Examples:
 * - "burgers" → "burgers"
 * - "  " → undefined (whitespace only)
 * - null → undefined
 * - "" → undefined
 */
export function normalizeQueryParam(value: string | null | undefined): string | undefined {
  if (value === null || value === undefined) {
    return undefined;
  }

  return value.trim().length === 0 ? undefined : value;
}

/**
 * Filter menu items by category and search text
 *
 * Used in MenuPage.tsx filtering pipeline.
 *
 * Category filter: Exact match
 * - If category specified: Only items with matching category
 * - If undefined: All items pass (no filter)
 *
 * Search filter: Multi-field text matching (case-insensitive)
 * - Searches in: title and description
 * - Partial matches: "coastal" matches "Coastal Burger"
 * - If undefined: All items pass (no filter)
 *
 * Both filters must pass (AND logic)
 *
 * Examples:
 * - filterMenuItems(items, { category: 'burgers' })
 *   → Only burgers
 * - filterMenuItems(items, { search: 'coastal' })
 *   → Items with "coastal" in title or description
 * - filterMenuItems(items, { category: 'burgers', search: 'coastal' })
 *   → Burgers with "coastal" in title or description
 */
export function filterMenuItems(items: MenuItem[], filters: MenuFilters): MenuItem[] {
  const { category, search } = filters;
  return items.filter((item) => {
    // Category filter (exact match)
    const matchesCategory = category ? item.category === category : true;

    // Search filter (case-insensitive, searches title and description)
    const matchesSearch = search
      ? `${item.title} ${item.description ?? ''}`
          .toLowerCase()
          .includes(search.toLowerCase())
      : true;

    return matchesCategory && matchesSearch;
  });
}

/**
 * Sort menu items by price
 *
 * Used in MenuPage.tsx sorting pipeline.
 *
 * Sort options:
 * - 'price_asc': Low to high ($12, $14, $16...)
 * - 'price_desc': High to low ($16, $14, $12...)
 * - undefined: No sorting (returns shallow copy in original order)
 *
 * Null price handling:
 * - Items with null prices always sorted to end
 * - Uses POSITIVE_INFINITY so null > any number
 *
 * Important: Creates shallow copy before sorting (immutability)
 *
 * Examples:
 * - sortMenuItems(items, 'price_asc')
 *   → [$12, $14, $16, null, null]
 * - sortMenuItems(items, 'price_desc')
 *   → [$16, $14, $12, null, null]
 * - sortMenuItems(items)
 *   → [original order]
 */
export function sortMenuItems(items: MenuItem[], sort?: MenuFilters['sort']): MenuItem[] {
  if (!sort) {
    return [...items];  // Shallow copy, preserve original order
  }

  const sorted = [...items];  // Shallow copy (don't mutate original)

  const compare = (a: MenuItem, b: MenuItem) => {
    // Use POSITIVE_INFINITY for null prices (sorts them to end)
    const priceA = a.price ?? Number.POSITIVE_INFINITY;
    const priceB = b.price ?? Number.POSITIVE_INFINITY;

    if (sort === 'price_asc') {
      return priceA - priceB;  // Ascending: 12 - 14 = -2 (a comes first)
    }

    if (sort === 'price_desc') {
      return priceB - priceA;  // Descending: 14 - 12 = 2 (b comes first)
    }

    return 0;
  };

  sorted.sort(compare);
  return sorted;
}

/**
 * Paginate items (generic utility works with any array)
 *
 * Used in MenuPage.tsx to show 9 items per page.
 *
 * Examples:
 * - paginateItems([1,2,3,4,5,6,7,8,9,10], 1, 3) → [1,2,3]
 * - paginateItems([1,2,3,4,5,6,7,8,9,10], 2, 3) → [4,5,6]
 * - paginateItems([1,2,3,4,5,6,7,8,9,10], 3, 3) → [7,8,9]
 *
 * @param items - Array to paginate
 * @param page - Page number (1-indexed)
 * @param perPage - Items per page
 */
export function paginateItems<T>(items: T[], page: number, perPage: number): T[] {
  const start = (page - 1) * perPage;  // Page 1 starts at index 0, page 2 at index 9, etc.
  return items.slice(start, start + perPage);
}

/**
 * Type guard: Check if string is valid Category
 *
 * TypeScript type guard narrows type from string to Category
 *
 * Valid categories: burgers, sandwiches, sides, cocktails, beverages, desserts, mains
 *
 * Used in MenuPage.tsx to validate URL parameters:
 * - const category = isCategory(param) ? param : undefined;
 *
 * Examples:
 * - isCategory('burgers') → true (param is Category)
 * - isCategory('invalid') → false (param is still string)
 * - isCategory(null) → false
 */
export function isCategory(value: string | null | undefined): value is Category {
  return Boolean(
    value &&
      ['burgers', 'sandwiches', 'sides', 'cocktails', 'beverages', 'desserts', 'mains'].includes(
        value
      )
  );
}

/**
 * Parse and validate page number from URL parameter
 *
 * Ensures page is always a valid positive integer
 *
 * Examples:
 * - parsePageParam('2') → 2
 * - parsePageParam('abc') → 1 (default)
 * - parsePageParam('-5') → 1 (must be positive)
 * - parsePageParam('3.7') → 3 (floors decimals)
 * - parsePageParam(null) → 1 (default)
 *
 * Used in MenuPage.tsx to safely parse ?page=2 from URL
 */
export function parsePageParam(value: string | null): number {
  const parsed = Number(value ?? '1');
  return Number.isFinite(parsed) && parsed > 0 ? Math.floor(parsed) : 1;
}
