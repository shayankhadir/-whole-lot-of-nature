import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function cleanProductDescription(html: string): string {
  if (!html) return '';
  // Remove emoji characters (including variation selectors / joiners)
  // Uses Unicode property escapes; supported by modern Node/Chrome.
  let cleaned = html
    .replace(/[\uFE0E\uFE0F]/g, '')
    .replace(/\u200D/g, '')
    .replace(/\p{Extended_Pictographic}/gu, '');
  // Remove asterisks
  cleaned = cleaned.replace(/\*/g, '');
  // Remove multiple spaces created by removals
  cleaned = cleaned.replace(/\s+/g, ' ');
  return cleaned;
}
