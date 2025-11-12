# WHOLE LOT OF NATURE - AI IMPLEMENTATION GUIDE FOR DEVELOPERS
**Complete Product Database & Frontend Architecture**

---

## EXECUTIVE SUMMARY

**Store:** Whole Lot of Nature  
**Total Products:** 29  
**Main Categories:** 8  
**Sub-Categories:** 13  
**Architecture:** Headless WordPress CMS + JavaScript Frontend  
**Design Theme:** Immersive Forest (Dark, Emerald Green, Sharp Edges)

This guide provides complete product taxonomy, SEO structure, API specifications, and React component architecture for AI code generation and development.

---

## 1. PRODUCT TAXONOMY & CATEGORIZATION

### Primary Categories (8 Main)

#### 1.1 SOIL MIXES & AMENDMENTS (5 Products)
**Category ID:** `soil-amendments`  
**SEO Focus:** "soil for plants", "potting mix", "organic amendments"  
**Target Audience:** Gardeners, plant parents, indoor growers

**Products:**
- Organic Potting Mix for Indoor Plants (ID: 1)
- Succulent Potting Mix (ID: 2)
- Cinder Lava Rocks (ID: 3)
- Organic Cocopeat (ID: 4)
- Organic Leaf Compost (ID: 5)

**Common Tags:** soil, potting mix, organic, drainage, eco-friendly, amendment

---

#### 1.2 AQUATIC ECOSYSTEM (13 Products)
**Category ID:** `aquatic-ecosystem`  
**SEO Focus:** "aquarium plants", "aquatic plant", "planted tank"  
**Target Audience:** Aquarium hobbyists, aquascapers, planted tank enthusiasts

**Sub-Category 1.2.1: Rooted Aquatic Plants (7 Products)**
- Guppy Grass - Najas guadalupensis (ID: 6)
- Asian Marshweed - Hygrophila polysperma (ID: 7)
- Indian Brahmi - Bacopa monnieri (ID: 8)
- Mexican Sword Plant - Echinodorus spp. (ID: 9)
- Mexican Pennywort - Hydrocotyle leucocephala (ID: 10)
- Brahmi - Bacopa (ID: 11)
- Dwarf Sagittaria - Sagittaria subulata (ID: 12)

Common Tags: aquatic, aquarium plants, fast-growing, cover plant, oxygenation, hardy, beginner-friendly

**Sub-Category 1.2.2: Floating Plants (4 Products)**
- Duckweed - Lemna minor (ID: 13)
- Greater Duckweed - Spirodela polyrhiza (ID: 14)
- Water Lettuce - Pistia stratiotes (ID: 15)
- Salvinia - Salvinia natans (ID: 16)

Common Tags: aquatic, floating plants, algae control, pond plants, natural filtration

**Sub-Category 1.2.3: Aquatic Snails (2 Products)**
- Ramshorn Snails (ID: 21)
- Malaysian Trumpet Snail - MTS (ID: 22)

Common Tags: aquatic, snails, aquarium accessories, cleanup crew, algae control

---

#### 1.3 INDOOR & DECORATIVE PLANTS (5 Products)
**Category ID:** `indoor-plants`  
**SEO Focus:** "succulents", "low-light plants", "desk plants", "indoor plants"  
**Target Audience:** Plant enthusiasts, office decorators, beginners

**Products:**
- Jade Plant - Crassula ovata (ID: 17)
- Euphorbia lactea (ID: 18)
- Haworthia (ID: 19)
- Aloe Vera (ID: 20)
- Mini Cactus Sets (ID: 27)

Common Tags: succulent, indoor plant, low-maintenance, decor, beginner-friendly

---

#### 1.4 HERBAL PRODUCTS & SUPPLEMENTS (4 Products)
**Category ID:** `wellness-herbal`  
**SEO Focus:** "herbal products", "ayurvedic", "natural supplements", "wellness"  
**Target Audience:** Wellness seekers, Ayurveda practitioners, natural health enthusiasts

**Products:**
- Ayurvedic Hair Oil 200ml (ID: 23)
- Face Pack Herbal Mix (ID: 24)
- Moringa Powder Tablets (ID: 25)
- Ashwagandha + Triphala + Moringa Combo (ID: 26)

