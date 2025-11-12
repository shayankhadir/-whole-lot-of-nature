# Whole Lot of Nature - Complete Redesign Specifications
## AI Implementation Guide

**Last Updated:** November 12, 2025  
**Status:** Ready for Implementation  
**Store Details:** 29 products, 8 categories, WordPress Headless + Next.js

---

## Quick Reference for AI Code Generation

### Store Architecture
- **Backend:** WordPress Headless CMS (existing at https://wholelotofnature.com)
- **Frontend:** Next.js 14 with React, Tailwind CSS
- **Hosting:** Vercel
- **Total Products:** 29 items
- **Categories:** 8 main categories
- **API:** WooCommerce REST API v3

### Design Token Summary
```javascript
const designTokens = {
  colors: {
    emerald: '#2E7D32',
    turquoise: '#66BB6A',
    sage: '#8BC34A',
    charcoal: '#1A1A1A',
    darkGray: '#2C2C2C',
    gold: '#C4B17C',
    white: '#F8F9FA'
  },
  spacing: {
    baseGap: 24, // Base spacing unit
    goldenRatio: 1.618,
    sections: [24, 38.8, 62.8, 101.6], // Golden ratio progression
  },
  typography: {
    scale: [10, 16, 26, 42, 68, 110, 178, 288], // Golden ratio from 16px base
    families: {
      header: 'Montserrat',
      body: 'Inter',
      accent: 'Poppins'
    }
  },
  borderRadius: {
    card: 8,
    button: 4,
    input: 4,
    pill: 40
  },
  animations: {
    duration: {
      fast: 200,
      normal: 300,
      slow: 600
    },
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
    stagger: 100
  }
}
```

---

## Product Structure & Taxonomy

### 8 Main Categories (29 Products Total)
1. **Soil Mixes & Amendments** (5 products)
   - Focus: Potting mix, organic soil, gardening essentials
   - Target: Indoor gardeners, plant parents
   
2. **Aquatic Plants (Rooted)** (7 products)
   - Focus: Aquarium plants, planted tanks
   - Target: Aquascapers, aquarium beginners

3. **Floating Plants** (4 products)
   - Focus: Pond plants, algae control
   - Target: Pond enthusiasts, natural filtration seekers

4. **Succulents & Indoor** (5 products)
   - Focus: Low-maintenance, desk plants
   - Target: Office workers, home décor buyers

5. **Aquatic Snails** (2 products)
   - Focus: Cleaner snails, aquarium fauna
   - Target: Aquarium hobbyists

6. **Herbal Products** (4 products)
   - Focus: Ayurvedic, wellness supplements
   - Target: Health-conscious users

7. **Plant Décor** (1 product)
   - Focus: Gift sets, handmade items
   - Target: Gift buyers

8. **Digital Products** (2 products)
   - Focus: Plant guides, eBooks
   - Target: Learning enthusiasts

### Tag System (3 Tiers)

#### TIER 1 Priority Tags (Build First - 10+ products each)
- `/tag/aquatic/` - 13 products - "Aquatic plants and aquarium essentials"
- `/tag/beginner-friendly/` - 12 products - "Easy-care plants for beginners"
- `/tag/organic/` - 10 products - "100% organic and eco-friendly"

#### TIER 2 Secondary Tags (5-9 products)
- `/tag/indoor-plant/` - 9 products
- `/tag/aquarium-plants/` - 11 products
- `/tag/low-maintenance/` - 8 products
- `/tag/succulent/` - 5 products
- `/tag/soil/` - 5 products
- `/tag/herbal/` - 4 products

#### TIER 3 Long-Tail Tags (1-4 products)
- `/tag/low-light/`, `/tag/fast-growing/`, `/tag/medicinal/`, `/tag/aquascaping/`

---

## WordPress API Integration

### Required Endpoints
```javascript
// Products
GET /wp-json/wp/v2/products
GET /wp-json/wp/v2/products/{id}
GET /wp-json/wp/v2/products?category={id}
GET /wp-json/wp/v2/products?tag={id}
GET /wp-json/wp/v2/products?search={query}

// Categories
GET /wp-json/wp/v2/categories

// Tags
GET /wp-json/wp/v2/tags

// Custom ACF Fields
GET /wp-json/acf/v3/options/theme-settings
```

### Custom Fields (ACF) Required
```javascript
{
  // SEO Fields
  seo_title: string,
  seo_description: string,
  focus_keyword: string,
  secondary_keywords: string[],
  image_alt_text: string,
  
  // Product Fields
  product_type: string,
  seo_category: string,
  featured_badge: string,
  stock_status: 'in_stock' | 'out_of_stock',
  
  // Media
  images: array,
  featured_image: string
}
```

---

## Homepage Sections (9 Total)

### 1. Hero Section (Full Viewport)
**Layout:** Full-screen with dark forest background

**Required Elements:**
- Background: High-res forest fern photo (2560x1440 min) with 60-70% dark overlay
- SVG ferns extending from top-left and bottom-right corners
- Content positioned at golden ratio: 38% from left

**Content:**
- H1: 110-178px, white, Montserrat Bold, 0.08em letter-spacing
- Subheadline: 26px, 70% opacity white, Inter Regular
- CTA Button: Pill-shaped (4px radius), emerald fill, white text
- Floating Product Card (right side): Glass-morphism card with product preview

**WordPress Fields:**
```javascript
{
  hero_background_image: 'url',
  hero_headline_text: 'Bring the Forest Home',
  hero_subheadline_text: 'Handpicked nature, delivered to your door',
  hero_cta_text: 'Shop Now',
  hero_cta_link: '/shop',
  featured_product_id: 123
}
```

### 2. Trust Indicators / Stats Section
**Layout:** Horizontal row, 2-3 columns, dark background

**Left:** Full-height workspace image with plants
**Right:** Stats grid with glass-morphism cards

**Stats Cards:**
- Background: `rgba(46, 125, 50, 0.1)` with `backdrop-filter: blur(20px)`
- Border: 1px emerald (#2E7D32)
- Number: 68-110px, white, bold
- Label: 16-26px, 70% opacity
- Icon/badge above each stat

**Animation:** CountUp.js on scroll, stagger 100ms, 200ms, 300ms

### 3. Featured Categories Grid
**Layout:** Asymmetric CSS Grid, 2-3 columns

**Card Specifications:**
- Varying heights (tall: 1.618:1 ratio, medium, short)
- Background: Category photo with dark gradient overlay
- Text overlay: Category name (42-68px) bottom-left, description (16px, 60% opacity)
- Hover: Brighten overlay -10%, scale image 1.05, slide-up arrow

**SVG Elements:**
- Decorative leaves/branches "growing" from card edges
- Thin-line botanical corner accents
- Use CSS mask-image for organic edge bleeding

### 4. Featured Products Carousel
**Layout:** Horizontal scroll with snap points

**Card Specs:**
- Size: 320px × 420px (desktop), 24px gap
- Container: Dark card, 8px border-radius, subtle shadow
- Image: White/light circular background, 1:1 aspect ratio
- Product name: 26px Montserrat Semi-Bold
- Description: 16px, 70% opacity, 2 lines max with ellipsis
- Price: 42px, emerald green
- CTA: Icon-only cart button (outlined), hover fills emerald

**Behavior:**
- Smooth horizontal scroll with momentum
- Hide scrollbar, custom navigation arrows
- Snap to card center
- Progress indicator dots below

### 5. How It Works / Process Section
**Layout:** 4 columns (numbered steps)

**Step Card:**
- Large number: 110-178px, stroke outline only, emerald color
- Small icon above or integrated with number
- Heading: 26-42px
- Body text: 16px, multiple lines
- Dark background with 1px border

**Alternative:** Vertical timeline with connecting line, geometric node markers, SVG branch/vine graphic

**Icons Needed:**
- Quality assurance
- Fast delivery
- Wide variety
- Accessibility

### 6. Immersive Visual Banner
**Layout:** Full-width photo banner

**Specs:**
- Full-bleed fern/forest background photo
- Centered large text: 110-288px
- Dark vignette edges
- Parallax scroll effect (background 0.5x speed)

**Typography:**
- Mix ultra-bold and light weights
- Letter-spacing: 0.1-0.15em
- Text shadow: `0 2px 8px rgba(0,0,0,0.4)`

### 7. Product Grid / Shop Section
**Grid:** 3-4 columns desktop, responsive to 2 then 1, 24-32px gap

**Product Card:**
- Image: White/light green background, 4:5 aspect ratio, subtle shadow
- Heart icon: Top-right corner
- Name: 16-20px, 2 lines max
- Category: 12px uppercase, 50% opacity
- Price: 26px bold, emerald green
- Rating: Small SVG stars, golden color
- Cart button: Circular, bottom-right, emerald fill

**Filter Sidebar:**
- Sticky on desktop
- Accordion category filters
- Price range slider (emerald accent)
- Featured products thumbnails

### 8. Newsletter / Contact Form Section
**Layout:** Two-column

**Left:** Large decorative plant SVG with gentle sway animation
**Right:** Form on dark glass-morphism container

**Form Design:**
- Input fields: Transparent background, 1px bottom border only
- Border: 40% opacity white, focus: emerald glow
- Field height: 68px, 26px vertical spacing
- Submit button: Full-width pill-shaped (40px radius), emerald fill

### 9. Footer
**Background:** Pure black or very dark green (#0D3B1F)

**Layout:** 3-column grid

**Column 1 - Brand:**
- Logo (white or emerald version)
- Tagline: 16px, 70% opacity
- Social icons: Outlined circles, emerald hover

**Column 2 - Quick Links:**
- Navigation menu
- 16px, hover underline emerald

**Column 3 - Contact:**
- Phone, email, address
- Small location icon SVGs

**Decorative:**
- Thin emerald line separator at top
- Geometric leaf pattern background (10% opacity)
- Root/vine SVG extending up from footer

---

## React Component Structure

### Core Components to Build

```javascript
// Product Components
<ProductCard />         // Individual product card
<ProductGrid />         // Grid layout with filters
<ProductCarousel />     // Horizontal scroll carousel
<ProductDetail />       // Single product page

// Layout Components
<Hero />                // Hero section with CTA
<StatsSection />        // Animated stats cards
<CategoryGrid />        // Featured categories
<ProcessSteps />        // How it works
<ImmersiveBanner />     // Full-width parallax banner
<NewsletterForm />      // Email capture form
<Footer />              // 3-column footer

// UI Components
<Button />              // Reusable button (pill, outline, filled)
<Input />               // Form input with emerald focus
<Filter />              // Category/tag/price filters
<SearchBar />           // Autocomplete search
<Badge />               // Product badges (organic, new, etc.)
<Rating />              // Star rating display
<LoadingSkeleton />     // Skeleton screens with emerald shimmer

// Utility Components
<ScrollAnimation />     // Intersection Observer wrapper
<ParallaxImage />       // Parallax background images
<GlassMorphism />       // Glass effect container
```

### Example: ProductGrid Component Spec

```javascript
// Tell AI this for code generation:
"Build ProductGrid component fetching /wp-json/wp/v2/products:
- 4 cols desktop, responsive to 2/1, 24px gap golden ratio spacing
- Next/Image lazy loading + responsive srcset
- Intersection Observer scroll animations (fade-in-up, 600ms, stagger 100ms)
- Emerald accents, dark backgrounds, glass-morphism cards
- Skeleton loading states with emerald shimmer
- Error handling and empty states
- Filters: category dropdown, tag multi-select, price range slider, sort options
- Pagination: Load more button or infinite scroll"
```

---

## SVG Assets Required

### Botanical Illustrations (Outline Style, 2px Stroke)
- **Fern Fronds:** 4 variations (different angles)
- **Succulent Plants:** Tall, stacked leaves
- **Monstera Leaf:** Outline with characteristic holes
- **Tree Branches:** Silhouettes extending from corners
- **Root Systems:** For footer decoration
- **Geometric Leaves:** Polygonal, angular shapes
- **Flower Outlines:** Minimal line art
- **Seed/Pod Shapes:** Simple geometric forms

### UI Icons (2px Stroke, Emerald or White)
- Shopping cart
- Search magnifier
- User profile
- Heart (wishlist)
- Menu hamburger
- Arrow (directional)
- Check mark
- Star (ratings)
- Delivery truck
- Shield (guarantee)
- Gift box
- Phone/email/location pins

### Decorative Elements
- Water droplets
- Sun rays (angular, not circular)
- Geometric polygonal leaves
- Connecting lines/vines for timelines

---

## Animation Specifications

### Scroll Animations (Intersection Observer)

**Fade In Up:**
```css
initial: { opacity: 0, y: 40 }
animate: { opacity: 1, y: 0 }
transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] }
stagger: 0.1
```

**Scale In (Stats, Icons):**
```css
initial: { opacity: 0, scale: 0.8 }
animate: { opacity: 1, scale: 1 }
transition: { duration: 0.4 }
```

**Parallax Backgrounds:**
- Background moves at 0.5x scroll speed
- Foreground content at 1x speed

### Hover Interactions

**Cards:**
```css
transform: translateY(-8px)
box-shadow: 0 12px 24px rgba(46, 125, 50, 0.2)
transition: 300ms
```

**Buttons:**
```css
transform: scale(1.05)
box-shadow: 0 4px 16px rgba(46, 125, 50, 0.4)
transition: 200ms
```

**Images:**
```css
transform: scale(1.1)  /* within container */
filter: brightness(1.1)
transition: 400ms
```

### Micro-Interactions
- **Add to Cart:** Button morphs to checkmark, brief scale pulse
- **Like/Wishlist:** Heart fills with color, slight bounce animation
- **Number Counters:** Animate from 0 to value on scroll (CountUp.js)
- **Loading States:** Emerald shimmer skeleton screens

---

## Responsive Breakpoints

```javascript
const breakpoints = {
  'xs': 375,   // Small mobile (minimum)
  'sm': 640,   // Mobile
  'md': 768,   // Tablet
  'lg': 1024,  // Desktop
  'xl': 1440,  // Large desktop
  '2xl': 1920  // Extra large (max content: 1600px)
}
```

### Typography Scaling
- **Desktop:** Full scale (10-288px)
- **Tablet (768px):** 0.8x scale
- **Mobile (640px):** 0.65x scale
- Maintain golden ratio relationships

### Layout Adjustments
- **Hero:** Stack vertically on mobile
- **Grid:** 4 → 3 → 2 → 1 columns
- **Navigation:** Hamburger menu below 1024px
- **Footer:** Stack columns vertically on mobile
- **Carousel:** 2 cards visible on tablet, 1.2 on mobile with peek

---

## Performance Targets

### Lighthouse Scores (Minimum)
- **Performance:** 90+
- **Accessibility:** 90+
- **Best Practices:** 90+
- **SEO:** 100

### Core Web Vitals
- **First Contentful Paint (FCP):** < 1.5s
- **Largest Contentful Paint (LCP):** < 2.5s
- **Time to Interactive (TTI):** < 3.5s
- **Cumulative Layout Shift (CLS):** < 0.1
- **First Input Delay (FID):** < 100ms

### Optimization Strategies
- Code splitting by route
- Lazy load images and heavy components
- Minimize third-party scripts
- Use CDN for static assets
- Implement service worker for offline functionality
- WebP images with JPG fallback
- Responsive image srcset
- Preload critical assets
- Defer non-critical JavaScript

---

## SEO Implementation

### Every Product Page Must Have

**Meta Tags:**
```html
<title>{seo_title} | Whole Lot of Nature</title>
<meta name="description" content="{seo_description}" />
<meta name="keywords" content="{focus_keyword}, {secondary_keywords}" />
<link rel="canonical" href="{product_url}" />
```

**Open Graph:**
```html
<meta property="og:title" content="{seo_title}" />
<meta property="og:description" content="{seo_description}" />
<meta property="og:image" content="{featured_image}" />
<meta property="og:url" content="{product_url}" />
<meta property="og:type" content="product" />
```

**JSON-LD Product Schema:**
```json
{
  "@context": "https://schema.org/",
  "@type": "Product",
  "name": "{product_name}",
  "image": ["{image_urls}"],
  "description": "{seo_description}",
  "sku": "{product_id}",
  "brand": {
    "@type": "Brand",
    "name": "Whole Lot of Nature"
  },
  "offers": {
    "@type": "Offer",
    "priceCurrency": "INR",
    "price": "{price}",
    "availability": "https://schema.org/InStock",
    "url": "{product_url}"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "{average_rating}",
    "reviewCount": "{review_count}"
  }
}
```

### Tag Page Strategy
Each TIER 1 tag page should have:
- Unique meta title and description
- H1 with tag name and keyword
- 12-20 products with pagination
- Related category links
- Internal links to other relevant tags
- FAQ specific to that tag
- Breadcrumb navigation

Example: `/tag/beginner-friendly/`
- Meta Title: "Beginner-Friendly Plants | Easy to Care Indoor & Outdoor Plants"
- H1: "Beginner-Friendly Plants - Perfect for First-Time Plant Parents"
- Description: "Discover 12 easy-to-care plants perfect for beginners. Low maintenance, forgiving, and beautiful."

---

## Technical Implementation Checklist

### Phase 1: Setup & Configuration
- [ ] Next.js 14 project initialized
- [ ] Tailwind CSS configured with custom colors
- [ ] WordPress API connection tested
- [ ] Environment variables configured
- [ ] Typography fonts loaded (Montserrat, Inter, Poppins)
- [ ] SVG asset library created
- [ ] Component folder structure established

### Phase 2: Core Components
- [ ] Layout wrapper with header/footer
- [ ] ProductCard component with all variants
- [ ] ProductGrid with filters and pagination
- [ ] ProductCarousel with horizontal scroll
- [ ] Button component (pill, outline, filled variants)
- [ ] Input component with emerald focus states
- [ ] Loading skeleton components

### Phase 3: Homepage Sections
- [ ] Hero section with parallax background
- [ ] Stats section with CountUp animation
- [ ] Category grid with hover effects
- [ ] Product carousel with snap scrolling
- [ ] Process steps with SVG icons
- [ ] Immersive banner with parallax
- [ ] Product grid section
- [ ] Newsletter form with validation
- [ ] Footer with 3 columns

### Phase 4: Product Pages
- [ ] Product detail page template
- [ ] Image gallery with lightbox
- [ ] Add to cart functionality
- [ ] Related products section
- [ ] Product reviews section
- [ ] SEO meta tags and JSON-LD

### Phase 5: Category & Tag Pages
- [ ] Category page template
- [ ] Tag page template
- [ ] Filter sidebar component
- [ ] Sort functionality
- [ ] Pagination or infinite scroll
- [ ] Breadcrumb navigation

### Phase 6: Additional Pages
- [ ] Shop page with all products
- [ ] Cart page
- [ ] Checkout flow
- [ ] About page
- [ ] Contact page
- [ ] Blog integration

### Phase 7: Performance & SEO
- [ ] Image optimization (WebP, srcset)
- [ ] Code splitting implemented
- [ ] Lazy loading for images
- [ ] Service worker for offline mode
- [ ] Sitemap generation
- [ ] Robots.txt configured
- [ ] Meta tags on all pages
- [ ] JSON-LD on all product pages
- [ ] Performance testing (Lighthouse 90+)

### Phase 8: Testing & Launch
- [ ] Cross-browser testing
- [ ] Mobile responsiveness verified
- [ ] Accessibility audit (WCAG AA)
- [ ] API error handling tested
- [ ] Loading states verified
- [ ] Form validation working
- [ ] Analytics integrated
- [ ] Deploy to Vercel production

---

## Files Reference

**Documentation:**
- `REDESIGN_SPECIFICATIONS.md` - This file (master reference)
- `wln-ai-guide.md` - 18-section detailed developer guide
- `wln-quick-reference.md` - Quick lookup with priorities
- `Premium Garden Store Website Design Structure & Im.md` - Complete design specs

**Data Files:**
- `whole_lot_of_nature_products.json` - Full product database
- `whole_lot_of_nature_seo_products.csv` - WordPress bulk import file

---

## AI Prompts for Code Generation

### Generate ProductGrid Component
```
Build a ProductGrid component for Next.js 14:
- Fetch products from /wp-json/wp/v2/products
- 4 columns on desktop, 2 on tablet, 1 on mobile
- 24px gap using golden ratio spacing
- Dark charcoal background (#1A1A1A)
- Each card has glass-morphism effect (backdrop-filter: blur(20px))
- Lazy load images using next/image
- Intersection Observer for scroll animations (fade-in-up, 600ms duration, 100ms stagger)
- Emerald green accents for hover states
- Include filter sidebar: category dropdown, price range slider, sort options
- Skeleton loading states with emerald shimmer effect
- Error and empty state handling
```

### Generate Hero Section
```
Build a Hero section component:
- Full viewport height (100vh)
- Background: Dark forest photo with 60% black overlay
- SVG fern illustrations in top-left and bottom-right corners extending beyond boundaries
- Content positioned at golden ratio (38% from left)
- H1 typography: 178px Montserrat Bold, white, 0.08em letter-spacing
- Subheadline: 26px Inter Regular, 70% opacity white
- CTA button: Pill-shaped (40px border-radius), emerald green (#2E7D32), white text
- Floating product card on right: glass-morphism card with Next/Image product
- Parallax scroll effect on background (0.5x speed)
- Smooth fade-in animation on mount
```

### Generate ProductCard Component
```
Build a ProductCard component:
- Container: 320px × 420px, 8px border-radius, dark background (#2C2C2C)
- Image area: White circular background, 1:1 aspect ratio, centered product photo
- Product name: 26px Montserrat Semi-Bold, white
- Description: 16px Inter, 70% opacity, max 2 lines with ellipsis
- Price: 42px bold, emerald green (#2E7D32)
- Cart button: Icon-only, outlined, bottom-right position
- Hover effects: translateY(-8px), emerald glow shadow, 300ms transition
- Heart icon for wishlist: top-right corner
- Badge for "New" or "Organic": top-left corner, muted gold background
- Lazy load image with blur-up placeholder
```

---

## Design Don'ts (Critical)

### Visual Don'ts
- ❌ No fully rounded corners (use 4-8px max, not 0px, not 50px)
- ❌ No light backgrounds (except product card image areas)
- ❌ No bright colors outside specified palette
- ❌ No busy patterns or textures
- ❌ No decorative fonts or scripts
- ❌ No excessive animations (keep subtle)

### Technical Don'ts
- ❌ Don't ignore golden ratio for spacing
- ❌ Don't hardcode values (use design tokens)
- ❌ Don't skip loading states
- ❌ Don't ignore error handling
- ❌ Don't load all images eagerly
- ❌ Don't skip accessibility attributes

---

**STATUS: Ready for AI Implementation**
All specifications complete. Use this file as master reference when generating code.
