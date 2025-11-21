# Pricing & Categorization Strategy Implementation

**Date Implemented:** November 9, 2025
**Status:** ✅ Applied to 40 Products

## Overview
Based on competitor analysis (The Affordable Organic Store, Nurserylive), a new "Smart Pricing" and "Smart Categorization" logic was applied to the product catalog. This ensures competitive positioning while maintaining healthy margins.

## 1. Smart Categorization Rules
Products were automatically assigned to new categories based on keyword matching in their names.

| Category | Keywords |
|----------|----------|
| **Plants** | `plant`, `succulent`, `cactus`, `fern`, `palm`, `jade`, `haworthia`, `aloe`, `euphorbia` |
| **Soil & Fertilizers** | `soil`, `mix`, `compost`, `manure`, `fertilizer`, `cinder`, `cocopeat` |
| **Aquatic Life** | `snail`, `fish`, `aquatic`, `guppy`, `shrimp`, `duckweed`, `water lettuce` |
| **Wellness & Herbal** | `oil`, `tablet`, `powder`, `herbal`, `facepack`, `ashwagandha`, `moringa` |
| **Seeds** | `seed` |
| **Gardening Essentials** | `pot`, `planter`, `tool` (Default fallback) |

## 2. Competitor-Based Pricing Model
Prices were adjusted to create a "Sale" effect, showing value to the customer.

| Category | Base Price (Regular) | Sale Price (Competitive) | Notes |
|----------|----------------------|--------------------------|-------|
| **Plants** | ₹399 - ₹499 | **₹249 - ₹299** | Mid-range positioning. |
| **Aquatic Life** | ₹199 | **₹99** | Entry-level pricing hook. |
| **Aquatic Plants** | ₹249 | **₹149** | |
| **Soil/Fertilizers** | ₹499 | **₹299** | Competitive with 3kg packs. |
| **Wellness** | ₹599 | **₹399** | Premium herbal positioning. |
| **Seeds** | ₹149 | **₹99** | Standard market rate. |

## 3. Variable Product Logic
For products with variations (Size: Small, Medium, Large), a multiplier logic was applied to the base sale price.

*   **Small:** 1.0x Base Price
*   **Medium:** 1.5x Base Price
*   **Large:** 2.5x Base Price

## 4. Implementation Script
The logic is preserved in `scripts/smart-categorize-and-price.ts` and can be re-run if new products are added, provided they follow the naming conventions.
