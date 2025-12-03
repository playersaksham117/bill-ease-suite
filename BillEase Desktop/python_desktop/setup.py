"""
Setup script for BillEase Suite Desktop
"""
import subprocess
import sys
import os

def install_requirements():
    """Install required packages"""
    print("Installing required packages...")
    try:
        subprocess.check_call([sys.executable, "-m", "pip", "install", "-r", "requirements.txt"])
        print("✓ Packages installed successfully!")
        return True
    except subprocess.CalledProcessError:
        print("✗ Failed to install packages")
        return False

def init_database():
    """Initialize database"""
    print("Initializing database...")
    try:
        from database import init_database
        init_database()
        print("✓ Database initialized successfully!")
        return True
    except Exception as e:
        print(f"✗ Failed to initialize database: {e}")
        return False

def main():
    """Main setup function"""
    print("=" * 50)
    print("BillEase Suite Desktop - Setup")
    print("=" * 50)
    print()
    
    # Check Python version
    if sys.version_info < (3, 9):
        print("✗ Python 3.9 or higher is required")
        print(f"  Current version: {sys.version}")
        return False
    
    print(f"✓ Python {sys.version.split()[0]} detected")
    print()
    
    # Install requirements
    if not install_requirements():
        return False
    
    print()
    
    # Initialize database
    if not init_database():
        return False
    
    print()
    print("=" * 50)
    print("Setup completed successfully!")
    print("=" * 50)
    print()
    print("To run the application:")
    print("  python main.py")
    print()
    print("Default login credentials:")
    print("  Username: admin")
    print("  Password: admin123")
    print()
    
    return True

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)

