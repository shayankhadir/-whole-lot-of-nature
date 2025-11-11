import React from 'react';

interface WordmarkProps {
  className?: string;
}

// SVG wordmark using live text so it inherits currentColor and can be animated via CSS.
export default function Wordmark({ className = 'h-6' }: WordmarkProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 1200 120"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Whole Lot of Nature"
    >
      <defs>
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <g style={{ filter: 'none' }}>
        <text
          x="0"
          y="90"
          fontFamily="'Plus Jakarta Sans', system-ui, -apple-system, Segoe UI, Roboto, 'Helvetica Neue', Arial, 'Noto Sans', 'Apple Color Emoji', 'Segoe UI Emoji'"
          fontWeight={700}
          fontSize={84}
          fill="currentColor"
        >
          Whole Lot of Nature
        </text>
      </g>
    </svg>
  );
}
