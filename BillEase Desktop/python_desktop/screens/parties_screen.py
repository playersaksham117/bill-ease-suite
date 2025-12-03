"""
Parties Management Screen (Customers/Suppliers) - PySide6
Modern UI/UX Design
"""
from PySide6.QtWidgets import (
    QWidget, QVBoxLayout, QHBoxLayout, QLabel, QPushButton, 
    QTableWidget, QTableWidgetItem, QHeaderView, QMessageBox,
    QDialog, QFormLayout, QLineEdit, QComboBox, QDoubleSpinBox,
    QDialogButtonBox
)
from PySide6.QtCore import Qt
from PySide6.QtGui import QFont


class PartiesScreen(QWidget):
    def __init__(self, db, user):
        super().__init__()
        self.db = db
        self.user = user
        self.parties = []
        self.selected_party = None
        self.party_type_filter = "all"
        self.init_ui()
        self.refresh_parties()
    
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
        
        icon_label = QLabel("👥")
        icon_label.setStyleSheet("font-size: 28px;")
        title_layout.addWidget(icon_label)
        
        title = QLabel("Parties Management")
        title_font = QFont()
        title_font.setPointSize(28)
        title_font.setBold(True)
        title.setFont(title_font)
        title.setStyleSheet("color: #4CAF50;")
        title_layout.addWidget(title)
        
        header_layout.addLayout(title_layout)
        header_layout.addStretch()
        
        # Filter
        filter_label = QLabel("Filter:")
        filter_label.setStyleSheet("font-weight: 600; color: #424242; margin-right: 8px;")
        self.filter_combo = QComboBox()
        self.filter_combo.addItems(["All Parties", "Customers", "Suppliers"])
        self.filter_combo.setMinimumHeight(45)
        self.filter_combo.setMinimumWidth(150)
        self.filter_combo.setStyleSheet("""
            QComboBox {
                padding: 10px 15px;
                border: 2px solid #E0E0E0;
                border-radius: 10px;
                font-size: 14px;
                background-color: white;
            }
            QComboBox:hover {
                border-color: #4CAF50;
            }
            QComboBox::drop-down {
                border: none;
            }
        """)
        self.filter_combo.currentIndexChanged.connect(self.on_filter_change)
        header_layout.addWidget(filter_label)
        header_layout.addWidget(self.filter_combo)
        
        add_btn = QPushButton("➕ Add Party")
        add_btn.setCursor(Qt.CursorShape.PointingHandCursor)
        add_btn.setMinimumHeight(45)
        add_btn.setStyleSheet("""
            QPushButton {
                background: qlineargradient(x1:0, y1:0, x2:1, y2:0,
                    stop:0 #4CAF50, stop:1 #45A049);
                color: white;
                padding: 12px 24px;
                border-radius: 10px;
                font-weight: 600;
                font-size: 15px;
                border: none;
            }
            QPushButton:hover {
                background: qlineargradient(x1:0, y1:0, x2:1, y2:0,
                    stop:0 #45A049, stop:1 #388E3C);
            }
        """)
        add_btn.clicked.connect(self.show_add_party_dialog)
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
        self.table.setColumnCount(8)
        self.table.setHorizontalHeaderLabels([
            "Name", "Type", "City", "Phone", "Email", "GSTIN", "Credit Limit", "Actions"
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
                background-color: #E8F5E9;
                color: #2E7D32;
            }
            QHeaderView::section {
                background-color: #F5F5F5;
                padding: 12px;
                border: none;
                border-bottom: 2px solid #4CAF50;
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
    
    def refresh_parties(self):
        """Refresh parties list"""
        if self.party_type_filter == "all":
            self.parties = self.db.fetchall("SELECT * FROM parties ORDER BY name")
        else:
            self.parties = self.db.fetchall(
                "SELECT * FROM parties WHERE type = ? ORDER BY name", 
                (self.party_type_filter,)
            )
        self.update_table()
    
    def update_table(self):
        """Update table with parties data"""
        self.table.setRowCount(len(self.parties))
        
        for row, party in enumerate(self.parties):
            self.table.setItem(row, 0, QTableWidgetItem(party.get('name', '')))
            self.table.setItem(row, 1, QTableWidgetItem(party.get('type', '')))
            self.table.setItem(row, 2, QTableWidgetItem(party.get('city', '') or '-'))
            self.table.setItem(row, 3, QTableWidgetItem(party.get('contact', '') or '-'))
            self.table.setItem(row, 4, QTableWidgetItem(party.get('email', '') or '-'))
            self.table.setItem(row, 5, QTableWidgetItem(party.get('gstin', '') or '-'))
            self.table.setItem(row, 6, QTableWidgetItem(f"₹{party.get('credit_limit', 0):,.2f}"))
            
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
            edit_btn.clicked.connect(lambda checked, p=party: self.show_edit_party_dialog(p))
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
            delete_btn.clicked.connect(lambda checked, p=party: self.show_delete_confirm(p))
            actions_layout.addWidget(delete_btn)
            
            actions_widget.setLayout(actions_layout)
            self.table.setCellWidget(row, 7, actions_widget)
        
        self.table.resizeColumnsToContents()
    
    def on_filter_change(self, index):
        """Handle filter change"""
        filters = ["all", "Customer", "Supplier"]
        self.party_type_filter = filters[index]
        self.refresh_parties()
    
    def show_add_party_dialog(self):
        """Show add party dialog"""
        dialog = PartyDialog(self, self.db)
        if dialog.exec() == QDialog.DialogCode.Accepted:
            self.refresh_parties()
    
    def show_edit_party_dialog(self, party):
        """Show edit party dialog"""
        dialog = PartyDialog(self, self.db, party)
        if dialog.exec() == QDialog.DialogCode.Accepted:
            self.refresh_parties()
    
    def show_delete_confirm(self, party):
        """Show delete confirmation"""
        reply = QMessageBox.question(
            self,
            "Confirm Delete",
            f"Are you sure you want to delete '{party.get('name', '')}'?\n\nThis action cannot be undone.",
            QMessageBox.StandardButton.Yes | QMessageBox.StandardButton.No,
            QMessageBox.StandardButton.No
        )
        
        if reply == QMessageBox.StandardButton.Yes:
            try:
                self.db.execute("DELETE FROM parties WHERE id = ?", (party['id'],))
                self.db.commit()
                QMessageBox.information(self, "Success", "✅ Party deleted successfully")
                self.refresh_parties()
            except Exception as ex:
                QMessageBox.critical(self, "Error", f"❌ Error deleting party: {str(ex)}")


class PartyDialog(QDialog):
    def __init__(self, parent, db, party=None):
        super().__init__(parent)
        self.db = db
        self.party = party
        self.setWindowTitle("Add Party" if not party else "Edit Party")
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
        header_label = QLabel("➕ Add Party" if not self.party else "✏️ Edit Party")
        header_font = QFont()
        header_font.setPointSize(24)
        header_font.setBold(True)
        header_label.setFont(header_font)
        header_label.setStyleSheet("color: #4CAF50; margin-bottom: 10px;")
        layout.addWidget(header_label)
        
        # Scroll area
        scroll = QScrollArea()
        scroll.setWidgetResizable(True)
        scroll.setStyleSheet("border: none; background: transparent;")
        
        form_widget = QWidget()
        form_layout = QFormLayout()
        form_layout.setSpacing(20)
        form_layout.setLabelAlignment(Qt.AlignmentFlag.AlignLeft)
        
        # Name
        self.name_field = QLineEdit()
        self.name_field.setPlaceholderText("Enter party name")
        self.name_field.setMinimumHeight(50)
        if self.party:
            self.name_field.setText(self.party.get('name', ''))
        self.name_field.setStyleSheet("""
            QLineEdit {
                padding: 12px 16px;
                border: 2px solid #E0E0E0;
                border-radius: 10px;
                font-size: 14px;
                background-color: #FAFAFA;
            }
            QLineEdit:focus {
                border: 2px solid #4CAF50;
                background-color: white;
            }
        """)
        form_layout.addRow("Name *", self.name_field)
        
        # Type
        self.type_field = QComboBox()
        self.type_field.addItems(["Customer", "Supplier"])
        self.type_field.setMinimumHeight(50)
        if self.party:
            index = self.type_field.findText(self.party.get('type', 'Customer'))
            if index >= 0:
                self.type_field.setCurrentIndex(index)
        self.type_field.setStyleSheet(self.name_field.styleSheet())
        form_layout.addRow("Type *", self.type_field)
        
        # Address, City, State, Pincode
        self.address_field = QLineEdit()
        self.address_field.setPlaceholderText("Address")
        self.address_field.setMinimumHeight(50)
        if self.party:
            self.address_field.setText(self.party.get('address', ''))
        self.address_field.setStyleSheet(self.name_field.styleSheet())
        form_layout.addRow("Address", self.address_field)
        
        city_state_layout = QHBoxLayout()
        self.city_field = QLineEdit()
        self.city_field.setPlaceholderText("City")
        self.city_field.setMinimumHeight(50)
        if self.party:
            self.city_field.setText(self.party.get('city', ''))
        self.city_field.setStyleSheet(self.name_field.styleSheet())
        
        self.state_field = QLineEdit()
        self.state_field.setPlaceholderText("State")
        self.state_field.setMinimumHeight(50)
        if self.party:
            self.state_field.setText(self.party.get('state', ''))
        self.state_field.setStyleSheet(self.name_field.styleSheet())
        
        self.pincode_field = QLineEdit()
        self.pincode_field.setPlaceholderText("Pincode")
        self.pincode_field.setMinimumHeight(50)
        if self.party:
            self.pincode_field.setText(self.party.get('pincode', ''))
        self.pincode_field.setStyleSheet(self.name_field.styleSheet())
        
        city_state_layout.addWidget(self.city_field)
        city_state_layout.addWidget(self.state_field)
        city_state_layout.addWidget(self.pincode_field)
        form_layout.addRow("City / State / Pincode", city_state_layout)
        
        # Contact, Email
        self.contact_field = QLineEdit()
        self.contact_field.setPlaceholderText("Contact number")
        self.contact_field.setMinimumHeight(50)
        if self.party:
            self.contact_field.setText(self.party.get('contact', ''))
        self.contact_field.setStyleSheet(self.name_field.styleSheet())
        form_layout.addRow("Contact", self.contact_field)
        
        self.email_field = QLineEdit()
        self.email_field.setPlaceholderText("Email address")
        self.email_field.setMinimumHeight(50)
        if self.party:
            self.email_field.setText(self.party.get('email', ''))
        self.email_field.setStyleSheet(self.name_field.styleSheet())
        form_layout.addRow("Email", self.email_field)
        
        # GSTIN, PAN
        gstin_pan_layout = QHBoxLayout()
        self.gstin_field = QLineEdit()
        self.gstin_field.setPlaceholderText("GSTIN")
        self.gstin_field.setMinimumHeight(50)
        if self.party:
            self.gstin_field.setText(self.party.get('gstin', ''))
        self.gstin_field.setStyleSheet(self.name_field.styleSheet())
        
        self.pan_field = QLineEdit()
        self.pan_field.setPlaceholderText("PAN")
        self.pan_field.setMinimumHeight(50)
        if self.party:
            self.pan_field.setText(self.party.get('pan', ''))
        self.pan_field.setStyleSheet(self.name_field.styleSheet())
        
        gstin_pan_layout.addWidget(self.gstin_field)
        gstin_pan_layout.addWidget(self.pan_field)
        form_layout.addRow("GSTIN / PAN", gstin_pan_layout)
        
        # Credit Limit, Opening Balance
        self.credit_limit_field = QDoubleSpinBox()
        self.credit_limit_field.setMaximum(999999999)
        self.credit_limit_field.setPrefix("₹ ")
        self.credit_limit_field.setMinimumHeight(50)
        if self.party:
            self.credit_limit_field.setValue(self.party.get('credit_limit', 0))
        self.credit_limit_field.setStyleSheet(self.name_field.styleSheet())
        form_layout.addRow("Credit Limit", self.credit_limit_field)
        
        self.opening_balance_field = QDoubleSpinBox()
        self.opening_balance_field.setMaximum(999999999)
        self.opening_balance_field.setPrefix("₹ ")
        self.opening_balance_field.setMinimumHeight(50)
        if self.party:
            self.opening_balance_field.setValue(self.party.get('opening_balance', 0))
        self.opening_balance_field.setStyleSheet(self.name_field.styleSheet())
        form_layout.addRow("Opening Balance", self.opening_balance_field)
        
        form_widget.setLayout(form_layout)
        scroll.setWidget(form_widget)
        layout.addWidget(scroll)
        
        # Buttons
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
        
        save_btn = QPushButton("💾 Save" if self.party else "➕ Create")
        save_btn.setMinimumHeight(50)
        save_btn.setMinimumWidth(150)
        save_btn.setCursor(Qt.CursorShape.PointingHandCursor)
        save_btn.setStyleSheet("""
            QPushButton {
                background: qlineargradient(x1:0, y1:0, x2:1, y2:0,
                    stop:0 #4CAF50, stop:1 #45A049);
                color: white;
                border: none;
                border-radius: 10px;
                font-weight: 600;
                font-size: 14px;
            }
            QPushButton:hover {
                background: qlineargradient(x1:0, y1:0, x2:1, y2:0,
                    stop:0 #45A049, stop:1 #388E3C);
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
            QMessageBox.warning(self, "Validation Error", "Party name is required")
            return
        
        try:
            if self.party:
                # Update
                self.db.execute("""
                    UPDATE parties SET 
                        name=?, type=?, address=?, city=?, state=?, pincode=?, 
                        contact=?, email=?, gstin=?, pan=?, credit_limit=?, opening_balance=?
                    WHERE id=?
                """, (
                    self.name_field.text().strip(),
                    self.type_field.currentText(),
                    self.address_field.text(),
                    self.city_field.text(),
                    self.state_field.text(),
                    self.pincode_field.text(),
                    self.contact_field.text(),
                    self.email_field.text(),
                    self.gstin_field.text(),
                    self.pan_field.text(),
                    self.credit_limit_field.value(),
                    self.opening_balance_field.value(),
                    self.party['id']
                ))
                QMessageBox.information(self, "Success", "✅ Party updated successfully!")
            else:
                # Create
                self.db.execute("""
                    INSERT INTO parties 
                    (name, type, address, city, state, pincode, contact, email, gstin, pan, credit_limit, opening_balance)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """, (
                    self.name_field.text().strip(),
                    self.type_field.currentText(),
                    self.address_field.text(),
                    self.city_field.text(),
                    self.state_field.text(),
                    self.pincode_field.text(),
                    self.contact_field.text(),
                    self.email_field.text(),
                    self.gstin_field.text(),
                    self.pan_field.text(),
                    self.credit_limit_field.value(),
                    self.opening_balance_field.value()
                ))
                QMessageBox.information(self, "Success", "✅ Party created successfully!")
            
            self.db.commit()
            super().accept()
        except Exception as ex:
            QMessageBox.critical(self, "Error", f"❌ Error saving party: {str(ex)}")
