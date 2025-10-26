/**
 * Application Constants
 *
 * Central configuration for:
 * - API endpoints and URLs
 * - Menu categories and their mappings
 * - Location data
 * - Pagination settings
 *
 * Modify these constants to configure the application behavior without
 * touching component code.
 */

import type { Category, Location } from './types';

/**
 * External Menu API Base URL
 *
 * Free public API providing menu items for various food categories
 * Used by menu.service.ts to fetch menu data
 */
export const API_BASE_URL = 'https://free-food-menus-api-two.vercel.app';

/**
 * Menu Categories (Order matters - displayed in this order in UI)
 *
 * These categories are used throughout the app:
 * - MenuPage filter tabs
 * - URL validation (isCategory type guard)
 * - API endpoint mapping
 */
export const MENU_CATEGORIES: Category[] = [
  'burgers',
  'sandwiches',
  'sides',
  'cocktails',
  'beverages',
  'desserts',
  'mains'
];

/**
 * Category Display Labels
 *
 * Maps internal category names to user-friendly labels
 * Used in MenuPage tabs and MenuCard badges
 *
 * Example: 'sides' → 'Shareables', 'mains' → 'Chef Specials'
 */
export const CATEGORY_LABELS: Record<Category, string> = {
  burgers: 'Burgers',
  sandwiches: 'Sandwiches',
  sides: 'Shareables',        // Custom label for better UX
  cocktails: 'Cocktails',
  beverages: 'Beverages',
  desserts: 'Desserts',
  mains: 'Chef Specials'       // Custom label for better UX
};

/**
 * Category to API Endpoints Mapping
 *
 * Some categories fetch from multiple endpoints to get variety:
 * - sandwiches: Combines sandwiches + BBQ items
 * - sides: Combines fried chicken + BBQ + pork items
 * - desserts: Combines desserts + chocolates + ice cream
 *
 * Note: Both cocktails and beverages use /drinks endpoint
 * but are differentiated by CATEGORY_KEYWORDS
 *
 * Used in menu.service.ts to fetch category data
 */
export const CATEGORY_ENDPOINTS: Record<Category, string[]> = {
  burgers: ['/burgers'],
  sandwiches: ['/sandwiches', '/bbqs'],
  sides: ['/fried-chicken', '/bbqs', '/porks'],
  cocktails: ['/drinks'],      // Filtered by keywords
  beverages: ['/drinks'],       // Filtered by keywords
  desserts: ['/desserts', '/chocolates', '/ice-cream'],
  mains: ['/steaks', '/porks', '/bbqs']
};

/**
 * Category Keywords for Item Filtering
 *
 * When an endpoint returns mixed items, keywords determine categorization.
 *
 * Critical for /drinks endpoint:
 * - "Maple Old Fashioned" → Contains "old fashioned" → cocktails
 * - "Iced Coffee" → Contains "coffee" → beverages
 *
 * Used in menu.service.ts matchesCategory() function
 * Case-insensitive matching on item title
 *
 * Example: item.title.toLowerCase().includes('old fashioned') → cocktails
 */
export const CATEGORY_KEYWORDS: Record<Category, string[]> = {
  burgers: ['burger', 'cheeseburger', 'patty', 'smash'],
  sandwiches: ['sandwich', 'panini', 'club', 'wrap', 'sub'],
  sides: ['fries', 'rings', 'sticks', 'bites', 'wings', 'slaw'],
  cocktails: ['cocktail', 'spritz', 'old fashioned', 'martini', 'margarita', 'mojito', 'negroni', 'manhattan'],
  beverages: ['coffee', 'tea', 'soda', 'juice', 'beer', 'wine', 'latte', 'cappuccino'],
  desserts: ['cake', 'pie', 'dessert', 'brownie', 'ice cream', 'torte', 'cheesecake', 'sweet'],
  mains: ['steak', 'salmon', 'rib', 'pasta', 'chicken', 'pork', 'shrimp', 'prime']
};

/**
 * Pagination Settings
 *
 * ITEMS_PER_PAGE: Number of menu items shown per page (MenuPage.tsx)
 * MAX_ITEMS_PER_CATEGORY: Limit per category from API to avoid overwhelming UI
 *
 * Both set to 9 for a 3x3 grid layout (responsive: 1 col mobile, 2 cols tablet, 3 cols desktop)
 */
export const ITEMS_PER_PAGE = 9;
export const MAX_ITEMS_PER_CATEGORY = 9;

/**
 * Restaurant Locations
 *
 * Hardcoded location data for all restaurant branches
 * Includes: address, hours, phone, map embed URLs, parking/transit info
 *
 * Used in LocationsPage.tsx and HomePage.tsx (featured locations)
 */
