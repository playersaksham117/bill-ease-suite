# BillEase Suite - Web Application

A modern, unified business platform built with Next.js 14, TypeScript, Tailwind CSS, and Supabase.

## 🎯 Features

- **Dashboard-style interface** with fixed sidebar navigation
- **Modular applications**: POS, CRM, Expense & Income, Inventory Tracking, Accounts+
- **Premium SaaS UI** inspired by Stripe and Linear
- **Fully responsive design** - Mobile & Desktop optimized
- **Dark mode support** with Tailwind CSS
- **Type-safe** with TypeScript
- **Real-time database** with Supabase
- **Authentication** built-in with Row Level Security
- **App Router** (Next.js 14)
- **Framer Motion** for smooth animations
- **Production-ready** for Hostinger deployment

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account (free tier available)

### Fast Installation

**Windows:**
```bash
cd web-app
scripts\install.bat
```

**Mac/Linux:**
```bash
cd web-app
chmod +x scripts/install.sh
./scripts/install.sh
```

### Manual Installation

```bash
# Install dependencies
npm install

# Configure environment variables
# Copy .env.local and add your Supabase credentials

# Start development server
npm run dev
```

Visit `http://localhost:3000` to see the app.

For detailed setup instructions, see **[QUICK_START.md](./QUICK_START.md)**

### Development Commands

```bash
npm run dev           # Start dev server
npm run build         # Build for production
npm start             # Start production server
npm run lint          # Run ESLint
npm run type-check    # TypeScript check
```

## 📁 Project Structure

```
web-app/
├── app/
│   ├── (auth)/                 # Auth routes group
│   │   └── login/
│   ├── workspace/              # Main workspace layout
│   │   ├── layout.tsx
│   │   ├── page.tsx            # Home/Dashboard
│   │   ├── dashboard/
│   │   ├── settings/
│   │   ├── support/
│   │   ├── pos/
│   │   ├── crm/
│   │   ├── exin/
│   │   ├── tracinvent/
│   │   └── accounts/
│   ├── layout.tsx              # Global layout
│   ├── globals.css
│   └── not-found.tsx
├── components/
│   ├── sidebar.tsx             # Main sidebar
│   ├── sidebar-nav.tsx         # Sidebar navigation
│   └── ui/                     # Reusable UI components
├── lib/
│   ├── cn.ts                   # Classname utility
│   └── navigation.ts           # Navigation config
├── public/                     # Static assets
├── types/                      # TypeScript types
├── hooks/                      # Custom hooks
├── .env.example                # Environment variables
├── tailwind.config.ts
├── tsconfig.json
├── next.config.js
└── package.json
```

## 🎨 Design System

### Colors
- **Primary**: Dark blue (`hsl(222.2, 47.6%, 11.2%)`)
- **Secondary**: Light gray (`hsl(210, 40%, 96%)`)
- **Accent**: Primary accent color
- **Muted**: Neutral tones for secondary text

### Layout
- **Sidebar**: Fixed 260px width
- **Main Content**: Fluid width with 6px padding (px-6 py-6)
- **Desktop-first**: Responsive but optimized for desktop

### Components Used
- **Lucide React** for icons
- **Framer Motion** for animations
- **Tailwind CSS** for styling
- **shadcn/ui** philosophy (unstyled, composable)

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file based on `.env.example`:

```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
DATABASE_URL=postgresql://...
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

### TypeScript Paths

Use path aliases for cleaner imports:
```typescript
import { cn } from "@/lib/cn"
import { Sidebar } from "@/components/sidebar"
import { Button } from "@/components/ui/button"
```

## 📱 Responsive Design

The layout uses a desktop-first approach:
- Base design optimized for desktop (1920px and up)
- Responsive grid system for cards (1 col mobile → 4 cols desktop)
- Sidebar remains fixed on desktop
- Touch-friendly button sizes (min 44px)

## 🚀 Deployment

### Vercel (Recommended)

```bash
npm run build
vercel deploy
```

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 📝 Notes

- The sidebar uses `position: fixed` for persistent navigation
- Main content has `ml-[260px]` margin to accommodate sidebar
- All routes are organized within the workspace layout group
- Login page uses a separate `(auth)` route group for clean auth flows
- Animations use Framer Motion for smooth transitions

## 🔄 Next Steps

1. **Set up authentication** - Add NextAuth.js or similar
2. **Database setup** - Configure PostgreSQL connection
3. **API routes** - Create server-side endpoints
4. **Module implementation** - Build out each application (POS, CRM, etc.)
5. **Testing** - Add Jest and React Testing Library
6. **CI/CD** - Set up GitHub Actions for automated testing/deployment

## 📚 Resources

- [Next.js 14 Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com)
- [Framer Motion](https://www.framer.com/motion)
- [TypeScript](https://www.typescriptlang.org)

---

Built with ⚡ for modern business platforms
