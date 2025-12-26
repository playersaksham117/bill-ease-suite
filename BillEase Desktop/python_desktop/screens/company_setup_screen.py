"""
Company Setup Screen - PySide6
Modern UI/UX Design
"""
from PySide6.QtWidgets import (
    QWidget, QVBoxLayout, QHBoxLayout, QLabel, QLineEdit, 
    QPushButton, QFrame, QMessageBox, QDialog, QScrollArea,
    QFormLayout, QTextEdit
)
from PySide6.QtCore import Qt, Signal, QSize, QPropertyAnimation, QEasingCurve
from PySide6.QtGui import QFont, QIcon, QPainter, QLinearGradient, QBrush, QColor


class CompanySetupScreen(QWidget):
    company_selected = Signal(dict)  # Signal emitted when company is selected
    
    def __init__(self, db, user, on_company_selected):
        super().__init__()
        self.db = db
        self.user = user
        self.on_company_selected = on_company_selected
        self.companies = []
        
        # Connect signal
        self.company_selected.connect(on_company_selected)
        
        self.refresh_companies()
        self.init_ui()
    
    def paintEvent(self, event):
        """Paint gradient background"""
        painter = QPainter(self)
        gradient = QLinearGradient(0, 0, 0, self.height())
        gradient.setColorAt(0, QColor(250, 250, 250))
        gradient.setColorAt(1, QColor(240, 248, 255))
        painter.fillRect(self.rect(), QBrush(gradient))
    
    def refresh_companies(self):
        """Refresh companies list"""
        self.companies = self.db.fetchall("SELECT * FROM companies ORDER BY name")
    
    def init_ui(self):
        """Initialize UI"""
        layout = QVBoxLayout()
        layout.setAlignment(Qt.AlignmentFlag.AlignCenter)
        layout.setContentsMargins(40, 40, 40, 40)
        layout.setSpacing(30)
        
        # Title section
        title_layout = QVBoxLayout()
        title_layout.setAlignment(Qt.AlignmentFlag.AlignCenter)
        title_layout.setSpacing(10)
        
        icon_label = QLabel("🏢")
        icon_label.setAlignment(Qt.AlignmentFlag.AlignCenter)
        icon_font = QFont()
        icon_font.setPointSize(48)
        icon_label.setFont(icon_font)
        title_layout.addWidget(icon_label)
        
        title = QLabel("Company Setup")
        title_font = QFont()
        title_font.setPointSize(42)
        title_font.setBold(True)
        title.setFont(title_font)
        title.setStyleSheet("""
            color: #1976D2;
            margin-bottom: 5px;
        """)
        title_layout.addWidget(title)
        
        subtitle = QLabel("Select or create a company to get started")
        subtitle.setAlignment(Qt.AlignmentFlag.AlignCenter)
        subtitle.setStyleSheet("""
            color: #616161;
            font-size: 18px;
            font-weight: 300;
        """)
        title_layout.addWidget(subtitle)
        
        layout.addLayout(title_layout)
        layout.addSpacing(20)
        
        # Existing companies section with modern card design
        companies_frame = QFrame()
        companies_frame.setFixedWidth(700)
        companies_frame.setStyleSheet("""
            QFrame {
                background-color: white;
                border-radius: 16px;
                padding: 30px;
                border: 1px solid #E0E0E0;
            }
        """)
        
        companies_layout = QVBoxLayout()
        companies_layout.setSpacing(15)
        
        companies_title = QLabel("Select Existing Company")
        companies_title_font = QFont()
        companies_title_font.setPointSize(18)
        companies_title_font.setBold(True)
        companies_title.setFont(companies_title_font)
        companies_title.setStyleSheet("color: #212121; margin-bottom: 5px;")
        companies_layout.addWidget(companies_title)
        
        # Companies list
        self.companies_widget = self.build_companies_list()
        companies_layout.addWidget(self.companies_widget)
        
        companies_frame.setLayout(companies_layout)
        layout.addWidget(companies_frame)
        
        # OR separator with modern design
        separator_layout = QHBoxLayout()
        separator_layout.addStretch()
        
        line1 = QFrame()
        line1.setFrameShape(QFrame.Shape.HLine)
        line1.setFixedWidth(150)
        line1.setStyleSheet("color: #E0E0E0;")
        separator_layout.addWidget(line1)
        
        or_label = QLabel("OR")
        or_label.setAlignment(Qt.AlignmentFlag.AlignCenter)
        or_label.setStyleSheet("""
            font-weight: 600;
            font-size: 14px;
            color: #9E9E9E;
            padding: 0 15px;
        """)
        separator_layout.addWidget(or_label)
        
        line2 = QFrame()
        line2.setFrameShape(QFrame.Shape.HLine)
        line2.setFixedWidth(150)
        line2.setStyleSheet("color: #E0E0E0;")
        separator_layout.addWidget(line2)
        
        separator_layout.addStretch()
        layout.addLayout(separator_layout)
        
        # Create button with modern gradient design
        create_btn = QPushButton("➕ Create New Company")
        create_btn.setFixedSize(320, 60)
        create_btn.setCursor(Qt.CursorShape.PointingHandCursor)
        create_btn.setStyleSheet("""
            QPushButton {
                background: qlineargradient(x1:0, y1:0, x2:1, y2:0,
                    stop:0 #1976D2, stop:1 #1565C0);
                color: white;
                border: none;
                border-radius: 12px;
                font-size: 17px;
                font-weight: 600;
                padding: 15px;
            }
            QPushButton:hover {
                background: qlineargradient(x1:0, y1:0, x2:1, y2:0,
                    stop:0 #1565C0, stop:1 #0D47A1);
                transform: scale(1.02);
            }
            QPushButton:pressed {
                background: qlineargradient(x1:0, y1:0, x2:1, y2:0,
                    stop:0 #0D47A1, stop:1 #0277BD);
            }
        """)
        create_btn.clicked.connect(self.show_create_company_dialog)
        
        btn_layout = QHBoxLayout()
        btn_layout.setAlignment(Qt.AlignmentFlag.AlignCenter)
        btn_layout.addWidget(create_btn)
        layout.addLayout(btn_layout)
        
        layout.addStretch()
        self.setLayout(layout)
    
    def build_companies_list(self):
        """Build companies selection list"""
        widget = QWidget()
        layout = QVBoxLayout()
        layout.setSpacing(12)
        
        if not self.companies:
            no_companies = QLabel("No companies found.\nCreate your first company to get started.")
            no_companies.setAlignment(Qt.AlignmentFlag.AlignCenter)
            no_companies.setStyleSheet("""
                color: #9E9E9E;
                font-size: 15px;
                padding: 40px;
            """)
            layout.addWidget(no_companies)
        else:
            for company in self.companies:
                company_card = self.create_company_card(company)
                layout.addWidget(company_card)
        
        layout.addStretch()
        widget.setLayout(layout)
        return widget
    
    def create_company_card(self, company):
        """Create a modern company card widget"""
        card = QFrame()
        card.setCursor(Qt.CursorShape.PointingHandCursor)
        card.setStyleSheet("""
            QFrame {
                background-color: #FAFAFA;
                border: 2px solid #E0E0E0;
                border-radius: 12px;
                padding: 20px;
            }
            QFrame:hover {
                border: 2px solid #1976D2;
                background-color: white;
                box-shadow: 0 4px 12px rgba(25, 118, 210, 0.15);
            }
        """)
        
        layout = QHBoxLayout()
        layout.setSpacing(15)
        
        # Icon
        icon_label = QLabel("🏢")
        icon_label.setStyleSheet("font-size: 32px;")
        layout.addWidget(icon_label)
        
        # Company info
        info_layout = QVBoxLayout()
        info_layout.setSpacing(5)
        
        name_label = QLabel(company.get('name', ''))
        name_font = QFont()
        name_font.setPointSize(16)
        name_font.setBold(True)
        name_label.setFont(name_font)
        name_label.setStyleSheet("color: #212121;")
        info_layout.addWidget(name_label)
        
        location = f"{company.get('city', '')}, {company.get('state', '')}"
        if location.strip() != ",":
            location_label = QLabel(location)
            location_label.setStyleSheet("color: #757575; font-size: 13px;")
            info_layout.addWidget(location_label)
        
        gstin = company.get('gstin', 'N/A')
        gstin_label = QLabel(f"GSTIN: {gstin}")
        gstin_label.setStyleSheet("color: #9E9E9E; font-size: 12px;")
        info_layout.addWidget(gstin_label)
        
        layout.addLayout(info_layout)
        layout.addStretch()
        
        # Select button
        select_btn = QPushButton("Select")
        select_btn.setCursor(Qt.CursorShape.PointingHandCursor)
        select_btn.setStyleSheet("""
            QPushButton {
                background-color: #4CAF50;
                color: white;
                padding: 10px 24px;
                border-radius: 8px;
                font-weight: 600;
                font-size: 14px;
                border: none;
            }
            QPushButton:hover {
                background-color: #45A049;
            }
            QPushButton:pressed {
                background-color: #388E3C;
            }
        """)
        select_btn.clicked.connect(lambda: self.select_company(company))
        layout.addWidget(select_btn)
        
        card.setLayout(layout)
        return card
    
    def select_company(self, company):
        """Select a company"""
        self.company_selected.emit(company)
    
    def show_create_company_dialog(self):
        """Show create company dialog"""
        dialog = CreateCompanyDialog(self, self.db)
        if dialog.exec() == QDialog.DialogCode.Accepted:
            company = dialog.get_company()
            if company:
                self.refresh_companies()
                # Rebuild companies list
                self.companies_widget.setParent(None)
                self.companies_widget = self.build_companies_list()
                # Find and update the companies frame
                for i in range(self.layout().count()):
                    item = self.layout().itemAt(i)
                    if item and item.widget() and isinstance(item.widget(), QFrame):
                        frame = item.widget()
                        if frame.findChild(QLabel, "Select Existing Company"):
                            frame.layout().removeWidget(self.companies_widget)
                            frame.layout().addWidget(self.companies_widget)
                            break
                
                self.select_company(company)