export const LOCATIONS: Location[] = [
  {
    id: 'coal-harbour',
    name: 'Coal Harbour',
    address: '1055 Canada Pl, Vancouver, BC V6C 0C3',
    lat: 49.2884,
    lng: -123.1112,
    phone: '(604) 555-2101',
    hours: {
      monday: '11:00am – 11:00pm',
      tuesday: '11:00am – 11:00pm',
      wednesday: '11:00am – 11:00pm',
      thursday: '11:00am – 12:00am',
      friday: '11:00am – 1:00am',
      saturday: '10:00am – 1:00am',
      sunday: '10:00am – 11:00pm'
    },
    notes: {
      neighborhood: 'Steps from the seawall with harbour views.',
      parking: 'Validated parking in the adjacent convention centre parkade.',
      transit: 'Accessible via Waterfront Station (Expo, Canada Line, SeaBus).'
    },
    mapsEmbedUrl:
      'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2600.53993778163!2d-123.11419032431691!3d49.289254271395204!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x5486717aa5d54a5f%3A0xfa9f42e4466f295e!2sCanada%20Place%2C%20Vancouver%2C%20BC!5e0!3m2!1sen!2sca!4v1718400000000!5m2!1sen!2sca'
  },
  {
    id: 'yaletown',
    name: 'Yaletown',
    address: '1110 Mainland St, Vancouver, BC V6B 2T9',
    lat: 49.2759,
    lng: -123.1206,
    phone: '(604) 555-2123',
    hours: {
      monday: '11:30am – 11:00pm',
      tuesday: '11:30am – 11:00pm',
      wednesday: '11:30am – 11:00pm',
      thursday: '11:30am – 12:00am',
      friday: '11:30am – 1:00am',
      saturday: '10:00am – 1:00am',
      sunday: '10:00am – 10:00pm'
    },
    notes: {
      neighborhood: 'Converted warehouse space with patio laneway seating.',
      parking: 'Metered street parking and EasyPark Lot 179.',
      transit: '3-minute walk from Yaletown-Roundhouse Station (Canada Line).'
    },
    mapsEmbedUrl:
      'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2601.2068829118424!2d-123.12430202431746!3d49.276338571390865!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x5486718144887eb1%3A0xe0bc0f25bf3cce61!2sMainland%20St!5e0!3m2!1sen!2sca!4v1718400000001!5m2!1sen!2sca'
  },
  {
    id: 'gastown',
    name: 'Gastown',
    address: '321 Water St, Vancouver, BC V6B 1B8',
    lat: 49.2832,
    lng: -123.1087,
    phone: '(604) 555-2144',
    hours: {
      monday: '11:00am – 11:00pm',
      tuesday: '11:00am – 11:00pm',
      wednesday: '11:00am – 11:00pm',
      thursday: '11:00am – 12:00am',
      friday: '11:00am – 1:00am',
      saturday: '10:00am – 1:00am',
      sunday: '10:00am – 10:00pm'
    },
    notes: {
      neighborhood: 'Brick-and-beam lounge overlooking Maple Tree Square.',
      parking: 'Impark lot at 150 Water St and street parking after 6pm.',
      transit: 'Waterfront Station (SkyTrain, SeaBus) within a 5-minute walk.'
    },
    mapsEmbedUrl:
      'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2600.9231409151167!2d-123.11112092431718!3d49.28293507139125!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x54867179ce1a6441%3A0xbf5d222dd8e74fff!2sWater%20St%2C%20Vancouver%2C%20BC!5e0!3m2!1sen!2sca!4v1718400000002!5m2!1sen!2sca'
  },
  {
    id: 'west-end',
    name: 'West End',
    address: '1200 Denman St, Vancouver, BC V6G 2N1',
    lat: 49.2893,
    lng: -123.1406,
    phone: '(604) 555-2165',
    hours: {
      monday: '11:00am – 10:00pm',
      tuesday: '11:00am – 10:00pm',
      wednesday: '11:00am – 10:00pm',
      thursday: '11:00am – 11:00pm',
      friday: '11:00am – 12:00am',
      saturday: '10:00am – 12:00am',
      sunday: '10:00am – 10:00pm'
    },
    notes: {
      neighborhood: 'Sunset lounge with English Bay views and weekend DJs.',
      parking: 'Underground parking off Davie St and secure bike racks.',
      transit: 'On the 5/6 bus lines; nearby bike share docks.'
    },
    mapsEmbedUrl:
      'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2601.078220564834!2d-123.1431787243174!3d49.27871707139239!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x5486719ff91738bd%3A0xdf2f66f6c10f17ef!2sDenman%20St!5e0!3m2!1sen!2sca!4v1718400000003!5m2!1sen!2sca'
  },
  {
    id: 'financial-district',
    name: 'Financial District',
    address: '745 Thurlow St, Vancouver, BC V6E 1V8',
    lat: 49.2854,
    lng: -123.1239,
    phone: '(604) 555-2188',
    hours: {
      monday: '11:30am – 10:00pm',
      tuesday: '11:30am – 10:00pm',
      wednesday: '11:30am – 10:00pm',
      thursday: '11:30am – 11:00pm',
      friday: '11:30am – 12:00am',
      saturday: '10:30am – 12:00am',
      sunday: '10:30am – 9:00pm'
    },
    notes: {
      neighborhood: 'Two-level space featuring a chef’s counter and mezzanine bar.',
      parking: 'Underground valet after 4pm; hourly parking at Bentall Centre.',
      transit: 'Between Burrard and Vancouver City Centre stations (SkyTrain).'
    },
    mapsEmbedUrl:
      'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2600.7525550292124!2d-123.12658632431696!3d49.28613917139301!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x54867180adb1d75b%3A0x3c1024c6ebe97ed4!2sThurlow%20St!5e0!3m2!1sen!2sca!4v1718400000004!5m2!1sen!2sca'
  }
];
