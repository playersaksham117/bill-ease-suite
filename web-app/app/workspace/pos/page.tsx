"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Barcode,
  Plus,
  Minus,
  Trash2,
  CreditCard,
  Banknote,
  Smartphone,
  QrCode,
  Printer,
  Receipt,
  FileText,
  User,
  Clock,
  Package,
  X,
  CheckCircle2,
  AlertCircle,
  WifiOff,
  Wifi,
  Calculator,
  Percent,
  Tag,
  ShoppingCart,
  ArrowRight,
  RotateCcw,
  History,
  Settings,
  Keyboard,
  Building2,
  Wallet,
  IndianRupee,
  HandCoins,
} from "lucide-react";

// Types
interface Product {
  id: string;
  name: string;
  price: number;
  mrp: number;
  sku: string;
  barcode: string;
  category: string;
  stock: number;
  unit: string;
  gstRate: number;
  hsnCode: string;
  image?: string;
}

interface BillItem extends Product {
  quantity: number;
  discount: number;
  discountType: "percent" | "amount";
  total: number;
  gstAmount: number;
}

interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  gstin?: string;
}

interface Supplier {
  id: string;
  companyName: string;
  contactPerson: string;
  phone: string;
  email?: string;
  gstin?: string;
}

type PaymentTerms = "cash" | "credit" | "partial";

// Mock product data
const mockProducts: Product[] = [
  { id: "1", name: "Tata Salt 1kg", price: 28, mrp: 30, sku: "SALT001", barcode: "8901030595301", category: "Grocery", stock: 150, unit: "pcs", gstRate: 5, hsnCode: "2501" },
  { id: "2", name: "Amul Butter 500g", price: 275, mrp: 290, sku: "BUTR001", barcode: "8901262011020", category: "Dairy", stock: 45, unit: "pcs", gstRate: 12, hsnCode: "0405" },
  { id: "3", name: "Maggi Noodles 70g", price: 14, mrp: 15, sku: "NOOD001", barcode: "8901058851458", category: "Instant Food", stock: 200, unit: "pcs", gstRate: 18, hsnCode: "1902" },
  { id: "4", name: "Parle-G Biscuits 800g", price: 85, mrp: 90, sku: "BISC001", barcode: "8904004400274", category: "Snacks", stock: 80, unit: "pcs", gstRate: 18, hsnCode: "1905" },
  { id: "5", name: "Surf Excel 1kg", price: 195, mrp: 210, sku: "DETG001", barcode: "8901030610325", category: "Household", stock: 60, unit: "pcs", gstRate: 28, hsnCode: "3402" },
  { id: "6", name: "Coca-Cola 750ml", price: 38, mrp: 40, sku: "BVRG001", barcode: "5449000000996", category: "Beverages", stock: 120, unit: "pcs", gstRate: 28, hsnCode: "2202" },
  { id: "7", name: "Britannia Bread", price: 45, mrp: 50, sku: "BREA001", barcode: "8901063090019", category: "Bakery", stock: 35, unit: "pcs", gstRate: 0, hsnCode: "1905" },
  { id: "8", name: "Fortune Sunflower Oil 1L", price: 145, mrp: 160, sku: "OIL001", barcode: "8901317500106", category: "Grocery", stock: 40, unit: "pcs", gstRate: 5, hsnCode: "1512" },
  { id: "9", name: "Dettol Soap 125g", price: 55, mrp: 60, sku: "SOAP001", barcode: "8901396332282", category: "Personal Care", stock: 95, unit: "pcs", gstRate: 18, hsnCode: "3401" },
  { id: "10", name: "Red Label Tea 500g", price: 285, mrp: 310, sku: "TEA001", barcode: "8901030791005", category: "Beverages", stock: 55, unit: "pcs", gstRate: 5, hsnCode: "0902" },
];

const categories = ["All", "Grocery", "Dairy", "Instant Food", "Snacks", "Household", "Beverages", "Bakery", "Personal Care"];

