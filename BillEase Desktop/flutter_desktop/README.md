# BillEase Suite - Flutter Desktop Application

Modern desktop application built with Flutter for UI/UX, Python FastAPI backend, and SQLite database.

## Architecture

- **Flutter Desktop** - Cross-platform UI/UX (Windows, macOS, Linux)
- **Python Backend** - FastAPI REST API server (`python_backend/`)
- **SQLite Database** - Local database managed by Python backend

## Prerequisites

- Flutter SDK (3.0.0 or higher)
- Dart SDK
- Python 3.9+ (for backend)
- Python backend server running

## Setup

### 1. Install Flutter Dependencies

```bash
cd flutter_desktop
flutter pub get
```

### 2. Start Python Backend

```bash
cd ../python_backend
pip install -r requirements.txt
python main.py
```

The backend will run on `http://127.0.0.1:8000`

### 3. Run Flutter Desktop App

```bash
cd flutter_desktop

# Windows
flutter run -d windows

# macOS
flutter run -d macos

# Linux
flutter run -d linux
```

## Default Login Credentials

- **Username**: `admin`
- **Password**: `admin123`

⚠️ **Change default password in production!**

## Project Structure

```
flutter_desktop/
├── lib/
│   ├── config/           # Configuration files
│   │   └── api_config.dart
│   ├── models/           # Data models
│   │   └── auth_model.dart
│   ├── providers/        # State management
│   │   └── auth_provider.dart
│   ├── screens/          # UI screens
│   │   ├── splash_screen.dart
│   │   ├── login_screen.dart
│   │   └── dashboard_screen.dart
│   ├── services/         # API & Database services
│   │   ├── api_service.dart
│   │   └── database_service.dart
│   ├── utils/            # Utilities
│   │   └── storage_helper.dart
│   └── main.dart         # App entry point
├── pubspec.yaml          # Dependencies
└── README.md
```

## Features

- ✅ **Modern UI/UX**: Material Design 3 with Flutter
- ✅ **Cross-Platform**: Windows, macOS, Linux support
- ✅ **API Integration**: Communicates with Python FastAPI backend
- ✅ **Local Caching**: SQLite for offline data caching
- ✅ **State Management**: Provider pattern
- ✅ **Authentication**: JWT token-based auth

## API Communication

The Flutter app communicates with Python backend via REST API:

- Base URL: `http://127.0.0.1:8000`
- Authentication: Bearer token (JWT)
- Endpoints: `/api/auth`, `/api/companies`, `/api/sales`, etc.

## Building for Distribution

### Windows

```bash
flutter build windows --release
```

Output: `build/windows/runner/Release/`

### macOS

```bash
flutter build macos --release
```

Output: `build/macos/Build/Products/Release/`

### Linux

```bash
flutter build linux --release
```

Output: `build/linux/x64/release/bundle/`

## Development

### Adding New Screens

1. Create screen file in `lib/screens/`
2. Add route in `main.dart`
3. Create provider if needed in `lib/providers/`
4. Add API methods in `lib/services/api_service.dart`

### Adding API Endpoints

1. Add endpoint to `lib/config/api_config.dart`
2. Add method to `lib/services/api_service.dart`
3. Create model in `lib/models/` if needed
4. Use in provider or screen

## Troubleshooting

### Backend Not Running

If you see "Backend Not Running" error:
1. Ensure Python backend is running: `cd python_backend && python main.py`
2. Check backend is on port 8000
3. Verify CORS settings in Python backend

### Build Issues

```bash
# Clean build
flutter clean
flutter pub get
flutter build windows --release
```

### Database Issues

The SQLite database is managed by Python backend. Flutter app uses local SQLite only for caching.

## License

Copyright © BillEase Suite. All rights reserved.
