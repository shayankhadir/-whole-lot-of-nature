'use client';

import { twMerge } from 'tailwind-merge';
import { ButtonHTMLAttributes, forwardRef } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'text';
  size?: 'sm' | 'md' | 'lg';
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center rounded-xl font-semibold transition-all duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2 ring-offset-white will-change-transform';
    
    const variants = {
      // Primary: Vibrant green solid button - most prominent
      primary: 'bg-gradient-to-r from-emerald-500 to-green-600 text-white border border-emerald-400/20 shadow-lg hover:from-emerald-400 hover:to-green-500 hover:shadow-xl hover:scale-105 active:scale-98 active:shadow-md disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100',
      
      // Secondary: Slightly lighter solid green
      secondary: 'bg-gradient-to-r from-emerald-600 to-green-700 text-white border border-emerald-500/20 shadow-md hover:from-emerald-500 hover:to-green-600 hover:shadow-lg hover:scale-105 active:scale-98 active:shadow-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100',
      
      // Outline: Ghost button with border that fills on hover
      outline: 'border-2 border-emerald-500 bg-transparent text-emerald-400 hover:bg-emerald-500 hover:text-white hover:scale-105 active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100',
      
      // Ghost: Minimal button with background fill on hover
      ghost: 'bg-transparent text-emerald-400 hover:bg-emerald-500/10 hover:scale-105 active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100',
      
      // Text: Minimal text-only button for tertiary actions
      text: 'bg-transparent text-emerald-400 hover:text-emerald-300 hover:underline active:text-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed',
    };

    const sizes = {
      sm: 'px-3 py-2 text-sm gap-1.5',
      md: 'px-6 py-3 text-base gap-2',
      lg: 'px-8 py-4 text-lg gap-2.5',
    };

    return (
      <button
        ref={ref}
        className={twMerge(
          baseStyles,
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';

export default Button;