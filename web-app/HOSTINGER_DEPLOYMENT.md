# BillEase Suite - Hostinger Deployment Guide

## 🚀 Quick Start for Hostinger Hosting

This guide will help you deploy BillEase Suite to Hostinger with MySQL database and traditional authentication (no Supabase needed).

### ✅ What's Included in Hostinger Version

- ✅ MySQL database (works with any hosting provider)
- ✅ NextAuth.js authentication
- ✅ Local file storage
- ✅ Demo user (up to 10 users for testing)
- ✅ All features: POS, Inventory, ExpenseIncome, CRM
- ✅ Session management
- ✅ Production-ready build

---

## 📋 Prerequisites

1. **Hostinger Account** with:
   - Node.js support (18.x or higher)
   - MySQL database access
   - FTP/File Manager access

2. **Local Environment**:
   - Node.js 18+ installed
   - npm or yarn

---

## 🛠️ Setup Instructions

### Step 1: Database Setup

1. **Create MySQL Database in Hostinger cPanel**:
   - Go to cPanel → Databases → MySQL Databases
   - Create new database: `billease_suite` (or your preferred name)
   - Create database user with password
   - Add user to database with ALL PRIVILEGES

2. **Import Database Schema**:
   - Go to phpMyAdmin in cPanel
   - Select your database
   - Go to "Import" tab
   - Upload `database-hostinger.sql` file
   - Click "Go" to execute

3. **Verify Import**:
   - Check that tables are created (users, pos_products, etc.)
   - Default demo user should exist: `demo@billease.com` / `demo123`

### Step 2: Configure Environment Variables

1. **Copy `.env.hostinger` to `.env.production`**
2. **Update the following values**:

