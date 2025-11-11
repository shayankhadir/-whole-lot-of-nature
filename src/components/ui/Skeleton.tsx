import { twMerge } from 'tailwind-merge';

interface SkeletonProps {
  className?: string;
}

// Generic shimmer skeleton with a subtle leaf vein overlay for nature theme
export default function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={twMerge(
  'relative overflow-hidden rounded-lg bg-gradient-to-br from-primary-50 to-[#EAF6EF]',
        'before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_1.6s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/50 before:to-transparent',
        'border border-primary-100/60 shadow-sm',
        className
      )}
      style={{
        maskImage:
          'radial-gradient(180px 100px at 10% 10%, black 40%, transparent 41%), radial-gradient(140px 120px at 90% 20%, black 45%, transparent 46%), radial-gradient(160px 120px at 30% 90%, black 40%, transparent 41%), radial-gradient(120px 100px at 80% 80%, black 45%, transparent 46%)',
        WebkitMaskImage:
          'radial-gradient(180px 100px at 10% 10%, black 40%, transparent 41%), radial-gradient(140px 120px at 90% 20%, black 45%, transparent 46%), radial-gradient(160px 120px at 30% 90%, black 40%, transparent 41%), radial-gradient(120px 100px at 80% 80%, black 45%, transparent 46%)',
      }}
    />
  );
}

// Tailwind keyframes (shimmer) are defined in tailwind.config.ts via arbitrary value above
