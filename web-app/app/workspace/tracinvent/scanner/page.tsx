"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ScanLine,
  Camera,
  Package,
  AlertTriangle,
  CheckCircle2,
  X,
  Search,
  ArrowDownCircle,
  ArrowUpCircle,
  Edit2,
  History,
  Keyboard,
  Volume2,
  VolumeX,
} from "lucide-react";

// Types
interface Product {
  id: string;
  name: string;
  sku: string;
  barcode: string;
  category: string;
  price: number;
  costPrice: number;
  stock: number;
  minStock: number;
  unit: string;
  location: string;
}

// Mock products database
const productDatabase: Product[] = [
  { id: "1", name: "Tata Salt 1kg", sku: "SALT001", barcode: "8901030595301", category: "Grocery", price: 28, costPrice: 25, stock: 150, minStock: 50, unit: "pcs", location: "Rack A1" },
  { id: "2", name: "Amul Butter 500g", sku: "BUTR001", barcode: "8901262011020", category: "Dairy", price: 275, costPrice: 250, stock: 12, minStock: 20, unit: "pcs", location: "Cold Storage" },
  { id: "3", name: "Maggi Noodles 70g", sku: "NOOD001", barcode: "8901058851458", category: "Instant Food", price: 14, costPrice: 12, stock: 200, minStock: 100, unit: "pcs", location: "Rack B2" },
  { id: "4", name: "Parle-G Biscuits 800g", sku: "BISC001", barcode: "8904004400274", category: "Snacks", price: 85, costPrice: 75, stock: 80, minStock: 30, unit: "pcs", location: "Rack C1" },
  { id: "5", name: "Surf Excel 1kg", sku: "DETG001", barcode: "8901030610325", category: "Household", price: 195, costPrice: 175, stock: 8, minStock: 25, unit: "pcs", location: "Rack D3" },
  { id: "6", name: "Coca-Cola 750ml", sku: "BVRG001", barcode: "5449000000996", category: "Beverages", price: 38, costPrice: 32, stock: 120, minStock: 50, unit: "pcs", location: "Cold Storage" },
];

interface ScanHistory {
  id: string;
  barcode: string;
  product: Product | null;
  timestamp: Date;
  action?: "stock-in" | "stock-out";
}

