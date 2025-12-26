"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Barcode,
  Plus,
  Minus,
  Trash2,
  FileEdit,
  Printer,
  Receipt,
  FileText,
  User,
  Clock,
  Package,
  X,
  CheckCircle2,
  AlertCircle,
  Calculator,
  Percent,
  Tag,
  ShoppingCart,
  ArrowRight,
  RotateCcw,
  Send,
  Download,
  Mail,
  Copy,
  Building2,
  Banknote,
  Wallet,
  HandCoins,
  IndianRupee,
  Calendar,
  FileCheck,
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

interface EstimateItem extends Product {
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

export default function EstimatePage() {
  // State
  const [searchQuery, setSearchQuery] = useState("");
  const [barcodeInput, setBarcodeInput] = useState("");
  const [estimateItems, setEstimateItems] = useState<EstimateItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [showSupplierModal, setShowSupplierModal] = useState(false);
  const [supplier, setSupplier] = useState<Supplier | null>(null);
  const [estimateDiscount, setEstimateDiscount] = useState(0);
  const [estimateDiscountType, setEstimateDiscountType] = useState<"percent" | "amount">("percent");
  const [estimateNumber, setEstimateNumber] = useState<string>("");
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);
  const [estimateNote, setEstimateNote] = useState("");
  const [validityDays, setValidityDays] = useState(15);
  const [showConvertModal, setShowConvertModal] = useState(false);

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
    let subtotal = 0;
    let totalGST = 0;
    let itemCount = 0;
    let itemDiscounts = 0;

    estimateItems.forEach((item) => {
      const itemTotal = item.price * item.quantity;
      const discount =
        item.discountType === "percent" ? (itemTotal * item.discount) / 100 : item.discount;
      subtotal += itemTotal - discount;
      totalGST += item.gstAmount;
      itemCount += item.quantity;
      itemDiscounts += discount;
    });

    const estimateDiscountAmount =
      estimateDiscountType === "percent" ? (subtotal * estimateDiscount) / 100 : estimateDiscount;

    const grandTotal = subtotal + totalGST - estimateDiscountAmount;

