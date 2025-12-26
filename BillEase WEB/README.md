# BillEase Suite - Web Application

Web-based business management solution built with React and Node.js.

## Features

- 🛒 POS Module - Point of Sale system
- 👥 CRM Module - Customer Relationship Management
- 💰 Income & Expense Manager
- 📦 Invento - Inventory Management
- 📄 Accounts Plus - Comprehensive accounting system

## Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
cd server
npm install
cd ..
```

2. Start the application:
```bash
# Start both frontend and backend
npm run dev:all

# Or separately:
# Terminal 1 - Backend
npm run server:dev

# Terminal 2 - Frontend
npm run dev
```

3. Open browser: `http://localhost:5173`

### Default Login
- Username: `admin`
- Password: `admin123`

## Project Structure

```
BillEase WEB/
├── src/              # React frontend
│   ├── components/  # Shared components
│   ├── modules/     # Feature modules
│   └── utils/       # Utilities
├── server/           # Node.js backend
│   ├── routes/      # API routes
│   └── database.js # Database setup
├── public/          # Static files
└── package.json     # Dependencies
```

## Build for Production

```bash
npm run build
```

Built files will be in the `dist` directory.

## Database

Uses SQLite database automatically created at `server/billease.db` on first run.

## Documentation

- See main [README.md](../README.md) for complete documentation
- See [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md) for design guidelines

