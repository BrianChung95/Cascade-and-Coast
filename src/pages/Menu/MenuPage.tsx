/**
 * MenuPage Component
 *
 * Displays restaurant menu with filtering, sorting, and pagination.
 *
 * Architecture:
 * - URL-driven state (category, search, sort, page in query params)
 * - React Query for data fetching and caching
 * - Client-side filtering/sorting (all data fetched at once)
 * - Zustand for modal state (menu item details)
 *
 * Data Flow Pipeline:
 * 1. React Query fetches all menu items → cached for 5 minutes
 * 2. Merge remote data + fallback cocktails
 * 3. Filter by category and search text (useMemo)
 * 4. Sort by price or alphabetically (useMemo)
 * 5. Paginate to 9 items per page (useMemo)
 * 6. Render MenuGrid with final items
 *
 * URL State Examples:
 * - /menu → All items
 * - /menu?category=burgers → Only burgers
 * - /menu?category=burgers&sort=price_asc → Burgers sorted by price
 * - /menu?search=coastal&page=2 → Search results, page 2
 */

import { useEffect, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import MenuFilters from '../../components/menu/MenuFilters';
import MenuGrid from '../../components/menu/MenuGrid';
import Container from '../../components/layout/Container';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import { MENU_CATEGORIES, ITEMS_PER_PAGE, CATEGORY_LABELS } from '../../lib/constants';
import {
  filterMenuItems,
  formatCurrency,
  isCategory,
  normalizeQueryParam,
  paginateItems,
  parsePageParam,
  sortMenuItems
} from '../../lib/utils';
import type { Category } from '../../lib/types';
import { fetchMenuItems } from '../../services/menu.service';
import { useUIStore } from '../../store/ui.store';
import { FALLBACK_MENU_ITEMS } from '../../lib/fallback-menu';

const MenuPage = () => {
  // ===== DATA FETCHING (React Query) =====
  // Fetches all menu items from API, cached for 5 minutes
  // On subsequent renders, returns cached data instantly (no loading spinner)
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['menu-items'],
    queryFn: fetchMenuItems
  });

  // ===== URL STATE (Single Source of Truth) =====
  // All filters/sort/pagination live in URL for shareability and bookmarking
  const [searchParams, setSearchParams] = useSearchParams();

  // Read URL parameters
  const categoryParam = searchParams.get('category');
  const sortParam = searchParams.get('sort');
  const searchParam = normalizeQueryParam(searchParams.get('search')) ?? '';
  const pageParam = parsePageParam(searchParams.get('page'));

  // Validate and normalize URL parameters
  const category = isCategory(categoryParam) ? categoryParam : undefined;
  const sort = sortParam === 'price_asc' || sortParam === 'price_desc' ? sortParam : undefined;
  const page = pageParam;

  /**
   * Update URL parameters (single source of truth for filters)
   *
   * Why URL instead of useState?
   * - Shareable links (send filtered view to others)
   * - Bookmarkable (save "burgers sorted by price")
   * - Browser back/forward works
   * - Deep linking (direct link to search results)
   *
   * Important implementation details:
   * - Uses 'category' in updates (not updates.category !== undefined)
   *   to allow passing category: undefined to clear filter
   * - replace: true prevents flooding browser history
   * - Page resets to 1 when filters change (handled at callsite)
   */
  const updateParams = (updates: {
    category?: Category | undefined;
    sort?: 'price_asc' | 'price_desc' | undefined;
    search?: string;
    page?: number;
  }) => {
    const params = new URLSearchParams(searchParams);

    if ('category' in updates) {
      if (updates.category) {
        params.set('category', updates.category);
      } else {
        params.delete('category');  // "All" tab removes category filter
      }
    }

    if ('sort' in updates) {
      if (updates.sort) {
        params.set('sort', updates.sort);
      } else {
        params.delete('sort');
      }
    }

    if ('search' in updates) {
      if (updates.search) {
        params.set('search', updates.search);
      } else {
        params.delete('search');
      }
    }

    if ('page' in updates) {
      params.set('page', String(updates.page));
    }

    setSearchParams(params, { replace: true });
  };

  // ===== DATA PREPARATION =====
  // Merge remote API data with fallback cocktails (business requirement)
  const remoteItems = Array.isArray(data) ? data : [];
  const hasRemoteData = remoteItems.length > 0;
  const shouldUseFallback = !hasRemoteData && !isLoading;

  // Cocktails always use fallback data (never from API)
  const cocktailItems = FALLBACK_MENU_ITEMS.filter(item => item.category === 'cocktails');
  const nonCocktailRemoteItems = hasRemoteData ? remoteItems.filter(item => item.category !== 'cocktails') : [];

  // Three scenarios:
  // 1. API success: remote items + fallback cocktails
  // 2. API error: all fallback items
  // 3. Loading: just cocktails (show something while loading)
  const items = hasRemoteData
    ? [...nonCocktailRemoteItems, ...cocktailItems]
    : shouldUseFallback
      ? FALLBACK_MENU_ITEMS
      : cocktailItems;
  const usingFallback = shouldUseFallback && !hasRemoteData;

  // ===== FILTERING & SORTING (Performance Optimized with useMemo) =====
  // useMemo prevents re-filtering/re-sorting on every render
  // Only recomputes when dependencies change: [items, category, searchParam, sort]
  const filteredItems = useMemo(() => {
    const filtered = filterMenuItems(items, { category, search: searchParam });
    return sortMenuItems(filtered, sort);
  }, [items, category, searchParam, sort]);

  // ===== PAGINATION =====
  const totalItems = filteredItems.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / ITEMS_PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const paginatedItems = useMemo(
    () => paginateItems(filteredItems, currentPage, ITEMS_PER_PAGE),
    [filteredItems, currentPage]
  );

  // Auto-correct: If user is on page 5 but filters reduce results to 2 pages,
  // redirect to page 2 (prevent showing empty "page 5 of 2")
  useEffect(() => {
    if (page > totalPages) {
      updateParams({ page: totalPages });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, totalPages]);

  // ===== MODAL STATE (Zustand Global State) =====
  // Used for menu item detail modal
  // MenuCard calls openMenuItem() directly (no prop drilling)
  const activeMenuItem = useUIStore((state) => state.activeMenuItem);
  const closeMenuItem = useUIStore((state) => state.closeMenuItem);

  return (
    <>
      <Helmet>
        <title>Cascade &amp; Coast Kitchen | Menu</title>
        <meta
          name="description"
          content="Browse the Cascade & Coast Kitchen menu. Burgers, salads, chef specials, and handcrafted beverages curated for Downtown Vancouver."
        />
      </Helmet>
      <section className="py-20">
        <Container className="space-y-10">
          <header className="space-y-4 text-center">
            <p className="text-xs uppercase tracking-[0.4em] text-brand-600">The Menu</p>
            <h1 className="font-display text-4xl font-semibold text-slate-900">
              Modern coastal classics
            </h1>
            <p className="mx-auto max-w-2xl text-sm text-slate-600">
              Thoughtfully composed dishes built for sharing and savoring. Filter by category, search
              for ingredients, or sort by price to plan your next visit.
            </p>
          </header>
          <MenuFilters
            categories={MENU_CATEGORIES}
            activeCategory={category}
            onCategoryChange={(nextCategory) => {
              updateParams({ category: nextCategory, page: 1 });
            }}
            search={searchParam}
            onSearchChange={(value) => {
              updateParams({ search: value, page: 1 });
            }}
            sort={sort}
            onSortChange={(nextSort) => {
              updateParams({ sort: nextSort, page: 1 });
            }}
            totalItems={totalItems}
          />
          {isError ? (
            <div className="rounded-3xl border border-red-200 bg-red-50 p-8 text-center text-sm text-red-700">
              <p>
                We hit a snag while fetching the menu:{' '}
                {error instanceof Error ? error.message : 'Unknown error'}.
              </p>
              <p className="mt-2 text-slate-600">
                We are serving our curated house menu while we reconnect.
              </p>
              <Button className="mt-4" onClick={() => refetch()}>
                Retry
              </Button>
            </div>
          ) : null}
          {!isError && usingFallback ? (
            <div className="rounded-3xl border border-brand-200 bg-brand-50 p-6 text-center text-sm text-brand-700">
              We are showcasing our signature dishes while new menu data loads.
            </div>
          ) : null}
          {!isLoading && !isError && totalItems === 0 ? (
            <div className="rounded-3xl border border-stone-200 bg-white p-12 text-center text-sm text-slate-600 shadow-lg shadow-brand-100/50">
              <p>No dishes match your filters.</p>
              <Button
                className="mt-4"
                variant="secondary"
                onClick={() =>
                  updateParams({ category: undefined, search: '', sort: undefined, page: 1 })
                }
              >
                Reset filters
              </Button>
            </div>
          ) : null}
          <MenuGrid items={paginatedItems} isLoading={isLoading} />
          {totalPages > 1 ? (
            <div className="flex items-center justify-between gap-4">
              <Button
                variant="secondary"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => updateParams({ page: currentPage - 1 })}
              >
                Previous
              </Button>
              <div className="flex items-center gap-3 text-sm text-slate-600">
                <span>Page</span>
                <Badge color="neutral">{currentPage}</Badge>
                <span className="text-slate-400">of</span>
                <span>{totalPages}</span>
              </div>
              <Button
                variant="secondary"
                size="sm"
                disabled={currentPage === totalPages}
                onClick={() => updateParams({ page: currentPage + 1 })}
              >
                Next
              </Button>
            </div>
          ) : null}
        </Container>
      </section>
      <Modal
        isOpen={Boolean(activeMenuItem)}
        onClose={closeMenuItem}
        title={activeMenuItem?.title ?? ''}
        description={activeMenuItem ? CATEGORY_LABELS[activeMenuItem.category] : undefined}
      >
        {activeMenuItem ? (
          <div className="space-y-4">
            <img
              src={activeMenuItem.imageUrl ?? '/src/assets/placeholder.jpg'}
              alt={activeMenuItem.title}
              className="h-56 w-full rounded-3xl border border-white object-cover"
            />
            <p className="text-sm text-slate-600">{activeMenuItem.description}</p>
            <p className="text-sm font-semibold text-slate-900">
              {formatCurrency(activeMenuItem.price)}
            </p>
            {activeMenuItem.tags ? (
              <div className="flex flex-wrap gap-2">
                {activeMenuItem.tags.map((tag) => (
                  <Badge key={tag} color="neutral">
                    {tag}
                  </Badge>
                ))}
              </div>
            ) : null}
          </div>
        ) : null}
      </Modal>
    </>
  );
};

export default MenuPage;
