"""
Authentication utilities for BillEase Suite Desktop
"""
import bcrypt
from typing import Optional, Dict
import sys
from pathlib import Path

# Import database - handle both absolute and relative imports
try:
    from database import Database
except ImportError:
    # Fallback for when running as module
    current_dir = Path(__file__).parent.parent
    if str(current_dir) not in sys.path:
        sys.path.insert(0, str(current_dir))
    from database import Database

class AuthManager:
    def __init__(self, db: Database):
        self.db = db
    
    def verify_password(self, password: str, password_hash: str) -> bool:
        """Verify password against hash"""
        try:
            return bcrypt.checkpw(password.encode('utf-8'), password_hash.encode('utf-8'))
        except:
            return False
    
    def login(self, username: str, password: str) -> Optional[Dict]:
        """Authenticate user"""
        user = self.db.fetchone("SELECT * FROM users WHERE username = ? AND is_active = 1", (username,))
        
        if not user:
            return None
        
        if not self.verify_password(password, user['password_hash']):
            return None
        
        # Remove password hash from returned user and include company_id
        user_dict = dict(user)
        del user_dict['password_hash']
        # Keep company_id for company check
        return user_dict
    
    def get_user(self, user_id: int) -> Optional[Dict]:
        """Get user by ID"""
        user = self.db.fetchone("SELECT * FROM users WHERE id = ?", (user_id,))
        if user:
            user_dict = dict(user)
            del user_dict['password_hash']
            return user_dict
        return None