Common Tags: herbal, ayurvedic, wellness, natural, organic, supplements

---

#### 1.5 DIGITAL PRODUCTS & GUIDES (2 Products)
**Category ID:** `digital-content`  
**SEO Focus:** "plant guides", "gardening ebooks", "plant care PDF"  
**Target Audience:** Learners, plant parents, gardeners

**Products:**
- eBooks (Plant Care & Gardening Guides) (ID: 28)
- Plant Guides (Individual Guides) (ID: 29)

Common Tags: digital, educational, downloadable, guides, beginner-friendly

---

## 2. SEO STRATEGY & TAG PAGES

### Tag Page Architecture

**Primary Tags (High Volume - >5 products each):**
1. `aquatic` - 13 products (all aquatic)
2. `soil` - 5 products (all soil mixes)
3. `herbal` - 4 products (all herbal products)
4. `indoor-plant` - 9 products (succulents + decor + some aquatic)
5. `succulent` - 5 products (all succulents + mini cactus)
6. `aquarium-plants` - 11 products (rooted + floating + snails)
7. `organic` - 10 products (across all categories)
8. `beginner-friendly` - 12 products (scattered)
9. `low-maintenance` - 8 products (succulents, some herbs, some aquatic)
10. `natural` - 7 products (herbal + organic soil)

**Secondary Tags (Medium Volume - 3-5 products):**
- digital, guides, educational
- potting mix, drainage, aeration
- floating plants, algae control
- medicinal, ayurvedic, wellness
- aquascaping, planted tank, cover plant
- decor, gift, handmade

**Long-Tail Tags (Low Volume - 1-2 products):**
- Fast-draining, moisture-retaining
- Foreground plant, background plant
- Substrate aeration, detritus control
- Sculptural, modern decor
- Tropical, hardy varieties

### Tag Page SEO Strategy

**URL Structure:**
```
/tag/[tag-slug]/
/tag/aquatic/
/tag/organic/
/tag/beginner-friendly/
```

**Tag Page Elements:**
- H1: "{Tag Name} - Whole Lot of Nature"
- Meta Description: "Browse our collection of {tag} products: [top 3-4 products]. Discover the best {tag} for your garden, aquarium, or home."
- Category filter (show products from all related categories)
- Sort options (price, newest, popularity, rating)
- Pagination (12-24 products per page)

**Recommended High-Value Tag Pages to Optimize:**
1. `/tag/aquatic/` - 13 products (huge search volume)
2. `/tag/beginner-friendly/` - 12 products
3. `/tag/organic/` - 10 products
4. `/tag/indoor-plant/` - 9 products
5. `/tag/low-maintenance/` - 8 products

---

## 3. WORDPRESS API STRUCTURE

### Custom Post Types & Fields

#### Post Type: `wln_product`
```
ID: auto-generated
title: Product Name
description: Product Description (200-300 words)
content: Full product details (features, care tips)
featured_image: Product image
price: WooCommerce price field
category: Product category
tags: Multiple tags (array)
meta_fields:
  - meta_title (SEO)
  - meta_description (SEO)
  - focus_keyword (SEO plugin)
  - product_type (growing_medium, indoor_plant, aquatic_plant, etc.)
  - seo_category (from taxonomy)
  - image_alt (alt text for image)
  - slug (URL slug)
```

#### Post Type: `wln_category`
```
ID: auto-generated
name: Category Name
slug: category-slug
description: Category description
parent_id: null or parent category ID
image: Category thumbnail
meta_fields:
  - category_color (hex for theme color)
  - category_icon (icon name)
  - seo_focus (primary keywords)
```

### REST API Endpoints

**Base URL:** `https://api.whole-lot-of-nature.com/wp-json/wp/v2/`

**Product Endpoints:**
```
GET /products
GET /products?per_page=20&page=1
GET /products?categories=soil-amendments
GET /products?tags=organic,beginner-friendly
GET /products/{id}
GET /products?search=jade
```

**Category Endpoints:**
```
GET /categories
GET /categories/{id}
GET /categories?parent=0
```

