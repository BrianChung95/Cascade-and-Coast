import MenuCard from './MenuCard';
import Skeleton from '../ui/Skeleton';
import type { MenuItem } from '../../lib/types';

interface MenuGridProps {
  items: MenuItem[];
  isLoading?: boolean;
  skeletonCount?: number;
  onQuickView: (item: MenuItem) => void;
}

const MenuGrid = ({ items, isLoading = false, skeletonCount = 6, onQuickView }: MenuGridProps) => {
  if (isLoading) {
    return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: skeletonCount }).map((_, index) => (
          <Skeleton key={index} className="h-80 w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <MenuCard key={item.id} item={item} onQuickView={onQuickView} />
      ))}
    </div>
  );
};

export default MenuGrid;
