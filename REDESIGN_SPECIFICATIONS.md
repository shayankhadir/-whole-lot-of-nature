# Website Redesign Specifications
## Whole Lot of Nature - Forest-Themed Garden Store

**Status:** Planning Phase - COMPLETE SPECIFICATIONS RECEIVED
**Date:** November 12, 2025
**Products:** 29 items across 8 categories
**Architecture:** WordPress Headless CMS + Next.js/React Frontend
**Awaiting:** Final approval before implementation

---

## Design Philosophy

### Core Aesthetic
- **Theme:** Dark, moody, immersive nighttime forest atmosphere
- **Style:** Modern, premium, sharp-edged with subtle rounding (4-8px max)
- **Edge Treatment:** Geometric containers with 4-8px border-radius (NOT fully sharp, NOT fully rounded)
- **Spacing:** Golden ratio (1:1.618) throughout
- **Graphics:** Trees and forest elements extending beyond container boundaries
- **Negative Space:** Generous use throughout for breathing room
- **Depth:** Layered depth using translucent overlays and backdrop blur effects

### Updated Visual Direction
- **Dark Mode Focus:** Rich black and charcoal backgrounds creating nighttime forest feel
- **Glass Morphism:** Translucent containers with backdrop-filter: blur(20px)
- **Photography:** High-quality product images on clean white/light backgrounds
- **Overlays:** Dark gradients (60-70% opacity) over background photos
- **Depth Perception:** Multiple z-index layers with parallax scrolling

---

## Color Palette

### Primary Colors
- **Emerald Green:** `#2E7D32` - Primary actions, accents, CTAs
- **Turquoise:** `#66BB6A` - Secondary accents, highlights, hover states
- **Sage Green:** `#8BC34A` - Tertiary, badges, success states

### Neutral/Background Colors
- **Pure Black:** `#000000` - Deep backgrounds
- **Charcoal:** `#1A1A1A` - Primary dark background
- **Dark Gray:** `#2C2C2C` - Card backgrounds, elevated surfaces
- **Medium Gray:** `#757575` - Body text on dark backgrounds
- **Light Gray:** `#E0E0E0` - Borders, dividers, disabled states
- **Off-White:** `#F8F9FA` - Product card backgrounds, light sections

### Accent Colors
- **Muted Gold:** `#C4B17C` - Premium highlights, badges, special offers
- **Deep Forest:** `#0D3B1F` - Ultra-dark sections, gradients

