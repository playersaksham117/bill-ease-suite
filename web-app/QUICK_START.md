# 🚀 Quick Start Guide - BillEase Suite

Get your BillEase Suite up and running in 5 minutes!

## ⚡ Quick Setup (Development)

### 1️⃣ Install Dependencies

```bash
cd web-app
npm install
```

### 2️⃣ Set Up Supabase

1. Create account at [supabase.com](https://supabase.com)
2. Create a new project
3. Copy your project URL and anon key
4. Create the database table (see step 5)

### 3️⃣ Configure Environment

Create `.env.local` file in `web-app/` folder:

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4️⃣ Create Database Table

Go to Supabase SQL Editor and run:

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

-- Create indexes
CREATE INDEX idx_stock_items_user_id ON public.stock_items(user_id);
CREATE INDEX idx_stock_items_category ON public.stock_items(category);
CREATE INDEX idx_stock_items_location ON public.stock_items(location);

-- Enable RLS
ALTER TABLE public.stock_items ENABLE ROW LEVEL SECURITY;

-- Create policies
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

-- Auto-update timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_stock_items_updated_at 
    BEFORE UPDATE ON public.stock_items 
    FOR EACH ROW 
    EXECUTE PROCEDURE update_updated_at_column();
```

### 5️⃣ Run Development Server

```bash
npm run dev
```

Visit: [http://localhost:3000](http://localhost:3000)

---

## 🌐 Production Deployment (Hostinger)

### Option 1: Static Export (Recommended)

```bash
# Build for production
npm run build

# Upload 'out/' folder contents to Hostinger public_html/
# Also upload the .htaccess file from public/ folder
```

### Option 2: Node.js Server

```bash
# On server via SSH
npm install --production
npm run build
npm start

# Or use PM2
pm2 start npm --name "billease" -- start
```

---

## 📋 Configuration Checklist

- [ ] Supabase project created
- [ ] Database table created with RLS policies
- [ ] Environment variables configured
- [ ] Dependencies installed (`npm install`)
- [ ] Development server running (`npm run dev`)
- [ ] User can register/login
- [ ] Stock data loads correctly

---

## 🎯 Next Steps

1. **Configure Authentication URLs** in Supabase:
   - Site URL: `https://yourdomain.com`
   - Redirect URLs: `https://yourdomain.com/auth/callback`

2. **Enable SSL on Hostinger**:
   - Go to SSL section in hPanel
   - Install free SSL certificate
   - Force HTTPS redirect

3. **Add Sample Data** (optional):
   - Go to Supabase Table Editor
   - Manually add stock items
   - Or use SQL insert statements

---

## 🆘 Common Issues

**"Failed to load stock data"**
- Check your `.env.local` file has correct Supabase credentials
- Verify table exists in Supabase dashboard
- Check browser console for errors

**Build errors**
- Run: `rm -rf .next node_modules && npm install && npm run build`
- Check Node.js version: `node -v` (should be 18+)

**Authentication not working**
- Verify redirect URLs in Supabase match your domain
- Check that cookies are enabled in browser
- Ensure HTTPS is enabled in production

---

## 📚 Documentation

- **Full Deployment Guide**: See `DEPLOYMENT.md`
- **Database Schema**: See `DATABASE_SCHEMA.md`
- **Design System**: See `DESIGN_SYSTEM.md`

---

## 🎉 You're All Set!

Your BillEase Suite is now running with:
- ✅ Supabase authentication
- ✅ Real-time database
- ✅ Secure data access
- ✅ Mobile responsive UI
- ✅ Production ready

Need help? Check the documentation files or Supabase support!
