#!/bin/bash

# Hostinger Public HTML Cleanup Script
# This script will clean up the public_html directory on Hostinger

SSH_USER="u951576049"
SSH_HOST="46.28.45.97"
SSH_PORT="65002"
PUBLIC_HTML="/home/u951576049/public_html"

echo "🔄 Connecting to Hostinger..."
echo "Host: $SSH_HOST:$SSH_PORT"
echo "User: $SSH_USER"
echo ""

# Step 1: List current contents
echo "📋 Step 1: Checking current contents of public_html..."
ssh -p $SSH_PORT $SSH_USER@$SSH_HOST "cd $PUBLIC_HTML && echo 'Current contents:' && ls -la"

echo ""
echo "🗑️  Step 2: Cleaning directory (removing all files)..."
ssh -p $SSH_PORT $SSH_USER@$SSH_HOST "cd $PUBLIC_HTML && rm -rf * && echo '✅ Cleanup complete!'"

echo ""
echo "✅ Step 3: Verifying directory is empty..."
ssh -p $SSH_PORT $SSH_USER@$SSH_HOST "cd $PUBLIC_HTML && ls -la && echo '✅ Directory is now empty!'"

echo ""
echo "🎉 SUCCESS! public_html is ready for deployment."
echo ""
echo "Next steps:"
echo "1. Go to Hostinger Dashboard → Hosting → Git"
echo "2. Enter these values:"
echo "   Repository: https://github.com/shayankhadir/-whole-lot-of-nature.git"
echo "   Branch: copilot/analyze-competitors-and-optimize"
echo "   Directory: (leave blank)"
echo "3. Click 'Deploy'"
