#!/usr/bin/env python3
"""
Startup script for BillEase Suite Python Backend
"""
import uvicorn
from config import settings

if __name__ == "__main__":
    print(f"Starting {settings.app_name} v{settings.app_version}")
    print(f"Database: {settings.database_type}")
    print(f"Server: http://{settings.host}:{settings.port}")
    print(f"API Docs: http://{settings.host}:{settings.port}/docs")
    print("\nPress CTRL+C to stop the server\n")
    
    uvicorn.run(
        "main:app",
        host=settings.host,
        port=settings.port,
        reload=settings.debug,
        log_level="info"
    )

