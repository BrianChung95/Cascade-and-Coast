import { z } from 'zod';
import {
  API_BASE_URL,
  CATEGORY_ENDPOINTS,
  CATEGORY_KEYWORDS,
  MAX_ITEMS_PER_CATEGORY,
  MENU_CATEGORIES
} from '../lib/constants';
import { httpGet } from '../lib/http';
import type { Category, MenuItem } from '../lib/types';

const RawMenuItemSchema = z
  .object({
    id: z.union([z.string(), z.number()]),
    name: z.string().optional(),
    dsc: z.string().optional(),
    price: z.union([z.string(), z.number()]).optional(),
    img: z.string().optional(),
    rate: z.union([z.string(), z.number()]).optional(),
    country: z.string().optional()
  })
  .passthrough();

type RawMenuItem = z.infer<typeof RawMenuItemSchema>;

const PRICE_SANITIZE_REGEX = /[^0-9.]/g;
const FALLBACK_DESCRIPTION = 'Chef-crafted for Cascade & Coast Kitchen guests.';

function matchesCategory(title: string, category: Category): boolean {
  const keywords = CATEGORY_KEYWORDS[category];
  if (!keywords || keywords.length === 0) {
    return true;
  }

  const haystack = title.toLowerCase();
  return keywords.some((keyword) => haystack.includes(keyword));
}

function parsePrice(value: RawMenuItem['price']): number | null {
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : null;
  }

  if (typeof value === 'string') {
    const sanitized = value.replace(PRICE_SANITIZE_REGEX, '');
    const parsed = Number.parseFloat(sanitized);
    return Number.isFinite(parsed) ? parsed : null;
  }

  return null;
}

function isValidImage(url?: string): boolean {
  return Boolean(url && /^https?:\/\//.test(url));
}

function buildDescription(raw: RawMenuItem): string {
  const dish = raw.dsc?.trim();
  const venue = raw.name?.trim();

  if (dish && venue && !venue.toLowerCase().includes(dish.toLowerCase())) {
    return `${dish} from ${venue}.`;
  }

  if (venue) {
    return `Featured by ${venue}.`;
  }

  return FALLBACK_DESCRIPTION;
}

function normalizeMenuItem(raw: RawMenuItem, category: Category): MenuItem | null {
  const title = raw.dsc?.trim() ?? raw.name?.trim();

  if (!title || !matchesCategory(title, category)) {
    return null;
  }

  return {
    id: String(raw.id),
    title,
    description: buildDescription(raw),
    price: parsePrice(raw.price),
    imageUrl: isValidImage(raw.img) ? raw.img : undefined,
    category
  };
}

async function fetchEndpointMenuItems(endpoint: string, category: Category): Promise<MenuItem[]> {
  const payload = await httpGet<unknown>(`${API_BASE_URL}${endpoint}`);
  const parsed = z.array(RawMenuItemSchema).safeParse(payload);

  if (!parsed.success) {
    throw new Error(`Failed to validate menu response for ${category}`);
  }

  const normalized: MenuItem[] = [];
  const seen = new Set<string>();

  for (const item of parsed.data) {
    const normalizedItem = normalizeMenuItem(item, category);
    if (!normalizedItem || seen.has(normalizedItem.id)) {
      continue;
    }

    seen.add(normalizedItem.id);
    normalized.push(normalizedItem);
  }

  return normalized;
}

function dedupe(items: MenuItem[]): MenuItem[] {
  const existing = new Set<string>();
  const unique: MenuItem[] = [];

  for (const item of items) {
    if (existing.has(item.id)) {
      continue;
    }

    existing.add(item.id);
    unique.push(item);
  }

  return unique;
}

async function fetchCategoryMenuItems(category: Category): Promise<MenuItem[]> {
  const endpoints = CATEGORY_ENDPOINTS[category];

  if (!endpoints || endpoints.length === 0) {
    throw new Error(`Unsupported menu category: ${category}`);
  }

  const aggregated: MenuItem[] = [];
  let lastError: unknown;

  for (const endpoint of endpoints) {
    try {
      const items = await fetchEndpointMenuItems(endpoint, category);
      aggregated.push(...items);
    } catch (error) {
      console.warn(`[menu] Failed to load ${endpoint} for ${category}:`, error);
      lastError = error;
    }
  }

  const unique = dedupe(aggregated);
  unique.sort((a, b) => {
    const priceDelta = (a.price ?? Number.POSITIVE_INFINITY) - (b.price ?? Number.POSITIVE_INFINITY);
    if (priceDelta !== 0 && Number.isFinite(priceDelta)) {
      return priceDelta;
    }
    return a.title.localeCompare(b.title);
  });

  const limited = unique.slice(0, MAX_ITEMS_PER_CATEGORY);

  if (limited.length === 0) {
    if (lastError instanceof Error) {
      throw lastError;
    }

    throw new Error(`Menu category ${category} is temporarily unavailable.`);
  }

  return limited;
}

export async function fetchMenuItems(
  categoryOrContext?: Category | 'all' | { queryKey: unknown }
): Promise<MenuItem[]> {
  if (categoryOrContext === 'all') {
    return fetchAllMenuItems();
  }

  if (typeof categoryOrContext === 'string') {
    return fetchCategoryMenuItems(categoryOrContext);
  }

  return fetchAllMenuItems();
}

async function fetchAllMenuItems(): Promise<MenuItem[]> {
  const results = await Promise.all(
    MENU_CATEGORIES.map(async (category) => {
      try {
        return await fetchCategoryMenuItems(category);
      } catch (error) {
        console.warn(`[menu] Category ${category} temporarily unavailable:`, error);
        return [];
      }
    })
  );

  const combined = dedupe(results.flat());

  if (combined.length === 0) {
    throw new Error('Menu data is temporarily unavailable.');
  }

  return combined;
}

export { fetchAllMenuItems, fetchCategoryMenuItems };
