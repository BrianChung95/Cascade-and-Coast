export type Category =
  | 'burgers'
  | 'sandwiches'
  | 'sides'
  | 'cocktails'
  | 'beverages'
  | 'desserts'
  | 'mains';

export interface MenuItem {
  id: string;
  title: string;
  description: string;
  price: number | null;
  imageUrl?: string;
  category: Category;
  tags?: string[];
}

export interface MenuFilters {
  category?: Category;
  search?: string;
  sort?: 'price_asc' | 'price_desc';
  page?: number;
}

export interface LocationNotes {
  neighborhood: string;
  parking: string;
  transit: string;
}

export interface LocationHours {
  monday: string;
  tuesday: string;
  wednesday: string;
  thursday: string;
  friday: string;
  saturday: string;
  sunday: string;
}

export interface Location {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  phone: string;
  hours: LocationHours;
  notes: LocationNotes;
  mapsEmbedUrl: string;
}
