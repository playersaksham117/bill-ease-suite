# BillEase Suite - Supabase & Hostinger Deployment Guide

## 📋 Prerequisites

1. **Supabase Account**: Create account at [supabase.com](https://supabase.com)
2. **Hostinger Account**: Get hosting plan at [hostinger.com](https://hostinger.com)
3. **Node.js**: Version 18.x or higher
4. **pnpm/npm/yarn**: Package manager

---

## 🚀 Part 1: Supabase Setup

### Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click "New Project"
3. Fill in:
   - **Project Name**: BillEase Suite
   - **Database Password**: (save this securely)
   - **Region**: Choose closest to your users
4. Click "Create new project"

### Step 2: Get API Keys

1. Go to Project Settings → API
2. Copy these values:
   - **Project URL**: `https://xxxxxxxxxxxxx.supabase.co`
   - **anon/public key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
   - **service_role key**: (optional, for admin operations)

### Step 3: Create Database Tables

1. Go to SQL Editor in your Supabase dashboard
2. Run this SQL to create the stock_items table:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create stock_items table
CREATE TABLE public.stock_items (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    sku TEXT NOT NULL,
    category TEXT NOT NULL,
    location TEXT NOT NULL,
    opening_stock INTEGER DEFAULT 0,
    stock_in INTEGER DEFAULT 0,
    stock_out INTEGER DEFAULT 0,
    adjustments INTEGER DEFAULT 0,
    closing_stock INTEGER DEFAULT 0,
    unit TEXT DEFAULT 'pcs',
    cost_price DECIMAL(10,2) DEFAULT 0,
    stock_value DECIMAL(10,2) DEFAULT 0,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create index for faster queries
CREATE INDEX idx_stock_items_user_id ON public.stock_items(user_id);
CREATE INDEX idx_stock_items_category ON public.stock_items(category);
CREATE INDEX idx_stock_items_location ON public.stock_items(location);

-- Enable Row Level Security (RLS)
ALTER TABLE public.stock_items ENABLE ROW LEVEL SECURITY;

-- Create policies for RLS
CREATE POLICY "Users can view their own stock items" 
    ON public.stock_items FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own stock items" 
    ON public.stock_items FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own stock items" 
    ON public.stock_items FOR UPDATE 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own stock items" 
    ON public.stock_items FOR DELETE 
    USING (auth.uid() = user_id);

-- Create function to auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for auto-updating updated_at
CREATE TRIGGER update_stock_items_updated_at 
    BEFORE UPDATE ON public.stock_items 
    FOR EACH ROW 
    EXECUTE PROCEDURE update_updated_at_column();
```

### Step 4: Configure Authentication

1. Go to Authentication → Providers
2. Enable Email provider (enabled by default)
3. Optional: Enable other providers (Google, GitHub, etc.)
4. Go to Authentication → URL Configuration
5. Add your site URL:
   - **Site URL**: `https://yourdomain.com`
   - **Redirect URLs**: 
     - `https://yourdomain.com/auth/callback`
     - `http://localhost:3000/auth/callback` (for development)

---

## 🌐 Part 2: Local Development Setup

### Step 1: Install Dependencies

```bash
cd web-app
npm install @supabase/supabase-js @supabase/ssr
```

### Step 2: Configure Environment Variables

Edit `.env.local` file:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Optional: For admin operations
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Step 3: Run Development Server

```bash
npm run dev
```

Visit `http://localhost:3000`

---

## 🚀 Part 3: Hostinger Deployment

### Option A: Deploy with Hostinger's Node.js Hosting

#### Step 1: Build Your Application

```bash
npm run build
```

#### Step 2: Upload to Hostinger

1. Login to Hostinger hPanel
2. Go to **Advanced** → **SSH Access**
3. Enable SSH and note credentials
4. Connect via SSH or use File Manager
5. Upload these files/folders:
   - `.next/` (entire folder)
   - `public/` (entire folder)
   - `node_modules/` (or run npm install on server)
   - `package.json`
   - `next.config.js`
   - `.env.production`

#### Step 3: Configure Environment Variables

1. In hPanel, go to your domain
2. Find "Environment Variables" or create `.env.production`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-production-anon-key
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

#### Step 4: Start Application

SSH into your server and run:

```bash
npm install --production
npm run start
```

Or use PM2 for process management:

```bash
npm install -g pm2
pm2 start npm --name "billease" -- start
pm2 save
pm2 startup
```

### Option B: Export as Static Site (Recommended for Hostinger)

If your app doesn't need server-side features:

#### Step 1: Update next.config.js

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
}

module.exports = nextConfig
```

#### Step 2: Build Static Export

```bash
npm run build
```

This creates an `out/` folder with static files.

#### Step 3: Upload to Hostinger

1. Login to Hostinger File Manager
2. Navigate to `public_html` (or your domain's root)
3. Upload all files from `out/` folder
4. Done! Your site is live.

### Step 4: Configure Domain

1. In Hostinger, go to **Domains**
2. Point your domain to the hosting
3. Enable **SSL Certificate** (free with Hostinger)
4. Update Supabase URLs with your domain

---

## 🔒 Part 4: Security Configuration

### 1. Update Supabase URLs

In Supabase dashboard → Authentication → URL Configuration:
- **Site URL**: `https://yourdomain.com`
- Add redirect URL: `https://yourdomain.com/auth/callback`

### 2. Environment Variables

**NEVER** commit `.env.local` or `.env.production` to Git!

Add to `.gitignore`:
```
.env*.local
.env.production
```

### 3. Enable HTTPS

Hostinger provides free SSL. Enable it in hPanel:
1. Go to SSL
2. Click "Install SSL"
3. Force HTTPS redirect

---

## 📊 Part 5: Seeding Initial Data (Optional)

To add sample data for testing:

1. Go to Supabase Dashboard → SQL Editor
2. First, create a test user or use an existing user ID
3. Run this SQL (replace `user-uuid-here` with actual user ID):

```sql
INSERT INTO public.stock_items 
(name, sku, category, location, opening_stock, stock_in, stock_out, adjustments, closing_stock, unit, cost_price, stock_value, user_id)
VALUES
('Tata Salt 1kg', 'SALT001', 'Grocery', 'Rack A1', 100, 100, 50, 0, 150, 'pcs', 25.00, 3750.00, 'user-uuid-here'),
('Amul Butter 500g', 'BUTR001', 'Dairy', 'Cold Storage', 50, 20, 58, 0, 12, 'pcs', 250.00, 3000.00, 'user-uuid-here'),
('Maggi Noodles 70g', 'NOOD001', 'Instant Food', 'Rack B2', 150, 200, 140, -10, 200, 'pcs', 12.00, 2400.00, 'user-uuid-here');
```

---

## 🧪 Testing Checklist

- [ ] User can register/login
- [ ] Stock data loads correctly
- [ ] Filters work (category, location, search)
- [ ] Export to CSV works
- [ ] Print functionality works
- [ ] Mobile responsive design works
- [ ] HTTPS is enabled
- [ ] Environment variables are set correctly
- [ ] RLS policies prevent unauthorized access

---

## 🐛 Troubleshooting

### "Failed to load stock data"
- Check Supabase API keys in environment variables
- Verify database table exists
- Check RLS policies are correctly set

### Build Errors
- Ensure all dependencies are installed: `npm install`
- Clear cache: `rm -rf .next && npm run build`

### 404 on Hostinger
- Ensure `.htaccess` redirects to `index.html` for SPA routing
- Check file permissions (755 for folders, 644 for files)

### Authentication Not Working
- Verify redirect URLs in Supabase match your domain
- Check CORS settings
- Ensure cookies are enabled

---

## 📞 Support

- **Supabase Docs**: [supabase.com/docs](https://supabase.com/docs)
- **Next.js Docs**: [nextjs.org/docs](https://nextjs.org/docs)
- **Hostinger Support**: Contact via hPanel

---

## 🎉 Success!

Your BillEase Suite is now live with:
- ✅ Supabase authentication & database
- ✅ Real-time data sync
- ✅ Secure row-level security
- ✅ Production hosting on Hostinger
- ✅ SSL/HTTPS enabled
- ✅ Mobile responsive

Happy coding! 🚀