**Tag Endpoints:**
```
GET /tags
GET /tags/{id}
GET /tags?per_page=50
```

**Response Format - Single Product:**
```json
{
  "id": 1,
  "title": "Organic Potting Mix for Indoor Plants",
  "slug": "organic-potting-mix-indoor-plants",
  "description": "Premium organic potting mix...",
  "content": "Full description and features...",
  "price": 499,
  "featured_image": {
    "url": "https://cdn.../product-1.jpg",
    "alt": "Organic potting mix for indoor plants"
  },
  "categories": [
    {
      "id": "soil-amendments",
      "name": "Soil Mixes",
      "slug": "soil-amendments"
    }
  ],
  "tags": [
    "soil", "potting mix", "organic", "indoor", "drainage"
  ],
  "meta": {
    "meta_title": "Organic Potting Mix for Indoor Plants — Whole Lot of Nature",
    "meta_description": "Premium organic potting mix...",
    "focus_keyword": "organic potting mix for indoor plants",
    "product_type": "growing_medium",
    "seo_category": "soil-mixes"
  }
}
```

---

## 4. REACT COMPONENT ARCHITECTURE

### Component Structure

```
src/
├── pages/
│   ├── HomePage/
│   ├── ProductPage/
│   ├── CategoryPage/
│   ├── TagPage/
│   └── SearchPage/
├── components/
│   ├── ProductCard/
│   │   ├── ProductCard.jsx
│   │   ├── ProductCardPlaceholder.jsx
│   │   └── ProductCard.module.css
│   ├── ProductGrid/
│   ├── ProductCarousel/
│   ├── CategoryGrid/
│   ├── Filters/
│   │   ├── CategoryFilter.jsx
│   │   ├── TagFilter.jsx
│   │   ├── PriceFilter.jsx
│   │   └── Filters.module.css
│   ├── SearchBar/
│   ├── Navigation/
│   └── common/
│       ├── Button/
│       ├── Modal/
│       └── Pagination/
├── hooks/
│   ├── useProducts.js
│   ├── useCategories.js
│   ├── useTags.js
│   └── useFetch.js
├── services/
│   ├── api.js
│   └── wpClient.js
├── styles/
│   ├── global.css
│   ├── typography.css
│   ├── colors.css
│   └── golden-ratio.css
└── utils/
    ├── helpers.js
    └── constants.js
```

### Key Components & Props

#### ProductCard Component
```jsx
<ProductCard
  id={product.id}
  image={product.featured_image}
  name={product.title}
  price={product.price}
  category={product.categories[0]}
  tags={product.tags}
  rating={product.rating}
  onAddToCart={(id) => handleAddToCart(id)}
/>
```

#### ProductGrid Component
```jsx
<ProductGrid
  products={products}
  columns={4}
  gap="24px"
  loading={isLoading}
  onProductClick={handleProductClick}
/>
```

#### Filters Component
```jsx
<Filters
  categories={categories}
  tags={tags}
  priceRange={[0, 5000]}
  onFilterChange={handleFilterChange}
  activeFilters={activeFilters}
/>
```

#### CategoryGrid Component
```jsx
<CategoryGrid
  categories={categories}
  columns={3}
  onCategoryClick={handleCategoryClick}
/>
```

### Data Fetching Pattern

```js
// hooks/useProducts.js
import { useEffect, useState } from 'react';
import { wpClient } from '../services/wpClient';

export function useProducts(filters = {}) {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const params = {
          per_page: filters.perPage || 12,
          page: filters.page || 1,
          categories: filters.categories,
          tags: filters.tags,
          search: filters.search,
          orderby: filters.sortBy || 'date',
          order: filters.order || 'desc'
        };

        const response = await wpClient.get('/products', { params });
        setProducts(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [filters]);

  return { products, isLoading, error };
}
```

---

## 5. PRODUCT TYPE CLASSIFICATION

### Product Type Definitions

**For API Queries & UI Rendering:**

