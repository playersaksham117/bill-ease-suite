# BillEase Suite Python Backend

Backend API server for BillEase Suite desktop application. This backend provides REST API endpoints for all business management modules.

## Features

- FastAPI-based REST API
- Support for SQLite, MySQL, and PostgreSQL databases
- JWT authentication
- Comprehensive database models
- Async database operations
- API documentation (Swagger/ReDoc)

## Database Support

### SQLite (Default)
- No additional setup required
- Database file: `billease.db`

### MySQL
1. Install MySQL server
2. Create database: `CREATE DATABASE billease;`
3. Update configuration (see below)

### PostgreSQL
1. Install PostgreSQL server
2. Create database: `CREATE DATABASE billease;`
3. Update configuration (see below)

## Installation

1. Install Python 3.9 or higher

2. Install dependencies:
```bash
pip install -r requirements.txt
```

## Configuration

Create a `.env` file in the `python_backend` directory:

```env
# Database Type: sqlite, mysql, or postgresql
DATABASE_TYPE=sqlite

# SQLite Configuration
SQLITE_DB_PATH=billease.db

# MySQL Configuration
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=your_password
MYSQL_DATABASE=billease

# PostgreSQL Configuration
POSTGRESQL_HOST=localhost
POSTGRESQL_PORT=5432
POSTGRESQL_USER=postgres
POSTGRESQL_PASSWORD=your_password
POSTGRESQL_DATABASE=billease

# Server Configuration
HOST=127.0.0.1
PORT=8000
DEBUG=false

# Security
SECRET_KEY=your-secret-key-change-in-production
```

## Running the Server

### Development Mode
```bash
python -m uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

### Production Mode
```bash
python -m uvicorn main:app --host 0.0.0.0 --port 8000
```

Or use the main file:
```bash
python main.py
```

## API Documentation

Once the server is running:
- **Swagger UI**: http://127.0.0.1:8000/docs
- **ReDoc**: http://127.0.0.1:8000/redoc
- **Health Check**: http://127.0.0.1:8000/api/health

## Default Credentials

- **Username**: `admin`
- **Password**: `admin123`

⚠️ **Change default password in production!**

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Companies
- `GET /api/companies` - List companies
- `POST /api/companies` - Create company
- `GET /api/companies/{id}` - Get company
- `PUT /api/companies/{id}` - Update company
- `DELETE /api/companies/{id}` - Delete company

### Sales
- `GET /api/sales` - List sales invoices
- `POST /api/sales` - Create sales invoice

### Reports
- `GET /api/reports/profit-loss` - Profit & Loss
- `GET /api/reports/balance-sheet` - Balance Sheet

### And more...
See Swagger documentation for complete API reference.

## Project Structure

```
python_backend/
├── main.py              # FastAPI application entry point
├── config.py            # Configuration settings
├── database.py          # Database models
├── routes/              # API route handlers
│   ├── auth.py
│   ├── companies.py
│   ├── sales.py
│   └── ...
├── requirements.txt     # Python dependencies
└── README.md
```

## Connecting Flutter Desktop

The Flutter Desktop application connects to this backend via HTTP API. Update the API base URL in Flutter app:

```dart
const String apiBaseUrl = 'http://127.0.0.1:8000/api';
```

## Development

### Adding New Routes

1. Create route file in `routes/` directory
2. Import and include in `main.py`:
```python
from .routes import new_route
app.include_router(new_route.router, prefix="/api/new", tags=["New"])
```

### Database Migrations

Database tables are auto-created on startup. For production, use Alembic for migrations:

```bash
pip install alembic
alembic init alembic
# Configure alembic.ini and create migrations
```

## Troubleshooting

### Database Connection Issues

**MySQL**:
- Ensure MySQL server is running
- Check user permissions
- Verify database exists

**PostgreSQL**:
- Ensure PostgreSQL server is running
- Check pg_hba.conf for authentication
- Verify database exists

**SQLite**:
- Check file permissions
- Ensure directory is writable

### Port Already in Use

Change port in `.env` or command:
```bash
python -m uvicorn main:app --port 8001
```

## License

MIT License

