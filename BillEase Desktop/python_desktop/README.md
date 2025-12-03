# BillEase Suite - Python Desktop Application

Modern desktop application built with Python, SQLite, and PySide6. Designed for Windows and macOS with a beautiful, modern UI/UX.

## Features

- **Modern UI/UX**: Built with PySide6 for a native, professional look and feel
- **SQLite Database**: Local SQLite database for data storage
- **Cross-Platform**: Works on Windows and macOS
- **Modular Design**: Separate modules for POS, CRM, Income/Expense, Inventory, and Accounts
- **User Authentication**: Secure login system with bcrypt password hashing

## Prerequisites

- Python 3.9 or higher
- pip (Python package manager)

## Installation

1. **Install Python dependencies:**
   ```bash
   cd python_desktop
   pip install -r requirements.txt
   ```

2. **Run the application:**
   ```bash
   python main.py
   ```

## Default Login Credentials

- **Username**: `admin`
- **Password**: `admin123`

⚠️ **Change default password in production!**

## Project Structure

```
python_desktop/
├── main.py                 # Application entry point
├── database.py             # SQLite database models and operations
├── requirements.txt        # Python dependencies
├── utils/
│   └── auth.py            # Authentication utilities
└── screens/
    ├── login.py           # Login screen
    ├── dashboard.py       # Main dashboard
    ├── pos_screen.py      # POS module
    ├── crm_screen.py      # CRM module
    ├── income_expense_screen.py  # Income & Expense module
    ├── inventory_screen.py # Inventory module
    └── accounts_screen.py  # Accounts+ module
```

## Database

The application uses SQLite database (`billease_desktop.db`) which is automatically created on first run. The database includes tables for:

- Users
- Companies
- Ledgers
- Parties
- Items Master
- Sales Invoices
- Income & Expense
- Inventory Transactions
- CRM Contacts

## Building for Distribution

### Windows

1. Install PyInstaller:
   ```bash
   pip install pyinstaller
   ```

2. Build executable:
   ```bash
   pyinstaller --onefile --windowed --name "BillEaseSuite" main.py
   ```

### macOS

1. Install PyInstaller:
   ```bash
   pip install pyinstaller
   ```

2. Build application:
   ```bash
   pyinstaller --onefile --windowed --name "BillEaseSuite" main.py
   ```

## Development

### Adding New Modules

1. Create a new screen file in `screens/` directory
2. Import and add to `dashboard.py`
3. Add navigation item in sidebar

### Database Operations

Use the `Database` class in `database.py` for all database operations:

```python
from database import Database

db = Database()
users = db.fetchall("SELECT * FROM users")
db.close()
```

## UI/UX Design

The application uses PySide6 which provides:
- Modern native UI components
- Responsive layouts
- Smooth animations
- Cross-platform native look and feel
- Professional Fusion style for consistent appearance

For custom UI designs, refer to Figma designs and implement using PySide6 components.

## Troubleshooting

### Database Issues
- Delete `billease_desktop.db` to reset database
- Check file permissions in application directory

### Import Errors
- Ensure all dependencies are installed: `pip install -r requirements.txt`
- Check Python version: `python --version` (should be 3.9+)

### Window Not Appearing
- Check console for error messages
- Ensure PySide6 is properly installed: `pip install PySide6`

## License

Copyright © BillEase Suite. All rights reserved.