### Color Usage Rules
- **Primary Backgrounds:** Always dark (#1A1A1A to #000000 range)
- **Text on Dark:** White (#FFFFFF) at varying opacities (100%, 70%, 40%, 20%)
- **CTAs:** Emerald green (#2E7D32) with white text
- **Borders:** 1px, 20-40% opacity white or emerald
- **Photo Overlays:** rgba(0,0,0,0.6) or rgba(0,0,0,0.7) over background images
- **Glass Morphism:** rgba(46, 125, 50, 0.1) with backdrop-filter: blur(20px)
- **Hover States:** Brighten by 10%, scale 1.05, add emerald glow

---

## Typography System

### Font Families

#### Headers (H1-H6)
- **Primary Choice:** Montserrat, Poppins, or Inter
- **Characteristics:** Sharp, geometric sans-serif with angular edges
- **Weights:** 600 (semi-bold), 700 (bold)
- **Letter Spacing:** 0.05em to 0.1em for emphasis and modern sharpness

#### Body Text
- **Primary Choice:** Open Sans, Roboto, or Lato
- **Characteristics:** Highly readable sans-serif
- **Weights:** 400 (regular)
- **Letter Spacing:** Normal

#### Accent Text
- **Use:** Slightly condensed variant of header font
- **Purpose:** Subtle emphasis without breaking minimalism

### Typography Scale (Golden Ratio: 1.618)

| Element | Size (px) | Calculation | Line Height | Usage |
|---------|-----------|-------------|-------------|-------|
| **H1 (Hero)** | 288 | 178 × 1.618 | 1.2 | Main hero tagline |
| **H2** | 178 | 110 × 1.618 | 1.2 | Major section headers |
| **H3** | 110 | 68 × 1.618 | 1.2 | Sub-section headers |
| **H4** | 68 | 42 × 1.618 | 1.2 | Card titles, category names |
| **H5** | 42 | 26 × 1.618 | 1.2 | Small headers |
| **H6** | 26 | 16 × 1.618 | 1.2 | Smallest header |
| **Body Text** | 16 | Base | 1.4 | Primary content |
| **Small Text** | 10 | 16 ÷ 1.618 | 1.4 | Labels, metadata |
| **Fine Print** | 6 | 10 ÷ 1.618 | 1.4 | Legal, copyright |

### Typography Guidelines
- **Vertical Rhythm:** Baseline text to multiples of 4px or 8px
- **Font Weight Limit:** Use only 2-3 variants (400, 600, 700)
- **Golden Ratio Spacing:** Apply 1.618 ratio to margins and padding around text
- **Consistency:** Maintain scale throughout all pages

---

## Homepage Sections - Detailed Breakdown

### 1. Hero Section

#### Layout
- **Width:** Full-width (100vw)
- **Height:** 80-100vh
- **Positioning:** Fixed or static with parallax option

#### Visual Elements
- **Background:** Deep emerald green → turquoise gradient fade
- **Graphics:** 3D renderings or layered SVG illustrations of trees
  - Trees should visually "grow" from edges into frame
  - Create enveloping forest effect
  - Angular leaves and branches
  - Crisp, sharp edges throughout
- **Logo:** Top left, sharp sans-serif typeface, minimal

#### Content
- **Main Tagline:** "Bring the Forest Home"
  - Typography: H1 (288px)
  - Positioning: Centered
  - Letterspacing: Large (0.1em)
- **Subtagline:** "Handpicked nature, delivered to your door."
  - Typography: H5 (42px)
  - Positioning: Below tagline, centered

#### Navigation
- **Position:** Top right
- **Links:** Only 3 - Shop, About, Contact
- **Style:** Minimal, sparse, sans-serif
- **Spacing:** Golden ratio spacing between items

---

### 2. Featured Plants Carousel

#### Layout
- **Type:** Horizontally scrolling cards
- **Scroll Behavior:** Smooth, touch-friendly
- **Card Spacing:** Golden ratio gutters

#### Card Design
- **Background:** White or charcoal alternating
- **Corners:** Sharp, no rounding
- **Borders:** Thin (1-2px) in turquoise
- **Plant Image:** High-quality, minimal background
- **Text Overlay:** Plant name with golden ratio spacing from edges

#### Interactive Effects
- **Hover:** Subtle animated green shadow mimicking sunlight through leaves
- **Transition:** Smooth, 300ms ease
- **Shadow Color:** Emerald green with low opacity

#### Negative Space
- Generous padding around each card
- Cards don't touch edges of container
- White space between cards

---

### 3. Shop By Category (Product Grid)

#### Grid Structure
- **Layout:** Three-column grid
- **Responsive:** Collapse to 2 columns (tablet), 1 column (mobile)
- **Gutter Width:** Golden ratio calculation
- **Margins:** Heavy padding, strict alignment

#### Categories
1. Forest Trees
2. Indoor Greens
3. Sculptural Succulents

#### Tile Design
- **Graphics:** Micro-forest illustrations "intruding" into bounds
  - Tree branch peeking from corner
  - Fern fronds extending beyond edge
  - Root structures creeping in
- **Style:** Angular, sharp-edged SVGs
- **Padding:** Golden ratio for internal spacing
- **Hover State:** Subtle lift or shadow effect

---

### 4. Immersive Forest Experience Banner

#### Layout
- **Width:** Full-width
- **Height:** Narrow band (15-20vh)
- **Position:** Mid-page separator

#### Visual Effects
- **Background:** Subtle parallax forest scene
- **Animation:** Gentle movement on scroll
- **Icons:** Minimal, forest-themed

#### Call-to-Action
- **Text:** "Explore the Virtual Forest"
- **Link:** Interactive 3D/AR forest scene or gallery
- **Button Style:** Sharp-edged, emerald green
- **Hover:** Turquoise color shift

#### Color Restriction
- Only greens, black, white, faint gold accents
- Maintain minimal aesthetic

---

### 5. About & Story Section

#### Layout
- **Type:** Side-by-side columns (50/50 split)
- **Responsive:** Stack vertically on mobile

#### Left Column - Image
- **Content:** Sharply-framed photo or SVG of founder in woods
- **Frame:** Geometric, angular border
- **Style:** High contrast, professional

#### Right Column - Story
- **Background:** Solid-colored geometric block (emerald/turquoise/charcoal)
- **Text:** Large, readable type (H4-H5 range)
- **Width:** Golden ratio calculation
- **Content:** Mission to bring forests to people's homes
- **Padding:** Generous, aligned to golden ratio

---

### 6. Customer Testimonials

#### Quantity
- 2-3 cards only (minimal approach)

#### Card Design
- **Borders:** Sharp, clean lines
- **Graphics:** Subtle leaf or branch protruding from edge
- **Color Alternation:** Black-on-white and white-on-black
- **Accent:** Forest green for stars or highlights

#### Typography
- **Text Size:** Large (H5-H6)
- **Line Length:** Long, generous
- **Spacing:** Golden ratio for measure and leading

#### Layout
- Horizontal arrangement (desktop)
- Vertical stack (mobile)
- Equal spacing between cards

---

### 7. Footer

#### Layout
- **Alignment:** All content left-aligned except social icons
- **Background:** Gradient from charcoal black → deep emerald
- **Dividers:** Thin emerald green lines separating sections

#### Content Sections
1. Contact Info (left)
2. Quick Links (center-left)
3. Copyright (bottom-left)
4. Social Icons (bottom-right, sharp-cornered block)

#### Decorative Elements
- **Motif:** Delicate branch or tree root extending up the side
- **Style:** Minimal, thin-line SVG
- **Color:** Muted gold or light emerald

---

## SVG Graphics System

### General SVG Style Guidelines
- **Fill Style:** Flat fills only (no gradients in SVGs)
- **Colors:** Emerald green, turquoise, charcoal gray, white
- **Edge Treatment:** Sharp, polygonal, faceted shapes
- **Stroke Weight:** Thin (1-2px) for line art
- **Negative Space:** Generous around all SVG shapes
- **No Rounded Corners:** All angles sharp and geometric

### SVG Motifs by Section

#### Hero Section SVGs
- **Stylized Angular Trees:**
  - Polygonal pine trees
  - Extending beyond container edges
  - Layered for depth
- **Leaf Shapes:**
  - Sharp-edged fern fronds
  - Tropical foliage with angular cuts
  - Arranged for 3D effect
- **Animals/Birds:**
  - Geometric bird silhouettes
  - Simple lines, solid fills
  - Perched on branches

#### Featured Plants Carousel SVGs
- Plant pot icons with angular edges
- Leaf shapes with linear veins
- Geometric patterns as overlays
- Corner decorations (flowers, seeds)

#### Shop By Category SVGs
- **Forest Elements "Growing" from Corners:**
  - Bonsai tree outlines
  - Fern/moss patches as polygons
  - Root tendrils in multi-edge lines
  - Branch structures

#### Immersive Forest Banner SVGs
- Continuous horizontal botanical border
- Repeated geometric forest motifs
- Pine needles in angular patterns
- Thin-line tree contours for skyline effect

#### About Section SVGs
- Portrait frames with polygon edges
- Decorative branch framing
- Root structures with angular transitions

#### Testimonials SVGs
- Accent leaves on card corners
- Small leaf clusters
- Geometric water droplets
- Dew icons

#### Footer SVGs
- Horizontal vine/root patterns across width
- Angular weaving design
- Small leaf icons near contact info

---

## Layout & Spacing System

### Golden Ratio Application (1:1.618)

#### Container Widths
- **Max Content Width:** Calculate using golden ratio from viewport
- **Column Widths:** Ratio-based proportions (e.g., 1:1.618 for 2-column)
- **Sidebar Ratios:** Smaller section = 1, larger = 1.618

#### Vertical Spacing
- **Section Padding:** Base × 1.618
- **Element Margin:** Base value
- **Sub-element Spacing:** Base ÷ 1.618

#### Image Aspect Ratios
- **Hero Images:** 1.618:1 (landscape)
- **Portrait Images:** 1:1.618
- **Square Crops:** Use sparingly, only when necessary

#### Grid Gutters
- **Base Gutter:** 16px or 24px
- **Large Gutter:** Base × 1.618
- **Small Gutter:** Base ÷ 1.618

---

## Technical Implementation Notes

### Performance Requirements
- **Asset Optimization:** Compress all SVGs and images
- **Lazy Loading:** Implement for forest illustrations and SVGs
- **Animation:** Use JavaScript for smooth, lightweight effects
- **Loading Speed:** Target <3s initial load on Vercel

### Component Architecture
- **Reusable Components:** Each section as separate React/Next.js component
- **Headless CMS:** WordPress backend for content management
- **Easy Updates:** Modular design for future changes
- **Component Library:** Build standardized UI components (buttons, cards, etc.)

### Technology Stack
- **Frontend:** Next.js 14 (existing)
- **Backend:** Headless WordPress (existing)
- **Hosting:** Vercel (existing)
- **Styling:** CSS Modules or Tailwind CSS (existing)

---

## Graphics Requirements

### Forest Illustrations
- **Format:** SVG or optimized PNG with transparency
- **Usage:** Extending beyond container edges using negative margins
- **Animation:** Subtle JS animations on scroll or hover
- **Loading:** Lazy-load for performance

### Tree Graphics
- **Style:** 3D renderings or layered SVG
- **Placement:** Hero, banners, section dividers
- **Effect:** Create enveloping forest atmosphere
- **Technique:** Use CSS transforms and z-index for depth

### Geometric Shapes
- **Types:** Squares, rectangles, polygonal overlays
- **Treatment:** Sharp corners only
- **Purpose:** Frame content, create visual hierarchy
- **Colors:** Match palette (emerald, turquoise, charcoal)

### Icon System
- **Style:** Minimalist, geometric
- **Consistency:** Same stroke weight throughout
- **Size Range:** 16px to 48px
- **Colors:** Monochrome or accent colors only

---

## Responsive Design Considerations

### Breakpoints
- **Mobile:** < 640px
- **Tablet:** 640px - 1024px
- **Desktop:** > 1024px
- **Large Desktop:** > 1440px

### Section Adaptations

#### Hero
- **Mobile:** Reduce H1 to 72-96px, stack elements
- **Tablet:** H1 at 144px
- **Desktop:** Full 288px H1

#### Grid Layouts
- **Mobile:** 1 column
- **Tablet:** 2 columns
- **Desktop:** 3 columns

#### Typography Scale
- Reduce by 20-30% on mobile
- Maintain ratio relationships
- Ensure minimum 16px body text

---

## Design Principles Checklist

### Visual Consistency
- [ ] All edges are sharp (no rounded corners)
- [ ] Golden ratio applied to all spacing
- [ ] Color palette limited to 5-6 specified colors
- [ ] Typography follows exact scale
- [ ] SVG graphics match angular style

### User Experience
- [ ] Generous negative space around elements
- [ ] Clear visual hierarchy
- [ ] Smooth animations and transitions
- [ ] Fast load times
- [ ] Mobile-friendly touch targets

### Forest Theme
- [ ] Trees extend beyond boundaries in every section
- [ ] Immersive forest atmosphere throughout
- [ ] Nature motifs subtle but present
- [ ] Graphics don't overcrowd (maintain minimalism)
- [ ] Color palette reflects forest environment

### Minimalism
- [ ] Only essential elements visible
- [ ] Sparse navigation (3 links max)
- [ ] Limited number of testimonials (2-3)
- [ ] Clean, uncluttered layouts
- [ ] Single clear CTA per section

---

## What NOT to Do

### Design Don'ts
- ❌ No rounded corners anywhere
- ❌ No busy patterns or overcrowded designs
- ❌ No colors outside specified palette
- ❌ No excessive animations or effects
- ❌ No traditional forest patterns (plaid, wood grain, etc.)
- ❌ No circular frames or elements
- ❌ No non-geometric shapes

### Typography Don'ts
- ❌ Don't deviate from golden ratio scale
- ❌ Don't use more than 3 font weights
- ❌ Don't use serif fonts
- ❌ Don't reduce body text below 16px
- ❌ Don't use decorative or script fonts

### Layout Don'ts
- ❌ Don't ignore golden ratio for spacing
- ❌ Don't crowd elements together
- ❌ Don't use random spacing values
- ❌ Don't center-align everything
- ❌ Don't add unnecessary sections

---

## Next Steps (HOLD FOR FOLLOW-UP PROMPT)

### Awaiting Additional Information
- Specific content for each section
- Exact product categories and structure
- Additional features or sections not mentioned
- Priority order for implementation
- Any existing brand guidelines to respect
- Logo files and brand assets
- Product images and photography style
- Any specific interactive elements required

### Before Starting Development
1. Review this documentation with client
2. Get approval on design direction
3. Receive follow-up prompt with additional details
4. Create wireframes/mockups for approval
5. Finalize component structure
6. Set up SVG library and graphics assets
7. Begin component development

---

## Questions for Follow-Up Prompt

1. Do you have existing brand assets (logo, colors) or start fresh?
2. What specific products/categories beyond the 3 mentioned?
3. Do you want e-commerce functionality (checkout, cart)?
4. Should we integrate the existing WordPress products?
5. Any specific animations or interactive features?
6. Do you have photography/illustrations or need to source them?
7. Should existing pages (About, Contact, etc.) follow same redesign?
8. Timeline and priority for implementation?
9. Any accessibility requirements beyond standard WCAG?
10. Do you want a style guide/component library delivered?

---

**REMINDER: DO NOT START CODING UNTIL FOLLOW-UP PROMPT IS RECEIVED**

This documentation captures all requirements from the initial prompt. Awaiting additional instructions before beginning implementation.
