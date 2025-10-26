import type { MenuItem } from './types';

export const FALLBACK_MENU_ITEMS: MenuItem[] = [
  {
    id: 'fallback-seawall-burger',
    title: 'Seawall Burger',
    description:
      'Smoked cheddar, caramelized onions, butter lettuce, charred tomato jam, brioche.',
    price: 23,
    imageUrl:
      'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=1200&q=80',
    category: 'burgers',
    tags: ['Certified Angus', 'Gluten-Friendly Option']
  },
  {
    id: 'fallback-market-club',
    title: 'Market Club',
    description:
      'Roasted turkey, maple bacon, avocado aioli, heirloom tomato, grilled sourdough.',
    price: 18,
    imageUrl:
      'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=1200&q=80',
    category: 'sandwiches',
    tags: ['Handheld', 'Lunch Favourite']
  },
  {
    id: 'fallback-harvest-risotto',
    title: 'Harvest Risotto',
    description:
      'Wild mushroom ragù, roasted squash, herb pistou, shaved parmesan, puffed grains.',
    price: 28,
    imageUrl:
      'https://images.unsplash.com/photo-1604908177093-3d24ab9e0295?auto=format&fit=crop&w=1200&q=80',
    category: 'mains',
    tags: ['Vegetarian', 'Seasonal']
  },
  {
    id: 'fallback-pacific-salmon',
    title: 'Pacific Cedar Salmon',
    description:
      'Cedar roasted salmon, charred broccolini, miso butter, fingerling potato smash.',
    price: 34,
    imageUrl:
      'https://images.unsplash.com/photo-1612874742257-900084940aca?auto=format&fit=crop&w=1200&q=80',
    category: 'mains',
    tags: ['Ocean Wise', 'Chef Special']
  },
  {
    id: 'fallback-cascadian-cobb',
    title: 'Cascadian Cobb',
    description:
      'Baby gem lettuce, smoked chicken, pickled beets, soft egg, blue cheese drizzle.',
    price: 21,
    imageUrl:
      'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?auto=format&fit=crop&w=1200&q=80',
    category: 'sides',
    tags: ['Gluten-Free', 'Protein Packed']
  },
  {
    id: 'fallback-seawall-spritz',
    title: 'Seawall Spritz',
    description:
      'Citrus gin, coastal botanicals, yuzu tonic',
    price: 16,
    imageUrl:
      'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=1200&q=80',
    category: 'cocktails',
    tags: ['Signature', 'Refreshing']
  },
  {
    id: 'fallback-coal-old-fashioned',
    title: 'Coal Harbour Old Fashioned',
    description:
      'Barrel-aged rye, maple syrup, orange bitters',
    price: 17,
    imageUrl:
      'https://images.unsplash.com/photo-1581579186989-4c04b2a758ad?auto=format&fit=crop&w=1200&q=80',
    category: 'cocktails',
    tags: ['Signature Cocktail', 'Smoked']
  },
  {
    id: 'fallback-pacific-negroni',
    title: 'Pacific Negroni',
    description:
      'BC gin, Campari, sweet vermouth',
    price: 15,
    imageUrl:
      'https://images.unsplash.com/photo-1536935338788-846bb9981813?auto=format&fit=crop&w=1200&q=80',
    category: 'cocktails',
    tags: ['Classic', 'Bold']
  },
  {
    id: 'fallback-yuzu-margarita',
    title: 'Yuzu Margarita',
    description:
      'Reposado tequila, yuzu juice, agave',
    price: 16,
    imageUrl:
      'https://images.unsplash.com/photo-1615332579937-0a6e6d7e4e8a?auto=format&fit=crop&w=1200&q=80',
    category: 'cocktails',
    tags: ['Citrus Forward', 'Spicy']
  },
  {
    id: 'fallback-lavender-martini',
    title: 'English Bay Martini',
    description:
      'Vodka, lavender liqueur, lemon verbena',
    price: 17,
    imageUrl:
      'https://images.unsplash.com/photo-1541367777708-7905fe3296c0?auto=format&fit=crop&w=1200&q=80',
    category: 'cocktails',
    tags: ['Floral', 'Elegant']
  },
  {
    id: 'fallback-whiskey-sour',
    title: 'Maple Whiskey Sour',
    description:
      'Canadian whisky, maple syrup, lemon',
    price: 15,
    imageUrl:
      'https://images.unsplash.com/photo-1560512823-829485b8bf24?auto=format&fit=crop&w=1200&q=80',
    category: 'cocktails',
    tags: ['Classic', 'Smooth']
  },
  {
    id: 'fallback-charred-broccolini',
    title: 'Charred Broccolini',
    description:
      'Preserved lemon vinaigrette, toasted almonds, whipped ricotta, chili oil.',
    price: 12,
    imageUrl:
      'https://images.unsplash.com/photo-1604908177563-5dfac298d18b?auto=format&fit=crop&w=1200&q=80',
    category: 'sides',
    tags: ['Vegetarian', 'Share Plate']
  },
  {
    id: 'fallback-sea-salted-fries',
    title: 'Sea Salt & Herb Fries',
    description:
      'Triple-cooked kennebec potatoes, smoked garlic aioli, charred scallion salsa verde.',
    price: 10,
    imageUrl:
      'https://images.unsplash.com/photo-1559329007-40df8a9345d2?auto=format&fit=crop&w=1200&q=80',
    category: 'sides',
    tags: ['Share Plate', 'Vegetarian']
  },
  {
    id: 'fallback-chocolate-torte',
    title: 'Midnight Chocolate Torte',
    description:
      'Flourless dark chocolate, espresso ganache, candied cocoa nibs, vanilla chantilly.',
    price: 12,
    imageUrl:
      'https://images.unsplash.com/photo-1612872087720-bb876e2b3a2a?auto=format&fit=crop&w=1200&q=80',
    category: 'desserts',
    tags: ['Gluten-Free', 'Indulgent']
  },
  {
    id: 'fallback-pineapple-upside',
    title: 'Pineapple Upside Crème',
    description:
      'Seared pineapple, toasted coconut crumble, vanilla custard, rum caramel.',
    price: 11,
    imageUrl:
      'https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=1200&q=80',
    category: 'desserts',
    tags: ['Tropical', 'Share Sweet']
  },
  {
    id: 'fallback-coastal-lemonade',
    title: 'Coastal Lemonade',
    description:
      'Cold-pressed lemon, yuzu, sea salt, rosemary, soda; available spirit-free or spiked.',
    price: 8,
    imageUrl:
      'https://images.unsplash.com/photo-1514361892635-6e122620e5fd?auto=format&fit=crop&w=1200&q=80',
    category: 'beverages',
    tags: ['Zero Proof', 'Bright & Fresh']
  }
];
