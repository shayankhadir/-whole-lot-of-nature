# UI/UX Fixes Summary

## 1. Text Color Standardization
**Objective:** Improve readability of description text on dark backgrounds.
**Action:** Updated description text color to `var(--mint-100)` (light light green) across key components.

**Modified Components:**
- `src/components/home/HeroSection.tsx`
- `src/components/home/TrustBanner.tsx`
- `src/components/home/Newsletter.tsx`
- `src/components/home/FeaturedProducts.tsx`
- `src/components/home/Categories.tsx`
- `src/components/home/Testimonials.tsx`
- `src/components/home/BlogPreview.tsx`
- `src/components/home/InstagramFeed.tsx`
- `src/components/ui/features-section.tsx`
- `src/components/ui/focus-cards.tsx`

## 2. Shop Dropdown Menu Fix
**Objective:** Prevent the shop submenu from disappearing too easily when navigating.
**Action:** Implemented a "hover intent" delay mechanism.
- Added a 200ms timeout before closing the dropdown.
- Moving the mouse from the button to the dropdown clears the timeout, keeping the menu open.
- This prevents accidental closures when the mouse briefly leaves the active area.

**Modified Component:**
- `src/components/layout/DesktopHeader.tsx`

## Verification
- `npm run build` executed successfully.
