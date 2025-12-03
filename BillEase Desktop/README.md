# BillEase Suite - Desktop Application

Modern desktop application with **Flutter UI/UX**, **Python Backend**, and **SQLite Database**.

## Architecture

- **Flutter Desktop** - Cross-platform UI/UX (Windows, macOS, Linux)
- **Python Backend** - FastAPI REST API server (`python_backend/`)
- **SQLite Database** - Local database managed by Python backend

## Quick Start

### 1. Start Python Backend

```bash
cd python_backend
pip install -r requirements.txt
python main.py
```

Backend runs on `http://127.0.0.1:8000`

### 2. Run Flutter Desktop App

```bash
cd flutter_desktop
flutter pub get
flutter run -d windows  # or macos, linux
```

## Default Login Credentials

- **Username**: `admin`
- **Password**: `admin123`

⚠️ **Change default password in production!**

## Project Structure

```
BillEase Desktop/
├── flutter_desktop/      # Flutter UI/UX Application (MAIN)
│   ├── lib/
│   │   ├── config/      # API configuration
│   │   ├── models/      # Data models
│   │   ├── providers/   # State management
│   │   ├── screens/     # UI screens
│   │   ├── services/    # API & Database services
│   │   └── utils/       # Utilities
│   └── pubspec.yaml     # Dependencies
│
└── python_backend/      # Python FastAPI Backend
    ├── main.py          # FastAPI app
    ├── config.py        # Configuration
    ├── database.py      # Database models
    └── routes/          # API routes
```

## Features

- ✅ **Modern UI/UX**: Flutter Material Design 3
- ✅ **Cross-Platform**: Windows, macOS, Linux support
- ✅ **REST API**: Python FastAPI backend
- ✅ **SQLite Database**: Local database via Python backend
- ✅ **Authentication**: JWT token-based auth
- ✅ **Offline Caching**: Local SQLite caching in Flutter

## Documentation

- `flutter_desktop/README.md` - Flutter app setup guide
- `python_backend/README.md` - Python backend API guide

## Requirements

- Flutter SDK 3.0.0+
- Python 3.9+
- pip (Python package manager)

## Building for Distribution

### Flutter Desktop

```bash
cd flutter_desktop

# Windows
flutter build windows --release

# macOS
flutter build macos --release

# Linux
flutter build linux --release
```

### Python Backend

The backend runs as a service. Package it with PyInstaller if needed:

```bash
cd python_backend
pip install pyinstaller
pyinstaller --onefile main.py
```

## Development

### Adding New Features

1. **Backend**: Add API routes in `python_backend/routes/`
2. **Frontend**: Add screens in `flutter_desktop/lib/screens/`
3. **Models**: Create models in `flutter_desktop/lib/models/`
4. **Services**: Add API methods in `flutter_desktop/lib/services/api_service.dart`

## API Endpoints

The Python backend provides REST API endpoints:

- `/api/auth` - Authentication
- `/api/companies` - Company management
- `/api/sales` - Sales operations
- `/api/purchases` - Purchase operations
- `/api/inventory` - Inventory management
- `/api/crm` - CRM operations
- `/api/reports` - Reports
- And more...

See `python_backend/README.md` for complete API documentation.

## License

Copyright © BillEase Suite. All rights reserved.
