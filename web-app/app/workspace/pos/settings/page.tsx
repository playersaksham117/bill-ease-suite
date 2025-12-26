"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Settings,
  Save,
  CheckCircle2,
  Store,
  Receipt,
  Printer,
  Keyboard,
  Bell,
  Shield,
  FileText,
  Palette,
  IndianRupee,
  Calculator,
  Package,
  Clock,
  RotateCcw,
  ChevronRight,
  Monitor,
  Volume2,
  Zap,
  Mail,
} from "lucide-react";

// Settings sections
interface SettingsSection {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

const settingsSections: SettingsSection[] = [
  { id: "general", title: "General", description: "Store info and basic settings", icon: Store },
  { id: "billing", title: "Billing", description: "Invoice and tax settings", icon: Receipt },
  { id: "display", title: "Display", description: "Screen and UI preferences", icon: Monitor },
  { id: "receipt", title: "Receipt", description: "Receipt format and content", icon: FileText },
  { id: "notifications", title: "Notifications", description: "Alerts and sounds", icon: Bell },
  { id: "shortcuts", title: "Keyboard Shortcuts", description: "Customize hotkeys", icon: Keyboard },
  { id: "security", title: "Security", description: "Access and permissions", icon: Shield },
];

export default function POSSettingsPage() {
  const [activeSection, setActiveSection] = useState("general");
  const [showSuccess, setShowSuccess] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Settings state
  const [settings, setSettings] = useState({
    // General
    storeName: "BillEase Mart",
    storeAddress: "123 Main Street, Mumbai, Maharashtra - 400001",
    storePhone: "+91 22 1234 5678",
    storeEmail: "contact@billease.com",
    storeGSTIN: "27AAAAA0000A1Z5",
    storeLogo: "",
    currency: "INR",
    currencySymbol: "₹",
    decimalPlaces: "2",
    roundingMethod: "nearest",

    // Billing
    invoicePrefix: "INV",
    invoiceStartNumber: "1001",
    enableGST: true,
    defaultGSTRate: "18",
    enableDiscount: true,
    maxDiscountPercent: "50",
    enableHoldBill: true,
    holdBillTimeout: "60",
    autoApplyLoyalty: false,
    requireCustomer: false,
    allowNegativeStock: false,
    lowStockThreshold: "10",

    // Display
    productsPerPage: "20",
    showProductImages: true,
    showProductSKU: true,
    showStockCount: true,
    enableDarkMode: false,
    fontSize: "medium",
    gridColumns: "4",
    touchOptimized: true,
    fullscreenMode: false,

    // Receipt
    printReceipt: true,
    printLogo: true,
    receiptHeader: "Thank you for shopping with us!",
    receiptFooter: "Visit again! | Returns within 7 days",
    showGSTBreakdown: true,
    showSavings: true,
    receiptCopies: "1",
    paperWidth: "80",
    autoOpenDrawer: true,

    // Notifications
    enableSounds: true,
    newSaleSound: true,
    lowStockAlert: true,
    errorSound: true,
    emailReceipt: false,
    smsReceipt: false,

    // Keyboard shortcuts
    searchShortcut: "F1",
    barcodeShortcut: "F2",
    payShortcut: "F3",
    clearShortcut: "F4",
    holdShortcut: "F5",
    discountShortcut: "F6",
    customerShortcut: "F7",
    settingsShortcut: "F12",

    // Security
    requirePinForDiscount: true,
    requirePinForVoid: true,
    requirePinForRefund: true,
    autoLogoutMinutes: "30",
    allowPriceOverride: false,
    trackCashierLogin: true,
  });

  // Update setting
  const updateSetting = (key: string, value: string | boolean) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  // Save settings
  const saveSettings = () => {
    setShowSuccess(true);
    setHasChanges(false);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  // Reset to defaults
  const resetDefaults = () => {
    // This would reset to default values
    setHasChanges(true);
  };

  // Render setting input
  const renderInput = (
    label: string,
    key: string,
    type: "text" | "number" | "select" | "toggle" | "textarea" = "text",
    options?: { value: string; label: string }[],
    description?: string
  ) => {
    const value = settings[key as keyof typeof settings];

    return (
      <div className="py-4 border-b border-border last:border-0">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <label className="font-medium">{label}</label>
            {description && (
              <p className="text-sm text-muted-foreground mt-0.5">{description}</p>
            )}
          </div>
          <div className="w-64">
            {type === "toggle" ? (
              <button
                onClick={() => updateSetting(key, !value)}
                className={`relative w-14 h-7 rounded-full transition-colors ${
                  value ? "bg-primary" : "bg-muted"
                }`}
              >
                <span
                  className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow transition-all ${
                    value ? "left-8" : "left-1"
                  }`}
                />
              </button>
            ) : type === "select" ? (
              <select
                value={value as string}
                onChange={(e) => updateSetting(key, e.target.value)}
                className="w-full h-10 px-3 bg-background border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {options?.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            ) : type === "textarea" ? (
              <textarea
                value={value as string}
                onChange={(e) => updateSetting(key, e.target.value)}
                rows={2}
                className="w-full px-3 py-2 bg-background border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              />
            ) : (
              <input
                type={type}
                value={value as string}
                onChange={(e) => updateSetting(key, e.target.value)}
                className="w-full h-10 px-3 bg-background border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            )}
          </div>
        </div>
      </div>
    );
  };

  // Render active section content
  const renderSectionContent = () => {
    switch (activeSection) {
      case "general":
        return (
          <div>
            <h3 className="text-lg font-bold mb-4">Store Information</h3>
            {renderInput("Store Name", "storeName", "text", undefined, "Your business name displayed on receipts")}
            {renderInput("Store Address", "storeAddress", "textarea")}
            {renderInput("Phone Number", "storePhone")}
            {renderInput("Email", "storeEmail")}
            {renderInput("GSTIN", "storeGSTIN", "text", undefined, "GST Identification Number")}
            
            <h3 className="text-lg font-bold mt-8 mb-4">Currency Settings</h3>
            {renderInput("Currency", "currency", "select", [
              { value: "INR", label: "Indian Rupee (INR)" },
              { value: "USD", label: "US Dollar (USD)" },
              { value: "EUR", label: "Euro (EUR)" },
            ])}
            {renderInput("Currency Symbol", "currencySymbol")}
            {renderInput("Decimal Places", "decimalPlaces", "select", [
              { value: "0", label: "0 (No decimals)" },
              { value: "2", label: "2 (Standard)" },
            ])}
            {renderInput("Rounding Method", "roundingMethod", "select", [
              { value: "nearest", label: "Round to nearest" },
              { value: "up", label: "Always round up" },
              { value: "down", label: "Always round down" },
            ])}
          </div>
        );

      case "billing":
        return (
          <div>
            <h3 className="text-lg font-bold mb-4">Invoice Settings</h3>
            {renderInput("Invoice Prefix", "invoicePrefix", "text", undefined, "Prefix added to invoice numbers")}
            {renderInput("Starting Number", "invoiceStartNumber", "number")}
            
            <h3 className="text-lg font-bold mt-8 mb-4">Tax Settings</h3>
            {renderInput("Enable GST", "enableGST", "toggle")}
            {renderInput("Default GST Rate (%)", "defaultGSTRate", "select", [
              { value: "0", label: "0% (Exempt)" },
              { value: "5", label: "5%" },
              { value: "12", label: "12%" },
              { value: "18", label: "18%" },
              { value: "28", label: "28%" },
            ])}
            
            <h3 className="text-lg font-bold mt-8 mb-4">Discount & Hold</h3>
            {renderInput("Enable Discounts", "enableDiscount", "toggle")}
            {renderInput("Max Discount (%)", "maxDiscountPercent", "number")}
            {renderInput("Enable Hold Bill", "enableHoldBill", "toggle")}
            {renderInput("Hold Timeout (minutes)", "holdBillTimeout", "number", undefined, "Auto-clear held bills after this time")}
            
            <h3 className="text-lg font-bold mt-8 mb-4">Customer & Stock</h3>
            {renderInput("Auto Apply Loyalty Points", "autoApplyLoyalty", "toggle")}
            {renderInput("Require Customer for Sale", "requireCustomer", "toggle")}
            {renderInput("Allow Negative Stock", "allowNegativeStock", "toggle")}
            {renderInput("Low Stock Threshold", "lowStockThreshold", "number")}
          </div>
        );

      case "display":
        return (
          <div>
            <h3 className="text-lg font-bold mb-4">Product Display</h3>
            {renderInput("Products Per Page", "productsPerPage", "select", [
              { value: "12", label: "12" },
              { value: "20", label: "20" },
              { value: "28", label: "28" },
              { value: "36", label: "36" },
            ])}
            {renderInput("Grid Columns", "gridColumns", "select", [
              { value: "3", label: "3 columns" },
              { value: "4", label: "4 columns" },
              { value: "5", label: "5 columns" },
              { value: "6", label: "6 columns" },
            ])}
            {renderInput("Show Product Images", "showProductImages", "toggle")}
            {renderInput("Show Product SKU", "showProductSKU", "toggle")}
            {renderInput("Show Stock Count", "showStockCount", "toggle")}
            
            <h3 className="text-lg font-bold mt-8 mb-4">Interface</h3>
            {renderInput("Font Size", "fontSize", "select", [
              { value: "small", label: "Small" },
              { value: "medium", label: "Medium" },
              { value: "large", label: "Large" },
            ])}
            {renderInput("Touch Optimized Mode", "touchOptimized", "toggle", undefined, "Larger buttons for touch screens")}
            {renderInput("Fullscreen Mode", "fullscreenMode", "toggle")}
          </div>
        );

      case "receipt":
        return (
          <div>
            <h3 className="text-lg font-bold mb-4">Print Settings</h3>
            {renderInput("Auto Print Receipt", "printReceipt", "toggle")}
            {renderInput("Print Store Logo", "printLogo", "toggle")}
            {renderInput("Receipt Copies", "receiptCopies", "select", [
              { value: "1", label: "1 copy" },
              { value: "2", label: "2 copies" },
              { value: "3", label: "3 copies" },
            ])}
            {renderInput("Paper Width", "paperWidth", "select", [
              { value: "58", label: "58mm (2.25 inch)" },
              { value: "80", label: "80mm (3 inch)" },
            ])}
            {renderInput("Auto Open Cash Drawer", "autoOpenDrawer", "toggle")}
            
            <h3 className="text-lg font-bold mt-8 mb-4">Receipt Content</h3>
            {renderInput("Header Message", "receiptHeader", "textarea")}
            {renderInput("Footer Message", "receiptFooter", "textarea")}
            {renderInput("Show GST Breakdown", "showGSTBreakdown", "toggle")}
            {renderInput("Show Customer Savings", "showSavings", "toggle")}
          </div>
        );

      case "notifications":
        return (
          <div>
            <h3 className="text-lg font-bold mb-4">Sound Alerts</h3>
            {renderInput("Enable Sounds", "enableSounds", "toggle")}
            {renderInput("New Sale Sound", "newSaleSound", "toggle")}
            {renderInput("Low Stock Alert Sound", "lowStockAlert", "toggle")}
            {renderInput("Error Sound", "errorSound", "toggle")}
            
            <h3 className="text-lg font-bold mt-8 mb-4">Digital Receipt</h3>
            {renderInput("Email Receipt Option", "emailReceipt", "toggle", undefined, "Show email receipt option at checkout")}
            {renderInput("SMS Receipt Option", "smsReceipt", "toggle", undefined, "Show SMS receipt option at checkout")}
          </div>
        );

      case "shortcuts":
        return (
          <div>
            <h3 className="text-lg font-bold mb-4">Keyboard Shortcuts</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Customize keyboard shortcuts for quick access to common actions.
            </p>
            {renderInput("Search Products", "searchShortcut", "select", [
              { value: "F1", label: "F1" },
              { value: "F2", label: "F2" },
              { value: "Ctrl+F", label: "Ctrl+F" },
            ])}
            {renderInput("Barcode Scanner", "barcodeShortcut", "select", [
              { value: "F2", label: "F2" },
              { value: "F3", label: "F3" },
              { value: "Ctrl+B", label: "Ctrl+B" },
            ])}
            {renderInput("Process Payment", "payShortcut", "select", [
              { value: "F3", label: "F3" },
              { value: "F9", label: "F9" },
              { value: "Enter", label: "Enter" },
            ])}
            {renderInput("Clear Bill", "clearShortcut", "select", [
              { value: "F4", label: "F4" },
              { value: "Esc", label: "Escape" },
              { value: "Ctrl+C", label: "Ctrl+C" },
            ])}
            {renderInput("Hold Bill", "holdShortcut", "select", [
              { value: "F5", label: "F5" },
              { value: "F6", label: "F6" },
              { value: "Ctrl+H", label: "Ctrl+H" },
            ])}
            {renderInput("Apply Discount", "discountShortcut", "select", [
              { value: "F6", label: "F6" },
              { value: "F7", label: "F7" },
              { value: "Ctrl+D", label: "Ctrl+D" },
            ])}
            {renderInput("Select Customer", "customerShortcut", "select", [
              { value: "F7", label: "F7" },
              { value: "F8", label: "F8" },
              { value: "Ctrl+U", label: "Ctrl+U" },
            ])}
            {renderInput("Open Settings", "settingsShortcut", "select", [
              { value: "F12", label: "F12" },
              { value: "Ctrl+,", label: "Ctrl+," },
            ])}
          </div>
        );

      case "security":
        return (
          <div>
            <h3 className="text-lg font-bold mb-4">PIN Requirements</h3>
            {renderInput("Require PIN for Discount", "requirePinForDiscount", "toggle", undefined, "Manager approval for discounts")}
            {renderInput("Require PIN for Void", "requirePinForVoid", "toggle", undefined, "Manager approval to void items")}
            {renderInput("Require PIN for Refund", "requirePinForRefund", "toggle", undefined, "Manager approval for refunds")}
            
            <h3 className="text-lg font-bold mt-8 mb-4">Access Control</h3>
            {renderInput("Allow Price Override", "allowPriceOverride", "toggle", undefined, "Allow cashiers to change prices")}
            {renderInput("Auto Logout (minutes)", "autoLogoutMinutes", "select", [
              { value: "0", label: "Never" },
              { value: "15", label: "15 minutes" },
              { value: "30", label: "30 minutes" },
              { value: "60", label: "1 hour" },
            ])}
            {renderInput("Track Cashier Login", "trackCashierLogin", "toggle", undefined, "Log all cashier sessions")}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0 h-14 bg-card border-b border-border flex items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <Settings className="w-5 h-5 text-primary" />
          <h1 className="text-lg font-bold">POS Settings</h1>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={resetDefaults}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-sm font-medium hover:bg-muted transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            Reset Defaults
          </button>
          <button
            onClick={saveSettings}
            disabled={!hasChanges}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            Save Changes
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <div className="w-72 flex-shrink-0 bg-card border-r border-border overflow-y-auto">
          <nav className="p-4 space-y-1">
            {settingsSections.map((section) => {
              const Icon = section.icon;
              const isActive = activeSection === section.id;

              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all ${
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "hover:bg-muted text-foreground"
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? "text-primary" : "text-muted-foreground"}`} />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium">{section.title}</div>
                    <div className="text-xs text-muted-foreground truncate">
                      {section.description}
                    </div>
                  </div>
                  <ChevronRight className={`w-4 h-4 ${isActive ? "text-primary" : "text-muted-foreground"}`} />
                </button>
              );
            })}
          </nav>
        </div>

        {/* Settings Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-3xl p-8">
            {renderSectionContent()}
          </div>
        </div>
      </div>

      {/* Unsaved Changes Indicator */}
      <AnimatePresence>
        {hasChanges && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 px-6 py-4 bg-warning rounded-xl shadow-lg flex items-center gap-3"
          >
            <span className="text-warning-foreground font-medium">
              You have unsaved changes
            </span>
            <button
              onClick={saveSettings}
              className="px-4 py-1.5 bg-white text-warning rounded-lg font-medium text-sm hover:bg-white/90 transition-colors"
            >
              Save Now
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success Toast */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 px-6 py-4 bg-success rounded-xl shadow-lg flex items-center gap-3"
          >
            <CheckCircle2 className="w-6 h-6 text-white" />
            <span className="text-white font-medium">Settings saved successfully!</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
