# Installation Guide - BillEase Suite Desktop

## Quick Installation

### Windows

1. **Install Python 3.9+**
   - Download from [python.org](https://www.python.org/downloads/)
   - Make sure to check "Add Python to PATH" during installation

2. **Open Command Prompt** in the `python_desktop` directory

3. **Run setup:**
   ```cmd
   python setup.py
   ```

4. **Start the application:**
   ```cmd
   python main.py
   ```
   Or double-click `run.bat`

### macOS

1. **Install Python 3.9+**
   - Python may already be installed. Check with: `python3 --version`
   - If not, install via Homebrew: `brew install python3`

2. **Open Terminal** in the `python_desktop` directory

3. **Run setup:**
   ```bash
   python3 setup.py
   ```

4. **Start the application:**
   ```bash
   python3 main.py
   ```
   Or run: `chmod +x run.sh && ./run.sh`

## Manual Installation

If the setup script doesn't work, install manually:

1. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

2. **Initialize database:**
   ```python
   python -c "from database import init_database; init_database()"
   ```

3. **Run the application:**
   ```bash
   python main.py
   ```

## Troubleshooting

### Python not found
- **Windows**: Add Python to PATH or use full path: `C:\Python39\python.exe`
- **macOS**: Use `python3` instead of `python`

### Module not found errors
- Ensure you're in the `python_desktop` directory
- Install requirements: `pip install -r requirements.txt`

### Database errors
- Delete `billease_desktop.db` to reset database
- Check file permissions

### Window doesn't appear
- Check console for error messages
- Ensure PySide6 is installed: `pip install PySide6`
- Verify PySide6 installation: `pip show PySide6`

## Building Executable

### Windows (using PyInstaller)

```bash
pip install pyinstaller
pyinstaller --onefile --windowed --name "BillEaseSuite" --icon=icon.ico main.py
```

### macOS (using PyInstaller)

```bash
pip install pyinstaller
pyinstaller --onefile --windowed --name "BillEaseSuite" main.py
```

The executable will be in the `dist/` folder.

## Requirements

- Python 3.9 or higher
- 100 MB disk space
- Windows 10+ or macOS 10.14+

## Default Login

- **Username**: `admin`
- **Password**: `admin123`

⚠️ **Important**: Change the default password after first login!

