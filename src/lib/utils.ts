import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function cleanProductDescription(html: string): string {
  if (!html) return '';
  // Remove emojis (broad ranges for common emojis)
  let cleaned = html.replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F900}-\u{1F9FF}\u{1F018}-\u{1F270}\u{238C}-\u{2454}]/gu, '');
  // Remove asterisks
  cleaned = cleaned.replace(/\*/g, '');
  // Remove multiple spaces created by removals
  cleaned = cleaned.replace(/\s+/g, ' ');
  return cleaned;
}