    return { subtotal, totalGST, itemCount, itemDiscounts, estimateDiscountAmount, grandTotal };
  }, [estimateItems, estimateDiscount, estimateDiscountType]);

  const totals = calculateTotals();

  // Add product to estimate
  const addToEstimate = useCallback((product: Product) => {
    setEstimateItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? {
                ...item,
                quantity: item.quantity + 1,
                total: item.price * (item.quantity + 1),
                gstAmount: (item.price * (item.quantity + 1) * item.gstRate) / 100,
              }
            : item
        );
      }
      const newItem: EstimateItem = {
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
    setEstimateItems((prev) =>
      prev
        .map((item) =>
          item.id === id
            ? {
                ...item,
                quantity: Math.max(0, item.quantity + delta),
                total: item.price * Math.max(0, item.quantity + delta),
                gstAmount: (item.price * Math.max(0, item.quantity + delta) * item.gstRate) / 100,
              }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  }, []);

  // Remove item
  const removeItem = useCallback((id: string) => {
    setEstimateItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  // Clear estimate
  const clearEstimate = useCallback(() => {
    setEstimateItems([]);
    setCustomer(null);
    setSupplier(null);
    setEstimateDiscount(0);
    setEstimateNote("");
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const fyStart = month >= 4 ? year : year - 1;
    const fyEnd = (fyStart + 1) % 100;
    const counter = String(Math.floor(Math.random() * 9999) + 1).padStart(4, "0");
    setEstimateNumber(`BEP/E-${counter}/${fyStart % 100}-${String(fyEnd).padStart(2, "0")}`);
  }, []);

  // Save estimate
  const saveEstimate = useCallback(() => {
    if (estimateItems.length === 0) return;
    
    const estimate = {
      id: Date.now().toString(),
      estimateNumber,
      items: estimateItems,
      customer,
      supplier,
      estimateDiscount,
      estimateDiscountType,
      totals: calculateTotals(),
      createdAt: new Date(),
      validUntil: new Date(Date.now() + validityDays * 24 * 60 * 60 * 1000),
      note: estimateNote,
      status: "draft",
    };
    
    // Get existing estimates from localStorage
    const existingEstimates = JSON.parse(localStorage.getItem("estimates") || "[]");
    existingEstimates.push(estimate);
    localStorage.setItem("estimates", JSON.stringify(existingEstimates));
    
    // Show success and clear current estimate
    setShowSaveSuccess(true);
    clearEstimate();
    
    setTimeout(() => setShowSaveSuccess(false), 2000);
  }, [estimateItems, estimateNumber, customer, supplier, estimateDiscount, estimateDiscountType, calculateTotals, estimateNote, validityDays, clearEstimate]);

  // Handle barcode scan
  const handleBarcodeScan = useCallback(
    (barcode: string) => {
      const product = mockProducts.find((p) => p.barcode === barcode);
      if (product) {
        addToEstimate(product);
        setBarcodeInput("");
      }
    },
    [addToEstimate]
  );

  // Generate estimate number on client side only
  useEffect(() => {
    const generateEstimateNumber = () => {
      const now = new Date();
      const year = now.getFullYear();
      const month = now.getMonth() + 1;
      const fyStart = month >= 4 ? year : year - 1;
      const fyEnd = (fyStart + 1) % 100;
      const counter = String(Math.floor(Math.random() * 9999) + 1).padStart(4, "0");
      return `BEP/E-${counter}/${fyStart % 100}-${String(fyEnd).padStart(2, "0")}`;
    };
    setEstimateNumber(generateEstimateNumber());
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setShowCustomerModal(false);
        setShowSupplierModal(false);
        setShowConvertModal(false);
      }
      if (e.key === "F2") {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
      if (e.key === "F3") {
        e.preventDefault();
        if (estimateItems.length > 0) saveEstimate();
      }
      if (e.key === "F4") {
        e.preventDefault();
        clearEstimate();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [estimateItems.length, saveEstimate, clearEstimate]);

  // Convert to bill
  const convertToBill = () => {
    if (estimateItems.length === 0) return;
    
    // Store estimate data in sessionStorage to be picked up by POS page
    const billData = {
      items: estimateItems,
      customer,
      supplier,
      billDiscount: estimateDiscount,
      billDiscountType: estimateDiscountType,
      fromEstimate: estimateNumber,
    };
    sessionStorage.setItem("resumeBill", JSON.stringify(billData));
    
    // Navigate to POS
    window.location.href = "/workspace/pos";
  };

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Top Bar */}
      <div className="flex-shrink-0 h-14 bg-card border-b border-border flex items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-warning">
            <FileEdit className="w-5 h-5" />
            <span className="font-semibold">New Estimate</span>
          </div>
          <div className="h-6 w-px bg-border" />
          <span className="text-sm text-muted-foreground">
            {new Date().toLocaleDateString("en-IN", {
              weekday: "short",
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">F2: Search</span>
          <span className="text-xs text-muted-foreground">F3: Save</span>
          <span className="text-xs text-muted-foreground">F4: Clear</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Products */}
        <div className="w-[45%] flex flex-col border-r border-border">
          {/* Search & Barcode */}
          <div className="flex-shrink-0 p-4 bg-card/50 border-b border-border space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search products by name, SKU... (F2)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-11 pl-10 pr-4 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
              />
            </div>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Barcode className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  ref={barcodeInputRef}
                  type="text"
                  placeholder="Scan barcode..."
                  value={barcodeInput}
                  onChange={(e) => setBarcodeInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && barcodeInput) {
                      handleBarcodeScan(barcodeInput);
                    }
                  }}
                  className="w-full h-11 pl-10 pr-4 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                />
              </div>
            </div>
          </div>

          {/* Categories */}
          <div className="flex-shrink-0 px-4 py-2 bg-muted/30 border-b border-border overflow-x-auto">
            <div className="flex gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap transition-colors ${
                    selectedCategory === category
                      ? "bg-warning text-warning-foreground font-medium"
                      : "bg-background hover:bg-muted text-muted-foreground"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Products Grid */}
          <div className="flex-1 p-4 overflow-y-auto">
            <div className="grid grid-cols-2 gap-3">
              {filteredProducts.map((product) => (
                <motion.button
                  key={product.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => addToEstimate(product)}
                  className="p-3 bg-card rounded-xl border border-border hover:border-warning hover:shadow-lg transition-all text-left group"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
                      <Package className="w-5 h-5 text-warning" />
                    </div>
                    <span className="text-xs text-muted-foreground">{product.sku}</span>
                  </div>
                  <div className="text-sm font-medium text-foreground line-clamp-2 mb-1 group-hover:text-warning transition-colors">
                    {product.name}
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-lg font-bold text-warning">₹{product.price}</span>
                    {product.mrp > product.price && (
                      <span className="text-xs text-muted-foreground line-through">₹{product.mrp}</span>
                    )}
                  </div>
                  <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                    <span>Stock: {product.stock}</span>
                    <span className="text-success">GST {product.gstRate}%</span>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        </div>

        {/* Middle Panel - Estimate Items */}
        <div className="flex-1 flex flex-col">
          {/* Estimate Header */}
          <div className="flex-shrink-0 p-4 bg-card/50 border-b border-border flex items-center justify-between flex-wrap gap-3">
            {/* Customer */}
            {customer ? (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 rounded-lg">
                <User className="w-4 h-4 text-primary" />
                <div className="text-sm">
                  <span className="font-medium">{customer.name}</span>
                  <span className="text-muted-foreground ml-1">({customer.phone})</span>
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

            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Estimate #</span>
              <span className="font-mono text-sm font-medium text-warning">{estimateNumber}</span>
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
                {estimateItems.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="h-full flex flex-col items-center justify-center text-muted-foreground"
                  >
                    <FileEdit className="w-16 h-16 mb-4 opacity-20" />
                    <p className="text-lg font-medium">No items in estimate</p>
                    <p className="text-sm">Search or scan products to add</p>
                  </motion.div>
                ) : (
                  estimateItems.map((item, index) => (
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

        {/* Right Panel - Estimate Summary */}
        <div className="w-80 flex-shrink-0 bg-card border-l border-border flex flex-col">
          {/* Summary Header */}
          <div className="flex-shrink-0 p-4 border-b border-border">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <Calculator className="w-5 h-5 text-warning" />
              Estimate Summary
            </h2>
          </div>

          {/* Summary Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* Item Count */}
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Items</span>
              <span className="font-medium">{totals.itemCount} ({estimateItems.length} products)</span>
            </div>

            {/* Subtotal */}
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-medium">₹{totals.subtotal.toFixed(2)}</span>
            </div>

            {/* Estimate Discount */}
            <div className="p-3 bg-muted/50 rounded-lg space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Tag className="w-4 h-4 text-warning" />
                Estimate Discount
              </div>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={estimateDiscount || ""}
                  onChange={(e) => setEstimateDiscount(Number(e.target.value))}
                  placeholder="0"
                  className="flex-1 h-9 px-3 bg-background border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-warning"
                />
                <button
                  onClick={() => setEstimateDiscountType(estimateDiscountType === "percent" ? "amount" : "percent")}
                  className={`w-9 h-9 rounded-lg border flex items-center justify-center transition-colors ${
                    estimateDiscountType === "percent"
                      ? "bg-warning/10 border-warning/30 text-warning"
                      : "bg-muted border-border"
                  }`}
                >
                  {estimateDiscountType === "percent" ? <Percent className="w-4 h-4" /> : <span className="text-sm">₹</span>}
                </button>
              </div>
              {totals.estimateDiscountAmount > 0 && (
                <div className="text-xs text-success">-₹{totals.estimateDiscountAmount.toFixed(2)} discount applied</div>
              )}
            </div>

            {/* GST Breakdown */}
            <div className="p-3 bg-muted/50 rounded-lg space-y-2">
              <div className="text-sm font-medium">GST Breakdown</div>
              <div className="space-y-1 text-xs">
                {[0, 5, 12, 18, 28].map((rate) => {
                  const items = estimateItems.filter((item) => item.gstRate === rate);
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

            {/* Validity */}
            <div className="p-3 bg-warning/10 rounded-lg space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Calendar className="w-4 h-4 text-warning" />
                Estimate Validity
              </div>
              <div className="flex gap-2">
                {[7, 15, 30, 45].map((days) => (
                  <button
                    key={days}
                    onClick={() => setValidityDays(days)}
                    className={`flex-1 h-8 rounded-md text-xs font-medium transition-all ${
                      validityDays === days
                        ? "bg-warning text-warning-foreground"
                        : "bg-background border border-border hover:border-warning"
                    }`}
                  >
                    {days} days
                  </button>
                ))}
              </div>
              <div className="text-xs text-muted-foreground">
                Valid until: {new Date(Date.now() + validityDays * 24 * 60 * 60 * 1000).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
              </div>
            </div>

            {/* Note */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Note / Terms</label>
              <textarea
                value={estimateNote}
                onChange={(e) => setEstimateNote(e.target.value)}
                placeholder="Add notes or terms..."
                className="w-full h-20 p-3 bg-background border border-input rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-warning"
              />
            </div>
          </div>

          {/* Grand Total */}
          <div className="flex-shrink-0 p-4 bg-warning/5 border-t border-warning/20">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xl font-bold">Grand Total</span>
              <span className="text-3xl font-bold text-warning">₹{totals.grandTotal.toFixed(2)}</span>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-2 mb-3">
              <button
                onClick={clearEstimate}
                disabled={estimateItems.length === 0}
                className="h-11 px-4 rounded-lg border border-border font-medium flex items-center justify-center gap-2 hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <RotateCcw className="w-4 h-4" />
                Clear (F4)
              </button>
              <button
                onClick={() => setShowConvertModal(true)}
                disabled={estimateItems.length === 0}
                className="h-11 px-4 rounded-lg border border-primary bg-primary/10 text-primary font-medium flex items-center justify-center gap-2 hover:bg-primary/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ShoppingCart className="w-4 h-4" />
                Convert
              </button>
            </div>

            <button
              onClick={saveEstimate}
              disabled={estimateItems.length === 0}
              className="w-full h-14 rounded-xl bg-warning text-warning-foreground font-bold text-lg flex items-center justify-center gap-2 hover:bg-warning/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FileCheck className="w-5 h-5" />
              Save Estimate (F3)
              <ArrowRight className="w-5 h-5" />
            </button>

            {/* Quick Actions */}
            <div className="flex gap-2 mt-3">
              <button className="flex-1 h-10 rounded-lg border border-border flex items-center justify-center gap-2 text-sm hover:bg-muted transition-colors">
                <Printer className="w-4 h-4" />
                Print
              </button>
              <button className="flex-1 h-10 rounded-lg border border-border flex items-center justify-center gap-2 text-sm hover:bg-muted transition-colors">
                <Download className="w-4 h-4" />
                PDF
              </button>
              <button className="flex-1 h-10 rounded-lg border border-border flex items-center justify-center gap-2 text-sm hover:bg-muted transition-colors">
                <Mail className="w-4 h-4" />
                Email
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Save Success Toast */}
      <AnimatePresence>
        {showSaveSuccess && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-4 left-1/2 -translate-x-1/2 px-6 py-3 bg-success text-success-foreground rounded-xl shadow-lg flex items-center gap-2"
          >
            <CheckCircle2 className="w-5 h-5" />
            Estimate saved successfully!
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
                  <h2 className="text-xl font-bold flex items-center gap-2">
                    <User className="w-5 h-5 text-primary" />
                    Add Customer
                  </h2>
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
                  <label className="block text-sm font-medium mb-2">Customer Name</label>
                  <input
                    type="text"
                    placeholder="Enter customer name"
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
                  <label className="block text-sm font-medium mb-2">Email (Optional)</label>
                  <input
                    type="email"
                    placeholder="Enter email address"
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
                    className="w-full h-11 px-4 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-warning"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Contact Person</label>
                  <input
                    type="text"
                    placeholder="Enter contact person name"
                    className="w-full h-11 px-4 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-warning"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Phone Number</label>
                  <input
                    type="tel"
                    placeholder="Enter phone number"
                    className="w-full h-11 px-4 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-warning"
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

      {/* Convert to Bill Modal */}
      <AnimatePresence>
        {showConvertModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setShowConvertModal(false)}
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
                    <ShoppingCart className="w-5 h-5 text-primary" />
                    Convert to Bill
                  </h2>
                  <button
                    onClick={() => setShowConvertModal(false)}
                    className="p-2 rounded-lg hover:bg-muted transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-4">
                <div className="p-4 bg-muted/50 rounded-lg">
                  <div className="text-sm text-muted-foreground mb-1">Estimate</div>
                  <div className="font-mono font-medium">{estimateNumber}</div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-primary/10 rounded-lg">
                  <ArrowRight className="w-5 h-5 text-primary" />
                  <div>
                    <div className="text-sm font-medium">This will create a new bill</div>
                    <div className="text-xs text-muted-foreground">
                      All items, customer, and discounts will be transferred
                    </div>
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">
                  <p className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-success" />
                    {estimateItems.length} items will be added
                  </p>
                  {customer && (
                    <p className="flex items-center gap-2 mt-1">
                      <CheckCircle2 className="w-4 h-4 text-success" />
                      Customer: {customer.name}
                    </p>
                  )}
                  <p className="flex items-center gap-2 mt-1">
                    <CheckCircle2 className="w-4 h-4 text-success" />
                    Total: ₹{totals.grandTotal.toFixed(2)}
                  </p>
                </div>
              </div>

              <div className="p-6 bg-muted/30 border-t border-border flex gap-3">
                <button
                  onClick={() => setShowConvertModal(false)}
                  className="flex-1 h-11 rounded-lg border border-border font-medium hover:bg-muted transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={convertToBill}
                  className="flex-1 h-11 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
                >
                  <ShoppingCart className="w-4 h-4" />
                  Convert to Bill
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
