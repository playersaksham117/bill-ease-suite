"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Plus,
  Package,
  Edit2,
  Trash2,
  Filter,
  Download,
  Upload,
  X,
  Save,
  AlertCircle,
  CheckCircle2,
  Barcode,
  Tag,
  IndianRupee,
  Box,
  ChevronDown,
} from "lucide-react";

// Types
interface Product {
  id: string;
  name: string;
  sku: string;
  barcode: string;
  category: string;
  price: number;
  mrp: number;
  costPrice: number;
  stock: number;
  minStock: number;
  unit: string;
  gstRate: number;
  hsnCode: string;
  isActive: boolean;
}

// Mock data
const mockProducts: Product[] = [
  { id: "1", name: "Tata Salt 1kg", sku: "SALT001", barcode: "8901030595301", category: "Grocery", price: 28, mrp: 30, costPrice: 24, stock: 150, minStock: 20, unit: "pcs", gstRate: 5, hsnCode: "2501", isActive: true },
  { id: "2", name: "Amul Butter 500g", sku: "BUTR001", barcode: "8901262011020", category: "Dairy", price: 275, mrp: 290, costPrice: 250, stock: 45, minStock: 10, unit: "pcs", gstRate: 12, hsnCode: "0405", isActive: true },
  { id: "3", name: "Maggi Noodles 70g", sku: "NOOD001", barcode: "8901058851458", category: "Instant Food", price: 14, mrp: 15, costPrice: 12, stock: 200, minStock: 30, unit: "pcs", gstRate: 18, hsnCode: "1902", isActive: true },
  { id: "4", name: "Parle-G Biscuits 800g", sku: "BISC001", barcode: "8904004400274", category: "Snacks", price: 85, mrp: 90, costPrice: 75, stock: 80, minStock: 15, unit: "pcs", gstRate: 18, hsnCode: "1905", isActive: true },
  { id: "5", name: "Surf Excel 1kg", sku: "DETG001", barcode: "8901030610325", category: "Household", price: 195, mrp: 210, costPrice: 170, stock: 60, minStock: 10, unit: "pcs", gstRate: 28, hsnCode: "3402", isActive: true },
  { id: "6", name: "Coca-Cola 750ml", sku: "BVRG001", barcode: "5449000000996", category: "Beverages", price: 38, mrp: 40, costPrice: 32, stock: 120, minStock: 25, unit: "pcs", gstRate: 28, hsnCode: "2202", isActive: true },
  { id: "7", name: "Britannia Bread", sku: "BREA001", barcode: "8901063090019", category: "Bakery", price: 45, mrp: 50, costPrice: 38, stock: 5, minStock: 10, unit: "pcs", gstRate: 0, hsnCode: "1905", isActive: true },
  { id: "8", name: "Fortune Sunflower Oil 1L", sku: "OIL001", barcode: "8901317500106", category: "Grocery", price: 145, mrp: 160, costPrice: 130, stock: 40, minStock: 10, unit: "pcs", gstRate: 5, hsnCode: "1512", isActive: true },
  { id: "9", name: "Dettol Soap 125g", sku: "SOAP001", barcode: "8901396332282", category: "Personal Care", price: 55, mrp: 60, costPrice: 48, stock: 95, minStock: 20, unit: "pcs", gstRate: 18, hsnCode: "3401", isActive: false },
  { id: "10", name: "Red Label Tea 500g", sku: "TEA001", barcode: "8901030791005", category: "Beverages", price: 285, mrp: 310, costPrice: 260, stock: 55, minStock: 10, unit: "pcs", gstRate: 5, hsnCode: "0902", isActive: true },
];

