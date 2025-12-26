"""
BillEase Suite - Python Desktop Application
Modern desktop application built with Python, SQLite, and PySide6
Supports Windows and macOS
"""
import sys
from pathlib import Path
from PySide6.QtWidgets import QApplication, QMainWindow, QStackedWidget, QMessageBox  # type: ignore[import-untyped]
from PySide6.QtCore import Qt  # type: ignore[import-untyped]
from PySide6.QtGui import QPalette, QColor  # type: ignore[import-untyped]

# Ensure we can import from current directory
current_dir = Path(__file__).parent.absolute()
if str(current_dir) not in sys.path:
    sys.path.insert(0, str(current_dir))

# Import database and models
from database import Database, init_database
from screens.login import LoginScreen
from screens.company_setup_screen import CompanySetupScreen
from screens.dashboard import DashboardScreen
from utils.auth import AuthManager


class BillEaseApp(QMainWindow):
    def __init__(self):
        super().__init__()
        self.db = Database()
        self.auth_manager = AuthManager(self.db)
        self.current_user = None
        self.current_company = None
        
        # Set window properties
        self.setWindowTitle("BillEase Suite - Modern Business Management")
        self.setMinimumSize(1200, 700)
        self.resize(1400, 900)
        
        # Apply modern styling
        self.setStyleSheet("""
            QMainWindow {
                background-color: #FAFAFA;
            }
        """)
        
        # Create stacked widget for screen management
        self.stacked_widget = QStackedWidget()
        self.stacked_widget.setStyleSheet("background: transparent;")
        self.setCentralWidget(self.stacked_widget)
        
        # Initialize screens
        self.login_screen = None
        self.company_setup_screen = None
        self.dashboard_screen = None
        
        # Check authentication
        self.check_auth()
    
    def check_auth(self):
        """Check if user is authenticated"""
        self.show_login()
    
    def show_login(self):
        """Show login screen"""
        if self.login_screen is None:
            self.login_screen = LoginScreen(self.db, self.auth_manager, self.on_login_success)
            self.stacked_widget.addWidget(self.login_screen)
        
        self.stacked_widget.setCurrentWidget(self.login_screen)
    
    def on_login_success(self, user):
        """Callback when login is successful"""
        self.current_user = user
        # Check if user has a company_id set
        if user.get('company_id'):
            company = self.db.fetchone("SELECT * FROM companies WHERE id = ?", (user['company_id'],))
            if company:
                self.current_company = company
                self.show_dashboard()
                return
        self.check_company_setup()
    
    def check_company_setup(self):
        """Check if company is selected, if not show company setup"""
        if not self.current_company:
            self.show_company_setup()
        else:
            self.show_dashboard()
    
    def show_company_setup(self):
        """Show company setup screen"""
        if self.company_setup_screen is None:
            self.company_setup_screen = CompanySetupScreen(
                self.db, 
                self.current_user, 
                self.on_company_selected
            )
            self.stacked_widget.addWidget(self.company_setup_screen)
        
        self.stacked_widget.setCurrentWidget(self.company_setup_screen)
    
    def on_company_selected(self, company):
        """Callback when company is selected"""
        self.current_company = company
        # Update user's company_id
        try:
            self.db.execute(
                "UPDATE users SET company_id = ? WHERE id = ?", 
                (company['id'], self.current_user['id'])
            )
            self.db.commit()
        except Exception as ex:
            QMessageBox.warning(self, "Error", f"Failed to update user company: {str(ex)}")
        
        self.show_dashboard()
    
    def show_dashboard(self):
        """Show dashboard screen"""
        try:
            if self.dashboard_screen is None:
                self.dashboard_screen = DashboardScreen(
                    self.db,
                    self.current_user,
                    self.current_company,
                    self.on_logout,
                    self.on_company_change
                )
                self.stacked_widget.addWidget(self.dashboard_screen)
            
            # Refresh dashboard data
            self.dashboard_screen.refresh_data()
            self.stacked_widget.setCurrentWidget(self.dashboard_screen)
        except Exception as e:
            QMessageBox.critical(
                self,
                "Error",
                f"Failed to load dashboard: {str(e)}"
            )
    
    def on_logout(self):
        """Handle logout"""
        self.current_user = None
        self.current_company = None
        self.show_login()
    
    def on_company_change(self):
        """Handle company change request"""
        self.current_company = None
        self.show_company_setup()
    
    def closeEvent(self, event):
        """Handle window close event"""
        if self.db:
            self.db.close()
        event.accept()


def main():
    """Main entry point"""
    # Initialize database
    init_database()
    
    # Create application
    app = QApplication(sys.argv)
    
    # Set application style
    app.setStyle('Fusion')
    
    # Apply modern color palette
    palette = QPalette()
    palette.setColor(QPalette.ColorRole.Window, QColor(250, 250, 250))
    palette.setColor(QPalette.ColorRole.WindowText, QColor(33, 33, 33))
    palette.setColor(QPalette.ColorRole.Base, QColor(255, 255, 255))
    palette.setColor(QPalette.ColorRole.AlternateBase, QColor(245, 245, 245))
    palette.setColor(QPalette.ColorRole.ToolTipBase, QColor(255, 255, 255))
    palette.setColor(QPalette.ColorRole.ToolTipText, QColor(33, 33, 33))
    palette.setColor(QPalette.ColorRole.Text, QColor(33, 33, 33))
    palette.setColor(QPalette.ColorRole.Button, QColor(255, 255, 255))
    palette.setColor(QPalette.ColorRole.ButtonText, QColor(33, 33, 33))
    palette.setColor(QPalette.ColorRole.BrightText, QColor(255, 255, 255))
    palette.setColor(QPalette.ColorRole.Link, QColor(25, 118, 210))
    palette.setColor(QPalette.ColorRole.Highlight, QColor(25, 118, 210))
    palette.setColor(QPalette.ColorRole.HighlightedText, QColor(255, 255, 255))
    app.setPalette(palette)
    
    # Create and show main window
    window = BillEaseApp()
    window.show()
    
    # Run application
    sys.exit(app.exec())


if __name__ == "__main__":
    main()
