#!/bin/bash

# Quick script to add CORS origins for Sanity
# Usage: bash add-cors.sh

echo "🔧 Adding CORS origins to Sanity..."
echo ""

# Add localhost for development
echo "Adding localhost:3000..."
npx sanity cors add http://localhost:3000 --credentials

# Prompt for Netlify domain
echo ""
echo "Enter your Netlify domain (e.g., your-site.netlify.app):"
read netlify_domain

if [ -z "$netlify_domain" ]; then
  echo "❌ No domain entered. Please run the script again."
  exit 1
fi

# Add https prefix if not present
if [[ ! $netlify_domain == http* ]]; then
  netlify_domain="https://$netlify_domain"
fi

echo ""
echo "Adding $netlify_domain..."
npx sanity cors add "$netlify_domain" --credentials

echo ""
echo "✅ Done! CORS origins added:"
echo "  - http://localhost:3000"
echo "  - $netlify_domain"
echo ""
echo "Wait 1-2 minutes for changes to propagate, then refresh your site."