const categories = ["All", "Grocery", "Dairy", "Instant Food", "Snacks", "Household", "Beverages", "Bakery", "Personal Care"];
const gstRates = [0, 5, 12, 18, 28];
const units = ["pcs", "kg", "g", "L", "ml", "dozen", "pack"];

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState<Partial<Product>>({
    name: "",
    sku: "",
    barcode: "",
    category: "Grocery",
    price: 0,
    mrp: 0,
    costPrice: 0,
    stock: 0,
    minStock: 10,
    unit: "pcs",
    gstRate: 18,
    hsnCode: "",
    isActive: true,
  });

  // Filter products
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.barcode.includes(searchQuery);
    const matchesCategory = categoryFilter === "All" || product.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  // Stats
  const totalProducts = products.length;
  const activeProducts = products.filter((p) => p.isActive).length;
  const lowStockProducts = products.filter((p) => p.stock <= p.minStock).length;
  const totalValue = products.reduce((sum, p) => sum + p.costPrice * p.stock, 0);

  // Handle form submit
  const handleSubmit = () => {
    if (editingProduct) {
      // Update existing
      setProducts((prev) =>
        prev.map((p) =>
          p.id === editingProduct.id ? { ...p, ...formData } as Product : p
        )
      );
      setShowSuccess("Product updated successfully!");
    } else {
      // Add new
      const newProduct: Product = {
        id: Date.now().toString(),
        ...formData,
      } as Product;
      setProducts((prev) => [...prev, newProduct]);
      setShowSuccess("Product added successfully!");
    }

    setShowAddModal(false);
    setEditingProduct(null);
    resetForm();

    setTimeout(() => setShowSuccess(null), 3000);
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      name: "",
      sku: "",
      barcode: "",
      category: "Grocery",
      price: 0,
      mrp: 0,
      costPrice: 0,
      stock: 0,
      minStock: 10,
      unit: "pcs",
      gstRate: 18,
      hsnCode: "",
      isActive: true,
    });
  };

  // Open edit modal
  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setFormData(product);
    setShowAddModal(true);
  };

  // Delete product
  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    setShowDeleteConfirm(null);
    setShowSuccess("Product deleted successfully!");
    setTimeout(() => setShowSuccess(null), 3000);
  };

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0 h-14 bg-card border-b border-border flex items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <Package className="w-5 h-5 text-primary" />
          <h1 className="text-lg font-bold">Product Management</h1>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-sm font-medium hover:bg-muted transition-colors">
            <Upload className="w-4 h-4" />
            Import
          </button>
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-sm font-medium hover:bg-muted transition-colors">
            <Download className="w-4 h-4" />
            Export
          </button>
          <button
            onClick={() => {
              resetForm();
              setEditingProduct(null);
              setShowAddModal(true);
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Product
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="flex-shrink-0 p-4 border-b border-border">
        <div className="grid grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
            <div className="text-sm text-muted-foreground">Total Products</div>
            <div className="text-2xl font-bold text-primary mt-1">{totalProducts}</div>
          </div>
          <div className="p-4 rounded-xl bg-success/5 border border-success/20">
            <div className="text-sm text-muted-foreground">Active Products</div>
            <div className="text-2xl font-bold text-success mt-1">{activeProducts}</div>
          </div>
          <div className="p-4 rounded-xl bg-warning/5 border border-warning/20">
            <div className="text-sm text-muted-foreground">Low Stock Items</div>
            <div className="text-2xl font-bold text-warning mt-1">{lowStockProducts}</div>
          </div>
          <div className="p-4 rounded-xl bg-muted border border-border">
            <div className="text-sm text-muted-foreground">Stock Value</div>
            <div className="text-2xl font-bold mt-1">₹{totalValue.toLocaleString()}</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex-shrink-0 p-4 border-b border-border flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by name, SKU, or barcode..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 pl-10 pr-4 bg-background border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div className="flex gap-2">
          {categories.slice(0, 5).map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                categoryFilter === cat
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {cat}
            </button>
          ))}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="h-10 px-3 bg-muted border-0 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {categories.slice(5).map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto">
          <table className="w-full">
            <thead className="bg-muted/50 sticky top-0">
              <tr className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                <th className="px-6 py-3">Product</th>
                <th className="px-6 py-3">SKU / Barcode</th>
                <th className="px-6 py-3">Category</th>
                <th className="px-6 py-3 text-right">Price / MRP</th>
                <th className="px-6 py-3 text-center">Stock</th>
                <th className="px-6 py-3">GST</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium">{product.name}</div>
                    <div className="text-xs text-muted-foreground">HSN: {product.hsnCode}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-mono text-sm font-medium text-primary">{product.sku}</div>
                    <div className="text-xs text-muted-foreground">{product.barcode}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-muted">
                      {product.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="font-bold">₹{product.price}</div>
                    <div className="text-xs text-muted-foreground line-through">₹{product.mrp}</div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-sm font-medium ${
                        product.stock <= product.minStock
                          ? "bg-destructive/10 text-destructive"
                          : product.stock <= product.minStock * 2
                          ? "bg-warning/10 text-warning"
                          : "bg-success/10 text-success"
                      }`}
                    >
                      {product.stock} {product.unit}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm">{product.gstRate}%</span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                        product.isActive
                          ? "bg-success/10 text-success"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {product.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => openEditModal(product)}
                        className="p-2 rounded-lg hover:bg-muted transition-colors"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4 text-muted-foreground" />
                      </button>
                      <button
                        onClick={() => setShowDeleteConfirm(product.id)}
                        className="p-2 rounded-lg hover:bg-destructive/10 hover:text-destructive transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => {
              setShowAddModal(false);
              setEditingProduct(null);
            }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-2xl bg-card rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-border flex items-center justify-between">
                <h2 className="text-xl font-bold">
                  {editingProduct ? "Edit Product" : "Add New Product"}
                </h2>
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingProduct(null);
                  }}
                  className="p-2 rounded-lg hover:bg-muted transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6">
                <div className="grid grid-cols-2 gap-4">
                  {/* Name */}
                  <div className="col-span-2">
                    <label className="block text-sm font-medium mb-2">Product Name *</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                      placeholder="Enter product name"
                      className="w-full h-11 px-4 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  {/* SKU */}
                  <div>
                    <label className="block text-sm font-medium mb-2">SKU *</label>
                    <input
                      type="text"
                      value={formData.sku}
                      onChange={(e) => setFormData((prev) => ({ ...prev, sku: e.target.value }))}
                      placeholder="e.g., PROD001"
                      className="w-full h-11 px-4 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  {/* Barcode */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Barcode</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={formData.barcode}
                        onChange={(e) => setFormData((prev) => ({ ...prev, barcode: e.target.value }))}
                        placeholder="Scan or enter barcode"
                        className="w-full h-11 px-4 pr-10 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                      <Barcode className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    </div>
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Category</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value }))}
                      className="w-full h-11 px-4 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      {categories.slice(1).map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Unit */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Unit</label>
                    <select
                      value={formData.unit}
                      onChange={(e) => setFormData((prev) => ({ ...prev, unit: e.target.value }))}
                      className="w-full h-11 px-4 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      {units.map((unit) => (
                        <option key={unit} value={unit}>
                          {unit}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Price Section */}
                  <div className="col-span-2 p-4 bg-muted/50 rounded-lg">
                    <h3 className="font-medium mb-3 flex items-center gap-2">
                      <IndianRupee className="w-4 h-4" />
                      Pricing
                    </h3>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs text-muted-foreground mb-1">Cost Price</label>
                        <input
                          type="number"
                          value={formData.costPrice || ""}
                          onChange={(e) => setFormData((prev) => ({ ...prev, costPrice: Number(e.target.value) }))}
                          placeholder="₹0"
                          className="w-full h-10 px-3 bg-background border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-muted-foreground mb-1">Selling Price *</label>
                        <input
                          type="number"
                          value={formData.price || ""}
                          onChange={(e) => setFormData((prev) => ({ ...prev, price: Number(e.target.value) }))}
                          placeholder="₹0"
                          className="w-full h-10 px-3 bg-background border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-muted-foreground mb-1">MRP</label>
                        <input
                          type="number"
                          value={formData.mrp || ""}
                          onChange={(e) => setFormData((prev) => ({ ...prev, mrp: Number(e.target.value) }))}
                          placeholder="₹0"
                          className="w-full h-10 px-3 bg-background border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Stock Section */}
                  <div className="col-span-2 p-4 bg-muted/50 rounded-lg">
                    <h3 className="font-medium mb-3 flex items-center gap-2">
                      <Box className="w-4 h-4" />
                      Inventory
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs text-muted-foreground mb-1">Current Stock</label>
                        <input
                          type="number"
                          value={formData.stock || ""}
                          onChange={(e) => setFormData((prev) => ({ ...prev, stock: Number(e.target.value) }))}
                          placeholder="0"
                          className="w-full h-10 px-3 bg-background border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-muted-foreground mb-1">Minimum Stock Alert</label>
                        <input
                          type="number"
                          value={formData.minStock || ""}
                          onChange={(e) => setFormData((prev) => ({ ...prev, minStock: Number(e.target.value) }))}
                          placeholder="10"
                          className="w-full h-10 px-3 bg-background border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Tax Section */}
                  <div>
                    <label className="block text-sm font-medium mb-2">GST Rate</label>
                    <select
                      value={formData.gstRate}
                      onChange={(e) => setFormData((prev) => ({ ...prev, gstRate: Number(e.target.value) }))}
                      className="w-full h-11 px-4 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      {gstRates.map((rate) => (
                        <option key={rate} value={rate}>
                          {rate}%
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* HSN Code */}
                  <div>
                    <label className="block text-sm font-medium mb-2">HSN Code</label>
                    <input
                      type="text"
                      value={formData.hsnCode}
                      onChange={(e) => setFormData((prev) => ({ ...prev, hsnCode: e.target.value }))}
                      placeholder="Enter HSN code"
                      className="w-full h-11 px-4 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  {/* Status */}
                  <div className="col-span-2">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.isActive}
                        onChange={(e) => setFormData((prev) => ({ ...prev, isActive: e.target.checked }))}
                        className="w-5 h-5 rounded border-input text-primary focus:ring-primary"
                      />
                      <span className="font-medium">Active Product</span>
                      <span className="text-sm text-muted-foreground">
                        (Inactive products won't appear in POS)
                      </span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-muted/30 border-t border-border flex gap-3">
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingProduct(null);
                  }}
                  className="flex-1 h-11 rounded-lg border border-border font-medium hover:bg-muted transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={!formData.name || !formData.sku || !formData.price}
                  className="flex-1 h-11 rounded-lg bg-primary text-primary-foreground font-medium flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  {editingProduct ? "Update Product" : "Add Product"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setShowDeleteConfirm(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-md bg-card rounded-2xl shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-border">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center">
                    <AlertCircle className="w-6 h-6 text-destructive" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">Delete Product?</h2>
                    <p className="text-sm text-muted-foreground">This action cannot be undone</p>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-muted/30 border-t border-border flex gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(null)}
                  className="flex-1 h-11 rounded-lg border border-border font-medium hover:bg-muted transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => deleteProduct(showDeleteConfirm)}
                  className="flex-1 h-11 rounded-lg bg-destructive text-destructive-foreground font-medium hover:bg-destructive/90 transition-colors"
                >
                  Delete
                </button>
              </div>
            </motion.div>
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
            <span className="text-white font-medium">{showSuccess}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