```javascript
const PRODUCT_TYPES = {
  growing_medium: {
    name: "Growing Medium",
    icon: "seedling",
    description: "Soil mixes and growing substrates",
    categoryIds: ["soil-amendments"]
  },
  soil_amendment: {
    name: "Soil Amendment",
    icon: "leaf",
    description: "Soil boosters and enhancers",
    categoryIds: ["soil-amendments"]
  },
  aquatic_plant: {
    name: "Aquatic Plant",
    icon: "water-drop",
    description: "Live plants for aquariums and ponds",
    categoryIds: ["aquatic-plants", "floating-plants"]
  },
  aquatic_accessory: {
    name: "Aquatic Accessory",
    icon: "snail",
    description: "Snails and aquatic fauna",
    categoryIds: ["aquatic-snails"]
  },
  indoor_plant: {
    name: "Indoor Plant",
    icon: "plant",
    description: "Houseplants and succulents",
    categoryIds: ["succulents", "plant-decor"]
  },
  decor_plant: {
    name: "Décor Plant",
    icon: "box",
    description: "Pre-arranged plant sets",
    categoryIds: ["plant-decor"]
  },
  herbal_product: {
    name: "Herbal Product",
    icon: "herb",
    description: "Natural herbal supplements",
    categoryIds: ["herbal-products"]
  },
  digital_product: {
    name: "Digital Product",
    icon: "file-pdf",
    description: "Downloadable guides and eBooks",
    categoryIds: ["digital-products"]
  }
};
```

---

## 6. FILTERING & SORTING SYSTEM

### Filter Options

**By Category:**
```
- Soil Mixes (5)
- Aquatic Plants (7)
- Floating Plants (4)
- Succulents (4)
- Aquatic Snails (2)
- Herbal Products (4)
- Plant Decor (1)
- Digital Products (2)
```

**By Tag (Primary):**
```
- Aquatic (13)
- Soil (5)
- Herbal (4)
- Indoor Plant (9)
- Succulent (5)
- Aquarium Plants (11)
- Organic (10)
- Beginner-Friendly (12)
- Low-Maintenance (8)
- Natural (7)
```

**By Price Range:**
```
Default: 0 - 5000 INR
Presets:
  - Under 500
  - 500 - 1000
  - 1000 - 2000
  - 2000 - 5000
  - 5000+
```

**Sort Options:**
```
- Newest (default)
- Price: Low to High
- Price: High to Low
- Popularity
- Rating (if available)
- Best Sellers
```

**Product Type Filter:**
```
- Growing Media
- Aquatic Plants
- Succulents
- Herbal Products
- Digital Guides
- Accessories
```

### API Query Examples

```javascript
// Get all aquatic plants under 1000 INR
/products?categories=aquatic-plants&price_max=1000

// Get beginner-friendly, organic products
/products?tags=beginner-friendly,organic

// Get all succulents for low-light conditions
/products?tags=low-light,succulent

// Search for soil products
/products?search=soil&categories=soil-amendments

// Get products sorted by price ascending
/products?orderby=meta_value_num&meta_key=price&order=asc

// Pagination: Page 2, 20 items per page
/products?per_page=20&page=2
```

---

## 7. SEARCH & AUTOCOMPLETE

### Search Algorithm

**Search Fields Priority:**
1. Product name (exact match: 100 points)
2. Meta title (match: 80 points)
3. Primary keyword (match: 70 points)
4. Secondary keywords (match: 60 points)
5. Tags (match: 50 points)
6. Product description (match: 30 points)

### Autocomplete Suggestions

```javascript
// Suggest from:
const suggestions = [
  ...productNames,           // "Jade Plant", "Guppy Grass"
  ...categoryNames,           // "Soil Mixes", "Aquatic Plants"
  ...primaryKeywords,         // "organic potting mix", "aquarium plants"
  ...popularSearches          // trending searches
];
```

**Autocomplete Response:**
```json
{
  "suggestions": [
    {
      "type": "product",
      "name": "Jade Plant (Crassula ovata)",
      "url": "/products/jade-plant-crassula-ovata"
    },
    {
      "type": "category",
      "name": "Succulents",
      "url": "/category/succulents"
    },
    {
      "type": "tag",
      "name": "low-maintenance",
      "url": "/tag/low-maintenance"
    }
  ]
}
```

---

## 8. SEO METADATA TEMPLATE

### Each Product Page Should Have:

