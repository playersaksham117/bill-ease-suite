"""Income & Expense Screen - PySide6"""
from PySide6.QtWidgets import QWidget, QVBoxLayout, QLabel
from PySide6.QtCore import Qt


class IncomeExpenseScreen(QWidget):
    def __init__(self, db, user, company=None):
        super().__init__()
        self.db = db
        self.user = user
        self.company = company
        self.init_ui()
    
    def init_ui(self):
        layout = QVBoxLayout()
        label = QLabel("Income & Expense Management\n\nThis module is under development.")
        label.setAlignment(Qt.AlignmentFlag.AlignCenter)
        label.setStyleSheet("font-size: 18px; color: #757575;")
        layout.addWidget(label)
        self.setLayout(layout)
