import { Leaf, Sprout, Droplet, Sparkles, Gem, BookOpen, type Icon as LucideIcon } from 'lucide-react';
import type { JSX } from 'react';

export type IconType = (props: { className?: string }) => JSX.Element;

/**
 * Returns a Lucide icon component for a given category name or slug.
 * Fallback: Leaf icon.
 */
export function getCategoryIcon(nameOrSlug?: string): IconType {
  const key = (nameOrSlug || '').toLowerCase();

  // Soil & Growing Media and sub-categories
  if (/(soil|substrate|amendment|fertilizer|manure|mix|aggregate|mould|mold)/.test(key)) return Sprout as unknown as IconType;

  // Land Plants and sub-categories
  if (/(land|indoor|outdoor|garden|succulent|cacti|plant)/.test(key)) return Leaf as unknown as IconType;

  // Aquatic Life & Ecosystem
  if (/(aquatic|water|pond|terrace\s*garden)/.test(key)) return Droplet as unknown as IconType;

  // Wellness & Herbal
  if (/(wellness|herbal|powder|extract|hair|body|care)/.test(key)) return Sparkles as unknown as IconType;

  // Miniature Decor
  if (/(miniature|clay|gift|decor)/.test(key)) return Gem as unknown as IconType;

  // Decor & Digital
  if (/(e-?book|guide|seed|digital|kit)/.test(key)) return BookOpen as unknown as IconType;

  // Default
  return Leaf as unknown as IconType;
}
