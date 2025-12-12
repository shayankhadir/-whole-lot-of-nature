export type SiteAudit = {
  generatedAt: string;
  counts: {
    totalRoutes: number;
    pageRoutes: number;
    apiRoutes: number;
    internalLinks: number;
    brokenLinks: number;
    orphanRoutes: number;
  };
  routes: Array<{ path: string; kind: 'page' | 'api'; source: string }>;
  brokenLinks: Array<{ href: string; source: string; line: number }>;
  orphanRoutes: Array<{ path: string; source: string }>;
};

export const siteAudit: SiteAudit = {
  "generatedAt": "2025-12-12T20:13:43.055Z",
  "counts": {
    "totalRoutes": 109,
    "pageRoutes": 68,
    "apiRoutes": 41,
    "internalLinks": 354,
    "brokenLinks": 0,
    "orphanRoutes": 22
  },
  "routes": [
    {
      "path": "/about",
      "kind": "page",
      "source": "src/app/about/page.tsx"
    },
    {
      "path": "/account",
      "kind": "page",
      "source": "src/app/account/page.tsx"
    },
    {
      "path": "/admin/content",
      "kind": "page",
      "source": "src/app/admin/content/page.tsx"
    },
    {
      "path": "/admin/growth",
      "kind": "page",
      "source": "src/app/admin/growth/page.tsx"
    },
    {
      "path": "/admin/inventory",
      "kind": "page",
      "source": "src/app/admin/inventory/page.tsx"
    },
    {
      "path": "/admin/pages",
      "kind": "page",
      "source": "src/app/admin/pages/page.tsx"
    },
    {
      "path": "/admin/seo",
      "kind": "page",
      "source": "src/app/admin/seo/page.tsx"
    },
    {
      "path": "/admin/trends",
      "kind": "page",
      "source": "src/app/admin/trends/page.tsx"
    },
    {
      "path": "/admin",
      "kind": "page",
      "source": "src/app/admin/page.tsx"
    },
    {
      "path": "/api/admin/run-script",
      "kind": "api",
      "source": "src/app/api/admin/run-script/route.ts"
    },
    {
      "path": "/api/agent/run",
      "kind": "api",
      "source": "src/app/api/agent/run/route.ts"
    },
    {
      "path": "/api/agent/supervisor",
      "kind": "api",
      "source": "src/app/api/agent/supervisor/route.ts"
    },
    {
      "path": "/api/agents/plantsy",
      "kind": "api",
      "source": "src/app/api/agents/plantsy/route.ts"
    },
    {
      "path": "/api/agents/social-auto-poster",
      "kind": "api",
      "source": "src/app/api/agents/social-auto-poster/route.ts"
    },
    {
      "path": "/api/auth/[...nextauth]",
      "kind": "api",
      "source": "src/app/api/auth/[...nextauth]/route.ts"
    },
    {
      "path": "/api/auth/register",
      "kind": "api",
      "source": "src/app/api/auth/register/route.ts"
    },
    {
      "path": "/api/backlinks/run",
      "kind": "api",
      "source": "src/app/api/backlinks/run/route.ts"
    },
    {
      "path": "/api/blog/create-test-drafts",
      "kind": "api",
      "source": "src/app/api/blog/create-test-drafts/route.ts"
    },
    {
      "path": "/api/blog/list",
      "kind": "api",
      "source": "src/app/api/blog/list/route.ts"
    },
    {
      "path": "/api/cart",
      "kind": "api",
      "source": "src/app/api/cart/route.ts"
    },
    {
      "path": "/api/categories",
      "kind": "api",
      "source": "src/app/api/categories/route.ts"
    },
    {
      "path": "/api/checkout",
      "kind": "api",
      "source": "src/app/api/checkout/route.ts"
    },
    {
      "path": "/api/coupons/validate",
      "kind": "api",
      "source": "src/app/api/coupons/validate/route.ts"
    },
    {
      "path": "/api/design-audit",
      "kind": "api",
      "source": "src/app/api/design-audit/route.ts"
    },
    {
      "path": "/api/email/intelligence",
      "kind": "api",
      "source": "src/app/api/email/intelligence/route.ts"
    },
    {
      "path": "/api/email/submit",
      "kind": "api",
      "source": "src/app/api/email/submit/route.ts"
    },
    {
      "path": "/api/generate-blog-post",
      "kind": "api",
      "source": "src/app/api/generate-blog-post/route.ts"
    },
    {
      "path": "/api/growth-agent/run",
      "kind": "api",
      "source": "src/app/api/growth-agent/run/route.ts"
    },
    {
      "path": "/api/growth-agent/stats",
      "kind": "api",
      "source": "src/app/api/growth-agent/stats/route.ts"
    },
    {
      "path": "/api/instagram/automate",
      "kind": "api",
      "source": "src/app/api/instagram/automate/route.ts"
    },
    {
      "path": "/api/instagram/buffer-test",
      "kind": "api",
      "source": "src/app/api/instagram/buffer-test/route.ts"
    },
    {
      "path": "/api/instagram/instagram-test",
      "kind": "api",
      "source": "src/app/api/instagram/instagram-test/route.ts"
    },
    {
      "path": "/api/inventory/sync",
      "kind": "api",
      "source": "src/app/api/inventory/sync/route.ts"
    },
    {
      "path": "/api/inventory",
      "kind": "api",
      "source": "src/app/api/inventory/route.ts"
    },
    {
      "path": "/api/marketing/analyze",
      "kind": "api",
      "source": "src/app/api/marketing/analyze/route.ts"
    },
    {
      "path": "/api/marketing/automate",
      "kind": "api",
      "source": "src/app/api/marketing/automate/route.ts"
    },
    {
      "path": "/api/marketing/social",
      "kind": "api",
      "source": "src/app/api/marketing/social/route.ts"
    },
    {
      "path": "/api/payments/cashfree/create-order",
      "kind": "api",
      "source": "src/app/api/payments/cashfree/create-order/route.ts"
    },
    {
      "path": "/api/payments/cashfree/status/[orderId]",
      "kind": "api",
      "source": "src/app/api/payments/cashfree/status/[orderId]/route.ts"
    },
    {
      "path": "/api/payments/cashfree/webhook",
      "kind": "api",
      "source": "src/app/api/payments/cashfree/webhook/route.ts"
    },
    {
      "path": "/api/products/[id]",
      "kind": "api",
      "source": "src/app/api/products/[id]/route.ts"
    },
    {
      "path": "/api/products",
      "kind": "api",
      "source": "src/app/api/products/route.ts"
    },
    {
      "path": "/api/publisher/schedule",
      "kind": "api",
      "source": "src/app/api/publisher/schedule/route.ts"
    },
    {
      "path": "/api/reviews",
      "kind": "api",
      "source": "src/app/api/reviews/route.ts"
    },
    {
      "path": "/api/tags",
      "kind": "api",
      "source": "src/app/api/tags/route.ts"
    },
    {
      "path": "/api/test-connection",
      "kind": "api",
      "source": "src/app/api/test-connection/route.ts"
    },
    {
      "path": "/api/test-woocommerce",
      "kind": "api",
      "source": "src/app/api/test-woocommerce/route.ts"
    },
    {
      "path": "/api/trends",
      "kind": "api",
      "source": "src/app/api/trends/route.ts"
    },
    {
      "path": "/api/webhooks/cashfree",
      "kind": "api",
      "source": "src/app/api/webhooks/cashfree/route.ts"
    },
    {
      "path": "/api/webhooks/order",
      "kind": "api",
      "source": "src/app/api/webhooks/order/route.ts"
    },
    {
      "path": "/auth/forgot-password",
      "kind": "page",
      "source": "src/app/auth/forgot-password/page.tsx"
    },
    {
      "path": "/auth/signin",
      "kind": "page",
      "source": "src/app/auth/signin/page.tsx"
    },
    {
      "path": "/auth/signup",
      "kind": "page",
      "source": "src/app/auth/signup/page.tsx"
    },
    {
      "path": "/blog-agent",
      "kind": "page",
      "source": "src/app/blog-agent/page.tsx"
    },
    {
      "path": "/blog/_old-categoryId-backup",
      "kind": "page",
      "source": "src/app/blog/_old-categoryId-backup/page.tsx"
    },
    {
      "path": "/blog/[slug]",
      "kind": "page",
      "source": "src/app/blog/[slug]/page.tsx"
    },
    {
      "path": "/blog/best-online-gardening-store-in-bangalore",
      "kind": "page",
      "source": "src/app/blog/best-online-gardening-store-in-bangalore/page.tsx"
    },
    {
      "path": "/blog/category/[id]",
      "kind": "page",
      "source": "src/app/blog/category/[id]/page.tsx"
    },
    {
      "path": "/blog",
      "kind": "page",
      "source": "src/app/blog/page.tsx"
    },
    {
      "path": "/careers",
      "kind": "page",
      "source": "src/app/careers/page.tsx"
    },
    {
      "path": "/cart",
      "kind": "page",
      "source": "src/app/cart/page.tsx"
    },
    {
      "path": "/categories",
      "kind": "page",
      "source": "src/app/categories/page.tsx"
    },
    {
      "path": "/checkout",
      "kind": "page",
      "source": "src/app/checkout/page.tsx"
    },
    {
      "path": "/combos",
      "kind": "page",
      "source": "src/app/combos/page.tsx"
    },
    {
      "path": "/community",
      "kind": "page",
      "source": "src/app/community/page.tsx"
    },
    {
      "path": "/contact",
      "kind": "page",
      "source": "src/app/contact/page.tsx"
    },
    {
      "path": "/faq",
      "kind": "page",
      "source": "src/app/faq/page.tsx"
    },
    {
      "path": "/gift-cards",
      "kind": "page",
      "source": "src/app/gift-cards/page.tsx"
    },
    {
      "path": "/guides",
      "kind": "page",
      "source": "src/app/guides/page.tsx"
    },
    {
      "path": "/learn-gardening/[id]",
      "kind": "page",
      "source": "src/app/learn-gardening/[id]/page.tsx"
    },
    {
      "path": "/learn-gardening",
      "kind": "page",
      "source": "src/app/learn-gardening/page.tsx"
    },
    {
      "path": "/login",
      "kind": "page",
      "source": "src/app/login/page.tsx"
    },
    {
      "path": "/order-success",
      "kind": "page",
      "source": "src/app/order-success/page.tsx"
    },
    {
      "path": "/",
      "kind": "page",
      "source": "src/app/page.tsx"
    },
    {
      "path": "/partnerships",
      "kind": "page",
      "source": "src/app/partnerships/page.tsx"
    },
    {
      "path": "/plants",
      "kind": "page",
      "source": "src/app/plants/page.tsx"
    },
    {
      "path": "/plantsy",
      "kind": "page",
      "source": "src/app/plantsy/page.tsx"
    },
    {
      "path": "/privacy-policy",
      "kind": "page",
      "source": "src/app/privacy-policy/page.tsx"
    },
    {
      "path": "/products/[slug]",
      "kind": "page",
      "source": "src/app/products/[slug]/page.tsx"
    },
    {
      "path": "/products",
      "kind": "page",
      "source": "src/app/products/page.tsx"
    },
    {
      "path": "/refund-policy",
      "kind": "page",
      "source": "src/app/refund-policy/page.tsx"
    },
    {
      "path": "/robots.txt",
      "kind": "page",
      "source": "src/app/robots.ts"
    },
    {
      "path": "/seo-pages/error",
      "kind": "page",
      "source": "src/app/seo-pages/error/page.tsx"
    },
    {
      "path": "/seo-pages/garden",
      "kind": "page",
      "source": "src/app/seo-pages/garden/page.tsx"
    },
    {
      "path": "/seo-pages/indoor-plants-care",
      "kind": "page",
      "source": "src/app/seo-pages/indoor-plants-care/page.tsx"
    },
    {
      "path": "/seo-pages/indoor",
      "kind": "page",
      "source": "src/app/seo-pages/indoor/page.tsx"
    },
    {
      "path": "/seo-pages/loading",
      "kind": "page",
      "source": "src/app/seo-pages/loading/page.tsx"
    },
    {
      "path": "/seo-pages/online",
      "kind": "page",
      "source": "src/app/seo-pages/online/page.tsx"
    },
    {
      "path": "/seo-pages/organic-fertilizers",
      "kind": "page",
      "source": "src/app/seo-pages/organic-fertilizers/page.tsx"
    },
    {
      "path": "/seo-pages/outdoor-gardening-tips",
      "kind": "page",
      "source": "src/app/seo-pages/outdoor-gardening-tips/page.tsx"
    },
    {
      "path": "/seo-pages/page",
      "kind": "page",
      "source": "src/app/seo-pages/page/page.tsx"
    },
    {
      "path": "/seo-pages/pest-control-natural",
      "kind": "page",
      "source": "src/app/seo-pages/pest-control-natural/page.tsx"
    },
    {
      "path": "/seo-pages/plant",
      "kind": "page",
      "source": "src/app/seo-pages/plant/page.tsx"
    },
    {
      "path": "/seo-pages/plants",
      "kind": "page",
      "source": "src/app/seo-pages/plants/page.tsx"
    },
    {
      "path": "/seo-pages/title",
      "kind": "page",
      "source": "src/app/seo-pages/title/page.tsx"
    },
    {
      "path": "/seo-pages/watering-schedule",
      "kind": "page",
      "source": "src/app/seo-pages/watering-schedule/page.tsx"
    },
    {
      "path": "/seo-pages",
      "kind": "page",
      "source": "src/app/seo-pages/page.tsx"
    },
    {
      "path": "/shipping-policy",
      "kind": "page",
      "source": "src/app/shipping-policy/page.tsx"
    },
    {
      "path": "/shop/[slug]",
      "kind": "page",
      "source": "src/app/shop/[slug]/page.tsx"
    },
    {
      "path": "/shop/category/[slug]",
      "kind": "page",
      "source": "src/app/shop/category/[slug]/page.tsx"
    },
    {
      "path": "/shop",
      "kind": "page",
      "source": "src/app/shop/page.tsx"
    },
    {
      "path": "/signup",
      "kind": "page",
      "source": "src/app/signup/page.tsx"
    },
    {
      "path": "/sitemap.xml",
      "kind": "page",
      "source": "src/app/sitemap.ts"
    },
    {
      "path": "/soil-mixes-and-amendments",
      "kind": "page",
      "source": "src/app/soil-mixes-and-amendments/page.tsx"
    },
    {
      "path": "/team",
      "kind": "page",
      "source": "src/app/team/page.tsx"
    },
    {
      "path": "/terms-and-conditions",
      "kind": "page",
      "source": "src/app/terms-and-conditions/page.tsx"
    },
    {
      "path": "/terms",
      "kind": "page",
      "source": "src/app/terms/page.tsx"
    },
    {
      "path": "/track-order",
      "kind": "page",
      "source": "src/app/track-order/page.tsx"
    },
    {
      "path": "/wishlist",
      "kind": "page",
      "source": "src/app/wishlist/page.tsx"
    }
  ],
  "brokenLinks": [],
  "orphanRoutes": [
    {
      "path": "/blog/_old-categoryId-backup",
      "source": "src/app/blog/_old-categoryId-backup/page.tsx"
    },
    {
      "path": "/blog/[slug]",
      "source": "src/app/blog/[slug]/page.tsx"
    },
    {
      "path": "/blog/best-online-gardening-store-in-bangalore",
      "source": "src/app/blog/best-online-gardening-store-in-bangalore/page.tsx"
    },
    {
      "path": "/blog/category/[id]",
      "source": "src/app/blog/category/[id]/page.tsx"
    },
    {
      "path": "/learn-gardening/[id]",
      "source": "src/app/learn-gardening/[id]/page.tsx"
    },
    {
      "path": "/products/[slug]",
      "source": "src/app/products/[slug]/page.tsx"
    },
    {
      "path": "/seo-pages/error",
      "source": "src/app/seo-pages/error/page.tsx"
    },
    {
      "path": "/seo-pages/garden",
      "source": "src/app/seo-pages/garden/page.tsx"
    },
    {
      "path": "/seo-pages/indoor-plants-care",
      "source": "src/app/seo-pages/indoor-plants-care/page.tsx"
    },
    {
      "path": "/seo-pages/indoor",
      "source": "src/app/seo-pages/indoor/page.tsx"
    },
    {
      "path": "/seo-pages/loading",
      "source": "src/app/seo-pages/loading/page.tsx"
    },
    {
      "path": "/seo-pages/online",
      "source": "src/app/seo-pages/online/page.tsx"
    },
    {
      "path": "/seo-pages/organic-fertilizers",
      "source": "src/app/seo-pages/organic-fertilizers/page.tsx"
    },
    {
      "path": "/seo-pages/outdoor-gardening-tips",
      "source": "src/app/seo-pages/outdoor-gardening-tips/page.tsx"
    },
    {
      "path": "/seo-pages/page",
      "source": "src/app/seo-pages/page/page.tsx"
    },
    {
      "path": "/seo-pages/pest-control-natural",
      "source": "src/app/seo-pages/pest-control-natural/page.tsx"
    },
    {
      "path": "/seo-pages/plant",
      "source": "src/app/seo-pages/plant/page.tsx"
    },
    {
      "path": "/seo-pages/plants",
      "source": "src/app/seo-pages/plants/page.tsx"
    },
    {
      "path": "/seo-pages/title",
      "source": "src/app/seo-pages/title/page.tsx"
    },
    {
      "path": "/seo-pages/watering-schedule",
      "source": "src/app/seo-pages/watering-schedule/page.tsx"
    },
    {
      "path": "/shop/[slug]",
      "source": "src/app/shop/[slug]/page.tsx"
    },
    {
      "path": "/shop/category/[slug]",
      "source": "src/app/shop/category/[slug]/page.tsx"
    }
  ]
} as const;
