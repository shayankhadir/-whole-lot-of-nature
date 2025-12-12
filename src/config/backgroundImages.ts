/**
 * Background Images Configuration
 * Maps images to different pages and sections throughout the site
 * 
 * IMPORTANT: Add your background images to public/images/backgrounds/
 * Recommended dimensions: 1200x1200px or larger (WebP format preferred)
 * 
 * Image Naming Convention:
 * - monstera-dark.jpg - Dark tropical monstera leaves
 * - monstera-close.jpg - Large monstera leaf close-up
 * - botanical-flowers.jpg - Green botanical with white flowers
 * - lilypond.jpg - Lily pad pond with water lilies
 * - pond-aerial.jpg - Aerial view of pond (illustration style)
 * - foliage-variegated.jpg - Illustrated variegated foliage
 * - foliage-vibrant.jpg - Vibrant green foliage overhead
 * - foliage-canopy.jpg - Dense green leaf canopy
 */

export const backgroundImages = {
  // Authentication Pages
  signup: {
    path: '/images/backgrounds/bgleaf1.webp',
    alt: 'Decorative dark tropical monstera leaves',
    description: 'Tropical monstera leaves background for signup page'
  },
  login: {
    path: '/images/backgrounds/bgleaf2.webp',
    alt: 'Decorative botanical illustration with white flowers',
    description: 'Botanical flowers background for login page'
  },

  // Home/Hero Sections
  hero: {
    primary: '/images/backgrounds/ai-generated-lush-tropical-green-leaves-background-photo.jpg',
    secondary: '/images/backgrounds/bgleaf3.webp',
    alt: 'Beautiful pond with lily pads and water lilies',
    description: 'Hero section background with nature imagery'
  },

  // Product & Category Pages
  products: {
    monstera: '/images/backgrounds/mi7i15y9qikqun.jpeg',
    botanical: '/images/backgrounds/bgleaf2.webp',
    foliage: '/images/backgrounds/bgleaf3.webp',
    canopy: '/images/backgrounds/mi7i1cq07eymwk.jpeg'
  },

  // Feature/Services Section
  features: {
    path: '/images/backgrounds/ai-generated-lush-tropical-green-leaves-background-photo.jpg',
    alt: 'Illustrated variegated foliage background',
    description: 'Features section background'
  },

  // Testimonials Section
  testimonials: {
    path: '/images/backgrounds/mi7i1cq07eymwk.jpeg',
    alt: 'Lush green leaf canopy background',
    description: 'Testimonials section background'
  },

  // Statistics/About Section
  stats: {
    path: '/images/backgrounds/bgleaf3.webp',
    alt: 'Pond with lily pads background',
    description: 'Statistics section background'
  },

  // Footer Area
  footer: {
    path: '/images/backgrounds/bgleaf3.webp',
    alt: 'Vibrant green foliage background',
    description: 'Footer section background'
  }
};

export const imageOptimizationSettings = {
  quality: 80, // JPEG quality (1-100)
  width: 1200,
  height: 1200,
  formats: ['webp', 'jpeg'],
  sizes: '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 100vw'
};

/**
 * Instructions for Adding Images:
 * 
 * 1. Create directory: public/images/backgrounds/
 * 
 * 2. Save images with these names:
 *    - monstera-dark.jpg (Image 1 - Dark tropical monstera)
 *    - monstera-close.jpg (Image 2 - Close monstera leaf)
 *    - botanical-flowers.jpg (Image 3 - Botanical with flowers)
 *    - lilypond.jpg (Image 4 - Pond with lilies)
 *    - pond-aerial.jpg (Image 5 - Aerial pond view)
 *    - foliage-variegated.jpg (Image 6 - Variegated illustration)
 *    - foliage-vibrant.jpg (Image 7 - Vibrant foliage)
 *    - foliage-canopy.jpg (Image 8 - Leaf canopy)
 * 
 * 3. Optimize images using:
 *    - TinyPNG / ImageOptim for compression
 *    - Target: 200-400KB per image
 *    - Format: JPEG or WebP
 *    - Min resolution: 1200x1200px
 * 
 * 4. After adding images, all pages will automatically use them
 * 
 * 5. Update paths here if you use different names/locations
 */
