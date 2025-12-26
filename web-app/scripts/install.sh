#!/bin/bash

echo "🚀 BillEase Suite - Installation Script"
echo "========================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18 or higher."
    exit 1
fi

echo "✅ Node.js version: $(node -v)"
echo ""

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm."
    exit 1
fi

echo "✅ npm version: $(npm -v)"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies."
    exit 1
fi

echo "✅ Dependencies installed successfully!"
echo ""

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo "⚙️  Creating .env.local file..."
    cat > .env.local << EOL
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your-project-url.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Optional: For admin operations
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
EOL
    echo "✅ Created .env.local - Please update with your Supabase credentials!"
else
    echo "✅ .env.local already exists"
fi

echo ""
echo "🎉 Installation complete!"
echo ""
echo "📋 Next steps:"
echo "   1. Update .env.local with your Supabase credentials"
echo "   2. Create database table in Supabase (see QUICK_START.md)"
echo "   3. Run: npm run dev"
echo ""
echo "📚 Documentation:"
echo "   - QUICK_START.md - Quick setup guide"
echo "   - DEPLOYMENT.md - Full deployment guide"
echo "   - DATABASE_SCHEMA.md - Database structure"
echo ""
echo "🚀 Ready to code!"
