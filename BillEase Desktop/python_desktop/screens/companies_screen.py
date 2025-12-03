"""
Companies Management Screen - PySide6
Modern UI/UX Design
"""
from PySide6.QtWidgets import (
    QWidget, QVBoxLayout, QHBoxLayout, QLabel, QPushButton, 
    QTableWidget, QTableWidgetItem, QHeaderView, QMessageBox,
    QDialog, QFormLayout, QLineEdit, QTextEdit, QDialogButtonBox
)
from PySide6.QtCore import Qt
from PySide6.QtGui import QFont, QColor


class CompaniesScreen(QWidget):
    def __init__(self, db, user):
        super().__init__()
        self.db = db
        self.user = user
        self.companies = []
        self.selected_company = None
        self.init_ui()
        self.refresh_companies()
    
    def init_ui(self):
        """Initialize UI"""
        layout = QVBoxLayout()
        layout.setContentsMargins(30, 30, 30, 30)
        layout.setSpacing(20)
        
        # Header with modern design
        header_frame = QFrame()
        header_frame.setStyleSheet("""
            QFrame {
                background-color: white;
                border-radius: 12px;
                padding: 20px;
            }
        """)
        header_layout = QHBoxLayout()
        header_layout.setContentsMargins(0, 0, 0, 0)
        
        title_layout = QHBoxLayout()
        title_layout.setSpacing(12)
        
        icon_label = QLabel("🏢")
        icon_label.setStyleSheet("font-size: 28px;")
        title_layout.addWidget(icon_label)
        
        title = QLabel("Companies Management")
        title_font = QFont()
        title_font.setPointSize(28)
        title_font.setBold(True)
        title.setFont(title_font)
        title.setStyleSheet("color: #1976D2;")
        title_layout.addWidget(title)
        
        header_layout.addLayout(title_layout)
        header_layout.addStretch()
        
        add_btn = QPushButton("➕ Add Company")
        add_btn.setCursor(Qt.CursorShape.PointingHandCursor)
        add_btn.setMinimumHeight(45)
        add_btn.setStyleSheet("""
            QPushButton {
                background: qlineargradient(x1:0, y1:0, x2:1, y2:0,
                    stop:0 #1976D2, stop:1 #1565C0);
                color: white;
                padding: 12px 24px;
                border-radius: 10px;
                font-weight: 600;
                font-size: 15px;
                border: none;
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
        add_btn.clicked.connect(self.show_add_company_dialog)
        header_layout.addWidget(add_btn)
        
        header_frame.setLayout(header_layout)
        layout.addWidget(header_frame)
        
        # Table with modern styling
        table_frame = QFrame()
        table_frame.setStyleSheet("""
            QFrame {
                background-color: white;
                border-radius: 12px;
                padding: 20px;
            }
        """)
        table_layout = QVBoxLayout()
        table_layout.setContentsMargins(0, 0, 0, 0)
        
        self.table = QTableWidget()
        self.table.setColumnCount(7)
        self.table.setHorizontalHeaderLabels([
            "Name", "City", "State", "Phone", "Email", "GSTIN", "Actions"
        ])
        self.table.horizontalHeader().setStretchLastSection(True)
        self.table.setSelectionBehavior(QTableWidget.SelectionBehavior.SelectRows)
        self.table.setEditTriggers(QTableWidget.EditTrigger.NoEditTriggers)
        self.table.setAlternatingRowColors(True)
        self.table.setStyleSheet("""
            QTableWidget {
                border: none;
                background-color: white;
                gridline-color: #E0E0E0;
                font-size: 14px;
            }
            QTableWidget::item {
                padding: 12px;
                border-bottom: 1px solid #F5F5F5;
            }
            QTableWidget::item:selected {
                background-color: #E3F2FD;
                color: #1976D2;
            }
            QHeaderView::section {
                background-color: #F5F5F5;
                padding: 12px;
                border: none;
                border-bottom: 2px solid #1976D2;
                font-weight: 600;
                font-size: 13px;
                color: #212121;
            }
            QTableWidget::item:alternate {
                background-color: #FAFAFA;
            }
        """)
        
        table_layout.addWidget(self.table)
        table_frame.setLayout(table_layout)
        layout.addWidget(table_frame)
        
        self.setLayout(layout)
        self.setStyleSheet("background-color: #FAFAFA;")
    
    def refresh_companies(self):
        """Refresh companies list"""
        self.companies = self.db.fetchall("SELECT * FROM companies ORDER BY name")
        self.update_table()
    
    def update_table(self):
        """Update table with companies data"""
        self.table.setRowCount(len(self.companies))
        
        for row, company in enumerate(self.companies):
            self.table.setItem(row, 0, QTableWidgetItem(company.get('name', '')))
            self.table.setItem(row, 1, QTableWidgetItem(company.get('city', '') or '-'))
            self.table.setItem(row, 2, QTableWidgetItem(company.get('state', '') or '-'))
            self.table.setItem(row, 3, QTableWidgetItem(company.get('phone', '') or '-'))
            self.table.setItem(row, 4, QTableWidgetItem(company.get('email', '') or '-'))
            self.table.setItem(row, 5, QTableWidgetItem(company.get('gstin', '') or '-'))
            
            # Actions
            actions_widget = QWidget()
            actions_layout = QHBoxLayout()
            actions_layout.setContentsMargins(5, 5, 5, 5)
            actions_layout.setSpacing(8)
            
            edit_btn = QPushButton("✏️ Edit")
            edit_btn.setCursor(Qt.CursorShape.PointingHandCursor)
            edit_btn.setStyleSheet("""
                QPushButton {
                    background-color: #FF9800;
                    color: white;
                    padding: 8px 16px;
                    border-radius: 6px;
                    font-weight: 600;
                    font-size: 12px;
                    border: none;
                }
                QPushButton:hover {
                    background-color: #F57C00;
                }
            """)
            edit_btn.clicked.connect(lambda checked, c=company: self.show_edit_company_dialog(c))
            actions_layout.addWidget(edit_btn)
            
            delete_btn = QPushButton("🗑️ Delete")
            delete_btn.setCursor(Qt.CursorShape.PointingHandCursor)
            delete_btn.setStyleSheet("""
                QPushButton {
                    background-color: #F44336;
                    color: white;
                    padding: 8px 16px;
                    border-radius: 6px;
                    font-weight: 600;
                    font-size: 12px;
                    border: none;
                }
                QPushButton:hover {
                    background-color: #D32F2F;
                }
            """)
            delete_btn.clicked.connect(lambda checked, c=company: self.show_delete_confirm(c))
            actions_layout.addWidget(delete_btn)
            
            actions_widget.setLayout(actions_layout)
            self.table.setCellWidget(row, 6, actions_widget)
        
        self.table.resizeColumnsToContents()
    
    def show_add_company_dialog(self):
        """Show add company dialog"""
        dialog = CompanyDialog(self, self.db)
        if dialog.exec() == QDialog.DialogCode.Accepted:
            self.refresh_companies()
    
    def show_edit_company_dialog(self, company):
        """Show edit company dialog"""
        dialog = CompanyDialog(self, self.db, company)
        if dialog.exec() == QDialog.DialogCode.Accepted:
            self.refresh_companies()
    
    def show_delete_confirm(self, company):
        """Show delete confirmation"""
        reply = QMessageBox.question(
            self,
            "Confirm Delete",
            f"Are you sure you want to delete '{company.get('name', '')}'?\n\nThis action cannot be undone.",
            QMessageBox.StandardButton.Yes | QMessageBox.StandardButton.No,
            QMessageBox.StandardButton.No
        )
        
        if reply == QMessageBox.StandardButton.Yes:
            try:
                self.db.execute("DELETE FROM companies WHERE id = ?", (company['id'],))
                self.db.commit()
                QMessageBox.information(self, "Success", "Company deleted successfully")
                self.refresh_companies()
            except Exception as ex:
                QMessageBox.critical(self, "Error", f"Error deleting company: {str(ex)}")


class CompanyDialog(QDialog):
    def __init__(self, parent, db, company=None):
        super().__init__(parent)
        self.db = db
        self.company = company
        self.setWindowTitle("Add Company" if not company else "Edit Company")
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
        header_label = QLabel("➕ Add Company" if not self.company else "✏️ Edit Company")
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
        form_layout.setSpacing(20)
        form_layout.setLabelAlignment(Qt.AlignmentFlag.AlignLeft)
        
        # Company Name (required)
        self.name_field = QLineEdit()
        self.name_field.setPlaceholderText("Enter company name")
        self.name_field.setMinimumHeight(50)
        if self.company:
            self.name_field.setText(self.company.get('name', ''))
        self.name_field.setStyleSheet("""
            QLineEdit {
                padding: 12px 16px;
                border: 2px solid #E0E0E0;
                border-radius: 10px;
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
        self.address_field.setMaximumHeight(90)
        if self.company:
            self.address_field.setPlainText(self.company.get('address', ''))
        self.address_field.setStyleSheet("""
            QTextEdit {
                padding: 12px 16px;
                border: 2px solid #E0E0E0;
                border-radius: 10px;
                font-size: 14px;
                background-color: #FAFAFA;
            }
            QTextEdit:focus {
                border: 2px solid #1976D2;
                background-color: white;
            }
        """)
        form_layout.addRow("Address", self.address_field)
        
        # City, State, Pincode
        city_state_layout = QHBoxLayout()
        self.city_field = QLineEdit()
        self.city_field.setPlaceholderText("City")
        self.city_field.setMinimumHeight(50)
        if self.company:
            self.city_field.setText(self.company.get('city', ''))
        self.city_field.setStyleSheet(self.name_field.styleSheet())
        
        self.state_field = QLineEdit()
        self.state_field.setPlaceholderText("State")
        self.state_field.setMinimumHeight(50)
        if self.company:
            self.state_field.setText(self.company.get('state', ''))
        self.state_field.setStyleSheet(self.name_field.styleSheet())
        
        self.pincode_field = QLineEdit()
        self.pincode_field.setPlaceholderText("Pincode")
        self.pincode_field.setMinimumHeight(50)
        if self.company:
            self.pincode_field.setText(self.company.get('pincode', ''))
        self.pincode_field.setStyleSheet(self.name_field.styleSheet())
        
        city_state_layout.addWidget(self.city_field)
        city_state_layout.addWidget(self.state_field)
        city_state_layout.addWidget(self.pincode_field)
        form_layout.addRow("City / State / Pincode", city_state_layout)
        
        # Phone, Email
        self.phone_field = QLineEdit()
        self.phone_field.setPlaceholderText("Phone number")
        self.phone_field.setMinimumHeight(50)
        if self.company:
            self.phone_field.setText(self.company.get('phone', ''))
        self.phone_field.setStyleSheet(self.name_field.styleSheet())
        form_layout.addRow("Phone", self.phone_field)
        
        self.email_field = QLineEdit()
        self.email_field.setPlaceholderText("Email address")
        self.email_field.setMinimumHeight(50)
        if self.company:
            self.email_field.setText(self.company.get('email', ''))
        self.email_field.setStyleSheet(self.name_field.styleSheet())
        form_layout.addRow("Email", self.email_field)
        
        # GSTIN, PAN
        gstin_pan_layout = QHBoxLayout()
        self.gstin_field = QLineEdit()
        self.gstin_field.setPlaceholderText("GSTIN")
        self.gstin_field.setMinimumHeight(50)
        if self.company:
            self.gstin_field.setText(self.company.get('gstin', ''))
        self.gstin_field.setStyleSheet(self.name_field.styleSheet())
        
        self.pan_field = QLineEdit()
        self.pan_field.setPlaceholderText("PAN")
        self.pan_field.setMinimumHeight(50)
        if self.company:
            self.pan_field.setText(self.company.get('pan', ''))
        self.pan_field.setStyleSheet(self.name_field.styleSheet())
        
        gstin_pan_layout.addWidget(self.gstin_field)
        gstin_pan_layout.addWidget(self.pan_field)
        form_layout.addRow("GSTIN / PAN", gstin_pan_layout)
        
        # Business Type, Opening Period, Accounting Year
        self.business_type_field = QLineEdit()
        self.business_type_field.setPlaceholderText("Business type")
        self.business_type_field.setMinimumHeight(50)
        if self.company:
            self.business_type_field.setText(self.company.get('business_type', ''))
        self.business_type_field.setStyleSheet(self.name_field.styleSheet())
        form_layout.addRow("Business Type", self.business_type_field)
        
        self.opening_period_field = QLineEdit()
        self.opening_period_field.setPlaceholderText("Opening period")
        self.opening_period_field.setMinimumHeight(50)
        if self.company:
            self.opening_period_field.setText(self.company.get('opening_period', ''))
        self.opening_period_field.setStyleSheet(self.name_field.styleSheet())
        form_layout.addRow("Opening Period", self.opening_period_field)
        
        self.accounting_year_field = QLineEdit()
        self.accounting_year_field.setPlaceholderText("Accounting year")
        self.accounting_year_field.setMinimumHeight(50)
        if self.company:
            self.accounting_year_field.setText(self.company.get('accounting_year', ''))
        self.accounting_year_field.setStyleSheet(self.name_field.styleSheet())
        form_layout.addRow("Accounting Year", self.accounting_year_field)
        
        form_widget.setLayout(form_layout)
        scroll.setWidget(form_widget)
        layout.addWidget(scroll)
        
        # Buttons with modern design
        buttons_layout = QHBoxLayout()
        buttons_layout.addStretch()
        
        cancel_btn = QPushButton("Cancel")
        cancel_btn.setMinimumHeight(50)
        cancel_btn.setMinimumWidth(130)
        cancel_btn.setCursor(Qt.CursorShape.PointingHandCursor)
        cancel_btn.setStyleSheet("""
            QPushButton {
                background-color: #F5F5F5;
                color: #424242;
                border: 2px solid #E0E0E0;
                border-radius: 10px;
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
        
        save_btn = QPushButton("💾 Save" if self.company else "➕ Create")
        save_btn.setMinimumHeight(50)
        save_btn.setMinimumWidth(150)
        save_btn.setCursor(Qt.CursorShape.PointingHandCursor)
        save_btn.setStyleSheet("""
            QPushButton {
                background: qlineargradient(x1:0, y1:0, x2:1, y2:0,
                    stop:0 #1976D2, stop:1 #1565C0);
                color: white;
                border: none;
                border-radius: 10px;
                font-weight: 600;
                font-size: 14px;
            }
            QPushButton:hover {
                background: qlineargradient(x1:0, y1:0, x2:1, y2:0,
                    stop:0 #1565C0, stop:1 #0D47A1);
            }
        """)
        save_btn.clicked.connect(self.accept)
        buttons_layout.addWidget(save_btn)
        
        layout.addLayout(buttons_layout)
        self.setLayout(layout)
        
        self.name_field.setFocus()
    
    def accept(self):
        """Handle accept"""
        if not self.name_field.text().strip():
            QMessageBox.warning(self, "Validation Error", "Company name is required")
            return
        
        try:
            if self.company:
                # Update
                self.db.execute("""
                    UPDATE companies SET 
                        name=?, address=?, city=?, state=?, pincode=?, phone=?, email=?, 
                        gstin=?, pan=?, business_type=?, opening_period=?, accounting_year=?
                    WHERE id=?
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
                    self.accounting_year_field.text(),
                    self.company['id']
                ))
                QMessageBox.information(self, "Success", "✅ Company updated successfully!")
            else:
                # Create
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
                QMessageBox.information(self, "Success", "✅ Company created successfully!")
            
            self.db.commit()
            super().accept()
        except Exception as ex:
            QMessageBox.critical(self, "Error", f"❌ Error saving company: {str(ex)}")
