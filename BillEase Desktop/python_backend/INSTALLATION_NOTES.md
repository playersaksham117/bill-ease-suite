# Installation Notes

## Issue: pandas Installation Failure

If you encounter errors installing `pandas` (requires C compiler), use the minimal requirements:

```bash
pip install -r requirements-minimal.txt
```

This installs all core dependencies without pandas and other optional packages that require compilation.

## Installing Optional Packages

### Option 1: Install Visual Studio Build Tools (Recommended)

1. Download Visual Studio Build Tools from: https://visualstudio.microsoft.com/downloads/
2. Install "Desktop development with C++" workload
3. Then install full requirements:
   ```bash
   pip install -r requirements.txt
   ```

### Option 2: Use Pre-built Wheels

Try installing pandas separately with a newer version that has pre-built wheels:

```bash
pip install pandas>=2.2.0
```

### Option 3: Skip Optional Packages

The backend works fine without pandas for basic functionality. Only Excel/CSV export features require pandas.

## Current Status

✅ **Core dependencies installed** - Server can run  
⚠️ **Optional packages** - Install separately if needed:
- `pandas` - For Excel/CSV operations
- `openpyxl` - For Excel file support
- `reportlab` - For PDF generation
- `Pillow` - For image processing
- `qrcode`, `barcode` - For QR/barcode generation
- `pymysql` - For MySQL support
- `asyncpg` - For PostgreSQL support

## Starting the Server

```bash
python start_server.py
```

The server will run at: `http://127.0.0.1:8000`

