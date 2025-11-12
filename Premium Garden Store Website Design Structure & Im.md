<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" style="height:64px;margin-right:32px"/>

# Premium Garden Store Website Design Structure \& Implementation Guide

Based on analysis of the provided design references and current premium design trends, here's a comprehensive structure for your immersive forest-themed garden store website optimized for WordPress headless CMS with JavaScript frontend.

## Design Philosophy \& Core Principles

**Visual Identity:** Dark, moody forest aesthetic with emerald green (\#2E7D32) and turquoise (\#66BB6A) accents against deep charcoal (\#1A1A1A) and rich black backgrounds, creating an immersive nighttime forest atmosphere.[^1][^2][^3][^4][^5][^6][^7]

**Key Design Elements:**

- Sharp, geometric containers with subtle rounded corners (4-8px max)
- Generous negative space following golden ratio proportions
- Layered depth using translucent overlays and backdrop blur effects
- Photographic product imagery with clean white backgrounds
- Subtle micro-animations triggered by scroll and hover interactions


## Section-by-Section Homepage Structure

### 1. Hero Section (Full Viewport Height)

**Layout Structure:**

- Full-screen immersive background: High-resolution forest fern photograph with dark gradient overlay (opacity 60-70%)
- Ferns/leaves extending from corners creating natural framing effect
- Content positioned using golden ratio: 38% from left, 62% white space

**Elements Required:**

- **Background Layer:** Dark forest photograph (2560x1440px minimum) with depth-of-field blur
- **SVG Decorative Elements:**
    - Geometric fern fronds positioned at top-left and bottom-right corners
    - Sharp-edged leaf silhouettes with 2px stroke weight
    - Layered at different z-indexes for depth
- **Text Content:**
    - Main headline: 110-178px (H2-H1 scale), white color, Montserrat Bold
    - Subheadline: 26px, 70% opacity white, Inter Regular
    - Letter-spacing: 0.08em for headlines
- **CTA Button:**
    - Pill-shaped with sharp 4px corners
    - Emerald green fill with white text
    - Hover: Scale 1.05, subtle glow effect
- **Product Preview Card (Floating):**
    - Positioned absolute right side
    - Dark glass-morphism card (backdrop-filter: blur(20px))
    - Contains product image on white circular background
    - Sharp-edged CTA button below

**WordPress API Fields Needed:**

```
hero_background_image
hero_headline_text
hero_subheadline_text
hero_cta_text
hero_cta_link
featured_product_image
featured_product_name
```


### 2. Trust Indicators / Stats Section

**Layout:** Horizontal row, 2-3 columns, dark background with subtle texture

**Elements:**

- **Stat Cards:**
    - Glass-morphism containers with 1px emerald border
    - Large number: 68-110px (golden ratio from body text)
    - Label below: 16-26px
    - Icon/badge above each stat
- **Left Content:**
    - Full-height image of office/workspace filled with plants
    - Overlay gradient from transparent to dark
- **Right Stats Grid:**
    - "10 лет на рынке" style badges
    - Dark green semi-transparent backgrounds
    - White text with green accent highlights

**Implementation Notes:**

- Cards use `background: rgba(46, 125, 50, 0.1)` with blur
- Animate numbers on scroll using CountUp.js
- Stagger animation delays: 100ms, 200ms, 300ms


### 3. Featured Categories Grid

**Layout:** Asymmetric grid using CSS Grid (not equal columns)

**Structure:**

- 2-3 column responsive grid
- Cards have varying heights (tall, medium, short)
- Golden ratio proportions: 1.618:1 aspect ratio for tall cards

**Category Card Design:**

- **Background:** Product/category photo with dark gradient overlay
- **Hover Effect:**
    - Brighten overlay (reduce opacity 10%)
    - Scale image 1.05
    - Slide-up arrow icon
- **Text Overlay:**
    - Category name: 42-68px, bottom-left positioned
    - Small description: 16px, 60% opacity
    - Geometric arrow icon (SVG)

**SVG Elements:**

- Decorative leaves/branches "growing" from card edges
- Thin-line botanical illustrations as corner accents
- Use `mask-image` for organic edge bleeding effects

**WordPress Fields:**

```
category_name
category_description
category_image
category_link
category_icon_svg
```


### 4. Featured Products Carousel

**Design Specifications:**

- Horizontal scroll container with snap points
- Cards: 320px wide × 420px tall on desktop
- 24px gap between cards (golden ratio derived)

**Product Card Structure:**

- **Container:** Dark card with 8px border-radius, subtle shadow
- **Image Area:**
    - White/light background circle or rounded square
    - Product photo centered, generous padding
    - Aspect ratio: 1:1
- **Content Area:**
    - Product name: 26px, Montserrat Semi-Bold
    - Short description: 16px, 70% opacity, 2 lines max with ellipsis
    - Price: 42px (golden ratio up from name), emerald green color
- **CTA:**
    - Icon-only cart button (outlined, not filled)
    - Hover: Fill with emerald, icon turns white

**Scroll Behavior:**

- Smooth horizontal scroll with momentum
- Hide scrollbar, use custom navigation arrows
- Snap to each card center
- Progress indicator dots below carousel


### 5. How It Works / Process Section

**Layout:** Numbered steps in horizontal row (4 columns)

**Step Card Design (from reference image 1):**

- Large number: 110-178px, stroke outline only, emerald color
- Small icon above or integrated with number
- Heading: 26-42px
- Body text: 16px, multiple lines
- Dark background cards with 1px border

**Alternative Layout (Vertical Timeline):**

- Left-aligned content with connecting line
- Geometric node markers at each step
- SVG branch/vine graphic following the timeline path

**SVG Elements:**

- Minimal line-art icons for each step (quality, speed, variety, accessibility)
- Connecting dotted lines between steps
- Decorative leaf accents


### 6. Immersive Visual Section

**Full-Width Photo Banner:**

- Similar to "botanical" coffee reference (image 4)
- Full-bleed fern/forest background photograph
- Centered large text overlay: 110-288px
- Dark vignette edges focusing attention center
- Parallax scroll effect (background moves slower than foreground)

**Typography Treatment:**

- Use mix of ultra-bold and light weights
- Letter-spacing: 0.1-0.15em for dramatic effect
- Text shadow for legibility: `0 2px 8px rgba(0,0,0,0.4)`


### 7. Product Grid / Shop Section

**Grid Specifications:**

- 3-4 columns on desktop, responsive to 2 then 1
- Equal height cards using `grid-auto-rows`
- 24-32px gap (golden ratio derived)

**Product Card (Clean Style - Image 3, 5, 6):**

- **Image Container:**
    - White or very light green background
    - Product photo with subtle drop shadow
    - 4:5 aspect ratio (portrait orientation)
    - Heart/wishlist icon top-right corner
- **Info Section:**
    - Product name: 16-20px, 2 lines max
    - Category/tag: 12px, uppercase, 50% opacity
    - Price: 26px, bold, emerald green
    - Star rating: Small SVG stars, golden color
- **Cart Button:**
    - Small circular button with cart icon
    - Position: bottom-right of card
    - Emerald fill, white icon

**Filter Sidebar (from Image 6):**

- Sticky sidebar on desktop
- Accordion-style category filters
- Price range slider with emerald accent
- Featured products thumbnails below filters


### 8. Newsletter / Contact Form Section

**Two-Column Layout:**

- Left: Large decorative plant illustration (SVG or PNG with transparency)
- Right: Form fields on dark glass-morphism container

**Form Design (Image 8, 9 reference):**

- **Input Fields:**
    - Transparent background with 1px bottom border only
    - Border color: 40% opacity white
    - Focus state: Emerald glow effect
    - Placeholder text: 60% opacity
    - Field height: 68px (golden ratio derived)
    - 26px vertical spacing between fields
- **Submit Button:**
    - Full-width or centered
    - Pill-shaped (40px border-radius)
    - Emerald or gold accent fill
    - Hover: Slight scale and glow

**Left Decorative Element:**

- Botanical illustration: Tall succulent plant (image 1 bottom)
- SVG format for crisp rendering
- Subtle animation: Gentle sway or floating motion
- Positioned with negative margin to overlap slightly


### 9. Footer

**Structure:** Dark background (pure black or very dark green)

**Layout (3-Column Grid):**

- **Column 1: Brand \& Social**
    - Logo (white or emerald version)
    - Tagline: 16px, 70% opacity
    - Social icons: Outlined circles, emerald hover fill
- **Column 2: Quick Links**
    - Navigation menu repeated
    - Links: 16px, hover underline emerald
- **Column 3: Contact Info**
    - Phone, email, address
    - Small location icon SVGs

**Decorative Elements:**

- Thin emerald line separator at top of footer
- Small geometric leaf pattern in background (10% opacity)
- Root or vine SVG graphic extending up from footer into last section


## Color Palette Specifications

**Primary Colors:**

- **Emerald Green:** \#2E7D32 (primary actions, accents)
- **Turquoise Green:** \#66BB6A (secondary accents, highlights)
- **Sage Green:** \#8BC34A (tertiary, badges)

**Neutral Colors:**

- **Charcoal:** \#1A1A1A (primary dark background)
- **Dark Gray:** \#2C2C2C (card backgrounds)
- **Medium Gray:** \#757575 (body text)
- **Light Gray:** \#E0E0E0 (borders, dividers)
- **Off-White:** \#F8F9FA (product card backgrounds, light sections)

**Accent Colors:**

- **Muted Gold:** \#C4B17C (premium highlights, badges)
- **Deep Forest:** \#0D3B1F (ultra-dark sections)

**Usage Rules:**

- Backgrounds: Always dark (\#1A1A1A to \#0D3B1F range)
- Text: White (\#FFFFFF) at varying opacities (100%, 70%, 40%)
- CTAs: Emerald green with white text
- Borders: 1px, 20-40% opacity white or emerald
- Overlays: `rgba(0,0,0,0.6)` over photos


## Typography System (Golden Ratio Based)

**Font Families:**

- **Headers:** Montserrat (weights: 600, 700)
- **Body:** Inter (weights: 400, 500)
- **Accents:** Poppins (weight: 300 for special large text)

**Scale (from 16px base):**

- 10px - Fine print, captions
- 16px - Body text, descriptions
- 26px - Small headers (H6), large buttons
- 42px - Medium headers (H4-H5)
- 68px - Large headers (H3)
- 110px - Extra large (H2)
- 178px - Hero headers (H1)
- 288px - Statement text (rare use)

**Text Styling:**

- **Line Height:** 1.4 for body, 1.2 for headers
- **Letter Spacing:**
    - Body: 0em (normal)
    - Small headers: 0.02em
    - Large headers: 0.08-0.1em
- **Font Weight Distribution:**
    - Body: 400
    - Emphasis: 500
    - Headers: 600-700


## SVG Graphics \& Iconography

**Required SVG Assets:**

1. **Botanical Illustrations:**
    - Fern fronds (3-4 variations)
    - Succulent plants (tall, stacked leaves)
    - Monstera leaf outlines
    - Tree branch silhouettes
    - Root systems (for footer)
2. **UI Icons (Outline Style, 2px stroke):**
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
    - Phone/email/location
3. **Decorative Elements:**
    - Geometric polygonal leaves
    - Minimal flower outlines
    - Seed/pod shapes
    - Water droplets
    - Sun rays (angular, not circular)

**SVG Style Guidelines:**

- **Stroke Weight:** Consistent 2px
- **Color:** Emerald green (\#2E7D32) or white
- **Corners:** Sharp angles, no rounded joins
- **Fill:** Use sparingly, mostly outline-based
- **Animation:** Subtle draw-in effects using `stroke-dasharray`


## Interaction \& Animation Specifications

**Scroll Animations (Intersection Observer):**

- **Fade In Up:** Cards, text blocks
    - Translate Y: 40px → 0px
    - Opacity: 0 → 1
    - Duration: 600ms
    - Easing: cubic-bezier(0.4, 0, 0.2, 1)
    - Stagger: 100ms per element
- **Scale In:** Stats, icons
    - Scale: 0.8 → 1
    - Opacity: 0 → 1
    - Duration: 400ms
- **Parallax Backgrounds:**
    - Background images move at 0.5x scroll speed
    - Foreground content at 1x speed
    - Create depth perception

**Hover Interactions:**

- **Cards:**
    - Transform: translateY(-8px)
    - Box-shadow: Increase depth
    - Duration: 300ms
- **Buttons:**
    - Transform: scale(1.05)
    - Box-shadow: 0 4px 16px rgba(46, 125, 50, 0.4)
    - Duration: 200ms
- **Images:**
    - Transform: scale(1.1) (within container)
    - Filter: brightness(1.1)
    - Duration: 400ms

**Loading States:**

- Skeleton screens with emerald shimmer effect
- Circular loading spinner (emerald color)
- Progress bars for image loading

**Micro-Interactions:**

- Add to cart: Button morphs to checkmark, brief scale pulse
- Like/wishlist: Heart fills with color, slight bounce
- Number counters: Animate from 0 to value on scroll into view


## Responsive Breakpoints

**Desktop-First Approach:**

- **Extra Large:** 1920px+ (max content width: 1600px)
- **Large Desktop:** 1440px (max content width: 1280px)
- **Desktop:** 1024px (standard grid layouts)
- **Tablet:** 768px (2-column grids, stacked sections)
- **Mobile:** 640px (single column, adjusted typography scale)
- **Small Mobile:** 375px (minimum supported)

**Typography Scaling:**

- Reduce font sizes by 0.8x at tablet breakpoint
- Reduce by 0.65x at mobile breakpoint
- Maintain golden ratio relationships

**Layout Adjustments:**

- Hero: Stack content vertically on mobile
- Grid: 4 → 3 → 2 → 1 columns
- Navigation: Hamburger menu below 1024px
- Footer: Stack columns vertically on mobile


## WordPress Headless CMS Structure

**Custom Post Types:**

1. **Products**
    - Fields: name, description, price, images[], category, tags[], stock_status, featured_badge
2. **Categories**
    - Fields: name, description, image, icon_svg, parent_category
3. **Pages**
    - Fields: title, content_blocks[] (flexible content using ACF)

**Content Blocks (Modular Sections):**

- Hero Block
- Stats Block
- Category Grid Block
- Product Carousel Block
- Process Steps Block
- Full-Width Image Block
- Newsletter Form Block
- Custom HTML Block

**API Endpoints:**

```
/wp-json/wp/v2/products
/wp-json/wp/v2/categories
/wp-json/wp/v2/pages
/wp-json/acf/v3/options/theme-settings
```

**Media Management:**

- All images uploaded at 2x resolution minimum
- WebP format with JPG fallback
- Lazy loading enabled
- Responsive image srcset generation


## Technical Implementation Guidelines

**Frontend Stack:**

- **Framework:** React.js or Next.js (for SSR/SSG)
- **Styling:** Tailwind CSS + Custom CSS for complex animations
- **Animation:** Framer Motion or GSAP
- **State Management:** Context API or Zustand
- **Image Optimization:** Next/Image or react-lazy-load-image-component

**Performance Targets:**

- Lighthouse Score: 90+ (all metrics)
- First Contentful Paint: < 1.5s
- Largest Contentful Paint: < 2.5s
- Time to Interactive: < 3.5s
- Cumulative Layout Shift: < 0.1

**Optimization Strategies:**

- Code splitting by route
- Lazy load images and heavy components
- Minimize third-party scripts
- Use CDN for static assets
- Implement service worker for offline functionality


## Design Assets Checklist for WordPress Upload

**Required for CMS:**

1. ✅ Logo (SVG format, white and color versions)
2. ✅ Favicon set (16x16 to 512x512)
3. ✅ Hero background images (2560x1440 WebP)
4. ✅ Category images (1200x800 minimum)
5. ✅ Product placeholder images (800x1000)
6. ✅ Icon set (all UI icons as individual SVGs)
7. ✅ Botanical illustration SVGs (decorative elements)
8. ✅ Pattern backgrounds (seamless textures)

**WordPress Plugin Recommendations:**

- **ACF Pro:** Custom fields for flexible content
- **WP REST API:** Headless functionality
- **WP GraphQL:** Alternative to REST API
- **Yoast SEO:** Metadata and sitemap
- **WP Rocket:** Caching (if some dynamic elements)
- **ShortPixel:** Image optimization

This comprehensive structure provides clear direction for both design implementation and development, ensuring the premium immersive forest aesthetic is maintained throughout while being technically feasible for a headless WordPress + JavaScript frontend architecture.[^2][^3][^4][^5][^6][^7][^8][^9][^10][^11][^12][^1]
<span style="display:none">[^13][^14][^15][^16][^17][^18][^19][^20][^21][^22][^23][^24][^25][^26][^27]</span>

<div align="center">⁂</div>

[^1]: image.jpg

[^2]: image.jpg

[^3]: image.jpg

[^4]: image.jpg

[^5]: image.jpg

[^6]: https://immersive-g.com

[^7]: https://www.awwwards.com/sites/immersive-garden-website

[^8]: https://kota.co.uk/blog/10-creative-websites-to-inspire-your-next-web-design-2025-update

[^9]: https://www.justinmind.com/ui-design/best-ecommerce-websites

[^10]: https://www.wix.com/blog/how-to-make-a-forestry-website

[^11]: https://seahawkmedia.com/wordpress/top-design-trends-for-modern-gardening-websites/

[^12]: https://www.webstacks.com/blog/modern-website-design

[^13]: image.jpg

[^14]: image.jpg

[^15]: https://www.uidux.com/indoor-plants-ecommerce-app-design-for-figma-and-adobe-xd

[^16]: https://blog.magezon.com/green-websites-examples-ecm/

[^17]: https://www.behance.net/search/projects/plant shop ui ux design

[^18]: https://dribbble.com/tags/forest-website

[^19]: https://dribbble.com/tags/plant-ecommerce

[^20]: https://nicepage.com/k/forest-website-templates

[^21]: https://www.gardendesign.com/trends/2025.html

[^22]: https://www.figma.com/community/file/1176632391018692033/plant-e-commerce-online-store-app-ui-kit

[^23]: https://www.superside.com/blog/best-website-templates

[^24]: https://ui8.net/munirsr/products/potea

[^25]: https://aureatelabs.com/guide/build-ecommerce-website-from-scratch/how-to-choose-a-website-template/

[^26]: https://www.spinxdigital.com/blog/best-website-design/

[^27]: https://dribbble.com/tags/plant-shop-ui