export default function POSPage() {
  // Client-side mounting check
  const [isMounted, setIsMounted] = useState(false);
  
  // State
  const [searchQuery, setSearchQuery] = useState("");
  const [barcodeInput, setBarcodeInput] = useState("");
  const [billItems, setBillItems] = useState<BillItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [printMode, setPrintMode] = useState<"thermal" | "a4">("thermal");
  const [isOnline, setIsOnline] = useState(true);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [showSupplierModal, setShowSupplierModal] = useState(false);
  const [supplier, setSupplier] = useState<Supplier | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "card" | "upi" | "mixed">("cash");
  const [cashReceived, setCashReceived] = useState("");
  const [showKeyboardShortcuts, setShowKeyboardShortcuts] = useState(false);
  const [billDiscount, setBillDiscount] = useState(0);
  const [billDiscountType, setBillDiscountType] = useState<"percent" | "amount">("percent");
  const [billNumber, setBillNumber] = useState<string>("");
  const [showHoldSuccess, setShowHoldSuccess] = useState(false);
  const [holdBillNote, setHoldBillNote] = useState("");
  const [paymentTerms, setPaymentTerms] = useState<PaymentTerms>("cash");
  const [partialAmount, setPartialAmount] = useState<number>(0);
  const [creditDays, setCreditDays] = useState<number>(30);

  // Refs
  const searchInputRef = useRef<HTMLInputElement>(null);
  const barcodeInputRef = useRef<HTMLInputElement>(null);

  // Filter products
  const filteredProducts = mockProducts.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.barcode.includes(searchQuery);
    const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Calculate totals
  const calculateTotals = useCallback(() => {
    const subtotal = billItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const totalGST = billItems.reduce((sum, item) => sum + item.gstAmount, 0);
    const itemDiscounts = billItems.reduce((sum, item) => {
      if (item.discountType === "percent") {
        return sum + (item.price * item.quantity * item.discount) / 100;
      }
      return sum + item.discount;
    }, 0);

    const afterItemDiscount = subtotal - itemDiscounts;
    const billDiscountAmount =
      billDiscountType === "percent" ? (afterItemDiscount * billDiscount) / 100 : billDiscount;
    const grandTotal = afterItemDiscount - billDiscountAmount + totalGST;

    return {
      subtotal,
      totalGST,
      itemDiscounts,
      billDiscountAmount,
      grandTotal,
      itemCount: billItems.reduce((sum, item) => sum + item.quantity, 0),
    };
  }, [billItems, billDiscount, billDiscountType]);

  const totals = calculateTotals();

  // Add product to bill
  const addToBill = useCallback((product: Product) => {
    setBillItems((prev) => {
      const existingItem = prev.find((item) => item.id === product.id);
      if (existingItem) {
        return prev.map((item) =>
          item.id === product.id
            ? {
                ...item,
                quantity: item.quantity + 1,
                total: (item.quantity + 1) * item.price,
                gstAmount: ((item.quantity + 1) * item.price * item.gstRate) / 100,
              }
            : item
        );
      }
      const newItem: BillItem = {
        ...product,
        quantity: 1,
        discount: 0,
        discountType: "percent",
        total: product.price,
        gstAmount: (product.price * product.gstRate) / 100,
      };
      return [...prev, newItem];
    });
  }, []);

  // Update quantity
  const updateQuantity = useCallback((id: string, delta: number) => {
    setBillItems((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQty = Math.max(0, item.quantity + delta);
            return {
              ...item,
              quantity: newQty,
              total: newQty * item.price,
              gstAmount: (newQty * item.price * item.gstRate) / 100,
            };
          }
          return item;
        })
        .filter((item) => item.quantity > 0)
    );
  }, []);

  // Remove item
  const removeItem = useCallback((id: string) => {
    setBillItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  // Clear bill
  const clearBill = useCallback(() => {
    setBillItems([]);
    setCustomer(null);
    setSupplier(null);
    setBillDiscount(0);
    setCashReceived("");
    setPaymentTerms("cash");
    setPartialAmount(0);
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const fyStart = month >= 4 ? year : year - 1;
    const fyEnd = (fyStart + 1) % 100;
    const counter = String(Math.floor(Math.random() * 9999) + 1).padStart(4, "0");
    setBillNumber(`BEP-${counter}/${fyStart % 100}-${String(fyEnd).padStart(2, "0")}`);
  }, []);

  // Hold bill
  const holdBill = useCallback(() => {
    if (billItems.length === 0 || typeof window === "undefined") return;
    
    // Create held bill object
    const heldBill = {
      id: Date.now().toString(),
      billNumber,
      items: billItems,
      customer,
      billDiscount,
      billDiscountType,
      totals: calculateTotals(),
      heldAt: new Date(),
      note: holdBillNote,
    };
    
    // Get existing held bills from localStorage
    const existingHeldBills = JSON.parse(localStorage.getItem("heldBills") || "[]");
    
    // Add new held bill
    localStorage.setItem("heldBills", JSON.stringify([...existingHeldBills, heldBill]));
    
    // Show success and clear current bill
    setShowHoldSuccess(true);
    setBillItems([]);
    setCustomer(null);
    setBillDiscount(0);
    setCashReceived("");
    setHoldBillNote("");
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const fyStart = month >= 4 ? year : year - 1;
    const fyEnd = (fyStart + 1) % 100;
    const counter = String(Math.floor(Math.random() * 9999) + 1).padStart(4, "0");
    setBillNumber(`BEP-${counter}/${fyStart % 100}-${String(fyEnd).padStart(2, "0")}`);
    
    // Hide success after 2 seconds
    setTimeout(() => setShowHoldSuccess(false), 2000);
  }, [billItems, billNumber, customer, billDiscount, billDiscountType, calculateTotals, holdBillNote]);

  // Handle barcode scan
  const handleBarcodeScan = useCallback(
    (barcode: string) => {
      const product = mockProducts.find((p) => p.barcode === barcode);
      if (product) {
        addToBill(product);
        setBarcodeInput("");
      }
    },
    [addToBill]
  );

  // Generate bill number on client side only
  useEffect(() => {
    setIsMounted(true);
    
    const generateBillNumber = () => {
      const now = new Date();
      const year = now.getFullYear();
      const month = now.getMonth() + 1; // 0-indexed
      const fyStart = month >= 4 ? year : year - 1;
      const fyEnd = (fyStart + 1) % 100;
      const counter = String(Math.floor(Math.random() * 9999) + 1).padStart(4, "0");
      return `BEP-${counter}/${fyStart % 100}-${String(fyEnd).padStart(2, "0")}`;
    };
    setBillNumber(generateBillNumber());
    
    // Check for resumed bill from sessionStorage (only on client)
    if (typeof window !== "undefined") {
      const resumedBill = sessionStorage.getItem("resumeBill");
      if (resumedBill) {
        try {
          const bill = JSON.parse(resumedBill);
          setBillItems(bill.items || []);
          setCustomer(bill.customer);
          setBillDiscount(bill.billDiscount || 0);
          setBillDiscountType(bill.billDiscountType || "percent");
          setBillNumber(bill.billNumber || Date.now().toString().slice(-6));
          sessionStorage.removeItem("resumeBill");
        } catch (e) {
          // Silent fail for invalid bill data
        }
      }
    }
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // F1 - Focus search
      if (e.key === "F1") {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
      // F2 - Focus barcode
      if (e.key === "F2") {
        e.preventDefault();
        barcodeInputRef.current?.focus();
      }
      // F3 - Payment
      if (e.key === "F3" && billItems.length > 0) {
        e.preventDefault();
        setShowPaymentModal(true);
      }
      // F4 - Clear bill
      if (e.key === "F4") {
        e.preventDefault();
        clearBill();
      }
      // F5 - Hold bill
      if (e.key === "F5" && billItems.length > 0) {
        e.preventDefault();
        holdBill();
      }
      // F6 - Print toggle
      if (e.key === "F6") {
        e.preventDefault();
        setPrintMode((prev) => (prev === "thermal" ? "a4" : "thermal"));
      }
      // Escape - Close modals
      if (e.key === "Escape") {
        setShowPaymentModal(false);
        setShowCustomerModal(false);
        setShowSupplierModal(false);
        setShowKeyboardShortcuts(false);
      }
      // F12 - Show shortcuts
      if (e.key === "F12") {
        e.preventDefault();
        setShowKeyboardShortcuts(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [billItems.length, clearBill, holdBill]);

  // Online/Offline detection
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Show loading state until mounted on client
  if (!isMounted) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
          <p className="text-lg font-medium text-muted-foreground">Loading POS...</p>
        </div>
      </div>
    );
  }

  // Quick amounts for cash
  const quickAmounts = [50, 100, 200, 500, 1000, 2000];

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      {/* Top Bar */}
      <div className="flex-shrink-0 h-14 bg-card border-b border-border flex items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-primary" />
            <h1 className="text-lg font-bold">Point of Sale</h1>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="w-4 h-4" />
            {new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Connection Status */}
          <div
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${
              isOnline ? "bg-success/10 text-success" : "bg-warning/10 text-warning"
            }`}
          >
            {isOnline ? <Wifi className="w-3.5 h-3.5" /> : <WifiOff className="w-3.5 h-3.5" />}
            {isOnline ? "Online" : "Offline"}
          </div>

          {/* Print Mode Toggle */}
          <button
            onClick={() => setPrintMode((prev) => (prev === "thermal" ? "a4" : "thermal"))}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm font-medium transition-colors ${
              printMode === "thermal"
                ? "bg-primary/10 border-primary/30 text-primary"
                : "bg-muted border-border text-foreground"
            }`}
          >
            {printMode === "thermal" ? <Receipt className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
            {printMode === "thermal" ? "Thermal" : "A4"}
          </button>

          {/* Keyboard Shortcuts */}
          <button
            onClick={() => setShowKeyboardShortcuts(true)}
            className="p-2 rounded-lg hover:bg-muted transition-colors"
            title="Keyboard Shortcuts (F12)"
          >
            <Keyboard className="w-5 h-5 text-muted-foreground" />
          </button>

          {/* History */}
          <button className="p-2 rounded-lg hover:bg-muted transition-colors" title="Transaction History">
            <History className="w-5 h-5 text-muted-foreground" />
          </button>

          {/* Settings */}
          <button className="p-2 rounded-lg hover:bg-muted transition-colors" title="POS Settings">
            <Settings className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Product Search */}
        <div className="w-80 flex-shrink-0 bg-card border-r border-border flex flex-col">
          {/* Search & Barcode */}
          <div className="p-4 space-y-3 border-b border-border">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search products... (F1)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-11 pl-10 pr-4 bg-background border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            {/* Barcode Input */}
            <div className="relative">
              <Barcode className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                ref={barcodeInputRef}
                type="text"
                placeholder="Scan barcode... (F2)"
                value={barcodeInput}
                onChange={(e) => setBarcodeInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && barcodeInput) {
                    handleBarcodeScan(barcodeInput);
                  }
                }}
                className="w-full h-11 pl-10 pr-4 bg-background border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>

          {/* Categories */}
          <div className="p-3 border-b border-border">
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                    selectedCategory === cat
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Product Grid */}
          <div className="flex-1 overflow-y-auto p-3">
            <div className="grid grid-cols-2 gap-2">
              {filteredProducts.map((product) => (
                <motion.button
                  key={product.id}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => addToBill(product)}
                  className="p-3 bg-background border border-border rounded-lg text-left hover:border-primary hover:bg-primary/5 transition-all group"
                >
                  <div className="text-xs text-muted-foreground mb-1">{product.sku}</div>
                  <div className="text-sm font-medium text-foreground line-clamp-2 mb-2 min-h-[2.5rem]">
                    {product.name}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-base font-bold text-primary">₹{product.price}</span>
                    <span
                      className={`text-xs px-1.5 py-0.5 rounded ${
                        product.stock > 20
                          ? "bg-success/10 text-success"
                          : product.stock > 5
                          ? "bg-warning/10 text-warning"
                          : "bg-destructive/10 text-destructive"
                      }`}
                    >
                      {product.stock}
                    </span>
                  </div>
                  <div className="mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="flex items-center justify-center gap-1 text-xs text-primary">
                      <Plus className="w-3 h-3" /> Add
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        </div>

        {/* Center Panel - Bill Items */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Customer Bar */}
          <div className="flex-shrink-0 h-12 bg-muted/30 border-b border-border flex items-center justify-between px-4">
            {customer ? (
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <div className="text-sm font-medium">{customer.name}</div>
                  <div className="text-xs text-muted-foreground">{customer.phone}</div>
                </div>
                <button
                  onClick={() => setCustomer(null)}
                  className="p-1 rounded hover:bg-muted transition-colors"
                >
                  <X className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowCustomerModal(true)}
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <User className="w-4 h-4" />
                Add Customer
              </button>
            )}

            {/* Supplier */}
            {supplier ? (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-warning/10 rounded-lg">
                <Building2 className="w-4 h-4 text-warning" />
                <div className="text-sm">
                  <span className="font-medium">{supplier.companyName}</span>
                  <span className="text-muted-foreground ml-1">({supplier.contactPerson})</span>
                </div>
                <button
                  onClick={() => setSupplier(null)}
                  className="p-1 rounded hover:bg-muted transition-colors"
                >
                  <X className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowSupplierModal(true)}
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <Building2 className="w-4 h-4" />
                Add Supplier
              </button>
            )}

            {/* Payment Terms */}
            <div className="flex items-center gap-1 p-1 bg-muted/50 rounded-lg">
              <button
                onClick={() => setPaymentTerms("cash")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                  paymentTerms === "cash"
                    ? "bg-success text-success-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                <Banknote className="w-4 h-4" />
                Cash
              </button>
              <button
                onClick={() => setPaymentTerms("credit")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                  paymentTerms === "credit"
                    ? "bg-warning text-warning-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                <Wallet className="w-4 h-4" />
                Credit
              </button>
              <button
                onClick={() => setPaymentTerms("partial")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                  paymentTerms === "partial"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                <HandCoins className="w-4 h-4" />
                Partial
              </button>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Bill #</span>
              <span className="font-mono text-sm font-medium">{billNumber}</span>
            </div>
          </div>

          {/* Items Table */}
          <div className="flex-1 overflow-hidden flex flex-col">
            {/* Table Header */}
            <div className="flex-shrink-0 bg-muted/50 border-b border-border">
              <div className="grid grid-cols-12 gap-2 px-4 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                <div className="col-span-5">Item</div>
                <div className="col-span-2 text-center">Price</div>
                <div className="col-span-2 text-center">Qty</div>
                <div className="col-span-2 text-right">Total</div>
                <div className="col-span-1"></div>
              </div>
            </div>

            {/* Table Body */}
            <div className="flex-1 overflow-y-auto">
              <AnimatePresence mode="popLayout">
                {billItems.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="h-full flex flex-col items-center justify-center text-muted-foreground"
                  >
                    <Package className="w-16 h-16 mb-4 opacity-20" />
                    <p className="text-lg font-medium">No items in bill</p>
                    <p className="text-sm">Search or scan products to add</p>
                  </motion.div>
                ) : (
                  billItems.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.2 }}
                      className={`grid grid-cols-12 gap-2 px-4 py-3 items-center border-b border-border hover:bg-muted/30 ${
                        index % 2 === 0 ? "bg-background" : "bg-muted/10"
                      }`}
                    >
                      <div className="col-span-5">
                        <div className="text-sm font-medium text-foreground">{item.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {item.sku} • GST {item.gstRate}%
                        </div>
                      </div>
                      <div className="col-span-2 text-center">
                        <div className="text-sm font-medium">₹{item.price}</div>
                      </div>
                      <div className="col-span-2 flex items-center justify-center gap-1">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="w-8 h-8 rounded-lg bg-muted hover:bg-muted/80 flex items-center justify-center transition-colors"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-10 text-center font-medium">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="w-8 h-8 rounded-lg bg-muted hover:bg-muted/80 flex items-center justify-center transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="col-span-2 text-right">
                        <div className="text-sm font-bold">₹{(item.price * item.quantity).toFixed(2)}</div>
                        <div className="text-xs text-muted-foreground">
                          +₹{item.gstAmount.toFixed(2)} GST
                        </div>
                      </div>
                      <div className="col-span-1 flex justify-end">
                        <button
                          onClick={() => removeItem(item.id)}
                          className="w-8 h-8 rounded-lg hover:bg-destructive/10 flex items-center justify-center text-muted-foreground hover:text-destructive transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Right Panel - Bill Summary */}
        <div className="w-80 flex-shrink-0 bg-card border-l border-border flex flex-col">
          {/* Summary Header */}
          <div className="flex-shrink-0 p-4 border-b border-border">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <Calculator className="w-5 h-5 text-primary" />
              Bill Summary
            </h2>
          </div>

          {/* Summary Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* Item Count */}
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Items</span>
              <span className="font-medium">{totals.itemCount} ({billItems.length} products)</span>
            </div>

            {/* Subtotal */}
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-medium">₹{totals.subtotal.toFixed(2)}</span>
            </div>

            {/* Item Discounts */}
            {totals.itemDiscounts > 0 && (
              <div className="flex items-center justify-between text-sm text-success">
                <span>Item Discounts</span>
                <span>-₹{totals.itemDiscounts.toFixed(2)}</span>
              </div>
            )}

            {/* Bill Discount */}
            <div className="p-3 bg-muted/50 rounded-lg space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Tag className="w-4 h-4 text-primary" />
                Bill Discount
              </div>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={billDiscount || ""}
                  onChange={(e) => setBillDiscount(Number(e.target.value))}
                  placeholder="0"
                  className="flex-1 h-9 px-3 bg-background border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <button
                  onClick={() => setBillDiscountType(billDiscountType === "percent" ? "amount" : "percent")}
                  className={`w-9 h-9 rounded-lg border flex items-center justify-center transition-colors ${
                    billDiscountType === "percent"
                      ? "bg-primary/10 border-primary/30 text-primary"
                      : "bg-muted border-border"
                  }`}
                >
                  {billDiscountType === "percent" ? <Percent className="w-4 h-4" /> : <span className="text-sm">₹</span>}
                </button>
              </div>
              {totals.billDiscountAmount > 0 && (
                <div className="text-xs text-success">-₹{totals.billDiscountAmount.toFixed(2)} discount applied</div>
              )}
            </div>

            {/* GST Breakdown */}
            <div className="p-3 bg-muted/50 rounded-lg space-y-2">
              <div className="text-sm font-medium">GST Breakdown</div>
              <div className="space-y-1 text-xs">
                {[0, 5, 12, 18, 28].map((rate) => {
                  const items = billItems.filter((item) => item.gstRate === rate);
                  const gstAmount = items.reduce((sum, item) => sum + item.gstAmount, 0);
                  if (gstAmount === 0) return null;
                  return (
                    <div key={rate} className="flex justify-between text-muted-foreground">
                      <span>GST @{rate}%</span>
                      <span>₹{gstAmount.toFixed(2)}</span>
                    </div>
                  );
                })}
              </div>
              <div className="flex justify-between text-sm font-medium pt-1 border-t border-border">
                <span>Total GST</span>
                <span>₹{totals.totalGST.toFixed(2)}</span>
              </div>
            </div>

            {/* Savings */}
            {(totals.itemDiscounts + totals.billDiscountAmount) > 0 && (
              <div className="p-3 bg-success/10 rounded-lg flex items-center justify-between">
                <div className="flex items-center gap-2 text-success text-sm font-medium">
                  <CheckCircle2 className="w-4 h-4" />
                  You Save
                </div>
                <span className="text-success font-bold">
                  ₹{(totals.itemDiscounts + totals.billDiscountAmount).toFixed(2)}
                </span>
              </div>
            )}

            {/* Payment Terms Details */}
            <div className={`p-3 rounded-lg space-y-3 ${
              paymentTerms === "cash" ? "bg-success/10" : 
              paymentTerms === "credit" ? "bg-warning/10" : "bg-primary/10"
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-medium">
                  {paymentTerms === "cash" && <Banknote className="w-4 h-4 text-success" />}
                  {paymentTerms === "credit" && <Wallet className="w-4 h-4 text-warning" />}
                  {paymentTerms === "partial" && <HandCoins className="w-4 h-4 text-primary" />}
                  Payment Terms
                </div>
                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                  paymentTerms === "cash" ? "bg-success/20 text-success" : 
                  paymentTerms === "credit" ? "bg-warning/20 text-warning" : "bg-primary/20 text-primary"
                }`}>
                  {paymentTerms.toUpperCase()}
                </span>
              </div>

              {/* Credit Days - shown for credit payment */}
              {paymentTerms === "credit" && (
                <div className="space-y-2">
                  <label className="text-xs text-muted-foreground">Credit Period (Days)</label>
                  <div className="flex gap-2">
                    {[7, 15, 30, 45, 60].map((days) => (
                      <button
                        key={days}
                        onClick={() => setCreditDays(days)}
                        className={`flex-1 h-8 rounded-md text-xs font-medium transition-all ${
                          creditDays === days
                            ? "bg-warning text-warning-foreground"
                            : "bg-background border border-border hover:border-warning"
                        }`}
                      >
                        {days}
                      </button>
                    ))}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Due Date: {new Date(Date.now() + creditDays * 24 * 60 * 60 * 1000).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                  </div>
                </div>
              )}

              {/* Partial Payment Input */}
              {paymentTerms === "partial" && (
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <label className="text-xs text-muted-foreground mb-1 block">Pay Now</label>
                      <div className="relative">
                        <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input
                          type="number"
                          value={partialAmount || ""}
                          onChange={(e) => setPartialAmount(Number(e.target.value))}
                          placeholder="0"
                          max={totals.grandTotal}
                          className="w-full h-9 pl-8 pr-3 bg-background border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>
                    </div>
                    <div className="flex-1">
                      <label className="text-xs text-muted-foreground mb-1 block">Balance Due</label>
                      <div className="h-9 px-3 bg-destructive/10 border border-destructive/20 rounded-lg flex items-center">
                        <span className="text-sm font-medium text-destructive">
                          ₹{Math.max(0, totals.grandTotal - partialAmount).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {[25, 50, 75].map((percent) => (
                      <button
                        key={percent}
                        onClick={() => setPartialAmount(Math.round(totals.grandTotal * percent / 100))}
                        className="flex-1 h-7 rounded-md text-xs font-medium bg-muted hover:bg-muted/80 transition-colors"
                      >
                        {percent}%
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {paymentTerms === "cash" && (
                <div className="text-xs text-muted-foreground">
                  Full payment required at checkout
                </div>
              )}
            </div>
          </div>

          {/* Grand Total */}
          <div className="flex-shrink-0 p-4 bg-primary/5 border-t border-primary/20">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xl font-bold">Grand Total</span>
              <span className="text-3xl font-bold text-primary">₹{totals.grandTotal.toFixed(2)}</span>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-2 mb-3">
              <button
                onClick={clearBill}
                disabled={billItems.length === 0}
                className="h-11 px-4 rounded-lg border border-border font-medium flex items-center justify-center gap-2 hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <RotateCcw className="w-4 h-4" />
                Clear (F4)
              </button>
              <button
                onClick={holdBill}
                disabled={billItems.length === 0}
                className="h-11 px-4 rounded-lg border border-border font-medium flex items-center justify-center gap-2 hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Clock className="w-4 h-4" />
                Hold (F5)
              </button>
            </div>

            <button
              onClick={() => setShowPaymentModal(true)}
              disabled={billItems.length === 0}
              className="w-full h-14 rounded-xl bg-primary text-primary-foreground font-bold text-lg flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <CreditCard className="w-5 h-5" />
              Pay Now (F3)
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      <AnimatePresence>
        {showPaymentModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setShowPaymentModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-lg bg-card rounded-2xl shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="p-6 border-b border-border">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold">Complete Payment</h2>
                  <button
                    onClick={() => setShowPaymentModal(false)}
                    className="p-2 rounded-lg hover:bg-muted transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="mt-2 text-3xl font-bold text-primary">₹{totals.grandTotal.toFixed(2)}</div>
              </div>

              {/* Payment Methods */}
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { id: "cash", icon: Banknote, label: "Cash" },
                    { id: "card", icon: CreditCard, label: "Card" },
                    { id: "upi", icon: QrCode, label: "UPI" },
                    { id: "mixed", icon: Calculator, label: "Mixed" },
                  ].map((method) => (
                    <button
                      key={method.id}
                      onClick={() => setPaymentMethod(method.id as typeof paymentMethod)}
                      className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${
                        paymentMethod === method.id
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <method.icon className="w-6 h-6" />
                      <span className="text-sm font-medium">{method.label}</span>
                    </button>
                  ))}
                </div>

                {/* Cash Input */}
                {paymentMethod === "cash" && (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium mb-2">Cash Received</label>
                      <input
                        type="number"
                        value={cashReceived}
                        onChange={(e) => setCashReceived(e.target.value)}
                        placeholder="Enter amount"
                        className="w-full h-14 px-4 text-xl font-bold bg-background border border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                        autoFocus
                      />
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {quickAmounts.map((amount) => (
                        <button
                          key={amount}
                          onClick={() => setCashReceived(amount.toString())}
                          className="px-4 py-2 rounded-lg bg-muted hover:bg-muted/80 font-medium transition-colors"
                        >
                          ₹{amount}
                        </button>
                      ))}
                      <button
                        onClick={() => setCashReceived(Math.ceil(totals.grandTotal).toString())}
                        className="px-4 py-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 font-medium transition-colors"
                      >
                        Exact
                      </button>
                    </div>
                    {Number(cashReceived) >= totals.grandTotal && (
                      <div className="p-4 bg-success/10 rounded-xl flex items-center justify-between">
                        <span className="text-success font-medium">Change to Return</span>
                        <span className="text-2xl font-bold text-success">
                          ₹{(Number(cashReceived) - totals.grandTotal).toFixed(2)}
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {/* UPI QR */}
                {paymentMethod === "upi" && (
                  <div className="flex flex-col items-center py-6">
                    <div className="w-48 h-48 bg-white rounded-xl flex items-center justify-center border">
                      <QrCode className="w-32 h-32 text-gray-800" />
                    </div>
                    <p className="mt-4 text-sm text-muted-foreground">Scan QR code to pay</p>
                    <p className="text-lg font-medium mt-1">UPI ID: billease@upi</p>
                  </div>
                )}

                {/* Card */}
                {paymentMethod === "card" && (
                  <div className="flex flex-col items-center py-6">
                    <Smartphone className="w-16 h-16 text-primary mb-4" />
                    <p className="text-lg font-medium">Waiting for card payment...</p>
                    <p className="text-sm text-muted-foreground mt-1">Insert or tap card on terminal</p>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="p-6 bg-muted/30 border-t border-border">
                <button
                  onClick={() => {
                    // Process payment
                    setShowPaymentModal(false);
                    clearBill();
                    // Show success toast
                  }}
                  disabled={paymentMethod === "cash" && Number(cashReceived) < totals.grandTotal}
                  className="w-full h-14 rounded-xl bg-success text-white font-bold text-lg flex items-center justify-center gap-2 hover:bg-success/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  Complete & Print Receipt
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Customer Modal */}
      <AnimatePresence>
        {showCustomerModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setShowCustomerModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-md bg-card rounded-2xl shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-border">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold">Add Customer</h2>
                  <button
                    onClick={() => setShowCustomerModal(false)}
                    className="p-2 rounded-lg hover:bg-muted transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Phone Number</label>
                  <input
                    type="tel"
                    placeholder="Enter phone number"
                    className="w-full h-11 px-4 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Customer Name</label>
                  <input
                    type="text"
                    placeholder="Enter name"
                    className="w-full h-11 px-4 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">GSTIN (Optional)</label>
                  <input
                    type="text"
                    placeholder="Enter GSTIN for B2B invoice"
                    className="w-full h-11 px-4 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              <div className="p-6 bg-muted/30 border-t border-border flex gap-3">
                <button
                  onClick={() => setShowCustomerModal(false)}
                  className="flex-1 h-11 rounded-lg border border-border font-medium hover:bg-muted transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setCustomer({ id: "1", name: "Walk-in Customer", phone: "9876543210" });
                    setShowCustomerModal(false);
                  }}
                  className="flex-1 h-11 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
                >
                  Add Customer
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Supplier Modal */}
      <AnimatePresence>
        {showSupplierModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setShowSupplierModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-md bg-card rounded-2xl shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-border">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-warning" />
                    Add Supplier
                  </h2>
                  <button
                    onClick={() => setShowSupplierModal(false)}
                    className="p-2 rounded-lg hover:bg-muted transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Company Name</label>
                  <input
                    type="text"
                    placeholder="Enter company name"
                    className="w-full h-11 px-4 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Contact Person</label>
                  <input
                    type="text"
                    placeholder="Enter contact person name"
                    className="w-full h-11 px-4 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Phone Number</label>
                  <input
                    type="tel"
                    placeholder="Enter phone number"
                    className="w-full h-11 px-4 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">GSTIN (Optional)</label>
                  <input
                    type="text"
                    placeholder="Enter GSTIN for B2B invoice"
                    className="w-full h-11 px-4 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              <div className="p-6 bg-muted/30 border-t border-border flex gap-3">
                <button
                  onClick={() => setShowSupplierModal(false)}
                  className="flex-1 h-11 rounded-lg border border-border font-medium hover:bg-muted transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setSupplier({ id: "1", companyName: "Sample Supplier", contactPerson: "Contact Person", phone: "9876543210" });
                    setShowSupplierModal(false);
                  }}
                  className="flex-1 h-11 rounded-lg bg-warning text-warning-foreground font-medium hover:bg-warning/90 transition-colors"
                >
                  Add Supplier
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Keyboard Shortcuts Modal */}
      <AnimatePresence>
        {showKeyboardShortcuts && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setShowKeyboardShortcuts(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-md bg-card rounded-2xl shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-border">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold flex items-center gap-2">
                    <Keyboard className="w-5 h-5" />
                    Keyboard Shortcuts
                  </h2>
                  <button
                    onClick={() => setShowKeyboardShortcuts(false)}
                    className="p-2 rounded-lg hover:bg-muted transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-3">
                {[
                  { key: "F1", action: "Focus product search" },
                  { key: "F2", action: "Focus barcode scanner" },
                  { key: "F3", action: "Open payment dialog" },
                  { key: "F4", action: "Clear current bill" },
                  { key: "F5", action: "Hold current bill" },
                  { key: "F6", action: "Toggle print mode" },
                  { key: "F12", action: "Show this help" },
                  { key: "Esc", action: "Close dialogs" },
                  { key: "Enter", action: "Process barcode scan" },
                ].map((shortcut) => (
                  <div key={shortcut.key} className="flex items-center justify-between">
                    <span className="text-muted-foreground">{shortcut.action}</span>
                    <kbd className="px-3 py-1 bg-muted rounded-lg text-sm font-mono font-medium">
                      {shortcut.key}
                    </kbd>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hold Success Toast */}
      <AnimatePresence>
        {showHoldSuccess && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 px-6 py-4 bg-primary rounded-xl shadow-lg flex items-center gap-3"
          >
            <CheckCircle2 className="w-6 h-6 text-white" />
            <span className="text-white font-medium">Bill held successfully! View in Held Bills.</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
