import type { Category } from '../../lib/types';
import { CATEGORY_LABELS } from '../../lib/constants';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Tabs from '../ui/Tabs';

interface MenuFiltersProps {
  categories: Category[];
  activeCategory?: Category;
  onCategoryChange: (category?: Category) => void;
  search: string;
  onSearchChange: (value: string) => void;
  sort?: 'price_asc' | 'price_desc';
  onSortChange: (sort?: 'price_asc' | 'price_desc') => void;
  totalItems: number;
}

const MenuFilters = ({
  categories,
  activeCategory,
  onCategoryChange,
  search,
  onSearchChange,
  sort,
  onSortChange,
  totalItems
}: MenuFiltersProps) => {
  return (
    <section className="space-y-4 rounded-[28px] border border-stone-200 bg-white p-6 shadow-lg shadow-brand-100/50">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-display text-xl font-semibold text-slate-900">Explore the Menu</h2>
          <p className="text-sm text-slate-600">
            {totalItems} dishes curated for Cascade &amp; Coast.
          </p>
        </div>
        <Select
          value={sort ?? ''}
          onChange={(event) => {
            const value = event.target.value as 'price_asc' | 'price_desc' | '';
            onSortChange(value ? value : undefined);
          }}
          aria-label="Sort menu items"
          className="sm:w-56"
        >
          <option value="">Sort by</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
        </Select>
      </div>
      <Tabs
        value={activeCategory ?? 'all'}
        onValueChange={(value) => {
          if (value === 'all') {
            onCategoryChange(undefined);
          } else {
            onCategoryChange(value as Category);
          }
        }}
      >
        <Tabs.List>
          <Tabs.Trigger value="all">All</Tabs.Trigger>
          {categories.map((category) => (
            <Tabs.Trigger key={category} value={category}>
              {CATEGORY_LABELS[category]}
            </Tabs.Trigger>
          ))}
        </Tabs.List>
      </Tabs>
      <label className="block text-sm font-medium text-slate-700" htmlFor="menu-search">
        Search the menu
      </label>
      <Input
        id="menu-search"
        type="search"
        placeholder="Search for flavors, ingredients, or dietary tags"
        value={search}
        onChange={(event) => onSearchChange(event.target.value)}
      />
    </section>
  );
};

export default MenuFilters;