**Meta Tags:**
```html
<meta name="title" content="{meta_title}" />
<meta name="description" content="{meta_description}" />
<meta name="keywords" content="{primary_keyword}, {secondary_keywords}" />
<meta property="og:title" content="{meta_title}" />
<meta property="og:description" content="{meta_description}" />
<meta property="og:image" content="{featured_image_url}" />
<meta property="og:url" content="https://whole-lot-of-nature.com/products/{slug}" />
```

**Structured Data (JSON-LD):**
```json
{
  "@context": "https://schema.org/",
  "@type": "Product",
  "name": "Jade Plant (Crassula ovata)",
  "image": "https://cdn.../product-image.jpg",
  "description": "Low-maintenance succulent with glossy leaves...",
  "brand": {
    "@type": "Brand",
    "name": "Whole Lot of Nature"
  },
  "offers": {
    "@type": "Offer",
    "url": "https://whole-lot-of-nature.com/products/jade-plant-crassula-ovata",
    "priceCurrency": "INR",
    "price": "499"
  }
}
```

**H1 & H2 Hierarchy:**
```
H1: Product Name (only one)
H2: Product Features / Benefits
H2: How to Use / Care Instructions
H2: Specifications
H2: Customer Reviews
H3: Review subheadings (if needed)
```

---

## 9. WORDPRESS FIELD MAPPING

### ACF (Advanced Custom Fields) Setup

**Product Custom Fields:**
```
Group: Product SEO & Details
├── seo_title (Text) → meta_title
├── seo_description (Textarea) → meta_description
├── focus_keyword (Text) → primary_keyword
├── secondary_keywords (Repeater)
│   └── keyword (Text)
├── product_type (Select) → [growing_medium, indoor_plant, etc.]
├── seo_category (Select) → [soil-amendments, aquatic-plants, etc.]
└── image_alt_text (Text) → image alt attribute

Group: Product Details
├── price (Number) → WooCommerce price
├── stock_status (Select) → [in-stock, low-stock, out-of-stock]
├── care_difficulty (Select) → [beginner, intermediate, advanced]
└── featured_badge (Checkbox) → Shows "Featured" badge
```

### WordPress Custom Taxonomy

**Taxonomy 1: SEO Category**
```
taxonomy: seo_category
terms:
  - soil-mixes
  - aquatic-plants
  - floating-plants
  - succulents
  - aquatic-snails
  - herbal-products
  - plant-decor
  - digital-products
```

**Taxonomy 2: Product Type**
```
taxonomy: product_type
terms:
  - growing_medium
  - soil_amendment
  - aquatic_plant
  - aquatic_accessory
  - indoor_plant
  - decor_plant
  - herbal_product
  - digital_product
```

---

## 10. CONTENT STRATEGY FOR AI GENERATION

### Product Description Template

**For Physical Products (Plants, Soil, Supplements):**
```
[1. Hook Sentence - 1 line]
"Jade Plant — the perfect low-maintenance succulent for every home."

[2. What It Is - 2-3 lines]
"Jade Plant (Crassula ovata) is a sculptural succulent characterized by thick, 
glossy, coin-shaped leaves that grow in dense clusters. Known as a symbol of 
prosperity in Asian cultures, it thrives indoors with minimal care."

[3. Key Benefits - 3-4 bullet points]
• Low-maintenance: Requires minimal watering and indirect light
• Air-purifying: Improves indoor air quality naturally
• Long-lasting: Can live 30+ years with proper care
• Versatile: Perfect for desks, shelves, or living spaces

[4. Ideal For]
"Perfect for apartment dwellers, office workers, and beginner plant parents who 
want a decorative, long-lasting plant without high maintenance demands."

[5. Care Quick Tips]
"Water every 2-3 weeks. Place in bright, indirect sunlight. Use well-draining 
succulent soil. Avoid overwatering."

[6. SEO Keywords Natural Integration]
"This low-maintenance succulent is one of the best indoor plants for beginners. 
Whether you're looking for desk plants or home décor, the Jade Plant delivers 
greenery that requires minimal attention."
```

