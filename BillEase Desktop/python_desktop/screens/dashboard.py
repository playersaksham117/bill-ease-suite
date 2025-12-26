"""
Dashboard Screen for BillEase Suite Desktop - PySide6
Modern UI/UX Design
"""
from PySide6.QtWidgets import (
    QWidget, QVBoxLayout, QHBoxLayout, QLabel, QPushButton, 
    QFrame, QScrollArea, QGridLayout, QStackedWidget, QSizePolicy
)
from PySide6.QtCore import Qt, Signal, QSize
from PySide6.QtGui import QFont, QIcon, QPainter, QLinearGradient, QBrush, QColor


class DashboardScreen(QWidget):
    logout_requested = Signal()
    company_change_requested = Signal()
    module_selected = Signal(str)
    
    def __init__(self, db, user, company, on_logout, on_company_change):
        super().__init__()
        self.db = db
        self.user = user
        self.company = company
        self.on_logout = on_logout
        self.on_company_change = on_company_change
        
        # Connect signals
        self.logout_requested.connect(on_logout)
        self.company_change_requested.connect(on_company_change)
        
        self.current_module = None
        self.init_ui()
    
    def init_ui(self):
        """Initialize UI"""
        main_layout = QHBoxLayout()
        main_layout.setContentsMargins(0, 0, 0, 0)
        main_layout.setSpacing(0)
        
        # Sidebar
        sidebar = self.create_sidebar()
        main_layout.addWidget(sidebar)
        
        # Main content area
        self.content_area = QStackedWidget()
        self.content_area.setStyleSheet("background-color: #FAFAFA;")
        
        # Dashboard view
        self.dashboard_view = self.create_dashboard_view()
        self.content_area.addWidget(self.dashboard_view)
        
        main_layout.addWidget(self.content_area, stretch=1)
        
        self.setLayout(main_layout)
    
    def create_sidebar(self):
        """Create modern sidebar navigation"""
        sidebar = QFrame()
        sidebar.setFixedWidth(280)
        sidebar.setStyleSheet("""
            QFrame {
                background: qlineargradient(x1:0, y1:0, x2:0, y2:1,
                    stop:0 #263238, stop:1 #212121);
                border-right: none;
            }
        """)
        
        layout = QVBoxLayout()
        layout.setContentsMargins(0, 0, 0, 0)
        layout.setSpacing(0)
        
        # Logo/Title section
        title_frame = QFrame()
        title_frame.setStyleSheet("""
            QFrame {
                background-color: rgba(25, 118, 210, 0.1);
                padding: 25px 20px;
                border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            }
        """)
        title_layout = QHBoxLayout()
        title_layout.setContentsMargins(15, 15, 15, 15)
        
        icon_label = QLabel("💼")
        icon_label.setStyleSheet("font-size: 24px;")
        title_layout.addWidget(icon_label)
        
        title = QLabel("BillEase")
        title_font = QFont()
        title_font.setPointSize(20)
        title_font.setBold(True)
        title.setFont(title_font)
        title.setStyleSheet("color: white;")
        title_layout.addWidget(title)
        
        title_frame.setLayout(title_layout)
        layout.addWidget(title_frame)
        
        # Navigation items
        nav_items = [
            ("📊 Dashboard", "dashboard", self.show_dashboard_view),
            ("🏢 Companies", "companies", lambda: self.show_module("companies")),
            ("👥 Parties", "parties", lambda: self.show_module("parties")),
            ("📦 Items", "items", lambda: self.show_module("items")),
            ("🛒 POS", "pos", lambda: self.show_module("pos")),
            ("🧾 Sales", "sales", lambda: self.show_module("sales")),
            ("📥 Purchases", "purchases", lambda: self.show_module("purchases")),
            ("📊 Inventory", "inventory", lambda: self.show_module("inventory")),
            ("🤝 CRM", "crm", lambda: self.show_module("crm")),
            ("💰 Income & Expense", "income_expense", lambda: self.show_module("income_expense")),
            ("📈 Accounts+", "accounts", lambda: self.show_module("accounts")),
            ("📋 Reports", "reports", lambda: self.show_module("reports")),
            ("💼 Payroll", "payroll", lambda: self.show_module("payroll")),
            ("🧾 GST", "gst", lambda: self.show_module("gst")),
            ("🏦 Bank Reconciliation", "bank_reconciliation", lambda: self.show_module("bank_reconciliation")),
        ]
        
        nav_scroll = QScrollArea()
        nav_scroll.setWidgetResizable(True)
        nav_scroll.setStyleSheet("border: none; background: transparent;")
        
        nav_widget = QWidget()
        nav_layout = QVBoxLayout()
        nav_layout.setContentsMargins(0, 10, 0, 10)
        nav_layout.setSpacing(3)
        
        for label, module_id, callback in nav_items:
            nav_item = self.create_nav_item(label, callback)
            nav_layout.addWidget(nav_item)
        
        nav_widget.setLayout(nav_layout)
        nav_scroll.setWidget(nav_widget)
        layout.addWidget(nav_scroll)
        
        layout.addStretch()
        
        # User info section
        user_frame = QFrame()
        user_frame.setStyleSheet("""
            QFrame {
                background-color: rgba(0, 0, 0, 0.2);
                padding: 20px;
                border-top: 1px solid rgba(255, 255, 255, 0.1);
            }
        """)
        user_layout = QVBoxLayout()
        user_layout.setSpacing(10)
        
        user_label = QLabel(f"👤 {self.user.get('username', 'User')}")
        user_label.setStyleSheet("color: white; font-size: 14px; font-weight: 600;")
        user_layout.addWidget(user_label)
        
        if self.company:
            company_label = QLabel(f"🏢 {self.company.get('name', 'No Company')}")
            company_label.setStyleSheet("color: #81C784; font-size: 12px; font-weight: 500;")
            company_label.setWordWrap(True)
            user_layout.addWidget(company_label)
            
            change_company_btn = QPushButton("🔄 Change Company")
            change_company_btn.setCursor(Qt.CursorShape.PointingHandCursor)
            change_company_btn.setStyleSheet("""
                QPushButton {
                    background-color: rgba(25, 118, 210, 0.3);
                    color: white;
                    border: 1px solid rgba(25, 118, 210, 0.5);
                    padding: 8px;
                    border-radius: 6px;
                    font-size: 12px;
                    font-weight: 500;
                }
                QPushButton:hover {
                    background-color: rgba(25, 118, 210, 0.5);
                }
            """)
            change_company_btn.clicked.connect(self.company_change_requested.emit)
            user_layout.addWidget(change_company_btn)
        
        user_frame.setLayout(user_layout)
        layout.addWidget(user_frame)
        
        logout_btn = QPushButton("🚪 Logout")
        logout_btn.setCursor(Qt.CursorShape.PointingHandCursor)
        logout_btn.setStyleSheet("""
            QPushButton {
                background-color: rgba(211, 47, 47, 0.3);
                color: white;
                padding: 12px;
                border: none;
                border-radius: 0;
                font-weight: 600;
                font-size: 14px;
            }
            QPushButton:hover {
                background-color: rgba(211, 47, 47, 0.5);
            }
        """)
        logout_btn.clicked.connect(self.logout_requested.emit)
        layout.addWidget(logout_btn)
        
        sidebar.setLayout(layout)
        return sidebar
    
    def create_nav_item(self, label, callback):
        """Create modern navigation item"""
        item = QPushButton(label)
        item.setCursor(Qt.CursorShape.PointingHandCursor)
        item.setStyleSheet("""
            QPushButton {
                text-align: left;
                padding: 14px 20px;
                border: none;
                background-color: transparent;
                font-size: 14px;
                color: rgba(255, 255, 255, 0.8);
                font-weight: 500;
            }
            QPushButton:hover {
                background-color: rgba(255, 255, 255, 0.1);
                color: white;
            }
        """)
        item.clicked.connect(callback)
        return item
    
    def create_dashboard_view(self):
        """Create modern dashboard view with statistics"""
        widget = QWidget()
        layout = QVBoxLayout()
        layout.setContentsMargins(30, 30, 30, 30)
        layout.setSpacing(25)
        
        # Header
        header_layout = QHBoxLayout()
        
        title_layout = QVBoxLayout()
        title_layout.setSpacing(5)
        
        welcome_label = QLabel(f"Welcome back, {self.user.get('username', 'User')}! 👋")
        welcome_font = QFont()
        welcome_font.setPointSize(32)
        welcome_font.setBold(True)
        welcome_label.setFont(welcome_font)
        welcome_label.setStyleSheet("color: #212121;")
        title_layout.addWidget(welcome_label)
        
        if self.company:
            company_label = QLabel(f"🏢 {self.company.get('name', 'No Company')}")
            company_font = QFont()
            company_font.setPointSize(20)
            company_font.setBold(True)
            company_label.setFont(company_font)
            company_label.setStyleSheet("color: #1976D2;")
            title_layout.addWidget(company_label)
            
            location = f"{self.company.get('city', '')}, {self.company.get('state', '')}"
            if location.strip() != ",":
                location_label = QLabel(location)
                location_label.setStyleSheet("color: #757575; font-size: 14px;")
                title_layout.addWidget(location_label)
        
        header_layout.addLayout(title_layout)
        header_layout.addStretch()
        
        refresh_btn = QPushButton("🔄 Refresh")
        refresh_btn.setCursor(Qt.CursorShape.PointingHandCursor)
        refresh_btn.setStyleSheet("""
            QPushButton {
                background-color: white;
                color: #1976D2;
                border: 2px solid #1976D2;
                padding: 10px 20px;
                border-radius: 8px;
                font-weight: 600;
            }
            QPushButton:hover {
                background-color: #E3F2FD;
            }
        """)
        refresh_btn.clicked.connect(self.refresh_data)
        header_layout.addWidget(refresh_btn)
        
        layout.addLayout(header_layout)
        
        # Statistics cards with modern design
        stats_layout = QGridLayout()
        stats_layout.setSpacing(20)
        
        stats = self.get_statistics()
        
        stat_cards = [
            ("👥 Total Parties", str(stats['parties']), "#4CAF50", "linear-gradient(135deg, #4CAF50 0%, #45A049 100%)"),
            ("📦 Total Items", str(stats['items']), "#9C27B0", "linear-gradient(135deg, #9C27B0 0%, #7B1FA2 100%)"),
            ("💰 Total Sales", f"₹{stats['sales']:,.2f}", "#2196F3", "linear-gradient(135deg, #2196F3 0%, #1976D2 100%)"),
            ("📈 Total Income", f"₹{stats['income']:,.2f}", "#4CAF50", "linear-gradient(135deg, #66BB6A 0%, #4CAF50 100%)"),
            ("📉 Total Expenses", f"₹{stats['expenses']:,.2f}", "#F44336", "linear-gradient(135deg, #EF5350 0%, #E53935 100%)"),
            ("⏳ Pending Invoices", str(stats['pending']), "#FF9800", "linear-gradient(135deg, #FF9800 0%, #F57C00 100%)"),
        ]
        
        row = 0
        col = 0
        for title, value, color, gradient in stat_cards:
            card = self.create_stat_card(title, value, color, gradient)
            stats_layout.addWidget(card, row, col)
            col += 1
            if col >= 3:
                col = 0
                row += 1
        
        layout.addLayout(stats_layout)
        
        # Module cards section
        modules_header = QHBoxLayout()
        modules_title = QLabel("Quick Access Modules")
        modules_font = QFont()
        modules_font.setPointSize(24)
        modules_font.setBold(True)
        modules_title.setFont(modules_font)
        modules_title.setStyleSheet("color: #212121;")
        modules_header.addWidget(modules_title)
        modules_header.addStretch()
        layout.addLayout(modules_header)
        
        modules_grid = QGridLayout()
        modules_grid.setSpacing(20)
        
        module_cards = [
            ("🏢 Companies", "Manage company information", "#2196F3"),
            ("👥 Parties", "Customers & Suppliers", "#4CAF50"),
            ("📦 Items Master", "Product & Item management", "#9C27B0"),
            ("🛒 BillEase POS", "Point of Sale system", "#2196F3"),
            ("🧾 Sales", "Sales invoices & management", "#FF9800"),
            ("📥 Purchases", "Purchase orders", "#FF9800"),
            ("📊 Inventory", "Stock management", "#9C27B0"),
            ("🤝 CRM", "Customer relationship management", "#2196F3"),
            ("💰 Income & Expense", "Financial transactions", "#4CAF50"),
            ("📈 Accounts+", "Accounting & ledgers", "#2196F3"),
            ("📋 Reports", "Business reports", "#607D8B"),
            ("💼 Payroll", "Employee payroll", "#795548"),
            ("🧾 GST", "GST management", "#F44336"),
            ("🏦 Bank Reconciliation", "Bank transaction reconciliation", "#2196F3"),
        ]
        
        row = 0
        col = 0
        for title, desc, color in module_cards:
            module_id = title.lower().replace(' ', '_').replace('&', '').replace('+', 'plus').replace('🏢', '').replace('👥', '').replace('📦', '').replace('🛒', '').replace('🧾', '').replace('📥', '').replace('📊', '').replace('🤝', '').replace('💰', '').replace('📈', '').replace('📋', '').replace('💼', '').replace('🏦', '').strip()
            if 'billEase_pos' in module_id or 'pos' in module_id:
                module_id = 'pos'
            card = self.create_module_card(title, desc, color, lambda checked, mid=module_id: self.show_module(mid))
            modules_grid.addWidget(card, row, col)
            col += 1
            if col >= 4:
                col = 0
                row += 1
        
        layout.addLayout(modules_grid)
        layout.addStretch()
        
        widget.setLayout(layout)
        
        # Scroll area
        scroll = QScrollArea()
        scroll.setWidget(widget)
        scroll.setWidgetResizable(True)
        scroll.setStyleSheet("border: none; background: transparent;")
        
        return scroll
    
    def create_stat_card(self, title, value, color, gradient):
        """Create modern statistics card"""
        card = QFrame()
        card.setFixedHeight(140)
        card.setCursor(Qt.CursorShape.PointingHandCursor)
        card.setStyleSheet(f"""
            QFrame {{
                background-color: white;
                border-radius: 16px;
                padding: 20px;
                border: 1px solid #E0E0E0;
            }}
            QFrame:hover {{
                border: 2px solid {color};
                transform: translateY(-2px);
            }}
        """)
        
        layout = QVBoxLayout()
        layout.setSpacing(10)
        
        title_label = QLabel(title)
        title_label.setStyleSheet(f"color: {color}; font-size: 13px; font-weight: 600;")
        layout.addWidget(title_label)
        
        value_label = QLabel(value)
        value_font = QFont()
        value_font.setPointSize(28)
        value_font.setBold(True)
        value_label.setFont(value_font)
        value_label.setStyleSheet(f"color: {color};")
        layout.addWidget(value_label)
        
        layout.addStretch()
        card.setLayout(layout)
        return card
    
    def create_module_card(self, title, description, color, callback):
        """Create modern module card"""
        card = QFrame()
        card.setFixedSize(300, 160)
        card.setCursor(Qt.CursorShape.PointingHandCursor)
        card.setStyleSheet(f"""
            QFrame {{
                background-color: white;
                border: 2px solid #E0E0E0;
                border-radius: 16px;
                padding: 20px;
            }}
            QFrame:hover {{
                border: 2px solid {color};
                background-color: #FAFAFA;
                transform: translateY(-4px);
            }}
        """)
        
        layout = QVBoxLayout()
        layout.setSpacing(8)
        
        title_label = QLabel(title)
        title_font = QFont()
        title_font.setPointSize(18)
        title_font.setBold(True)
        title_label.setFont(title_font)
        title_label.setStyleSheet(f"color: {color};")
        layout.addWidget(title_label)
        
        desc_label = QLabel(description)
        desc_label.setStyleSheet("color: #757575; font-size: 13px;")
        desc_label.setWordWrap(True)
        layout.addWidget(desc_label)
        
        layout.addStretch()
        card.setLayout(layout)
        
        # Make card clickable
        def mousePressEvent(event):
            callback()
            QFrame.mousePressEvent(card, event)
        card.mousePressEvent = mousePressEvent
        
        return card
    
    def get_statistics(self):
        """Get dashboard statistics"""
        company_id = self.company['id'] if self.company else None
        
        total_parties = len(self.db.fetchall(
            "SELECT * FROM parties WHERE company_id = ? OR company_id IS NULL", 
            (company_id,)
        ))
        total_items = len(self.db.fetchall(
            "SELECT * FROM items_master WHERE company_id = ? OR company_id IS NULL", 
            (company_id,)
        ))
        total_sales = self.db.fetchone(
            "SELECT COALESCE(SUM(grand_total), 0) as total FROM sales_invoices WHERE status != 'cancelled' AND (company_id = ? OR company_id IS NULL)", 
            (company_id,)
        ) or {'total': 0}
        total_expenses = self.db.fetchone(
            "SELECT COALESCE(SUM(amount), 0) as total FROM income_expense WHERE type = 'expense' AND (company_id = ? OR company_id IS NULL)", 
            (company_id,)
        ) or {'total': 0}
        total_income = self.db.fetchone(
            "SELECT COALESCE(SUM(amount), 0) as total FROM income_expense WHERE type = 'income' AND (company_id = ? OR company_id IS NULL)", 
            (company_id,)
        ) or {'total': 0}
        pending_invoices = len(self.db.fetchall(
            "SELECT * FROM sales_invoices WHERE status = 'confirmed' AND balance_amount > 0 AND (company_id = ? OR company_id IS NULL)", 
            (company_id,)
        ))
        
        return {
            'parties': total_parties,
            'items': total_items,
            'sales': total_sales['total'],
            'expenses': total_expenses['total'],
            'income': total_income['total'],
            'pending': pending_invoices,
        }
    
    def refresh_data(self):
        """Refresh dashboard data"""
        # Rebuild dashboard view
        self.content_area.removeWidget(self.dashboard_view)
        self.dashboard_view = self.create_dashboard_view()
        self.content_area.insertWidget(0, self.dashboard_view)
        self.content_area.setCurrentWidget(self.dashboard_view)
    
    def show_dashboard_view(self):
        """Show dashboard view"""
        self.content_area.setCurrentWidget(self.dashboard_view)
    
    def show_module(self, module_name):
        """Show module screen"""
        # Modules that require company setup
        modules_requiring_company = ["pos", "crm", "inventory", "income_expense"]
        
        if module_name in modules_requiring_company and not self.company:
            module_names = {
                "pos": "BillEase POS",
                "crm": "CRM",
                "inventory": "Inventory",
                "income_expense": "Income & Expense",
            }
            QMessageBox.warning(
                self,
                "Company Setup Required",
                f"Please set up your company/firm details before using {module_names.get(module_name, module_name)} module."
            )
            return
        
        # Import and show module screens
        try:
            if module_name == "companies":
                from screens.companies_screen import CompaniesScreen
                screen = CompaniesScreen(self.db, self.user)
            elif module_name == "parties":
                from screens.parties_screen import PartiesScreen
                screen = PartiesScreen(self.db, self.user)
            elif module_name == "items":
                from screens.items_screen import ItemsScreen
                screen = ItemsScreen(self.db, self.user)
            elif module_name == "pos":
                from screens.pos_screen import POSScreen
                screen = POSScreen(self.db, self.user, self.company)
            elif module_name == "sales":
                from screens.sales_screen import SalesScreen
                screen = SalesScreen(self.db, self.user)
            elif module_name == "purchases":
                from screens.purchases_screen import PurchasesScreen
                screen = PurchasesScreen(self.db, self.user)
            elif module_name == "inventory":
                from screens.inventory_screen import InventoryScreen
                screen = InventoryScreen(self.db, self.user, self.company)
            elif module_name == "crm":
                from screens.crm_screen import CRMScreen
                screen = CRMScreen(self.db, self.user, self.company)
            elif module_name == "income_expense":
                from screens.income_expense_screen import IncomeExpenseScreen
                screen = IncomeExpenseScreen(self.db, self.user, self.company)
            elif module_name == "accounts" or module_name == "accountsplus":
                from screens.accounts_screen import AccountsScreen
                screen = AccountsScreen(self.db, self.user)
            elif module_name == "reports":
                from screens.reports_screen import ReportsScreen
                screen = ReportsScreen(self.db, self.user)
            elif module_name == "payroll":
                from screens.payroll_screen import PayrollScreen
                screen = PayrollScreen(self.db, self.user)
            elif module_name == "gst":
                from screens.gst_screen import GSTScreen
                screen = GSTScreen(self.db, self.user)
            elif module_name == "bank_reconciliation":
                from screens.bank_reconciliation_screen import BankReconciliationScreen
                screen = BankReconciliationScreen(self.db, self.user)
            else:
                # Placeholder for unknown modules
                screen = QWidget()
                layout = QVBoxLayout()
                label = QLabel(f"{module_name.replace('_', ' ').title()} Module\n\nThis module is under development.")
                label.setAlignment(Qt.AlignmentFlag.AlignCenter)
                label.setStyleSheet("font-size: 18px; color: #757575;")
                layout.addWidget(label)
                screen.setLayout(layout)
            
            # Add to stacked widget
            self.content_area.addWidget(screen)
            self.content_area.setCurrentWidget(screen)
        except Exception as ex:
            QMessageBox.critical(
                self,
                "Error",
                f"Error loading {module_name} module: {str(ex)}"
            )
