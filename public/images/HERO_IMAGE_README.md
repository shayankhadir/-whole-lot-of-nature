# Hero Background Image

## Required Image: `hero-leaf-bg.jpg`

**Location:** `public/images/hero-leaf-bg.jpg`

### Specifications:
- **Resolution:** Minimum 2560x1440px (recommended: 3840x2160px for 4K displays)
- **Format:** WebP (preferred) or JPG
- **Orientation:** Landscape
- **Subject:** Lush forest leaves, ferns, or tropical foliage
- **Color Palette:** Deep emerald greens, turquoise accents, dark shadows
- **Mood:** Immersive, dense, organic, close-up texture
- **File Size:** Optimize to <500KB using compression

### Recommended Sources:
1. **Unsplash** - Free high-quality nature photography
   - Search: "tropical leaves", "fern close-up", "forest texture"
   - Keywords: emerald, jungle, monstera, rainforest

2. **Pexels** - Free stock photos
   - Search: "green leaves texture", "tropical foliage"

3. **Your Own Photography** - Authentic brand imagery

### Image Treatment:
The HeroSection component will automatically apply:
- **Brightness filter:** 60% (darkens image)
- **Gradient overlay:** Deep emerald to charcoal
- **Blur effect:** Subtle backdrop blur for glassmorphism

### Alternative Temporary Solution:
If no image is available yet, you can:
1. Use a solid gradient background (already included as fallback)
2. Download a free image from Unsplash:
   ```
   https://unsplash.com/photos/green-leafed-plants-FV_PxCqgtwc
   https://unsplash.com/photos/green-plant-leaves-ZMxWL5Bf58M
   ```

### How to Add:
1. Download your chosen image
2. Rename to `hero-leaf-bg.jpg` or `hero-leaf-bg.webp`
3. Place in `public/images/`
4. Hero will automatically load it

### Optimization Tips:
```bash
# Using ImageMagick (if installed)
convert hero-original.jpg -resize 2560x1440^ -quality 85 hero-leaf-bg.jpg

# Using Next.js Image Optimization
# Images in /public/images/ are automatically optimized by Next.js
```

---

**Status:** 🟡 Placeholder needed  
**Priority:** High - Hero displays gradient fallback until image added
