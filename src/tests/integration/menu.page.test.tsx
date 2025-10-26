import { afterEach, beforeEach, describe, expect, it, vi, type Mock } from 'vitest';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider, createMemoryRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import MenuPage from '../../../src/pages/Menu/MenuPage';
import type { MenuItem } from '../../../src/lib/types';
import { fetchMenuItems } from '../../../src/services/menu.service';

vi.mock('../../../src/services/menu.service', async () => {
  const actual = await vi.importActual<typeof import('../../../src/services/menu.service')>(
    '../../../src/services/menu.service'
  );
  return {
    ...actual,
    fetchMenuItems: vi.fn()
  };
});

const mockedFetchMenuItems = fetchMenuItems as unknown as Mock;

const mockItems: MenuItem[] = [
  {
    id: '1',
    title: 'Seawall Burger',
    description: 'Smoked cheddar, garlic aioli, brioche bun.',
    price: 23,
    category: 'burgers',
    tags: ['Gluten-Friendly'],
    imageUrl: 'https://example.com/burger.jpg'
  },
  {
    id: '2',
    title: 'Market Club',
    description: 'Roasted turkey, maple bacon, heirloom tomato.',
    price: 18,
    category: 'sandwiches',
    tags: ['Handheld'],
    imageUrl: 'https://example.com/club.jpg'
  },
  {
    id: '3',
    title: 'Coal Harbour Old Fashioned',
    description: 'Barrel-aged rye, maple, bitters.',
    price: 17,
    category: 'beverages',
    imageUrl: 'https://example.com/oldfashioned.jpg'
  },
  {
    id: '4',
    title: 'Harbour Steak',
    description: 'Charred striploin, smoked potato purée.',
    price: 39,
    category: 'mains',
    imageUrl: 'https://example.com/steak.jpg'
  }
];

const queryClients: QueryClient[] = [];

const renderMenuPage = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } }
  });
  queryClients.push(queryClient);

  const router = createMemoryRouter(
    [
      {
        path: '/menu',
        element: <MenuPage />
      }
    ],
    { initialEntries: ['/menu'] }
  );

  render(
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </HelmetProvider>
  );

  return { router, queryClient };
};

describe('MenuPage', () => {
  beforeEach(() => {
    mockedFetchMenuItems.mockResolvedValue(mockItems);
  });

  afterEach(() => {
    cleanup();
    mockedFetchMenuItems.mockReset();
    queryClients.forEach((client) => client.clear());
    queryClients.length = 0;
  });

  it('filters by category and syncs URL search params', async () => {
    const { router } = renderMenuPage();

    await screen.findByText('Seawall Burger');
    const sandwichesTab = screen.getByRole('tab', { name: /sandwiches/i });
    await userEvent.click(sandwichesTab);

    await waitFor(() => {
      expect(router.state.location.search).toContain('category=sandwiches');
    });

    expect(screen.getByText('Market Club')).toBeInTheDocument();
    expect(screen.queryByText('Seawall Burger')).not.toBeInTheDocument();
  });

  it('performs search and sort interactions', async () => {
    const { router } = renderMenuPage();
    await screen.findByText('Seawall Burger');

    const searchInput = screen.getByLabelText(/search the menu/i);
    await userEvent.type(searchInput, 'old fashioned');

    await waitFor(() => {
      const params = new URLSearchParams(router.state.location.search);
      expect(params.get('search')).toBe('old fashioned');
    });

    const oldFashionedElements = screen.getAllByText('Coal Harbour Old Fashioned');
    expect(oldFashionedElements.length).toBeGreaterThan(0);
    expect(screen.queryByText('Seawall Burger')).not.toBeInTheDocument();

    await userEvent.clear(searchInput);
    await waitFor(() => {
      const params = new URLSearchParams(router.state.location.search);
      expect(params.has('search')).toBe(false);
    });

    const sortSelect = screen.getByLabelText(/sort menu items/i);
    await userEvent.selectOptions(sortSelect, 'price_desc');

    await waitFor(() => {
      expect(router.state.location.search).toContain('sort=price_desc');
    });

    const headings = screen.getAllByRole('heading', { level: 3 });
    expect(headings[0]).toHaveTextContent('Harbour Steak');
  });
});
