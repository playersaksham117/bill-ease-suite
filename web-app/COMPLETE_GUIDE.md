# 🎯 BillEase Suite - Complete Setup & Deployment Guide

**Version**: 1.0.0  
**Last Updated**: December 25, 2025  
**Tech Stack**: Next.js 14 + TypeScript + Supabase + Hostinger

---

## 📚 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Local Development Setup](#local-development-setup)
3. [Supabase Configuration](#supabase-configuration)
4. [Testing Locally](#testing-locally)
5. [Production Deployment](#production-deployment)
6. [Troubleshooting](#troubleshooting)
7. [FAQ](#faq)

---

## Prerequisites

### Required Software
- ✅ Node.js 18.x or higher ([Download](https://nodejs.org/))
- ✅ npm (comes with Node.js)
- ✅ Git (optional but recommended)
- ✅ Code editor (VS Code recommended)

### Required Accounts
- ✅ Supabase account (free tier) - [Sign up](https://supabase.com)
- ✅ Hostinger hosting account - [Sign up](https://hostinger.com)

### Check Your Setup
```bash
node -v    # Should show v18.0.0 or higher
npm -v     # Should show 8.0.0 or higher
```

---

## Local Development Setup

### Step 1: Install Dependencies

**Option A - Automated (Windows)**
```bash
cd web-app
scripts\install.bat
```

**Option B - Manual**
```bash
cd web-app
npm install
```

This will install:
- Next.js and React
- TypeScript
- Tailwind CSS
- Supabase Client (@supabase/supabase-js)
- Supabase SSR (@supabase/ssr)
- All other dependencies

### Step 2: Verify Installation

Run the verification script:
```bash
scripts\verify-setup.bat
```

This checks:
- Node.js and npm installation
- Package dependencies
- Required Supabase files
- Environment configuration

---

## Supabase Configuration

### Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click **"New Project"**
3. Fill in:
   - **Project Name**: `billease-suite`
   - **Database Password**: Choose a strong password (save it!)
   - **Region**: Select closest to your users
4. Click **"Create new project"**
5. Wait 2-3 minutes for setup to complete

### Step 2: Get API Credentials

1. In your Supabase dashboard, go to **Settings → API**
2. Copy these values:
   ```
   Project URL: https://xxxxxxxxxxxxx.supabase.co
   anon/public key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

### Step 3: Configure Environment Variables

1. Open `web-app/.env.local` in your code editor
2. Replace placeholder values:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```
3. Save the file

⚠️ **Important**: Never commit `.env.local` to Git!

### Step 4: Create Database Table

1. In Supabase dashboard, go to **SQL Editor**
2. Click **"New Query"**
3. Copy and paste this SQL:

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

-- Create indexes for better performance
CREATE INDEX idx_stock_items_user_id ON public.stock_items(user_id);
CREATE INDEX idx_stock_items_category ON public.stock_items(category);
CREATE INDEX idx_stock_items_location ON public.stock_items(location);

-- Enable Row Level Security
ALTER TABLE public.stock_items ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (users can only access their own data)
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

-- Function to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to call the function
CREATE TRIGGER update_stock_items_updated_at 
    BEFORE UPDATE ON public.stock_items 
    FOR EACH ROW 
    EXECUTE PROCEDURE update_updated_at_column();
```

4. Click **"Run"** (or press F5)
5. You should see: **"Success. No rows returned"**

### Step 5: Configure Authentication

1. In Supabase dashboard, go to **Authentication → Providers**
2. Ensure **Email** provider is enabled (it's enabled by default)
3. Go to **Authentication → URL Configuration**
4. Add these URLs:
   - **Site URL**: `http://localhost:3000` (for development)
   - **Redirect URLs**: 
     - `http://localhost:3000/auth/callback`
     - `http://localhost:3000/**` (wildcard for all routes)

---

## Testing Locally

### Step 1: Start Development Server

```bash
npm run dev
```

You should see:
```
▲ Next.js 14.0.0
- Local:        http://localhost:3000
- Ready in 2.5s
```

### Step 2: Open in Browser

Visit: [http://localhost:3000](http://localhost:3000)

### Step 3: Test Features

1. **Register a new account**
   - Go to `/register`
   - Create account with email/password
   - Check email for confirmation link

2. **Login**
   - Go to `/login`
   - Sign in with your credentials

3. **View Stock Report**
   - Navigate to: `/workspace/tracinvent/reports/stock`
   - Should see empty stock list (no data yet)

4. **Add test data** (optional)
   - Go to Supabase dashboard → Table Editor
   - Select `stock_items` table
   - Click "Insert row"
   - Fill in values (make sure `user_id` matches your auth user ID)

### Step 4: Test Responsive Design

1. Open browser DevTools (F12)
2. Toggle device toolbar (Ctrl+Shift+M)
3. Test different screen sizes:
   - Mobile: 375px
   - Tablet: 768px
   - Desktop: 1920px

---

## Production Deployment

### Option 1: Static Export (Recommended for Hostinger)

This is the simplest method for Hostinger shared hosting.

#### Step 1: Prepare for Production

1. Create `.env.production` file:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-production-anon-key
   NEXT_PUBLIC_APP_URL=https://yourdomain.com
   ```

2. Update `next.config.js`:
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

#### Step 2: Build for Production

**Windows:**
```bash
scripts\build-production.bat
```

**Mac/Linux:**
```bash
chmod +x scripts/build-production.sh
./scripts/build-production.sh
```

This creates an `out/` folder with static files.

#### Step 3: Upload to Hostinger

**Via File Manager:**
1. Login to Hostinger hPanel
2. Go to **File Manager**
3. Navigate to `public_html` (or your domain folder)
4. Delete existing files (if any)
5. Upload all files from the `out/` folder
6. Upload `public/.htaccess` file

**Via FTP:**
1. Connect using FileZilla or similar
2. Upload all files from `out/` folder to `public_html/`
3. Upload `.htaccess` file

#### Step 4: Configure Domain & SSL

1. In Hostinger hPanel, go to **Domains**
2. Point your domain to hosting
3. Go to **SSL**
4. Click **"Install SSL"** (free Let's Encrypt)
5. Enable **"Force HTTPS"**

#### Step 5: Update Supabase URLs

1. Go to Supabase dashboard
2. Navigate to **Authentication → URL Configuration**
3. Update:
   - **Site URL**: `https://yourdomain.com`
   - **Redirect URLs**:
     - `https://yourdomain.com/auth/callback`
     - `https://yourdomain.com/**`

### Option 2: Node.js Hosting

If you have Node.js hosting (VPS/dedicated):

1. SSH into your server
2. Upload entire project
3. Install dependencies: `npm install --production`
4. Build: `npm run build`
5. Start with PM2:
   ```bash
   npm install -g pm2
   pm2 start npm --name "billease" -- start
   pm2 save
   pm2 startup
   ```

---

## Troubleshooting

### "Failed to load stock data"

**Cause**: Supabase connection issue

**Solutions**:
1. Check `.env.local` has correct credentials
2. Verify database table exists in Supabase
3. Check browser console for specific error
4. Ensure user is logged in (auth.uid() exists)

### Build Errors

**Cause**: Dependency or configuration issue

**Solutions**:
```bash
# Clear cache and rebuild
rm -rf .next node_modules package-lock.json
npm install
npm run build
```

### Authentication Not Working

**Cause**: Redirect URL mismatch

**Solutions**:
1. Check Supabase redirect URLs match your domain
2. Ensure HTTPS is enabled in production
3. Clear browser cookies and try again
4. Check browser console for CORS errors

### 404 Errors on Hostinger

**Cause**: Missing .htaccess or incorrect routing

**Solutions**:
1. Ensure `.htaccess` file is uploaded
2. Check file permissions (755 for folders, 644 for files)
3. Verify `index.html` exists in root
4. Enable mod_rewrite in hosting settings

### Mobile View Issues

**Cause**: Viewport or responsive CSS issues

**Solutions**:
1. Clear browser cache
2. Test in Chrome DevTools device mode
3. Check Tailwind breakpoints are correct
4. Verify `viewport` meta tag in HTML

---

## FAQ

### Q: Can I use this with other databases?

A: Yes, but you'll need to modify the data fetching logic. Supabase is recommended for ease of use.

### Q: Is Supabase free?

A: Yes, Supabase offers a generous free tier perfect for development and small projects.

### Q: Can I deploy to Vercel instead of Hostinger?

A: Yes! Vercel is actually easier. Just:
```bash
npm install -g vercel
vercel
```

### Q: How do I add more tables?

A: Follow the same pattern:
1. Create table in Supabase SQL Editor
2. Add RLS policies
3. Create TypeScript types
4. Fetch data in your component

### Q: How do I backup my database?

A: In Supabase dashboard:
1. Go to Database → Backups
2. Configure automatic backups
3. Or export manually via SQL Editor

### Q: Can I use custom domains?

A: Yes, configure in Hostinger:
1. Point domain DNS to Hostinger
2. Add domain in hPanel
3. Install SSL certificate
4. Update Supabase redirect URLs

---

## 🎉 Success!

Your BillEase Suite is now:
- ✅ Running locally with hot reload
- ✅ Connected to Supabase database
- ✅ Secured with authentication
- ✅ Mobile responsive
- ✅ Production ready for Hostinger

---

## 📞 Support

- **Supabase Docs**: https://supabase.com/docs
- **Next.js Docs**: https://nextjs.org/docs
- **Tailwind CSS**: https://tailwindcss.com/docs
- **Hostinger Help**: Contact via hPanel

---

## 📝 Additional Resources

- `DEPLOYMENT.md` - Detailed deployment guide
- `DATABASE_SCHEMA.md` - Database documentation
- `SUPABASE_INTEGRATION_SUMMARY.md` - Integration details

---

**Happy Coding! 🚀**
