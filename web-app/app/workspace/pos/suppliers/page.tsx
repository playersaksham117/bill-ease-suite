"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Plus,
  Building2,
  Edit2,
  Trash2,
  X,
  Save,
  CheckCircle2,
  AlertCircle,
  Phone,
  Mail,
  MapPin,
  Globe,
  IndianRupee,
  Package,
  Calendar,
  Download,
  Upload,
  Eye,
  FileText,
  Truck,
  FileSpreadsheet,
  Wallet,
  CreditCard,
  Banknote,
  ArrowUpRight,
} from "lucide-react";

// Types
interface Supplier {
  id: string;
  companyName: string;
  contactPerson: string;
  phone: string;
  email?: string;
  address?: string;
  gstin?: string;
  website?: string;
  category: string;
  totalOrders: number;
  totalPurchases: number;
  lastOrder: Date | null;
  createdAt: Date;
  isActive: boolean;
  paymentTerms: string;
  notes?: string;
  creditLimit?: number;
  outstandingBalance?: number;
  cashPurchases?: number;
  creditPurchases?: number;
}

// Mock data
const mockSuppliers: Supplier[] = [
  { id: "1", companyName: "Tata Consumer Products", contactPerson: "Vikram Singh", phone: "9876543210", email: "orders@tata.com", address: "Tata Centre, Mumbai", gstin: "27AAAAA0000A1Z5", website: "www.tataconsumer.com", category: "Grocery", totalOrders: 45, totalPurchases: 485000, lastOrder: new Date(2025, 11, 20), createdAt: new Date(2025, 3, 15), isActive: true, paymentTerms: "Net 30", notes: "Primary salt and tea supplier", creditLimit: 200000, outstandingBalance: 85000, cashPurchases: 200000, creditPurchases: 285000 },
  { id: "2", companyName: "Amul Dairy", contactPerson: "Harsh Patel", phone: "9123456780", email: "supply@amul.coop", address: "Amul Dairy Road, Anand, Gujarat", gstin: "24BBBBB0000B2Z6", website: "www.amul.com", category: "Dairy", totalOrders: 62, totalPurchases: 325000, lastOrder: new Date(2025, 11, 21), createdAt: new Date(2025, 2, 10), isActive: true, paymentTerms: "Net 15", notes: "Dairy products - weekly delivery", creditLimit: 150000, outstandingBalance: 45000, cashPurchases: 180000, creditPurchases: 145000 },
  { id: "3", companyName: "Nestle India", contactPerson: "Priya Sharma", phone: "9988776655", email: "b2b@nestle.in", address: "Nestle House, Gurgaon", gstin: "06CCCCC0000C3Z7", website: "www.nestle.in", category: "Instant Food", totalOrders: 38, totalPurchases: 265000, lastOrder: new Date(2025, 11, 18), createdAt: new Date(2025, 4, 20), isActive: true, paymentTerms: "Net 45", creditLimit: 300000, outstandingBalance: 120000, cashPurchases: 65000, creditPurchases: 200000 },
  { id: "4", companyName: "Parle Products", contactPerson: "Rajesh Kumar", phone: "9555444333", email: "orders@parle.com", address: "Parle House, Vile Parle, Mumbai", gstin: "27DDDDD0000D4Z8", category: "Snacks", totalOrders: 52, totalPurchases: 198000, lastOrder: new Date(2025, 11, 19), createdAt: new Date(2025, 5, 5), isActive: true, paymentTerms: "Net 30", creditLimit: 100000, outstandingBalance: 35000, cashPurchases: 98000, creditPurchases: 100000 },
  { id: "5", companyName: "HUL Distributors", contactPerson: "Amit Verma", phone: "9111222333", email: "dist@hul.com", address: "HUL House, Mumbai", gstin: "27EEEEE0000E5Z9", website: "www.hul.co.in", category: "Household", totalOrders: 28, totalPurchases: 156000, lastOrder: new Date(2025, 11, 15), createdAt: new Date(2025, 6, 12), isActive: false, paymentTerms: "Net 30", notes: "Secondary supplier - use when primary unavailable", creditLimit: 50000, outstandingBalance: 28000, cashPurchases: 78000, creditPurchases: 78000 },
  { id: "6", companyName: "Coca-Cola India", contactPerson: "Neha Gupta", phone: "9444555666", email: "supply@coca-cola.in", address: "Coca-Cola House, Gurgaon", gstin: "06FFFFF0000F6Z0", category: "Beverages", totalOrders: 35, totalPurchases: 142000, lastOrder: new Date(2025, 11, 22), createdAt: new Date(2025, 7, 25), isActive: true, paymentTerms: "COD", creditLimit: 0, outstandingBalance: 0, cashPurchases: 142000, creditPurchases: 0 },
];

