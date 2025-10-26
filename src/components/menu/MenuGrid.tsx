import MenuCard from './MenuCard';
import Skeleton from '../ui/Skeleton';
import type { MenuItem } from '../../lib/types';

interface MenuGridProps {
  items: MenuItem[];
  isLoading?: boolean;
  skeletonCount?: number;
}

const MenuGrid = ({ items, isLoading = false, skeletonCount = 6 }: MenuGridProps) => {
  if (isLoading) {
    // Mirror the final layout shape while data loads to avoid layout shift.
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
      {/* Render each dish as a MenuCard once content is ready. */}
      {items.map((item) => (
        <MenuCard key={item.id} item={item} />
      ))}
    </div>
  );
};

export default MenuGrid;
