import { describe, expect, it, vi, afterEach } from 'vitest';
import { fetchMenuItems } from '../../../src/services/menu.service';

const mockResponse = (data: unknown, ok = true, status = 200) =>
  Promise.resolve({
    ok,
    status,
    json: () => Promise.resolve(data)
  } as Response);

describe('menu.service', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('normalizes raw menu items and filters into curated categories', async () => {
    const endpointPayloads: Record<string, unknown> = {
      '/burgers': [
        {
          id: 1,
          name: 'Smoky Harbor Burger',
          dsc: 'Smoky Harbor Burger',
          price: '$24.50',
          img: 'https://example.com/burger.jpg'
        }
      ],
      '/drinks': [
        {
          id: 2,
          name: 'Maple Old Fashioned',
          dsc: 'Maple Old Fashioned',
          price: 16,
          img: 'https://example.com/maple.jpg'
        }
      ],
      '/steaks': [
        {
          id: 3,
          name: 'Coal Harbour Kitchen',
          dsc: 'Coastal Prime Steak'
        }
      ]
    };

    const requestedPaths: string[] = [];

    vi.spyOn(global, 'fetch').mockImplementation((input) => {
      const url = typeof input === 'string' ? input : input instanceof Request ? input.url : String(input);
      const path = url.replace('https://free-food-menus-api-two.vercel.app', '');
      requestedPaths.push(path);
      const payload = endpointPayloads[path] ?? [];
      return mockResponse(payload);
    });

    const result = await fetchMenuItems('all');

    expect(new Set(requestedPaths)).toEqual(
      new Set(['/burgers', '/sandwiches', '/fried-chicken', '/drinks', '/desserts', '/steaks', '/bbqs', '/porks', '/chocolates', '/ice-cream'])
    );

    expect(result).toHaveLength(3);
    expect(result[0]).toMatchObject({
      id: '1',
      category: 'burgers',
      price: 24.5,
      imageUrl: 'https://example.com/burger.jpg'
    });
    expect(result[1]).toMatchObject({
      id: '2',
      category: 'cocktails',
      price: 16
    });

    expect(result[2]).toMatchObject({
      id: '3',
      category: 'mains',
      price: null
    });
  });

  it('throws when the payload fails validation', async () => {
    vi.spyOn(global, 'fetch').mockImplementation((input) => {
      const url = typeof input === 'string' ? input : input instanceof Request ? input.url : String(input);
      if (url.endsWith('/burgers')) {
        return mockResponse({ foo: 'bar' });
      }
      return mockResponse([]);
    });

    await expect(fetchMenuItems('burgers')).rejects.toThrow(
      'Failed to validate menu response for burgers'
    );
  });

  it('throws on non-200 responses', async () => {
    vi.spyOn(global, 'fetch').mockImplementation((input) => {
      const url = typeof input === 'string' ? input : input instanceof Request ? input.url : String(input);
      if (url.endsWith('/burgers')) {
        return mockResponse({}, false, 500);
      }
      return mockResponse([]);
    });

    await expect(fetchMenuItems('burgers')).rejects.toThrow('Request failed with status 500');
  });
});
