/**
 * Menu Service
 *
 * Handles fetching menu data from external API, normalizing it to our format,
 * and managing category-based filtering.
 *
 * Data Flow:
 * 1. Fetch raw data from API endpoints (burgers, drinks, steaks, etc.)
 * 2. Validate with Zod schema
 * 3. Normalize to MenuItem format (clean prices, validate images, etc.)
 * 4. Filter by category keywords (e.g., "old fashioned" → cocktails)
 * 5. Deduplicate items
 * 6. Sort by price and name
 * 7. Limit to MAX_ITEMS_PER_CATEGORY (9 per category)
 *
 * Error Handling:
 * - Individual category failures are logged but don't stop other categories
 * - Only throws error if ALL categories fail
 * - Graceful degradation (some data is better than no data)
 */

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

/**
 * Zod Schema for Raw API Response
 *
 * The external API returns inconsistent data formats:
 * - IDs can be strings or numbers
 * - Prices can be "$24.50" or 24.5
 * - Some fields are optional
 *
 * This schema validates and normalizes the data before processing.
 */
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

/**
 * Check if item title matches category keywords
 *
 * Example: "Maple Old Fashioned" contains "old fashioned" → matches cocktails
 *
 * This allows items from generic endpoints (like /drinks) to be categorized
 * into either cocktails or beverages based on keywords.
 */
function matchesCategory(title: string, category: Category): boolean {
  const keywords = CATEGORY_KEYWORDS[category];
  if (!keywords || keywords.length === 0) {
    return true;
  }

  const haystack = title.toLowerCase();
  return keywords.some((keyword) => haystack.includes(keyword));
}

/**
 * Parse price from various formats
 *
 * Handles:
 * - Numbers: 24.5 → 24.5
 * - Strings with $: "$24.50" → 24.5
 * - Invalid values: "N/A" → null
 */
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

/**
 * Validate image URL
 *
 * Only accept http/https URLs, reject relative paths or invalid URLs
 */
function isValidImage(url?: string): boolean {
  return Boolean(url && /^https?:\/\//.test(url));
}

/**
 * Build user-friendly description from raw API data
 *
 * Examples:
 * - dish="Smoky Burger", venue="Harbor Grill" → "Smoky Burger from Harbor Grill."
 * - dish="Harbor Grill", venue="Harbor Grill" → "Featured by Harbor Grill."
 * - No data → "Chef-crafted for Cascade & Coast Kitchen guests."
 */
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

/**
 * Normalize raw API item to MenuItem format
 *
 * Returns null if:
 * - No title available
 * - Title doesn't match category keywords
 *
 * This filters out irrelevant items (e.g., "Coffee" from /drinks when fetching cocktails)
 */
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

/**
 * Fetch and normalize items from a single API endpoint
 *
 * Example: fetchEndpointMenuItems('/burgers', 'burgers')
 * - GET https://free-food-menus-api-two.vercel.app/burgers
 * - Validate with Zod schema
 * - Normalize each item
 * - Deduplicate by ID
 */
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

/**
 * Remove duplicate items by ID
 *
 * Some items appear in multiple endpoints (e.g., BBQ in both sandwiches and sides)
 * Keep only first occurrence
 */
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

/**
 * Fetch all items for a specific category
 *
 * Some categories fetch from multiple endpoints:
 * - sandwiches: ['/sandwiches', '/bbqs']
 * - desserts: ['/desserts', '/chocolates', '/ice-cream']
 *
 * Error handling:
 * - Individual endpoint failures are logged but don't stop other endpoints
 * - Only throws if ALL endpoints for the category fail
 */
async function fetchCategoryMenuItems(category: Category): Promise<MenuItem[]> {
  const endpoints = CATEGORY_ENDPOINTS[category];

  if (!endpoints || endpoints.length === 0) {
    throw new Error(`Unsupported menu category: ${category}`);
  }

  const aggregated: MenuItem[] = [];
  let lastError: unknown;

  // Fetch from all endpoints for this category
  for (const endpoint of endpoints) {
    try {
      const items = await fetchEndpointMenuItems(endpoint, category);
      aggregated.push(...items);
    } catch (error) {
      console.warn(`[menu] Failed to load ${endpoint} for ${category}:`, error);
      lastError = error;
    }
  }

  // Deduplicate items
  const unique = dedupe(aggregated);

  // Sort by price (ascending), then alphabetically
  unique.sort((a, b) => {
    const priceDelta = (a.price ?? Number.POSITIVE_INFINITY) - (b.price ?? Number.POSITIVE_INFINITY);
    if (priceDelta !== 0 && Number.isFinite(priceDelta)) {
      return priceDelta;
    }
    return a.title.localeCompare(b.title);
  });

  // Limit to MAX_ITEMS_PER_CATEGORY to avoid overwhelming UI
  const limited = unique.slice(0, MAX_ITEMS_PER_CATEGORY);

  // Only throw error if we got zero items
  if (limited.length === 0) {
    if (lastError instanceof Error) {
      throw lastError;
    }

    throw new Error(`Menu category ${category} is temporarily unavailable.`);
  }

  return limited;
}

/**
 * Main export: Fetch menu items
 *
 * Supports three modes:
 * 1. fetchMenuItems() or fetchMenuItems('all') → Fetch all categories
 * 2. fetchMenuItems('burgers') → Fetch only burgers
 * 3. fetchMenuItems({ queryKey: [...] }) → React Query compatibility
 *
 * Used by React Query in MenuPage.tsx
 */
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

/**
 * Fetch all menu items across all categories
 *
 * Fetches all 7 categories in parallel with Promise.all:
 * - burgers, sandwiches, sides, cocktails, beverages, desserts, mains
 *
 * Error handling (Graceful degradation):
 * - If burgers fail → Still shows other categories
 * - Only throws if ALL categories fail (zero items total)
 *
 * This ensures users always see some menu data even if API is partially down
 */
async function fetchAllMenuItems(): Promise<MenuItem[]> {
  const results = await Promise.all(
    MENU_CATEGORIES.map(async (category) => {
      try {
        return await fetchCategoryMenuItems(category);
      } catch (error) {
        console.warn(`[menu] Category ${category} temporarily unavailable:`, error);
        return [];  // Return empty array, don't fail entire fetch
      }
    })
  );

  const combined = dedupe(results.flat());

  // Only throw if we got zero items from ALL categories
  if (combined.length === 0) {
    throw new Error('Menu data is temporarily unavailable.');
  }

  return combined;
}

export { fetchAllMenuItems, fetchCategoryMenuItems };
