#!/bin/bash

# This script sets up .env.local on Hostinger
# Usage: Pass this to SSH or run manually on the server

cd /home/u951576049/public_html

cat > .env.local << 'EOF'
# AI/Content
PERPLEXITY_API_KEY=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

# WordPress Core
WORDPRESS_API_URL=https://admin.wholelotofnature.com/wp-json
WORDPRESS_URL=https://admin.wholelotofnature.com
WORDPRESS_SITE_URL=https://admin.wholelotofnature.com
WORDPRESS_USERNAME=zebbroka@gmail.com
WORDPRESS_APP_PASSWORD=Jm2r 8rVf 1vqw RwGx pIq9 aL7c

# WooCommerce
WC_CONSUMER_KEY=ck_7c14b9262866f37bee55394c53c727cf4a6c987f
WC_CONSUMER_SECRET=cs_25c1e29325113145d0c13913007cc1a92d965bce

# Frontend URLs
NEXT_PUBLIC_SITE_URL=https://wholelotofnature.com
NEXT_PUBLIC_API_URL=https://admin.wholelotofnature.com/wp-json
NEXT_PUBLIC_WORDPRESS_URL=https://admin.wholelotofnature.com

# Instagram
INSTAGRAM_ACCESS_TOKEN=EAAZA7I46ApJsBP1NOqmyZCodaue1J39iqIrZBfnt2SLc6lfSYgSzAFhzCteOz99xjDx2racR9KmEK8DWIEPpQ1aXTyYTV7rvvqbJGZAr6QoeqpTfhQsf8CnrNFCWfThEuk5F8VxyIdBWt15lWZC6amZC6rXsOaxb0zstQIkg8BCfM2aejm2N1Qa93SUrGOGc3zG2fH31cXGn6iRQjlpH74qnygEpYKkOeUXUbkVC5OR39lJSm1sDqjwSHFNKZBfnvOs6PGtgGitPHWEHiQCOJya
INSTAGRAM_BUSINESS_ACCOUNT_ID=852065054661900
INSTAGRAM_APP_ID=1824242505131163
INSTAGRAM_APP_SECRET=697d402f5317e6db29b39175158d5b10

# System/Security
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1
REVALIDATE_SECRET=a7f3c8e9d2b1f4e6a9c3b8d1e4f7a2c5b8e9d0f1a2b3c4d5e6f7a8b9c0d1e2

# SEO
NEXT_PUBLIC_GSC_VERIFICATION=6tuH6YnXi1idUfoqCATuz4a05rpWhoPqX5YXO7jW74U
EOF

# Set secure permissions
chmod 600 .env.local

# Verify creation
echo "✅ .env.local created successfully!"
echo "File location: $(pwd)/.env.local"
echo "Permissions: $(ls -l .env.local | awk '{print $1}')"
echo ""
echo "File contents:"
cat .env.local