```env
# Database Configuration
DB_HOST=localhost              # Usually localhost on Hostinger
DB_USER=your_db_username       # From Step 1
DB_PASSWORD=your_db_password   # From Step 1
DB_NAME=billease_suite         # Your database name
DB_PORT=3306

# NextAuth Configuration
NEXTAUTH_URL=https://yourdomain.com
NEXTAUTH_SECRET=generate_random_32_char_secret

# JWT Secret
JWT_SECRET=another_random_secret

# App Configuration
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

3. **Generate Secrets** (run in terminal):
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Step 3: Build for Production

**On Windows:**
```bash
cd web-app
scripts\build-hostinger.bat
```

**On Linux/Mac:**
```bash
cd web-app
chmod +x scripts/build-hostinger.sh
./scripts/build-hostinger.sh
```

This creates a `dist` folder with all deployment files.

### Step 4: Upload to Hostinger

**Option A: File Manager (Recommended for beginners)**
1. Login to Hostinger hPanel
2. Go to Files → File Manager
3. Navigate to `public_html` directory
4. Delete default files (index.html, etc.)
5. Upload entire contents of `dist` folder to `public_html`
6. Upload `.env.production` file (rename to `.env.local` on server)

**Option B: FTP (Faster for large files)**
1. Use FileZilla or any FTP client
2. Connect to your Hostinger FTP
3. Navigate to `/public_html`
4. Upload `dist/*` contents
5. Upload `.env.production` as `.env.local`

### Step 5: Configure Node.js in Hostinger

1. **Go to hPanel → Advanced → Setup Node.js**
2. **Create new Node.js application**:
   - **Node.js version**: 18.x or higher
   - **Application mode**: Production
   - **Application root**: `/public_html`
   - **Application URL**: https://yourdomain.com
   - **Application startup file**: `node_modules/next/dist/bin/next`
   - **Arguments**: `start`
   - **Environment variables**: (add if not in .env.local)
     - `NODE_ENV=production`

3. **Click "Create" or "Update"**

4. **Install dependencies on server**:
   - In hPanel Node.js section, click "Open Terminal"
   - Run: `npm install --production`

### Step 6: Configure Domain

1. **Point domain to your hosting**:
   - In hPanel → Domains
   - Add your domain or subdomain
   - Wait for DNS propagation (up to 48 hours)

2. **SSL Certificate**:
   - hPanel → SSL → Order SSL Certificate (Free Let's Encrypt)
   - Or enable automatic SSL

### Step 7: Test Your Application

1. Visit: `https://yourdomain.com`
2. Login with demo credentials:
   - **Email**: `demo@billease.com`
   - **Password**: `demo123`

3. **Test database connection**: Visit `/api/test-db` to verify

---

## 🔐 Security Recommendations

### For Production Deployment:

1. **Change Demo Password**:
```sql
-- Generate new hash: bcrypt.hash('your-new-password', 10)
UPDATE users SET password_hash = 'new_bcrypt_hash' WHERE email = 'demo@billease.com';
```

2. **Disable Demo Mode**:
```env
DEMO_MODE=false
```

3. **Set Strong Secrets**:
   - Use 32+ character random strings
   - Never commit secrets to git

4. **Database Backup**:
   - Enable automatic backups in cPanel
   - Or setup cron job for daily backups

5. **File Permissions**:
```bash
chmod 644 .env.local
chmod 755 public_html
```

---

## 📦 What's Different from Supabase Version?

| Feature | Supabase Version | Hostinger Version |
|---------|------------------|-------------------|
| Database | PostgreSQL (cloud) | MySQL (your server) |
| Auth | Supabase Auth | NextAuth.js |
| Storage | Supabase Storage | Local file system |
| Real-time | ✅ Built-in | ❌ Not included |
| Cost | Free tier + paid | Hosting plan only |
| Setup | Easy | Moderate |
| Control | Limited | Full control |

---

## 🐛 Troubleshooting

### Database Connection Fails
```bash
# Check credentials in .env.local
# Verify database exists
# Check user has privileges
# Ensure DB_HOST is 'localhost' on Hostinger
```

### 500 Internal Server Error
```bash
# Check Node.js logs in hPanel
# Verify all environment variables are set
# Check file permissions
# Ensure npm install completed successfully
```

### Authentication Not Working
```bash
# Verify NEXTAUTH_SECRET is set
# Check NEXTAUTH_URL matches your domain
# Clear browser cookies and try again
```

### Can't Access Admin Panel
```bash
# Login with demo@billease.com / demo123
# Or create new admin user via phpMyAdmin
```

---

## 📊 Performance Optimization

1. **Enable Caching** (add to `.env.local`):
```env
CACHE_ENABLED=true
CACHE_TTL=3600
```

2. **Database Indexes**: Already included in schema

3. **Image Optimization**: Use Hostinger CDN if available

4. **Gzip Compression**: Enable in .htaccess:
```apache
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/css text/javascript application/javascript application/json
</IfModule>
```

---

## 🔄 Updates and Maintenance

### Updating Application:
1. Build new version locally
2. Upload to server (backup old files first)
3. Run `npm install` if dependencies changed
4. Restart Node.js app in hPanel

### Database Migrations:
1. Create SQL migration files
2. Run in phpMyAdmin or via SSH
3. Always backup before migrations

---

## 📞 Support

- **Database issues**: Check Hostinger knowledge base
- **Application bugs**: Check GitHub issues
- **Deployment help**: Hostinger support chat

---

## 🎉 You're Done!

Your BillEase Suite is now running on Hostinger with:
- ✅ MySQL database
- ✅ Secure authentication
- ✅ Up to 10 demo users
- ✅ Production-ready setup

**Default Login**: demo@billease.com / demo123

**Next Steps**:
1. Change demo password
2. Create your business account
3. Add products and start using POS
4. Invite team members (if demo mode disabled)

---

## 📝 File Structure on Server

```
public_html/
├── .next/                 # Built Next.js app
├── public/                # Static assets
├── node_modules/          # Dependencies
├── .env.local            # Environment config
├── package.json          # Package manifest
└── next.config.js        # Next.js config
```

---

## 🔒 Demo Mode Limits

When `DEMO_MODE=true`:
- Maximum 10 user registrations
- Suitable for testing/presentation
- Set to `false` for production use

---

**Happy Selling! 🎊**