**For Digital Products:**
```
[1. What You Get]
"Complete PDF guide with 40+ pages covering plant care, propagation, and troubleshooting."

[2. Content Overview]
"Sections include:
• 30-Day care checklist
• Propagation step-by-step guide
• Common problems & solutions
• Visual reference photos"

[3. Who This Is For]
"Perfect for new plant parents, gardeners upgrading to rare plants, or anyone 
wanting to expand their gardening knowledge."

[4. Instant Download]
"Get immediate access via email. Print-friendly PDF format, works on all devices."
```

---

## 11. IMAGE ASSET SPECIFICATIONS

### Product Image Guidelines

**Primary Product Image:**
- Format: WebP (with JPG fallback)
- Dimensions: 1200px × 1500px (4:5 aspect ratio)
- File size: < 200KB
- Background: White or light green (#F8F9FA)
- Quality: 95% compression

**Thumbnail:**
- 400px × 500px
- File size: < 50KB

**Category Banner:**
- 1600px × 400px (4:1 aspect ratio)
- File size: < 300KB

**Hero/Featured Image:**
- 2560px × 1440px (16:9 aspect ratio, desktop)
- 1080px × 1920px (9:16 aspect ratio, mobile)
- File size: < 400KB each

---

## 12. URL STRUCTURE & ROUTING

### Routing Map

```
/ → HomePage
/shop → ShopPage (all products)
/shop?category=soil-amendments → Filter by category
/shop?tag=organic → Filter by tag
/search?q=jade → Search results

/products/{product-slug} → Product detail page
  Examples:
  /products/jade-plant-crassula-ovata
  /products/guppy-grass-najas
  /products/organic-potting-mix-indoor-plants

/category/{category-slug} → Category page
  /category/soil-amendments
  /category/aquatic-plants
  /category/succulents

/tag/{tag-slug} → Tag page
  /tag/organic
  /tag/beginner-friendly
  /tag/low-maintenance

/guides → Digital products page
/about → About page
/cart → Shopping cart
/checkout → Checkout
```

---

## 13. PERFORMANCE & OPTIMIZATION

### Image Optimization Strategy

**Lazy Loading:**
```jsx
import Image from 'next/image';

<Image
  src={productImage}
  alt={imageAlt}
  width={400}
  height={500}
  loading="lazy"
  placeholder="blur"
  blurDataURL={blurPlaceholder}
/>
```

**Responsive Images (srcset):**
```html
<img
  srcset="
    /images/product-400.webp 400w,
    /images/product-800.webp 800w,
    /images/product-1200.webp 1200w"
  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
  src="/images/product-1200.webp"
  alt="Product name"
/>
```

### Caching Strategy

```javascript
// API responses cache: 10 minutes
// Product images: 30 days (CDN)
// Static assets: 1 year
// Dynamic pages: 1 hour
```

---

## 14. DEVELOPMENT CHECKLIST

### Before Launch

**SEO & Metadata:**
- [ ] All 29 products have unique meta titles (< 60 chars)
- [ ] All products have meta descriptions (120-160 chars)
- [ ] All products have primary + secondary keywords assigned
- [ ] All image alt texts filled (using image_alt field)
- [ ] JSON-LD structured data on all product pages
- [ ] XML sitemap generated and submitted to Google

**Content:**
- [ ] All product descriptions 200-300 words minimum
- [ ] Natural keyword integration (2-3 keyword mentions per 100 words)
- [ ] H1, H2, H3 hierarchy correct on each page
- [ ] Internal linking between related products

**Technical:**
- [ ] Mobile responsive design tested
- [ ] Page load time < 3 seconds (Lighthouse)
- [ ] All images optimized & lazy loaded
- [ ] 404 page created for broken links
- [ ] Robots.txt and meta robots tags configured

**Categories & Tags:**
- [ ] All 8 categories properly structured
- [ ] All primary tags have dedicated pages
- [ ] Category pages optimized for SEO
- [ ] Tag pages have unique meta descriptions

---

## 15. FUTURE EXPANSION PATHS

### Product Categories to Consider Adding

1. **Terrarium & Mounting Supplies** (Moss poles, frames, mounting boards)
2. **Fertilizers & Nutrients** (Organic, liquid, granular)
3. **Plant Care Tools** (Pruners, sprayers, humidity meters)
4. **Pots & Planters** (Ceramic, plastic, decorative)
5. **Lighting Systems** (Grow lights, full-spectrum LEDs)
6. **Water Testing Kits** (For aquariums)
7. **Live Bacteria Cultures** (Aquarium cycling products)
8. **Organic Pesticides & Fungicides**
9. **Subscription Boxes** (Monthly plant boxes)
10. **Plant Rental Services** (Commercial/office greening)

---

## 16. API RESPONSE EXAMPLES

### Get All Products with Filters

**Request:**
```
GET /products?tags=organic,beginner-friendly&per_page=12&page=1
```

**Response:**
```json
{
  "total": 18,
  "pages": 2,
  "per_page": 12,
  "current_page": 1,
  "products": [
    {
      "id": 1,
      "title": "Organic Potting Mix for Indoor Plants",
      "slug": "organic-potting-mix-indoor-plants",
      "price": 499,
      "featured_image": {
        "url": "https://cdn.../product-1.webp",
        "alt": "Organic potting mix for indoor plants"
      },
      "categories": ["soil-amendments"],
      "tags": ["soil", "organic", "beginner-friendly"],
      "meta": {
        "primary_keyword": "organic potting mix for indoor plants"
      }
    }
    // ... more products
  ]
}
```

### Get Single Product

**Request:**
```
GET /products/jade-plant-crassula-ovata
```

**Response:**
```json
{
  "id": 17,
  "title": "Jade Plant (Crassula ovata)",
  "slug": "jade-plant-crassula-ovata",
  "content": "Full HTML content...",
  "price": 699,
  "categories": ["succulents"],
  "tags": ["succulent", "indoor-plant", "beginner-friendly"],
  "featured_image": {
    "url": "https://cdn.../jade-plant.webp",
    "alt": "Jade Plant (Crassula ovata) succulent",
    "sizes": {
      "thumbnail": "https://cdn.../jade-plant-400.webp",
      "full": "https://cdn.../jade-plant-1200.webp"
    }
  },
  "meta": {
    "meta_title": "Jade Plant (Crassula ovata) — Hardy Indoor Succulent",
    "meta_description": "Jade Plant — low-maintenance succulent...",
    "focus_keyword": "jade plant crassula ovata",
    "secondary_keywords": ["indoor succulents", "low maintenance plants"]
  }
}
```

---

## 17. DEVELOPER NOTES FOR AI CODE GENERATION

### When Asking AI to Generate Code:

**Specify:**
```
1. Component type and props
2. Data source (WordPress API endpoint)
3. Styling approach (Tailwind CSS + CSS Modules)
4. Response handling (loading, error states)
5. SEO requirements (meta tags, structured data)
6. Image optimization (lazy loading, srcset)
7. Performance targets (page speed, bundle size)
```

**Example Prompt:**
```
"Create a React component ProductGrid that:
- Fetches products from /wp-json/wp/v2/products?tags=organic&per_page=12
- Displays 4 products per row (responsive to 2 on tablet, 1 on mobile)
- Uses ProductCard component for each item
- Shows loading skeletons while fetching
- Handles error state gracefully
- Implements intersection observer for lazy loading
- Uses Next.js Image component for optimization
- Adds JSON-LD structured data for each product
- Uses emerald green (#2E7D32) accent colors
- Follows golden ratio spacing (24px base gap)"
```

---

## 18. CONTACT & NEXT STEPS

**Ready to Upload Products to WordPress:**
1. Export CSV: `whole_lot_of_nature_seo_products.csv`
2. Export JSON: `whole_lot_of_nature_products.json`
3. Install WordPress plugins: ACF Pro, Yoast SEO, WP REST API
4. Create custom fields and taxonomies (see Section 9)
5. Bulk upload products via CSV import
6. Verify API endpoints responding correctly
7. Build React components and integrate with API
8. Test all filters, search, and pagination
9. Submit XML sitemap to Google Search Console
10. Monitor Core Web Vitals via PageSpeed Insights

---

**Document Version:** 1.0  
**Last Updated:** November 12, 2025  
**Status:** Ready for Development
