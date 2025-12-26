"""
Items Master Management Screen - PySide6
Modern UI/UX Design
"""
from PySide6.QtWidgets import (
    QWidget, QVBoxLayout, QHBoxLayout, QLabel, QPushButton, 
    QTableWidget, QTableWidgetItem, QHeaderView, QMessageBox,
    QDialog, QFormLayout, QLineEdit, QDoubleSpinBox, QDialogButtonBox
)
from PySide6.QtCore import Qt
from PySide6.QtGui import QFont


class ItemsScreen(QWidget):
    def __init__(self, db, user):
        super().__init__()
        self.db = db
        self.user = user
        self.items = []
        self.selected_item = None
        self.init_ui()
        self.refresh_items()
    
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
        
        icon_label = QLabel("📦")
        icon_label.setStyleSheet("font-size: 28px;")
        title_layout.addWidget(icon_label)
        
        title = QLabel("Items Master")
        title_font = QFont()
        title_font.setPointSize(28)
        title_font.setBold(True)
        title.setFont(title_font)
        title.setStyleSheet("color: #9C27B0;")
        title_layout.addWidget(title)
        
        header_layout.addLayout(title_layout)
        header_layout.addStretch()
        
        add_btn = QPushButton("➕ Add Item")
        add_btn.setCursor(Qt.CursorShape.PointingHandCursor)
        add_btn.setMinimumHeight(45)
        add_btn.setStyleSheet("""
            QPushButton {
                background: qlineargradient(x1:0, y1:0, x2:1, y2:0,
                    stop:0 #9C27B0, stop:1 #7B1FA2);
                color: white;
                padding: 12px 24px;
                border-radius: 10px;
                font-weight: 600;
                font-size: 15px;
                border: none;
            }
            QPushButton:hover {
                background: qlineargradient(x1:0, y1:0, x2:1, y2:0,
                    stop:0 #7B1FA2, stop:1 #6A1B9A);
            }
        """)
        add_btn.clicked.connect(self.show_add_item_dialog)
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
        self.table.setColumnCount(9)
        self.table.setHorizontalHeaderLabels([
            "Code", "Name", "HSN", "UOM", "Rate", "Cost Price", "Stock", "Reorder Level", "Actions"
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
                background-color: #F3E5F5;
                color: #7B1FA2;
            }
            QHeaderView::section {
                background-color: #F5F5F5;
                padding: 12px;
                border: none;
                border-bottom: 2px solid #9C27B0;
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
    
    def refresh_items(self):
        """Refresh items list"""
        self.items = self.db.fetchall("SELECT * FROM items_master ORDER BY name")
        self.update_table()
    
    def update_table(self):
        """Update table with items data"""
        self.table.setRowCount(len(self.items))
        
        for row, item in enumerate(self.items):
            self.table.setItem(row, 0, QTableWidgetItem(item.get('code', '')))
            self.table.setItem(row, 1, QTableWidgetItem(item.get('name', '')))
            self.table.setItem(row, 2, QTableWidgetItem(item.get('hsn', '') or '-'))
            self.table.setItem(row, 3, QTableWidgetItem(item.get('uom', '') or '-'))
            self.table.setItem(row, 4, QTableWidgetItem(f"₹{item.get('rate', 0):,.2f}"))
            self.table.setItem(row, 5, QTableWidgetItem(f"₹{item.get('cost_price', 0):,.2f}"))
            
            # Calculate stock
            stock = self.calculate_stock(item['id'])
            stock_item = QTableWidgetItem(f"{stock:,.2f}")
            if stock < item.get('reorder_level', 0):
                stock_item.setForeground(QColor("#F44336"))  # Red for low stock
            self.table.setItem(row, 6, stock_item)
            
            self.table.setItem(row, 7, QTableWidgetItem(f"{item.get('reorder_level', 0):,.2f}"))
            
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
            edit_btn.clicked.connect(lambda checked, i=item: self.show_edit_item_dialog(i))
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
            delete_btn.clicked.connect(lambda checked, i=item: self.show_delete_confirm(i))
            actions_layout.addWidget(delete_btn)
            
            actions_widget.setLayout(actions_layout)
            self.table.setCellWidget(row, 8, actions_widget)
        
        self.table.resizeColumnsToContents()
    
    def calculate_stock(self, item_id):
        """Calculate current stock for item"""
        # Get opening stock
        item = self.db.fetchone("SELECT opening_stock FROM items_master WHERE id = ?", (item_id,))
        opening_stock = item.get('opening_stock', 0) if item else 0
        
        # Get sales (out)
        sales = self.db.fetchone("""
            SELECT COALESCE(SUM(quantity), 0) as total 
            FROM sales_invoice_items WHERE item_id = ?
        """, (item_id,)) or {'total': 0}
        
        # Get purchases (in)
        purchases = self.db.fetchone("""
            SELECT COALESCE(SUM(quantity), 0) as total 
            FROM purchase_order_items WHERE item_id = ?
        """, (item_id,)) or {'total': 0}
        
        # Get inventory adjustments
        adjustments = self.db.fetchone("""
            SELECT COALESCE(SUM(CASE WHEN transaction_type = 'in' THEN quantity ELSE -quantity END), 0) as total
            FROM inventory_transactions WHERE item_id = ?
        """, (item_id,)) or {'total': 0}
        
        return opening_stock + purchases['total'] - sales['total'] + adjustments['total']
    
    def show_add_item_dialog(self):
        """Show add item dialog"""
        dialog = ItemDialog(self, self.db)
        if dialog.exec() == QDialog.DialogCode.Accepted:
            self.refresh_items()
    
    def show_edit_item_dialog(self, item):
        """Show edit item dialog"""
        dialog = ItemDialog(self, self.db, item)
        if dialog.exec() == QDialog.DialogCode.Accepted:
            self.refresh_items()
    
    def show_delete_confirm(self, item):
        """Show delete confirmation"""
        reply = QMessageBox.question(
            self,
            "Confirm Delete",
            f"Are you sure you want to delete '{item.get('name', '')}'?\n\nThis action cannot be undone.",
            QMessageBox.StandardButton.Yes | QMessageBox.StandardButton.No,
            QMessageBox.StandardButton.No
        )
        
        if reply == QMessageBox.StandardButton.Yes:
            try:
                self.db.execute("DELETE FROM items_master WHERE id = ?", (item['id'],))
                self.db.commit()
                QMessageBox.information(self, "Success", "✅ Item deleted successfully")
                self.refresh_items()
            except Exception as ex:
                QMessageBox.critical(self, "Error", f"❌ Error deleting item: {str(ex)}")


class ItemDialog(QDialog):
    def __init__(self, parent, db, item=None):
        super().__init__(parent)
        self.db = db
        self.item = item
        self.setWindowTitle("Add Item" if not item else "Edit Item")
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
        header_label = QLabel("➕ Add Item" if not self.item else "✏️ Edit Item")
        header_font = QFont()
        header_font.setPointSize(24)
        header_font.setBold(True)
        header_label.setFont(header_font)
        header_label.setStyleSheet("color: #9C27B0; margin-bottom: 10px;")
        layout.addWidget(header_label)
        
        # Scroll area
        scroll = QScrollArea()
        scroll.setWidgetResizable(True)
        scroll.setStyleSheet("border: none; background: transparent;")
        
        form_widget = QWidget()
        form_layout = QFormLayout()
        form_layout.setSpacing(20)
        form_layout.setLabelAlignment(Qt.AlignmentFlag.AlignLeft)
        
        # Common field style
        field_style = """
            QLineEdit, QDoubleSpinBox {
                padding: 12px 16px;
                border: 2px solid #E0E0E0;
                border-radius: 10px;
                font-size: 14px;
                background-color: #FAFAFA;
            }
            QLineEdit:focus, QDoubleSpinBox:focus {
                border: 2px solid #9C27B0;
                background-color: white;
            }
        """
        
        # Code, Name
        self.code_field = QLineEdit()
        self.code_field.setPlaceholderText("Item code")
        self.code_field.setMinimumHeight(50)
        if self.item:
            self.code_field.setText(self.item.get('code', ''))
        self.code_field.setStyleSheet(field_style)
        form_layout.addRow("Code *", self.code_field)
        
        self.name_field = QLineEdit()
        self.name_field.setPlaceholderText("Item name")
        self.name_field.setMinimumHeight(50)
        if self.item:
            self.name_field.setText(self.item.get('name', ''))
        self.name_field.setStyleSheet(field_style)
        form_layout.addRow("Name *", self.name_field)
        
        # HSN, SAC, UOM
        hsn_sac_layout = QHBoxLayout()
        self.hsn_field = QLineEdit()
        self.hsn_field.setPlaceholderText("HSN")
        self.hsn_field.setMinimumHeight(50)
        if self.item:
            self.hsn_field.setText(self.item.get('hsn', ''))
        self.hsn_field.setStyleSheet(field_style)
        
        self.sac_field = QLineEdit()
        self.sac_field.setPlaceholderText("SAC")
        self.sac_field.setMinimumHeight(50)
        if self.item:
            self.sac_field.setText(self.item.get('sac', ''))
        self.sac_field.setStyleSheet(field_style)
        
        hsn_sac_layout.addWidget(self.hsn_field)
        hsn_sac_layout.addWidget(self.sac_field)
        form_layout.addRow("HSN / SAC", hsn_sac_layout)
        
        self.uom_field = QLineEdit()
        self.uom_field.setPlaceholderText("Unit of Measure")
        self.uom_field.setMinimumHeight(50)
        if self.item:
            self.uom_field.setText(self.item.get('uom', ''))
        self.uom_field.setStyleSheet(field_style)
        form_layout.addRow("UOM", self.uom_field)
        
        # Rate, Cost Price
        self.rate_field = QDoubleSpinBox()
        self.rate_field.setMaximum(999999999)
        self.rate_field.setPrefix("₹ ")
        self.rate_field.setMinimumHeight(50)
        if self.item:
            self.rate_field.setValue(self.item.get('rate', 0))
        self.rate_field.setStyleSheet(field_style)
        form_layout.addRow("Rate", self.rate_field)
        
        self.cost_price_field = QDoubleSpinBox()
        self.cost_price_field.setMaximum(999999999)
        self.cost_price_field.setPrefix("₹ ")
        self.cost_price_field.setMinimumHeight(50)
        if self.item:
            self.cost_price_field.setValue(self.item.get('cost_price', 0))
        self.cost_price_field.setStyleSheet(field_style)
        form_layout.addRow("Cost Price", self.cost_price_field)
        
        # Reorder Level, Category, Brand
        self.reorder_level_field = QDoubleSpinBox()
        self.reorder_level_field.setMaximum(999999999)
        self.reorder_level_field.setMinimumHeight(50)
        if self.item:
            self.reorder_level_field.setValue(self.item.get('reorder_level', 0))
        self.reorder_level_field.setStyleSheet(field_style)
        form_layout.addRow("Reorder Level", self.reorder_level_field)
        
        self.category_field = QLineEdit()
        self.category_field.setPlaceholderText("Category")
        self.category_field.setMinimumHeight(50)
        if self.item:
            self.category_field.setText(self.item.get('category', ''))
        self.category_field.setStyleSheet(field_style)
        form_layout.addRow("Category", self.category_field)
        
        self.brand_field = QLineEdit()
        self.brand_field.setPlaceholderText("Brand")
        self.brand_field.setMinimumHeight(50)
        if self.item:
            self.brand_field.setText(self.item.get('brand', ''))
        self.brand_field.setStyleSheet(field_style)
        form_layout.addRow("Brand", self.brand_field)
        
        # Opening Stock
        self.opening_stock_field = QDoubleSpinBox()
        self.opening_stock_field.setMaximum(999999999)
        self.opening_stock_field.setMinimumHeight(50)
        if self.item:
            self.opening_stock_field.setValue(self.item.get('opening_stock', 0))
        self.opening_stock_field.setStyleSheet(field_style)
        form_layout.addRow("Opening Stock", self.opening_stock_field)
        
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
        
        save_btn = QPushButton("💾 Save" if self.item else "➕ Create")
        save_btn.setMinimumHeight(50)
        save_btn.setMinimumWidth(150)
        save_btn.setCursor(Qt.CursorShape.PointingHandCursor)
        save_btn.setStyleSheet("""
            QPushButton {
                background: qlineargradient(x1:0, y1:0, x2:1, y2:0,
                    stop:0 #9C27B0, stop:1 #7B1FA2);
                color: white;
                border: none;
                border-radius: 10px;
                font-weight: 600;
                font-size: 14px;
            }
            QPushButton:hover {
                background: qlineargradient(x1:0, y1:0, x2:1, y2:0,
                    stop:0 #7B1FA2, stop:1 #6A1B9A);
            }
        """)
        save_btn.clicked.connect(self.accept)
        buttons_layout.addWidget(save_btn)
        
        layout.addLayout(buttons_layout)
        self.setLayout(layout)
        
        self.code_field.setFocus()
    
    def accept(self):
        """Handle accept"""
        if not self.code_field.text().strip() or not self.name_field.text().strip():
            QMessageBox.warning(self, "Validation Error", "Code and Name are required")
            return
        
        try:
            if self.item:
                # Update
                self.db.execute("""
                    UPDATE items_master SET 
                        code=?, name=?, hsn=?, sac=?, uom=?, rate=?, cost_price=?, 
                        reorder_level=?, category=?, brand=?, opening_stock=?
                    WHERE id=?
                """, (
                    self.code_field.text().strip(),
                    self.name_field.text().strip(),
                    self.hsn_field.text(),
                    self.sac_field.text(),
                    self.uom_field.text(),
                    self.rate_field.value(),
                    self.cost_price_field.value(),
                    self.reorder_level_field.value(),
                    self.category_field.text(),
                    self.brand_field.text(),
                    self.opening_stock_field.value(),
                    self.item['id']
                ))
                QMessageBox.information(self, "Success", "✅ Item updated successfully!")
            else:
                # Create
                self.db.execute("""
                    INSERT INTO items_master 
                    (code, name, hsn, sac, uom, rate, cost_price, reorder_level, category, brand, opening_stock)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """, (
                    self.code_field.text().strip(),
                    self.name_field.text().strip(),
                    self.hsn_field.text(),
                    self.sac_field.text(),
                    self.uom_field.text(),
                    self.rate_field.value(),
                    self.cost_price_field.value(),
                    self.reorder_level_field.value(),
                    self.category_field.text(),
                    self.brand_field.text(),
                    self.opening_stock_field.value()
                ))
                QMessageBox.information(self, "Success", "✅ Item created successfully!")
            
            self.db.commit()
            super().accept()
        except Exception as ex:
            QMessageBox.critical(self, "Error", f"❌ Error saving item: {str(ex)}")
