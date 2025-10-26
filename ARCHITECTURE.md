# Cascade & Coast Kitchen - Architecture Documentation

## Project Overview

A modern restaurant website built with React 18, TypeScript, and Vite. Features include a dynamic menu with filtering/sorting, location information, and responsive design.

**Live Demo:** [https://cascade-and-coast.netlify.app/]

## Technology Stack

### Core
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **pnpm** - Package manager

### Routing & Data
- **React Router v6** - Client-side routing
- **TanStack Query (React Query)** - Server state management
- **Zustand** - Global UI state

### Styling & UI
- **Tailwind CSS** - Utility-first CSS
- **Custom Design System** - Brand colors, typography, components

### Testing
- **Vitest** - Unit test runner
- **React Testing Library** - Component testing
- **@testing-library/user-event** - User interaction testing

### Other
- **Zod** - Runtime schema validation
- **React Helmet Async** - Document head management

---

## Project Structure

```
src/
├── app/
│   └── routes.tsx              # React Router configuration
├── assets/
│   ├── logo.svg                # Restaurant logo
│   └── placeholder.jpg         # Fallback image
├── components/
│   ├── layout/
│   │   ├── Container.tsx       # Max-width wrapper
│   │   ├── Footer.tsx          # Site footer
│   │   └── Navbar.tsx          # Site navigation
│   ├── locations/
│   │   ├── LocationCard.tsx    # Location details card
│   │   └── MapEmbed.tsx        # Google Maps iframe
│   ├── menu/
│   │   ├── MenuCard.tsx        # Menu item card (uses Zustand)
│   │   ├── MenuFilters.tsx     # Category tabs, search, sort controls
│   │   └── MenuGrid.tsx        # Grid layout for menu cards
│   └── ui/
│       ├── Badge.tsx           # Pill-shaped labels
│       ├── Button.tsx          # Polymorphic button component
│       ├── Card.tsx            # Card container with slots
│       ├── Modal.tsx           # Accessible modal dialog
│       ├── Skeleton.tsx        # Loading placeholder
│       └── Tabs.tsx            # Compound component (Tabs.Root, Tabs.List, etc.)
├── lib/
│   ├── constants.ts            # API URLs, categories, endpoints, keywords
│   ├── fallback-menu.ts        # Hardcoded menu items (cocktails + fallback)
│   ├── http.ts                 # HTTP fetch wrapper
│   ├── types.ts                # TypeScript type definitions
│   └── utils.ts                # Filter, sort, pagination utilities
├── pages/
│   ├── About/
│   │   └── AboutPage.tsx       # About page
│   ├── Home/
│   │   ├── FeaturedLocations.tsx
│   │   ├── Hero.tsx
│   │   └── HomePage.tsx        # Landing page
│   ├── Locations/
│   │   └── LocationsPage.tsx   # All locations
│   └── Menu/
│       └── MenuPage.tsx        # Menu with filters/sort/pagination
├── services/
│   └── menu.service.ts         # API data fetching & normalization
├── store/
│   └── ui.store.ts             # Zustand global state (modal)
├── styles/
│   └── globals.css             # Tailwind imports + custom styles
├── tests/
│   ├── integration/
│   │   └── menu.page.test.tsx  # MenuPage integration tests
│   └── unit/
│       ├── menu.service.test.ts
│       └── utils.test.ts
└── main.tsx                    # Application entry point
```

---

## Key Architecture Decisions

### 1. URL-Driven State (Menu Filters)

**Why:** Shareable links, bookmarkable filters, browser history support

**Implementation:**
- All filters live in URL query params: `/menu?category=burgers&sort=price_asc&page=2`
- `useSearchParams` from React Router manages URL state
- `updateParams()` function updates URL (single source of truth)

**Example:**
```tsx
// Read from URL
const [searchParams, setSearchParams] = useSearchParams();
const category = searchParams.get('category'); // "burgers"

// Update URL
const updateParams = (updates) => {
  const params = new URLSearchParams(searchParams);
  if (updates.category) {
    params.set('category', updates.category);
  }
  setSearchParams(params, { replace: true });
};
```

---

### 2. React Query for Server State

**Why:** Automatic caching, background refresh, retry logic, loading states

**Configuration:** (`main.tsx`)
```tsx
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,      // 5 min cache
      retry: 2,                       // Retry failed requests twice
      refetchOnWindowFocus: false     // Don't refetch on tab focus
    }
  }
});
```

**Usage:** (`MenuPage.tsx`)
```tsx
const { data, isLoading, isError } = useQuery({
  queryKey: ['menu-items'],
  queryFn: fetchMenuItems
});
```

**Benefits:**
- First render: Fetches data, shows loading spinner
- Subsequent renders: Returns cached data instantly (no loading!)
- After 5 min: Shows stale data while refetching in background
- Automatic error handling with retries

---

### 3. Zustand for Global UI State

**Why:** No prop drilling, simple API, no providers needed

**Use Case:** Menu item detail modal

**Store:** (`ui.store.ts`)
```tsx
export const useUIStore = create<UIState>((set) => ({
  activeMenuItem: null,
  openMenuItem: (item) => set({ activeMenuItem: item }),
  closeMenuItem: () => set({ activeMenuItem: null })
}));
```

**Component Hierarchy (No Prop Drilling):**
```
MenuPage (reads activeMenuItem)
  └─ MenuGrid (doesn't know about modal)
       └─ MenuCard (calls openMenuItem directly)
```

**MenuCard.tsx:**
```tsx
const openMenuItem = useUIStore((state) => state.openMenuItem);

<Button onClick={() => openMenuItem(item)}>
  Details
</Button>
```

**MenuPage.tsx:**
```tsx
const activeMenuItem = useUIStore((state) => state.activeMenuItem);

{activeMenuItem && <Modal item={activeMenuItem} />}
```

---

### 4. Client-Side Filtering & Sorting

**Why:** Instant UX, works with React Query caching, simpler backend

**Data Pipeline:**
```
1. React Query fetches ALL items → Cached for 5 min
2. Merge remote data + fallback cocktails
3. Filter by category and search (useMemo)
4. Sort by price or alphabetically (useMemo)
5. Paginate to 9 items per page (useMemo)
6. Render MenuGrid
```

**Performance Optimization:**
```tsx
const filteredItems = useMemo(() => {
  const filtered = filterMenuItems(items, { category, search });
  return sortMenuItems(filtered, sort);
}, [items, category, search, sort]);
```

**useMemo benefits:**
- Only recomputes when dependencies change
- Skips expensive filtering/sorting on unrelated re-renders
- Essential for good performance with large datasets

---

## Data Flow Diagrams

### Menu Page Data Flow

```
User opens /menu
    ↓
useQuery checks cache
    ↓
Cache MISS (first visit)
    ↓
fetchMenuItems() called
    ↓
Promise.all fetches 7 categories in parallel:
  - /burgers → burgers
  - /drinks → cocktails (filtered by keywords)
  - /drinks → beverages (filtered by keywords)
  - /desserts, /chocolates, /ice-cream → desserts
  - /steaks, /porks, /bbqs → mains
  - /sandwiches, /bbqs → sandwiches
  - /fried-chicken, /bbqs, /porks → sides
    ↓
Normalize each item:
  - Validate with Zod schema
  - Parse price ("$24.50" → 24.5)
  - Filter by category keywords
  - Deduplicate by ID
  - Sort by price, then alphabetically
  - Limit to 9 items per category
    ↓
Store in React Query cache
    ↓
MenuPage receives data
    ↓
Merge remote items + fallback cocktails
    ↓
Filter → Sort → Paginate (useMemo)
    ↓
Render MenuGrid with 9 items
```

### User Interaction Flow (Filtering)

```
User clicks "Burgers" tab
    ↓
onCategoryChange('burgers') called
    ↓
updateParams({ category: 'burgers', page: 1 })
    ↓
URL changes: /menu → /menu?category=burgers
    ↓
React Router triggers re-render
    ↓
useSearchParams reads new category
    ↓
useMemo recomputes filteredItems
  (filters items.category === 'burgers')
    ↓
useMemo recomputes paginatedItems
  (slices items 0-8)
    ↓
MenuGrid re-renders with filtered items
```

---

## API Integration

### External API

**Base URL:** `https://free-food-menus-api-two.vercel.app`

**Endpoints Used:**
- `/burgers` - Burger items
- `/drinks` - Beverages and cocktails
- `/steaks` - Steak and meat dishes
- `/sandwiches` - Sandwiches
- `/bbqs` - BBQ items
- `/porks` - Pork dishes
- `/fried-chicken` - Fried chicken
- `/desserts` - Desserts
- `/chocolates` - Chocolate desserts
- `/ice-cream` - Ice cream

### Category Mapping

Some categories fetch from multiple endpoints:

```typescript
export const CATEGORY_ENDPOINTS: Record<Category, string[]> = {
  burgers: ['/burgers'],
  sandwiches: ['/sandwiches', '/bbqs'],
  sides: ['/fried-chicken', '/bbqs', '/porks'],
  cocktails: ['/drinks'],          // Filtered by keywords
  beverages: ['/drinks'],           // Filtered by keywords
  desserts: ['/desserts', '/chocolates', '/ice-cream'],
  mains: ['/steaks', '/porks', '/bbqs']
};
```

### Keyword Filtering

Items from `/drinks` are categorized as either cocktails or beverages based on keywords:

```typescript
export const CATEGORY_KEYWORDS: Record<Category, string[]> = {
  cocktails: ['cocktail', 'spritz', 'old fashioned', 'martini', ...],
  beverages: ['coffee', 'tea', 'soda', 'juice', 'beer', 'wine', ...],
  // ...
};
```

**Example:**
- "Maple Old Fashioned" → Contains "old fashioned" → `category: 'cocktails'`
- "Iced Coffee" → Contains "coffee" → `category: 'beverages'`

### Error Handling (Graceful Degradation)

```typescript
async function fetchAllMenuItems(): Promise<MenuItem[]> {
  const results = await Promise.all(
    MENU_CATEGORIES.map(async (category) => {
      try {
        return await fetchCategoryMenuItems(category);
      } catch (error) {
        console.warn(`Category ${category} unavailable:`, error);
        return [];  // Don't fail entire fetch
      }
    })
  );

  // Only throw if ALL categories fail
  if (combined.length === 0) {
    throw new Error('Menu data temporarily unavailable.');
  }

  return combined;
}
```

**Benefits:**
- If burgers API fails → Still shows other categories
- User always sees some data (better than blank page)
- Errors logged for debugging

---

## Component Patterns

### 1. Compound Components (Tabs)

**Usage:**
```tsx
<Tabs.Root value={activeTab} onValueChange={setActiveTab}>
  <Tabs.List>
    <Tabs.Trigger value="all">All</Tabs.Trigger>
    <Tabs.Trigger value="burgers">Burgers</Tabs.Trigger>
  </Tabs.List>
  <Tabs.Content value="all">
    {/* Content */}
  </Tabs.Content>
</Tabs.Root>
```

**Benefits:**
- Related components stay together (Tabs.Root, Tabs.List, etc.)
- Shared context (activeTab managed internally)
- Flexible composition

### 2. Polymorphic Components (Button)

**Usage:**
```tsx
<Button asChild>
  <Link to="/menu">View Menu</Link>
</Button>
```

**Implementation:**
```tsx
const Button = ({ asChild, children, ...props }) => {
  const Comp = asChild ? Slot : 'button';
  return <Comp {...props}>{children}</Comp>;
};
```

**Benefits:**
- Button styles on any element (a, Link, button)
- Semantic HTML (use <a> for links, not <button>)

### 3. Render Props / Slots (Card)

**Usage:**
```tsx
<Card
  header={<img src="..." />}
  footer={<Button>Details</Button>}
>
  <p>Card body content</p>
</Card>
```

**Benefits:**
- Flexible layout (header and footer optional)
- Consistent styling across all cards
- Separation of concerns

---

## Testing Strategy

### Unit Tests

**utils.test.ts:**
- `filterMenuItems()` - Category and search filtering
- `sortMenuItems()` - Price and alphabetical sorting
- `paginateItems()` - Pagination logic
- `isCategory()` - Type guard validation

**menu.service.test.ts:**
- API response validation with Zod
- Price parsing ("$24.50" → 24.5)
- Category keyword matching
- Error handling

### Integration Tests

**menu.page.test.tsx:**
- Category filtering updates URL
- Search functionality
- Sort functionality
- Pagination
- Loading states
- Error states with fallback data

**Running Tests:**
```bash
pnpm test          # Run all tests
pnpm test:watch    # Watch mode
pnpm coverage      # Coverage report
```

---

## Performance Optimizations

1. **React Query Caching** - 5 min cache, instant subsequent loads
2. **useMemo** - Prevent unnecessary filtering/sorting
3. **Code Splitting** - React Router lazy loading (if implemented)
4. **Image Lazy Loading** - `loading="lazy"` on images
5. **Pagination** - Only render 9 items at a time

---

## Development

### Prerequisites
- Node.js 18+
- pnpm 8+

### Setup
```bash
git clone <repo-url>
cd Cascade-and-Coast
pnpm install
```

### Commands
```bash
pnpm dev           # Start dev server (http://localhost:5173)
pnpm build         # Production build
pnpm preview       # Preview production build
pnpm test          # Run tests
pnpm typecheck     # Type check without building
```

### Environment Variables
None currently required (API is public)

---

## Deployment

### Netlify (Recommended)

**Configuration:** `netlify.toml`
```toml
[build]
  publish = "dist"
  command = "pnpm build"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200  # SPA redirect for client-side routing
```

**Steps:**
1. Connect GitHub repo to Netlify
2. Build command: `pnpm build`
3. Publish directory: `dist`
4. Deploy!

### GitHub Pages

**Configuration:** `.github/workflows/deploy.yml`
- Builds on push to main
- Deploys to gh-pages branch
- Requires `base: '/Cascade-and-Coast/'` in vite.config.ts

**Note:** Requires 404.html redirect pattern for client-side routing

---

## Future Improvements

### Architecture
- [ ] Implement server-side pagination for large datasets
- [ ] Add debouncing to search input (reduce URL updates)
- [ ] Category-specific React Query keys for granular caching
- [ ] Add infinite scroll as pagination alternative

### Features
- [ ] User authentication (favorites, orders)
- [ ] Shopping cart functionality
- [ ] Online ordering integration
- [ ] Dietary filters (vegetarian, gluten-free, etc.)
- [ ] Menu item ratings/reviews

### Performance
- [ ] Add service worker for offline support
- [ ] Image optimization (WebP, AVIF)
- [ ] Code splitting by route
- [ ] Prefetch data on link hover

### Developer Experience
- [ ] Add Storybook for component documentation
- [ ] ESLint + Prettier setup
- [ ] Husky for pre-commit hooks
- [ ] Playwright for E2E tests

---

## License

MIT

---

## Contact

For questions or suggestions, please open an issue on GitHub.