export default function BarcodeScannerPage() {
  const [barcodeInput, setBarcodeInput] = useState("");
  const [foundProduct, setFoundProduct] = useState<Product | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [scanHistory, setScanHistory] = useState<ScanHistory[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showQuickAction, setShowQuickAction] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Play beep sound
  const playBeep = (success: boolean) => {
    if (!soundEnabled) return;
    const audio = new AudioContext();
    const oscillator = audio.createOscillator();
    const gain = audio.createGain();
    oscillator.connect(gain);
    gain.connect(audio.destination);
    oscillator.frequency.value = success ? 800 : 300;
    oscillator.type = "sine";
    gain.gain.value = 0.1;
    oscillator.start();
    setTimeout(() => oscillator.stop(), success ? 100 : 300);
  };

  // Handle barcode scan/input
  const handleScan = (barcode: string) => {
    if (!barcode.trim()) return;

    setIsScanning(true);
    
    // Simulate scanning delay
    setTimeout(() => {
      const product = productDatabase.find(
        (p) => p.barcode === barcode || p.sku.toLowerCase() === barcode.toLowerCase()
      ) ?? null;

      const historyItem: ScanHistory = {
        id: Date.now().toString(),
        barcode,
        product,
        timestamp: new Date(),
      };

      if (product) {
        setFoundProduct(product);
        setNotFound(false);
        playBeep(true);
        setShowQuickAction(true);
      } else {
        setFoundProduct(null);
        setNotFound(true);
        playBeep(false);
        setShowQuickAction(false);
      }

      setScanHistory((prev) => [historyItem, ...prev.slice(0, 9)]);
      setBarcodeInput("");
      setIsScanning(false);
    }, 300);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleScan(barcodeInput);
    }
  };

  const handleQuickAction = (action: "stock-in" | "stock-out") => {
    if (!foundProduct) return;
    
    setScanHistory((prev) => {
      const updated = [...prev];
      if (updated[0]) {
        updated[0] = { ...updated[0], action };
      }
      return updated;
    });
    
    setShowQuickAction(false);
    setFoundProduct(null);
  };

  const getStockStatus = (product: Product) => {
    if (product.stock === 0) return { label: "Out of Stock", color: "text-destructive", bg: "bg-destructive/10" };
    if (product.stock <= product.minStock) return { label: "Low Stock", color: "text-warning", bg: "bg-warning/10" };
    return { label: "In Stock", color: "text-success", bg: "bg-success/10" };
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0 px-6 py-4 border-b border-border bg-card/50">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-foreground">Barcode Scanner</h1>
            <p className="text-sm text-muted-foreground">Scan barcodes to lookup or manage inventory</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`p-2 rounded-lg transition-colors ${
                soundEnabled ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
              }`}
              title={soundEnabled ? "Sound On" : "Sound Off"}
            >
              {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-4xl mx-auto">
          {/* Scanner Input Area */}
          <div className="bg-card border border-border rounded-2xl p-8 mb-6">
            <div className="text-center mb-6">
              <div className={`w-20 h-20 mx-auto rounded-2xl flex items-center justify-center mb-4 transition-colors ${
                isScanning ? "bg-primary/20 animate-pulse" : "bg-primary/10"
              }`}>
                <ScanLine className={`w-10 h-10 text-primary ${isScanning ? "animate-bounce" : ""}`} />
              </div>
              <h2 className="text-lg font-semibold mb-2">Scan or Enter Barcode</h2>
              <p className="text-sm text-muted-foreground">
                Use a barcode scanner or type the barcode/SKU manually
              </p>
            </div>

            <div className="relative max-w-md mx-auto">
              <Keyboard className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                ref={inputRef}
                type="text"
                value={barcodeInput}
                onChange={(e) => setBarcodeInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Scan barcode or enter SKU..."
                className="w-full h-14 pl-12 pr-4 bg-background border-2 border-border rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-center font-mono"
                autoFocus
              />
            </div>

            <div className="flex justify-center gap-4 mt-4">
              <button
                onClick={() => handleScan(barcodeInput)}
                disabled={!barcodeInput.trim() || isScanning}
                className="flex items-center gap-2 px-6 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                <Search className="w-4 h-4" />
                Lookup
              </button>
            </div>
          </div>

          {/* Product Result */}
          <AnimatePresence mode="wait">
            {foundProduct && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-card border border-success/30 rounded-2xl p-6 mb-6"
              >
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-xl bg-success/10 flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="w-8 h-8 text-success" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-xl font-bold text-foreground">{foundProduct.name}</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          SKU: {foundProduct.sku} • Barcode: {foundProduct.barcode}
                        </p>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStockStatus(foundProduct).bg} ${getStockStatus(foundProduct).color}`}>
                        {getStockStatus(foundProduct).label}
                      </div>
                    </div>

                    <div className="grid grid-cols-4 gap-4 mt-4">
                      <div className="bg-muted/50 rounded-lg p-3">
                        <p className="text-xs text-muted-foreground">Category</p>
                        <p className="font-semibold">{foundProduct.category}</p>
                      </div>
                      <div className="bg-muted/50 rounded-lg p-3">
                        <p className="text-xs text-muted-foreground">Current Stock</p>
                        <p className="font-semibold">{foundProduct.stock} {foundProduct.unit}</p>
                      </div>
                      <div className="bg-muted/50 rounded-lg p-3">
                        <p className="text-xs text-muted-foreground">Price</p>
                        <p className="font-semibold">₹{foundProduct.price}</p>
                      </div>
                      <div className="bg-muted/50 rounded-lg p-3">
                        <p className="text-xs text-muted-foreground">Location</p>
                        <p className="font-semibold">{foundProduct.location}</p>
                      </div>
                    </div>

                    {showQuickAction && (
                      <div className="flex gap-3 mt-4">
                        <button
                          onClick={() => handleQuickAction("stock-in")}
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-success/10 text-success rounded-lg font-medium hover:bg-success/20 transition-colors"
                        >
                          <ArrowDownCircle className="w-5 h-5" />
                          Stock In
                        </button>
                        <button
                          onClick={() => handleQuickAction("stock-out")}
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-destructive/10 text-destructive rounded-lg font-medium hover:bg-destructive/20 transition-colors"
                        >
                          <ArrowUpCircle className="w-5 h-5" />
                          Stock Out
                        </button>
                        <button
                          onClick={() => {}}
                          className="flex items-center justify-center gap-2 px-4 py-3 bg-muted text-foreground rounded-lg font-medium hover:bg-muted/80 transition-colors"
                        >
                          <Edit2 className="w-5 h-5" />
                          Edit
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {notFound && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-card border border-destructive/30 rounded-2xl p-6 mb-6"
              >
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-xl bg-destructive/10 flex items-center justify-center flex-shrink-0">
                    <AlertTriangle className="w-8 h-8 text-destructive" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-foreground">Product Not Found</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      No product matches this barcode. Would you like to add it?
                    </p>
                    <button className="mt-3 flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
                      <Package className="w-4 h-4" />
                      Add New Product
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Scan History */}
          {scanHistory.length > 0 && (
            <div className="bg-card border border-border rounded-xl overflow-hidden">
              <div className="px-4 py-3 border-b border-border flex items-center gap-2">
                <History className="w-4 h-4 text-muted-foreground" />
                <h3 className="font-semibold">Recent Scans</h3>
              </div>
              <div className="divide-y divide-border">
                {scanHistory.map((scan) => (
                  <div key={scan.id} className="px-4 py-3 flex items-center justify-between hover:bg-muted/30 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        scan.product ? "bg-success/10" : "bg-destructive/10"
                      }`}>
                        {scan.product ? (
                          <Package className="w-5 h-5 text-success" />
                        ) : (
                          <AlertTriangle className="w-5 h-5 text-destructive" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">
                          {scan.product ? scan.product.name : "Not Found"}
                        </p>
                        <p className="text-xs text-muted-foreground font-mono">{scan.barcode}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      {scan.action && (
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          scan.action === "stock-in" ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"
                        }`}>
                          {scan.action === "stock-in" ? "Stock In" : "Stock Out"}
                        </span>
                      )}
                      <p className="text-xs text-muted-foreground mt-1">
                        {scan.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quick Tips */}
          <div className="mt-6 p-4 bg-muted/50 rounded-xl">
            <h4 className="font-medium mb-2">Quick Tips</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Use a USB or Bluetooth barcode scanner for faster operation</li>
              <li>• You can also search by SKU code</li>
              <li>• Press Enter after typing to search</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