const categories = ["Grocery", "Dairy", "Instant Food", "Snacks", "Household", "Beverages", "Bakery", "Personal Care"];
const paymentTermsOptions = ["COD", "Net 7", "Net 15", "Net 30", "Net 45", "Net 60"];

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>(mockSuppliers);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    companyName: "",
    contactPerson: "",
    phone: "",
    email: "",
    address: "",
    gstin: "",
    website: "",
    category: "Grocery",
    paymentTerms: "Net 30",
    notes: "",
    isActive: true,
  });

  // Filter suppliers
  const filteredSuppliers = suppliers.filter((supplier) => {
    const matchesSearch =
      supplier.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      supplier.contactPerson.toLowerCase().includes(searchQuery.toLowerCase()) ||
      supplier.phone.includes(searchQuery);
    const matchesCategory = categoryFilter === "all" || supplier.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  // Stats
  const totalSuppliers = suppliers.length;
  const activeSuppliers = suppliers.filter((s) => s.isActive).length;
  const totalPurchases = suppliers.reduce((sum, s) => sum + s.totalPurchases, 0);
  const totalOrders = suppliers.reduce((sum, s) => sum + s.totalOrders, 0);

  // Handle form submit
  const handleSubmit = () => {
    if (editingSupplier) {
      setSuppliers((prev) =>
        prev.map((s) =>
          s.id === editingSupplier.id
            ? { ...s, ...formData }
            : s
        )
      );
      setShowSuccess("Supplier updated successfully!");
    } else {
      const newSupplier: Supplier = {
        id: Date.now().toString(),
        ...formData,
        totalOrders: 0,
        totalPurchases: 0,
        lastOrder: null,
        createdAt: new Date(),
      };
      setSuppliers((prev) => [...prev, newSupplier]);
      setShowSuccess("Supplier added successfully!");
    }

    setShowAddModal(false);
    setEditingSupplier(null);
    resetForm();
    setTimeout(() => setShowSuccess(null), 3000);
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      companyName: "",
      contactPerson: "",
      phone: "",
      email: "",
      address: "",
      gstin: "",
      website: "",
      category: "Grocery",
      paymentTerms: "Net 30",
      notes: "",
      isActive: true,
    });
  };

  // Open edit modal
  const openEditModal = (supplier: Supplier) => {
    setEditingSupplier(supplier);
    setFormData({
      companyName: supplier.companyName,
      contactPerson: supplier.contactPerson,
      phone: supplier.phone,
      email: supplier.email || "",
      address: supplier.address || "",
      gstin: supplier.gstin || "",
      website: supplier.website || "",
      category: supplier.category,
      paymentTerms: supplier.paymentTerms,
      notes: supplier.notes || "",
      isActive: supplier.isActive,
    });
    setShowAddModal(true);
  };

  // Delete supplier
  const deleteSupplier = (id: string) => {
    setSuppliers((prev) => prev.filter((s) => s.id !== id));
    setShowDeleteConfirm(null);
    if (selectedSupplier?.id === id) {
      setSelectedSupplier(null);
    }
    setShowSuccess("Supplier deleted successfully!");
    setTimeout(() => setShowSuccess(null), 3000);
  };

  // Format date
  const formatDate = (date: Date | null) => {
    if (!date) return "Never";
    return date.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
  };

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0 h-14 bg-card border-b border-border flex items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <Building2 className="w-5 h-5 text-primary" />
          <h1 className="text-lg font-bold">Supplier Management</h1>
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
              setEditingSupplier(null);
              setShowAddModal(true);
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Supplier
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="flex-shrink-0 p-4 border-b border-border">
        <div className="grid grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
            <div className="text-sm text-muted-foreground">Total Suppliers</div>
            <div className="text-2xl font-bold text-primary mt-1">{totalSuppliers}</div>
          </div>
          <div className="p-4 rounded-xl bg-success/5 border border-success/20">
            <div className="text-sm text-muted-foreground">Active Suppliers</div>
            <div className="text-2xl font-bold text-success mt-1">{activeSuppliers}</div>
          </div>
          <div className="p-4 rounded-xl bg-warning/5 border border-warning/20">
            <div className="text-sm text-muted-foreground">Total Orders</div>
            <div className="text-2xl font-bold text-warning mt-1">{totalOrders}</div>
          </div>
          <div className="p-4 rounded-xl bg-muted border border-border">
            <div className="text-sm text-muted-foreground">Total Purchases</div>
            <div className="text-2xl font-bold mt-1">₹{(totalPurchases / 100000).toFixed(1)}L</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex-shrink-0 p-4 border-b border-border flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by company, contact, or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 pl-10 pr-4 bg-background border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="h-10 px-4 bg-background border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="all">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Supplier List */}
        <div className="flex-1 overflow-y-auto">
          <table className="w-full">
            <thead className="bg-muted/50 sticky top-0">
              <tr className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                <th className="px-6 py-3">Supplier</th>
                <th className="px-6 py-3">Contact</th>
                <th className="px-6 py-3">Category</th>
                <th className="px-6 py-3 text-center">Orders</th>
                <th className="px-6 py-3 text-right">Total Purchases</th>
                <th className="px-6 py-3">Payment Terms</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredSuppliers.map((supplier) => (
                <tr
                  key={supplier.id}
                  className={`hover:bg-muted/30 transition-colors cursor-pointer ${
                    selectedSupplier?.id === supplier.id ? "bg-primary/5" : ""
                  }`}
                  onClick={() => setSelectedSupplier(supplier)}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Building2 className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <div className="font-medium">{supplier.companyName}</div>
                        {supplier.gstin && (
                          <div className="text-xs text-muted-foreground">
                            GSTIN: {supplier.gstin}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium">{supplier.contactPerson}</div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Phone className="w-3 h-3" />
                      {supplier.phone}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-muted">
                      {supplier.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Truck className="w-4 h-4 text-muted-foreground" />
                      <span className="font-medium">{supplier.totalOrders}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="font-bold">₹{supplier.totalPurchases.toLocaleString()}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-primary/10 text-primary">
                      {supplier.paymentTerms}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                        supplier.isActive
                          ? "bg-success/10 text-success"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {supplier.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedSupplier(supplier);
                        }}
                        className="p-2 rounded-lg hover:bg-muted transition-colors"
                        title="View"
                      >
                        <Eye className="w-4 h-4 text-muted-foreground" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openEditModal(supplier);
                        }}
                        className="p-2 rounded-lg hover:bg-muted transition-colors"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4 text-muted-foreground" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowDeleteConfirm(supplier.id);
                        }}
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

        {/* Supplier Detail Panel */}
        <AnimatePresence>
          {selectedSupplier && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 400, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              className="flex-shrink-0 border-l border-border bg-card overflow-hidden"
            >
              <div className="w-[400px] h-full flex flex-col">
                <div className="p-6 border-b border-border">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold">Supplier Details</h3>
                    <button
                      onClick={() => setSelectedSupplier(null)}
                      className="p-2 rounded-lg hover:bg-muted transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Building2 className="w-8 h-8 text-primary" />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold">{selectedSupplier.companyName}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-muted">
                          {selectedSupplier.category}
                        </span>
                        <span
                          className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                            selectedSupplier.isActive
                              ? "bg-success/10 text-success"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {selectedSupplier.isActive ? "Active" : "Inactive"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
                      <div className="text-xs text-muted-foreground">Total Purchases</div>
                      <div className="text-lg font-bold text-primary mt-1">
                        ₹{selectedSupplier.totalPurchases.toLocaleString()}
                      </div>
                    </div>
                    <div className="p-3 rounded-lg bg-success/5 border border-success/20">
                      <div className="text-xs text-muted-foreground">Orders</div>
                      <div className="text-lg font-bold text-success mt-1">
                        {selectedSupplier.totalOrders}
                      </div>
                    </div>
                  </div>

                  {/* Credit Account */}
                  {(selectedSupplier.creditLimit ?? 0) > 0 && (
                    <div className="p-4 rounded-xl bg-card border border-border">
                      <div className="flex items-center justify-between mb-3">
                        <h5 className="text-sm font-medium flex items-center gap-2">
                          <Wallet className="w-4 h-4 text-warning" />
                          Credit Account
                        </h5>
                        <span className={`text-xs px-2 py-1 rounded-full ${(selectedSupplier.outstandingBalance ?? 0) > 0 ? "bg-destructive/10 text-destructive" : "bg-success/10 text-success"}`}>
                          {(selectedSupplier.outstandingBalance ?? 0) > 0 ? "Payable" : "Clear"}
                        </span>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Credit Limit</span>
                          <span className="font-medium">₹{(selectedSupplier.creditLimit ?? 0).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Outstanding</span>
                          <span className="font-bold text-destructive">₹{(selectedSupplier.outstandingBalance ?? 0).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Available</span>
                          <span className="font-medium text-success">₹{((selectedSupplier.creditLimit ?? 0) - (selectedSupplier.outstandingBalance ?? 0)).toLocaleString()}</span>
                        </div>
                        <div className="w-full h-2 bg-muted rounded-full mt-2 overflow-hidden">
                          <div 
                            className="h-full bg-warning rounded-full transition-all"
                            style={{ width: `${Math.min(100, ((selectedSupplier.outstandingBalance ?? 0) / (selectedSupplier.creditLimit ?? 1)) * 100)}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Purchase Breakdown */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-lg bg-success/5 border border-success/20">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Banknote className="w-3 h-3" />
                        Cash Purchases
                      </div>
                      <div className="text-lg font-bold text-success mt-1">
                        ₹{(selectedSupplier.cashPurchases ?? 0).toLocaleString()}
                      </div>
                    </div>
                    <div className="p-3 rounded-lg bg-warning/5 border border-warning/20">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <CreditCard className="w-3 h-3" />
                        Credit Purchases
                      </div>
                      <div className="text-lg font-bold text-warning mt-1">
                        ₹{(selectedSupplier.creditPurchases ?? 0).toLocaleString()}
                      </div>
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div>
                    <h5 className="text-sm font-medium text-muted-foreground mb-3">
                      Contact Information
                    </h5>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                          <Building2 className="w-4 h-4 text-muted-foreground" />
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground">Contact Person</div>
                          <div className="font-medium">{selectedSupplier.contactPerson}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                          <Phone className="w-4 h-4 text-muted-foreground" />
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground">Phone</div>
                          <div>{selectedSupplier.phone}</div>
                        </div>
                      </div>
                      {selectedSupplier.email && (
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                            <Mail className="w-4 h-4 text-muted-foreground" />
                          </div>
                          <div>
                            <div className="text-xs text-muted-foreground">Email</div>
                            <div>{selectedSupplier.email}</div>
                          </div>
                        </div>
                      )}
                      {selectedSupplier.website && (
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                            <Globe className="w-4 h-4 text-muted-foreground" />
                          </div>
                          <div>
                            <div className="text-xs text-muted-foreground">Website</div>
                            <div>{selectedSupplier.website}</div>
                          </div>
                        </div>
                      )}
                      {selectedSupplier.address && (
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                            <MapPin className="w-4 h-4 text-muted-foreground" />
                          </div>
                          <div>
                            <div className="text-xs text-muted-foreground">Address</div>
                            <div>{selectedSupplier.address}</div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Business Info */}
                  <div>
                    <h5 className="text-sm font-medium text-muted-foreground mb-3">
                      Business Information
                    </h5>
                    <div className="space-y-2 text-sm">
                      {selectedSupplier.gstin && (
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">GSTIN</span>
                          <span className="font-mono">{selectedSupplier.gstin}</span>
                        </div>
                      )}
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Payment Terms</span>
                        <span className="font-medium">{selectedSupplier.paymentTerms}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Supplier Since</span>
                        <span>{formatDate(selectedSupplier.createdAt)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Last Order</span>
                        <span>{formatDate(selectedSupplier.lastOrder)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Notes */}
                  {selectedSupplier.notes && (
                    <div>
                      <h5 className="text-sm font-medium text-muted-foreground mb-2">Notes</h5>
                      <div className="p-3 bg-muted/50 rounded-lg text-sm">
                        {selectedSupplier.notes}
                      </div>
                    </div>
                  )}
                </div>

                <div className="p-4 border-t border-border space-y-2">
                  <button
                    onClick={() => window.location.href = `/workspace/pos/suppliers/${selectedSupplier.id}/statement`}
                    className="w-full h-11 rounded-lg bg-warning text-warning-foreground font-medium flex items-center justify-center gap-2 hover:bg-warning/90 transition-colors"
                  >
                    <FileSpreadsheet className="w-4 h-4" />
                    View Account Statement
                    <ArrowUpRight className="w-4 h-4" />
                  </button>
                  <div className="flex gap-2">
                    <button
                      onClick={() => openEditModal(selectedSupplier)}
                      className="flex-1 h-10 rounded-lg border border-border font-medium flex items-center justify-center gap-2 hover:bg-muted transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                      Edit
                    </button>
                    <button className="flex-1 h-10 rounded-lg bg-primary text-primary-foreground font-medium flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors">
                      <FileText className="w-4 h-4" />
                      New Order
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
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
              setEditingSupplier(null);
            }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-lg bg-card rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-border flex items-center justify-between">
                <h2 className="text-xl font-bold">
                  {editingSupplier ? "Edit Supplier" : "Add New Supplier"}
                </h2>
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingSupplier(null);
                  }}
                  className="p-2 rounded-lg hover:bg-muted transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {/* Company Name */}
                <div>
                  <label className="block text-sm font-medium mb-2">Company Name *</label>
                  <input
                    type="text"
                    value={formData.companyName}
                    onChange={(e) => setFormData((prev) => ({ ...prev, companyName: e.target.value }))}
                    placeholder="Enter company name"
                    className="w-full h-11 px-4 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                {/* Contact Person */}
                <div>
                  <label className="block text-sm font-medium mb-2">Contact Person *</label>
                  <input
                    type="text"
                    value={formData.contactPerson}
                    onChange={(e) => setFormData((prev) => ({ ...prev, contactPerson: e.target.value }))}
                    placeholder="Enter contact person name"
                    className="w-full h-11 px-4 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium mb-2">Phone Number *</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                    placeholder="Enter phone number"
                    className="w-full h-11 px-4 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                    placeholder="Enter email address"
                    className="w-full h-11 px-4 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                {/* Category & Payment Terms */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Category</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value }))}
                      className="w-full h-11 px-4 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Payment Terms</label>
                    <select
                      value={formData.paymentTerms}
                      onChange={(e) => setFormData((prev) => ({ ...prev, paymentTerms: e.target.value }))}
                      className="w-full h-11 px-4 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      {paymentTermsOptions.map((term) => (
                        <option key={term} value={term}>{term}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Address */}
                <div>
                  <label className="block text-sm font-medium mb-2">Address</label>
                  <textarea
                    value={formData.address}
                    onChange={(e) => setFormData((prev) => ({ ...prev, address: e.target.value }))}
                    placeholder="Enter address"
                    rows={2}
                    className="w-full px-4 py-3 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  />
                </div>

                {/* GSTIN */}
                <div>
                  <label className="block text-sm font-medium mb-2">GSTIN</label>
                  <input
                    type="text"
                    value={formData.gstin}
                    onChange={(e) => setFormData((prev) => ({ ...prev, gstin: e.target.value.toUpperCase() }))}
                    placeholder="e.g., 27AAAAA0000A1Z5"
                    className="w-full h-11 px-4 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary font-mono"
                  />
                </div>

                {/* Website */}
                <div>
                  <label className="block text-sm font-medium mb-2">Website</label>
                  <input
                    type="text"
                    value={formData.website}
                    onChange={(e) => setFormData((prev) => ({ ...prev, website: e.target.value }))}
                    placeholder="www.example.com"
                    className="w-full h-11 px-4 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-sm font-medium mb-2">Notes</label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
                    placeholder="Any special notes about this supplier"
                    rows={2}
                    className="w-full px-4 py-3 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  />
                </div>

                {/* Status */}
                <div>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => setFormData((prev) => ({ ...prev, isActive: e.target.checked }))}
                      className="w-5 h-5 rounded border-input text-primary focus:ring-primary"
                    />
                    <span className="font-medium">Active Supplier</span>
                  </label>
                </div>
              </div>

              <div className="p-6 bg-muted/30 border-t border-border flex gap-3">
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingSupplier(null);
                  }}
                  className="flex-1 h-11 rounded-lg border border-border font-medium hover:bg-muted transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={!formData.companyName || !formData.contactPerson || !formData.phone}
                  className="flex-1 h-11 rounded-lg bg-primary text-primary-foreground font-medium flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  {editingSupplier ? "Update" : "Add Supplier"}
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
                    <h2 className="text-xl font-bold">Delete Supplier?</h2>
                    <p className="text-sm text-muted-foreground">
                      This will remove all supplier data
                    </p>
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
                  onClick={() => deleteSupplier(showDeleteConfirm)}
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
