import type { Category, MenuFilters, MenuItem } from './types';

export function formatCurrency(value: number | null): string {
  if (value === null || Number.isNaN(value)) {
    return 'Market Price';
  }

  return new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency: 'CAD'
  }).format(value);
}

export function normalizeQueryParam(value: string | null | undefined): string | undefined {
  if (value === null || value === undefined) {
    return undefined;
  }

  return value.trim().length === 0 ? undefined : value;
}

export function filterMenuItems(items: MenuItem[], filters: MenuFilters): MenuItem[] {
  const { category, search } = filters;
  return items.filter((item) => {
    const matchesCategory = category ? item.category === category : true;
    const matchesSearch = search
      ? `${item.title} ${item.description ?? ''}`
          .toLowerCase()
          .includes(search.toLowerCase())
      : true;
    return matchesCategory && matchesSearch;
  });
}

export function sortMenuItems(items: MenuItem[], sort?: MenuFilters['sort']): MenuItem[] {
  if (!sort) {
    return [...items];
  }

  const sorted = [...items];
  const compare = (a: MenuItem, b: MenuItem) => {
    const priceA = a.price ?? Number.POSITIVE_INFINITY;
    const priceB = b.price ?? Number.POSITIVE_INFINITY;

    if (sort === 'price_asc') {
      return priceA - priceB;
    }

    if (sort === 'price_desc') {
      return priceB - priceA;
    }

    return 0;
  };

  sorted.sort(compare);
  return sorted;
}

export function paginateItems<T>(items: T[], page: number, perPage: number): T[] {
  const start = (page - 1) * perPage;
  return items.slice(start, start + perPage);
}

export function isCategory(value: string | null | undefined): value is Category {
  return Boolean(
    value &&
      ['burgers', 'sandwiches', 'sides', 'cocktails', 'beverages', 'desserts', 'mains'].includes(
        value
      )
  );
}

export function parsePageParam(value: string | null): number {
  const parsed = Number(value ?? '1');
  return Number.isFinite(parsed) && parsed > 0 ? Math.floor(parsed) : 1;
}
