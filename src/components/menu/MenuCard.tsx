/**
 * MenuCard Component
 *
 * Displays a single menu item with image, title, description, price, and tags.
 *
 * Zustand Usage Pattern (No Prop Drilling):
 * - This component calls useUIStore directly to get openMenuItem action
 * - No need to pass onQuickView prop from MenuPage → MenuGrid → MenuCard
 * - MenuGrid doesn't need to know about modal state at all
 *
 * Component Hierarchy:
 * MenuPage (reads activeMenuItem)
 *   └─ MenuGrid (no modal knowledge)
 *        └─ MenuCard (calls openMenuItem directly) ← THIS COMPONENT
 *
 * When user clicks "Details" button:
 * 1. MenuCard calls openMenuItem(item)
 * 2. Zustand updates global activeMenuItem state
 * 3. MenuPage (subscribed to activeMenuItem) re-renders
 * 4. Modal shows with item details
 */

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
  // Note: No onQuickView prop needed! Zustand handles it globally
}

const MenuCard = ({ item }: MenuCardProps) => {
  // ===== ZUSTAND GLOBAL STATE =====
  // Get action directly from store - no prop drilling!
  // This is the correct way to use Zustand for global actions
  const openMenuItem = useUIStore((state) => state.openMenuItem);

  // ===== LOCAL COMPONENT STATE =====
  // Image fallback is local to this card, not global
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
