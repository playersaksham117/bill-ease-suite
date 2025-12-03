"""
Login Screen for BillEase Suite Desktop - PySide6
Modern UI/UX Design
"""
from PySide6.QtWidgets import (
    QWidget, QVBoxLayout, QHBoxLayout, QLabel, QLineEdit, 
    QPushButton, QFrame, QMessageBox
)
from PySide6.QtCore import Qt, Signal, QPropertyAnimation, QEasingCurve, QRect
from PySide6.QtGui import QFont, QIcon, QPainter, QLinearGradient, QBrush, QColor


class LoginScreen(QWidget):
    login_success = Signal(dict)  # Signal emitted on successful login
    
    def __init__(self, db, auth_manager, on_login_success):
        super().__init__()
        self.db = db
        self.auth_manager = auth_manager
        self.on_login_success = on_login_success
        
        # Connect signal
        self.login_success.connect(on_login_success)
        
        self.init_ui()
    
    def paintEvent(self, event):
        """Paint gradient background"""
        painter = QPainter(self)
        gradient = QLinearGradient(0, 0, 0, self.height())
        gradient.setColorAt(0, QColor(25, 118, 210))  # Blue
        gradient.setColorAt(1, QColor(13, 71, 161))   # Darker blue
        painter.fillRect(self.rect(), QBrush(gradient))
    
    def init_ui(self):
        """Initialize UI"""
        layout = QVBoxLayout()
        layout.setAlignment(Qt.AlignmentFlag.AlignCenter)
        layout.setContentsMargins(40, 40, 40, 40)
        layout.setSpacing(30)
        
        # Logo/Brand section
        brand_layout = QVBoxLayout()
        brand_layout.setAlignment(Qt.AlignmentFlag.AlignCenter)
        brand_layout.setSpacing(10)
        
        logo_label = QLabel("💼")
        logo_label.setAlignment(Qt.AlignmentFlag.AlignCenter)
        logo_font = QFont()
        logo_font.setPointSize(64)
        logo_label.setFont(logo_font)
        brand_layout.addWidget(logo_label)
        
        title = QLabel("BillEase Suite")
        title.setAlignment(Qt.AlignmentFlag.AlignCenter)
        title_font = QFont()
        title_font.setPointSize(36)
        title_font.setBold(True)
        title.setFont(title_font)
        title.setStyleSheet("color: white; margin-bottom: 5px;")
        brand_layout.addWidget(title)
        
        subtitle = QLabel("Modern Business Management Solution")
        subtitle.setAlignment(Qt.AlignmentFlag.AlignCenter)
        subtitle.setStyleSheet("color: rgba(255, 255, 255, 0.9); font-size: 16px; font-weight: 300;")
        brand_layout.addWidget(subtitle)
        
        layout.addLayout(brand_layout)
        layout.addSpacing(40)
        
        # Main container frame with modern design
        container = QFrame()
        container.setFixedWidth(450)
        container.setStyleSheet("""
            QFrame {
                background-color: white;
                border-radius: 20px;
                padding: 40px;
            }
        """)
        
        # Add shadow effect (simulated with border)
        container.setStyleSheet("""
            QFrame {
                background-color: white;
                border-radius: 20px;
                padding: 40px;
                border: none;
            }
        """)
        
        container_layout = QVBoxLayout()
        container_layout.setSpacing(25)
        
        # Form title
        form_title = QLabel("Welcome Back")
        form_title.setAlignment(Qt.AlignmentFlag.AlignCenter)
        form_title_font = QFont()
        form_title_font.setPointSize(24)
        form_title_font.setBold(True)
        form_title.setFont(form_title_font)
        form_title.setStyleSheet("color: #1976D2; margin-bottom: 5px;")
        container_layout.addWidget(form_title)
        
        form_subtitle = QLabel("Sign in to your account")
        form_subtitle.setAlignment(Qt.AlignmentFlag.AlignCenter)
        form_subtitle.setStyleSheet("color: #757575; font-size: 14px; margin-bottom: 20px;")
        container_layout.addWidget(form_subtitle)
        
        # Username field
        username_label = QLabel("Username")
        username_label.setStyleSheet("""
            font-weight: 600;
            font-size: 13px;
            color: #424242;
            margin-bottom: 5px;
        """)
        self.username_input = QLineEdit()
        self.username_input.setPlaceholderText("Enter your username")
        self.username_input.setMinimumHeight(50)
        self.username_input.setStyleSheet("""
            QLineEdit {
                padding: 12px 16px;
                border: 2px solid #E0E0E0;
                border-radius: 10px;
                font-size: 15px;
                background-color: #FAFAFA;
                color: #212121;
            }
            QLineEdit:focus {
                border: 2px solid #1976D2;
                background-color: white;
            }
            QLineEdit:hover {
                border: 2px solid #BDBDBD;
            }
        """)
        
        # Password field
        password_label = QLabel("Password")
        password_label.setStyleSheet("""
            font-weight: 600;
            font-size: 13px;
            color: #424242;
            margin-top: 10px;
            margin-bottom: 5px;
        """)
        self.password_input = QLineEdit()
        self.password_input.setPlaceholderText("Enter your password")
        self.password_input.setEchoMode(QLineEdit.EchoMode.Password)
        self.password_input.setMinimumHeight(50)
        self.password_input.setStyleSheet("""
            QLineEdit {
                padding: 12px 16px;
                border: 2px solid #E0E0E0;
                border-radius: 10px;
                font-size: 15px;
                background-color: #FAFAFA;
                color: #212121;
            }
            QLineEdit:focus {
                border: 2px solid #1976D2;
                background-color: white;
            }
            QLineEdit:hover {
                border: 2px solid #BDBDBD;
            }
        """)
        
        # Login button with modern design
        login_btn = QPushButton("Sign In")
        login_btn.setMinimumHeight(50)
        login_btn.setCursor(Qt.CursorShape.PointingHandCursor)
        login_btn.setStyleSheet("""
            QPushButton {
                background: qlineargradient(x1:0, y1:0, x2:1, y2:0,
                    stop:0 #1976D2, stop:1 #1565C0);
                color: white;
                border: none;
                border-radius: 10px;
                font-size: 16px;
                font-weight: 600;
                padding: 12px;
            }
            QPushButton:hover {
                background: qlineargradient(x1:0, y1:0, x2:1, y2:0,
                    stop:0 #1565C0, stop:1 #0D47A1);
            }
            QPushButton:pressed {
                background: qlineargradient(x1:0, y1:0, x2:1, y2:0,
                    stop:0 #0D47A1, stop:1 #0277BD);
            }
        """)
        login_btn.clicked.connect(self.handle_login)
        
        # Enter key support
        self.password_input.returnPressed.connect(self.handle_login)
        self.username_input.returnPressed.connect(lambda: self.password_input.setFocus())
        
        # Add widgets to layout
        container_layout.addWidget(form_title)
        container_layout.addWidget(form_subtitle)
        container_layout.addSpacing(10)
        container_layout.addWidget(username_label)
        container_layout.addWidget(self.username_input)
        container_layout.addWidget(password_label)
        container_layout.addWidget(self.password_input)
        container_layout.addSpacing(10)
        container_layout.addWidget(login_btn)
        
        container.setLayout(container_layout)
        
        # Add container to main layout
        layout.addWidget(container)
        self.setLayout(layout)
        
        # Focus on username field
        self.username_input.setFocus()
    
    def handle_login(self):
        """Handle login button click"""
        username = self.username_input.text().strip()
        password = self.password_input.text()
        
        if not username or not password:
            QMessageBox.warning(self, "Login Failed", "Please enter both username and password")
            return
        
        # Authenticate user
        user = self.auth_manager.login(username, password)
        
        if user:
            self.login_success.emit(user)
        else:
            QMessageBox.warning(self, "Login Failed", "Invalid username or password")
            self.password_input.clear()
            self.password_input.setFocus()
