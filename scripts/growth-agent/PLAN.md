# Business Growth Agent - Audit & Strategy Plan

**Date:** November 21, 2025
**Target Website:** Whole Lot of Nature (Gardening, Plants, Aquatic Life, Wellness)

## 1. Website & Niche Audit

### **Niche Analysis**
*   **Primary Sector:** E-Commerce / Gardening & Horticulture.
*   **Sub-Niches:**
    *   **Indoor/Outdoor Plants:** Succulents, Air Purifying, Decorative.
    *   **Aquascaping:** Aquatic plants, snails, aquarium ecosystem supplies.
    *   **Organic Gardening:** Soil mixes, fertilizers (vermicompost, bone meal), seeds.
    *   **Wellness:** Herbal powders (Ashwagandha, Moringa), oils.
*   **Unique Selling Proposition (USP):** "Whole Lot of Nature" implies a holistic, organic approach. The combination of terrestrial gardening and aquatic life is a specific cross-segment.

### **Target Audience**
*   **B2C (Direct to Consumer):**
    *   Urban gardeners (balcony/indoor plants).
    *   Aquarium hobbyists (planted tanks).
    *   Health-conscious individuals (herbal supplements).
*   **B2B (Potential):**
    *   Interior Designers (Green decor).
    *   Corporate Offices (Bulk plant orders/gifting).
    *   Small Nurseries (Wholesale supplies).

### **Current Technical Assets**
*   **Content Agent:** Capable of generating blog posts, product descriptions, and social captions based on `brand-voice.json`.
*   **SEO Agent:** Capable of auditing meta tags, headings, and schema.
*   **Platform:** Next.js + Headless WooCommerce.

---

## 2. Lead Generation Plan

The **Lead Generation Agent** will focus on identifying high-intent prospects across multiple channels.

### **Strategy A: B2B Corporate & Design (High Value)**
*   **Target:** Interior Designers, Office Managers, Event Planners.
*   **Platform:** LinkedIn.
*   **Search Criteria:** "Interior Designer", "Workplace Experience Manager", "Corporate Gifting".
*   **Value Prop:** "Bring nature into your workspace/designs with our curated plant sets."

### **Strategy B: Community Influencers (High Reach)**
*   **Target:** Micro-influencers in gardening and aquascaping.
*   **Platform:** Instagram / YouTube.
*   **Search Criteria:** #plantmom, #aquascape, #organicgardening (Location: India/Local).
*   **Value Prop:** Affiliate partnerships or product reviews.

### **Strategy C: Local Wholesale (Volume)**
*   **Target:** Small independent nurseries, landscaping firms.
*   **Platform:** Google Maps / Local Directories.
*   **Value Prop:** Wholesale pricing on specialized items like aquatic plants or specific soil mixes.

---

## 3. Integration Strategy (The "Ultimate Agent")

We will merge the existing `ContentAgent` and `SEOAgent` into a unified **Business Growth Agent** architecture.

### **Architecture**
*   **`scripts/growth-agent/`**: Root directory.
*   **`main.ts`**: The central brain (Orchestrator).
*   **`lead-gen.ts`**: Handles scraping and identification (Mocked for now, ready for API integration).
*   **`outreach.ts`**: Generates personalized messages using the Content Agent's NLP capabilities.
*   **`seo-content.ts`**: Wraps the existing `ContentAgent` and `SEOAgent` to drive inbound traffic.
*   **`analytics.ts`**: Scores leads and tracks conversion probability.

### **Workflow**
1.  **Inbound:** `SEO-Content Agent` ensures the site ranks for "Organic Potting Mix" -> Traffic arrives -> `Sales Agent` (Chatbot/Popup) captures email.
2.  **Outbound:** `Lead Gen Agent` finds a local Interior Designer on LinkedIn -> `Outreach Agent` drafts a personalized email about "Biophilic Design" using the blog content as a reference -> `Sales Agent` tracks the reply.

---

## 4. Next Steps
1.  Set up the `growth-agent` directory structure.
2.  Create the `Orchestrator` to manage the sub-agents.
3.  Integrate the existing `ContentAgent` logic to power the `Outreach Agent` (using the same brand voice).
4.  Implement the `Lead Gen` logic (simulated for this environment).
