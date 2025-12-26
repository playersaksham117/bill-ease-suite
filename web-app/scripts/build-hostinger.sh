#!/bin/bash
# Build script for Hostinger deployment

echo "🚀 Building BillEase Suite for Hostinger..."

# Set environment to production
export NODE_ENV=production

# Copy Hostinger environment file
if [ -f ".env.hostinger" ]; then
  echo "📋 Copying Hostinger environment configuration..."
  cp .env.hostinger .env.production
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install --production=false

# Build Next.js application
echo "🔨 Building Next.js application..."
npm run build

# Create deployment package
echo "📦 Creating deployment package..."
mkdir -p dist
cp -r .next dist/
cp -r public dist/
cp package.json dist/
cp package-lock.json dist/
cp next.config.js dist/
cp -r node_modules dist/ 2>/dev/null || echo "Skipping node_modules copy (install on server)"

echo "✅ Build complete!"
echo ""
echo "📁 Deployment files are in the 'dist' folder"
echo ""
echo "🌐 Next steps for Hostinger:"
echo "1. Upload 'dist' contents to your public_html directory"
echo "2. In Hostinger panel: Setup > Node.js"
echo "3. Set Node.js version to 18.x or higher"
echo "4. Set Application Root to '/public_html'"
echo "5. Set Application URL to your domain"
echo "6. Set Application Startup File to 'node_modules/next/dist/bin/next'"
echo "7. Set arguments: 'start'"
echo "8. Click 'Create' or 'Update'"
echo ""
echo "💾 Database setup:"
echo "1. Create MySQL database in cPanel"
echo "2. Import 'database-hostinger.sql'"
echo "3. Update .env.production with database credentials"
echo ""
echo "🔐 Default demo login:"
echo "   Email: demo@billease.com"
echo "   Password: demo123"
