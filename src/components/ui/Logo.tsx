import React from 'react';

interface LogoProps {
  className?: string;
  title?: string;
}

// A simple leaf mark that inherits currentColor for dynamic theming
export default function Logo({ className = 'h-8 w-8', title = 'Whole Lot of Nature' }: LogoProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden={title ? undefined : true}
      role={title ? 'img' : 'presentation'}
    >
      {title ? <title>{title}</title> : null}
      {/* Leaf outline */}
      <path
        d="M32 6C22 12 12 22 12 34c0 10 8 18 20 18s20-8 20-18C52 22 42 12 32 6Z"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      {/* Central vein */}
      <path d="M32 12v32" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      {/* Side veins */}
      <path d="M32 22c6 2 10 5 14 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M32 28c-6 2-10 5-14 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M32 18c-5 2-8 4-12 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M32 34c5 2 8 4 12 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
