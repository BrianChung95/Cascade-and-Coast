import { useState, type SyntheticEvent } from 'react';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import { formatCurrency } from '../../lib/utils';
import type { MenuItem } from '../../lib/types';
import { useUIStore } from '../../store/ui.store';

const FALLBACK_IMAGE = '/src/assets/placeholder.jpg';

interface MenuCardProps {
  item: MenuItem;
}

const MenuCard = ({ item }: MenuCardProps) => {
  const openMenuItem = useUIStore((state) => state.openMenuItem);
  const [isFallbackImage, setIsFallbackImage] = useState(!item.imageUrl);

  const handleImageError = (event: SyntheticEvent<HTMLImageElement>) => {
    const target = event.currentTarget;
    if (target.dataset.fallbackApplied) {
      return;
    }
    target.dataset.fallbackApplied = 'true';
    target.src = FALLBACK_IMAGE;
    setIsFallbackImage(true);
  };

  return (
    <Card
      className="transition hover:border-brand-300 hover:bg-brand-50/60 hover:shadow-brand-200/80"
      header={
        <div className="relative overflow-hidden rounded-2xl">
          <img
            src={item.imageUrl ?? FALLBACK_IMAGE}
            alt={item.title}
            loading="lazy"
            onError={handleImageError}
            className="aspect-[4/3] w-full rounded-2xl object-cover"
          />
          {isFallbackImage ? (
            <span className="absolute inset-x-0 bottom-3 mx-auto max-w-[85%] rounded-full bg-stone-900/80 px-3 py-1 text-center text-xs font-medium uppercase tracking-[0.2em] text-white">
              Photo coming soon
            </span>
          ) : null}
          <Badge className="absolute left-4 top-4 border border-brand-300 bg-white/90 text-brand-700 shadow-sm backdrop-blur">
            {formatCurrency(item.price)}
          </Badge>
        </div>
      }
      footer={
        <div className="flex items-center justify-between gap-2">
          <h3 className="font-display text-lg font-semibold text-slate-900">{item.title}</h3>
          <Button size="sm" variant="secondary" onClick={() => openMenuItem(item)}>
            Details
          </Button>
        </div>
      }
    >
      <p className="text-sm text-slate-600">{item.description}</p>
      {item.tags && item.tags.length > 0 ? (
        <div className="mt-4 flex flex-wrap gap-2">
          {item.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} color="neutral">
              {tag}
            </Badge>
          ))}
        </div>
      ) : null}
    </Card>
  );
};

export default MenuCard;