class CreateCompanyDialog(QDialog):
    def __init__(self, parent, db):
        super().__init__(parent)
        self.db = db
        self.created_company = None
        self.setWindowTitle("Create New Company")
        self.setMinimumSize(600, 700)
        self.setStyleSheet("""
            QDialog {
                background-color: white;
            }
        """)
        self.init_ui()
    
    def init_ui(self):
        """Initialize dialog UI"""
        layout = QVBoxLayout()
        layout.setContentsMargins(30, 30, 30, 30)
        layout.setSpacing(20)
        
        # Header
        header_label = QLabel("Create New Company")
        header_font = QFont()
        header_font.setPointSize(24)
        header_font.setBold(True)
        header_label.setFont(header_font)
        header_label.setStyleSheet("color: #1976D2; margin-bottom: 10px;")
        layout.addWidget(header_label)
        
        # Scroll area for form
        scroll = QScrollArea()
        scroll.setWidgetResizable(True)
        scroll.setStyleSheet("border: none; background: transparent;")
        
        form_widget = QWidget()
        form_layout = QFormLayout()
        form_layout.setSpacing(18)
        form_layout.setLabelAlignment(Qt.AlignmentFlag.AlignLeft)
        
        # Company Name (required)
        self.name_field = QLineEdit()
        self.name_field.setPlaceholderText("Enter company name")
        self.name_field.setMinimumHeight(45)
        self.name_field.setStyleSheet("""
            QLineEdit {
                padding: 12px 16px;
                border: 2px solid #E0E0E0;
                border-radius: 8px;
                font-size: 14px;
                background-color: #FAFAFA;
            }
            QLineEdit:focus {
                border: 2px solid #1976D2;
                background-color: white;
            }
        """)
        form_layout.addRow("Company Name *", self.name_field)
        
        # Address
        self.address_field = QTextEdit()
        self.address_field.setMaximumHeight(80)
        self.address_field.setStyleSheet("""
            QTextEdit {
                padding: 12px 16px;
                border: 2px solid #E0E0E0;
                border-radius: 8px;
                font-size: 14px;
                background-color: #FAFAFA;
            }
            QTextEdit:focus {
                border: 2px solid #1976D2;
                background-color: white;
            }
        """)
        form_layout.addRow("Address", self.address_field)
        
        # City, State, Pincode in row
        city_state_layout = QHBoxLayout()
        self.city_field = QLineEdit()
        self.city_field.setPlaceholderText("City")
        self.city_field.setMinimumHeight(45)
        self.city_field.setStyleSheet("""
            QLineEdit {
                padding: 12px 16px;
                border: 2px solid #E0E0E0;
                border-radius: 8px;
                font-size: 14px;
                background-color: #FAFAFA;
            }
            QLineEdit:focus {
                border: 2px solid #1976D2;
                background-color: white;
            }
        """)
        self.state_field = QLineEdit()
        self.state_field.setPlaceholderText("State")
        self.state_field.setMinimumHeight(45)
        self.state_field.setStyleSheet(self.city_field.styleSheet())
        self.pincode_field = QLineEdit()
        self.pincode_field.setPlaceholderText("Pincode")
        self.pincode_field.setMinimumHeight(45)
        self.pincode_field.setStyleSheet(self.city_field.styleSheet())
        
        city_state_layout.addWidget(self.city_field)
        city_state_layout.addWidget(self.state_field)
        city_state_layout.addWidget(self.pincode_field)
        form_layout.addRow("City / State / Pincode", city_state_layout)
        
        # Phone, Email
        self.phone_field = QLineEdit()
        self.phone_field.setPlaceholderText("Phone number")
        self.phone_field.setMinimumHeight(45)
        self.phone_field.setStyleSheet(self.city_field.styleSheet())
        form_layout.addRow("Phone", self.phone_field)
        
        self.email_field = QLineEdit()
        self.email_field.setPlaceholderText("Email address")
        self.email_field.setMinimumHeight(45)
        self.email_field.setStyleSheet(self.city_field.styleSheet())
        form_layout.addRow("Email", self.email_field)
        
        # GSTIN, PAN
        gstin_pan_layout = QHBoxLayout()
        self.gstin_field = QLineEdit()
        self.gstin_field.setPlaceholderText("GSTIN")
        self.gstin_field.setMinimumHeight(45)
        self.gstin_field.setStyleSheet(self.city_field.styleSheet())
        self.pan_field = QLineEdit()
        self.pan_field.setPlaceholderText("PAN")
        self.pan_field.setMinimumHeight(45)
        self.pan_field.setStyleSheet(self.city_field.styleSheet())
        
        gstin_pan_layout.addWidget(self.gstin_field)
        gstin_pan_layout.addWidget(self.pan_field)
        form_layout.addRow("GSTIN / PAN", gstin_pan_layout)
        
        # Business Type, Opening Period, Accounting Year
        self.business_type_field = QLineEdit()
        self.business_type_field.setPlaceholderText("Business type")
        self.business_type_field.setMinimumHeight(45)
        self.business_type_field.setStyleSheet(self.city_field.styleSheet())
        form_layout.addRow("Business Type", self.business_type_field)
        
        self.opening_period_field = QLineEdit()
        self.opening_period_field.setPlaceholderText("Opening period")
        self.opening_period_field.setMinimumHeight(45)
        self.opening_period_field.setStyleSheet(self.city_field.styleSheet())
        form_layout.addRow("Opening Period", self.opening_period_field)
        
        self.accounting_year_field = QLineEdit()
        self.accounting_year_field.setPlaceholderText("Accounting year")
        self.accounting_year_field.setMinimumHeight(45)
        self.accounting_year_field.setStyleSheet(self.city_field.styleSheet())
        form_layout.addRow("Accounting Year", self.accounting_year_field)
        
        form_widget.setLayout(form_layout)
        scroll.setWidget(form_widget)
        layout.addWidget(scroll)
        
        # Buttons with modern design
        buttons_layout = QHBoxLayout()
        buttons_layout.addStretch()
        
        cancel_btn = QPushButton("Cancel")
        cancel_btn.setMinimumHeight(45)
        cancel_btn.setMinimumWidth(120)
        cancel_btn.setCursor(Qt.CursorShape.PointingHandCursor)
        cancel_btn.setStyleSheet("""
            QPushButton {
                background-color: #F5F5F5;
                color: #424242;
                border: 2px solid #E0E0E0;
                border-radius: 8px;
                font-weight: 600;
                font-size: 14px;
            }
            QPushButton:hover {
                background-color: #EEEEEE;
                border-color: #BDBDBD;
            }
        """)
        cancel_btn.clicked.connect(self.reject)
        buttons_layout.addWidget(cancel_btn)
        
        create_btn = QPushButton("Create Company")
        create_btn.setMinimumHeight(45)
        create_btn.setMinimumWidth(150)
        create_btn.setCursor(Qt.CursorShape.PointingHandCursor)
        create_btn.setStyleSheet("""
            QPushButton {
                background: qlineargradient(x1:0, y1:0, x2:1, y2:0,
                    stop:0 #1976D2, stop:1 #1565C0);
                color: white;
                border: none;
                border-radius: 8px;
                font-weight: 600;
                font-size: 14px;
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
        create_btn.clicked.connect(self.handle_create)
        buttons_layout.addWidget(create_btn)
        
        layout.addLayout(buttons_layout)
        self.setLayout(layout)
        
        # Focus on name field
        self.name_field.setFocus()
    
    def handle_create(self):
        """Handle company creation"""
        if not self.name_field.text().strip():
            QMessageBox.warning(self, "Validation Error", "Company name is required")
            return
        
        try:
            # Create new company
            self.db.execute("""
                INSERT INTO companies 
                (name, address, city, state, pincode, phone, email, gstin, pan, 
                 business_type, opening_period, accounting_year)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                self.name_field.text().strip(),
                self.address_field.toPlainText(),
                self.city_field.text(),
                self.state_field.text(),
                self.pincode_field.text(),
                self.phone_field.text(),
                self.email_field.text(),
                self.gstin_field.text(),
                self.pan_field.text(),
                self.business_type_field.text(),
                self.opening_period_field.text(),
                self.accounting_year_field.text()
            ))
            
            company_id = self.db.cursor.lastrowid
            self.db.commit()
            
            # Get the created company
            self.created_company = self.db.fetchone(
                "SELECT * FROM companies WHERE id = ?", 
                (company_id,)
            )
            
            if self.created_company:
                QMessageBox.information(self, "Success", "Company created successfully!")
                self.accept()
            else:
                QMessageBox.warning(self, "Error", "Company created but could not be retrieved")
        except Exception as ex:
            QMessageBox.critical(self, "Error", f"Error creating company: {str(ex)}")
    
    def get_company(self):
        """Get the created company"""
        return self.created_company
