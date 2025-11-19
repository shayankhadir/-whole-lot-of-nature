#!/usr/bin/env python3
import re

# Read BrandStorySection.tsx
with open('src/components/sections/BrandStorySection.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace the old story with the new one
old_pattern = r'Whole Lot of Nature grew from a single spark.*?Whole Lot of Nature — bringing soil, soul, and sustainability together\.'

new_text = '''At Whole Lot of Nature, we believe that every plant has a story, and every garden is a sanctuary. We're on a mission to connect people with nature through thoughtfully curated plants, premium growing essentials, and sustainable practices.
              </p>
              <p>
                Our carefully selected collection includes vibrant indoor and outdoor plants, premium organic soil mixes, eco-friendly fertilizers, aquatic ecosystems, and handcrafted herbal products. Each item is chosen with care to ensure it meets our high standards for quality and sustainability.
              </p>
              <p>
                We're committed to making plant parenthood accessible, enjoyable, and rewarding for everyone – whether you're starting your first green space or tending an entire garden. Our expert team is always here to guide you on your botanical journey.
              </p>
              <p>
                When you shop with us, you're not just getting plants and products – you're joining a community dedicated to greener living, mindful consumption, and nurturing the Earth.
              </p>
              <p className="font-medium text-[#66BB6A]">
                Welcome to Whole Lot of Nature – where every root matters.'''

content = re.sub(old_pattern, new_text, content, flags=re.DOTALL)

with open('src/components/sections/BrandStorySection.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("✅ Updated BrandStorySection.tsx")
