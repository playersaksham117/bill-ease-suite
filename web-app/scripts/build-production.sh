#!/bin/bash

# Production Build Script for Hostinger Deployment
# Run this script before deploying to Hostinger

echo "🚀 Starting production build..."

# Clean previous builds
echo "🧹 Cleaning previous builds..."
rm -rf .next out

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Run type check
echo "🔍 Running type check..."
npm run type-check

# Build the application
echo "🏗️  Building application..."
npm run build

echo "✅ Build complete!"
echo ""
echo "📁 Your production files are ready in the 'out/' folder"
echo "📤 Upload the contents of 'out/' folder to your Hostinger public_html directory"
echo ""
echo "📋 Don't forget to:"
echo "   1. Set environment variables in Hostinger"
echo "   2. Upload .htaccess file"
echo "   3. Enable SSL certificate"
echo "   4. Update Supabase redirect URLs"
echo ""
echo "🎉 Happy deploying!"
