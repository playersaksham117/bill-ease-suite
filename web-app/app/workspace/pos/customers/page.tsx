"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Plus,
  UserCheck,
  Edit2,
  Trash2,
  X,
  Save,
  CheckCircle2,
  AlertCircle,
  Phone,
  Mail,
  MapPin,
  Building2,
  IndianRupee,
  ShoppingCart,
  Calendar,
  Download,
  Upload,
  Filter,
  Eye,
  FileSpreadsheet,
  Wallet,
  CreditCard,
  Banknote,
  ArrowUpRight,
} from "lucide-react";

// Types
interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  address?: string;
  gstin?: string;
  type: "regular" | "wholesale" | "retail";
  totalPurchases: number;
  totalSpent: number;
  lastPurchase: Date | null;
  createdAt: Date;
  isActive: boolean;
  notes?: string;
  creditLimit?: number;
  creditBalance?: number;
  cashSales?: number;
  creditSales?: number;
}

// Mock data
const mockCustomers: Customer[] = [
  { id: "1", name: "Rahul Sharma", phone: "9876543210", email: "rahul@email.com", address: "123, MG Road, Delhi", gstin: "07AAAAA0000A1Z5", type: "wholesale", totalPurchases: 45, totalSpent: 125680, lastPurchase: new Date(2025, 11, 22), createdAt: new Date(2025, 6, 15), isActive: true, notes: "Premium customer - 10% discount", creditLimit: 50000, creditBalance: 12580, cashSales: 85000, creditSales: 40680 },
  { id: "2", name: "Priya Patel", phone: "9123456780", email: "priya.p@email.com", address: "456, Sector 18, Noida", type: "regular", totalPurchases: 28, totalSpent: 45890, lastPurchase: new Date(2025, 11, 21), createdAt: new Date(2025, 8, 20), isActive: true, creditLimit: 20000, creditBalance: 3500, cashSales: 38000, creditSales: 7890 },
  { id: "3", name: "Amit Kumar", phone: "9988776655", email: "amit.kumar@business.com", address: "789, Industrial Area, Gurgaon", gstin: "06BBBBB0000B2Z6", type: "wholesale", totalPurchases: 62, totalSpent: 289450, lastPurchase: new Date(2025, 11, 20), createdAt: new Date(2025, 4, 10), isActive: true, notes: "B2B client - Monthly billing", creditLimit: 100000, creditBalance: 45000, cashSales: 120000, creditSales: 169450 },
  { id: "4", name: "Sunita Verma", phone: "9555444333", type: "retail", totalPurchases: 8, totalSpent: 12340, lastPurchase: new Date(2025, 11, 15), createdAt: new Date(2025, 10, 5), isActive: true, creditLimit: 0, creditBalance: 0, cashSales: 12340, creditSales: 0 },
  { id: "5", name: "Rajesh Gupta", phone: "9111222333", email: "rajesh@shop.com", address: "321, Market Road, Mumbai", type: "regular", totalPurchases: 15, totalSpent: 28900, lastPurchase: new Date(2025, 10, 30), createdAt: new Date(2025, 7, 25), isActive: false, creditLimit: 15000, creditBalance: 8500, cashSales: 15000, creditSales: 13900 },
  { id: "6", name: "Neha Singh", phone: "9444555666", email: "neha.s@gmail.com", type: "retail", totalPurchases: 12, totalSpent: 18560, lastPurchase: new Date(2025, 11, 18), createdAt: new Date(2025, 9, 12), isActive: true, creditLimit: 5000, creditBalance: 0, cashSales: 18560, creditSales: 0 },
];

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>(mockCustomers);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | "regular" | "wholesale" | "retail">("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    gstin: "",
    type: "regular" as "regular" | "wholesale" | "retail",
    notes: "",
    isActive: true,
  });

  // Filter customers
  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch =
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.phone.includes(searchQuery) ||
      customer.email?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === "all" || customer.type === typeFilter;
    return matchesSearch && matchesType;
  });

  // Stats
  const totalCustomers = customers.length;
  const activeCustomers = customers.filter((c) => c.isActive).length;
  const wholesaleCustomers = customers.filter((c) => c.type === "wholesale").length;
  const totalRevenue = customers.reduce((sum, c) => sum + c.totalSpent, 0);

  // Handle form submit
  const handleSubmit = () => {
    if (editingCustomer) {
      setCustomers((prev) =>
        prev.map((c) =>
          c.id === editingCustomer.id
            ? { ...c, ...formData }
            : c
        )
      );
      setShowSuccess("Customer updated successfully!");
    } else {
      const newCustomer: Customer = {
        id: Date.now().toString(),
        ...formData,
        totalPurchases: 0,
        totalSpent: 0,
        lastPurchase: null,
        createdAt: new Date(),
      };
      setCustomers((prev) => [...prev, newCustomer]);
      setShowSuccess("Customer added successfully!");
    }

    setShowAddModal(false);
    setEditingCustomer(null);
    resetForm();
    setTimeout(() => setShowSuccess(null), 3000);
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      name: "",
      phone: "",
      email: "",
      address: "",
      gstin: "",
      type: "regular",
      notes: "",
      isActive: true,
    });
  };

  // Open edit modal
  const openEditModal = (customer: Customer) => {
    setEditingCustomer(customer);
    setFormData({
      name: customer.name,
      phone: customer.phone,
      email: customer.email || "",
      address: customer.address || "",
      gstin: customer.gstin || "",
      type: customer.type,
      notes: customer.notes || "",
      isActive: customer.isActive,
    });
    setShowAddModal(true);
  };

  // Delete customer
  const deleteCustomer = (id: string) => {
    setCustomers((prev) => prev.filter((c) => c.id !== id));
    setShowDeleteConfirm(null);
    if (selectedCustomer?.id === id) {
      setSelectedCustomer(null);
    }
    setShowSuccess("Customer deleted successfully!");
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
          <UserCheck className="w-5 h-5 text-primary" />
          <h1 className="text-lg font-bold">Customer Management</h1>
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
              setEditingCustomer(null);
              setShowAddModal(true);
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Customer
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="flex-shrink-0 p-4 border-b border-border">
        <div className="grid grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
            <div className="text-sm text-muted-foreground">Total Customers</div>
            <div className="text-2xl font-bold text-primary mt-1">{totalCustomers}</div>
          </div>
          <div className="p-4 rounded-xl bg-success/5 border border-success/20">
            <div className="text-sm text-muted-foreground">Active Customers</div>
            <div className="text-2xl font-bold text-success mt-1">{activeCustomers}</div>
          </div>
          <div className="p-4 rounded-xl bg-warning/5 border border-warning/20">
            <div className="text-sm text-muted-foreground">Wholesale Accounts</div>
            <div className="text-2xl font-bold text-warning mt-1">{wholesaleCustomers}</div>
          </div>
          <div className="p-4 rounded-xl bg-muted border border-border">
            <div className="text-sm text-muted-foreground">Total Revenue</div>
            <div className="text-2xl font-bold mt-1">₹{totalRevenue.toLocaleString()}</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex-shrink-0 p-4 border-b border-border flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by name, phone, or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 pl-10 pr-4 bg-background border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div className="flex gap-2">
          {(["all", "regular", "wholesale", "retail"] as const).map((type) => (
            <button
              key={type}
              onClick={() => setTypeFilter(type)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                typeFilter === type
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Customer List */}
        <div className="flex-1 overflow-y-auto">
          <table className="w-full">
            <thead className="bg-muted/50 sticky top-0">
              <tr className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                <th className="px-6 py-3">Customer</th>
                <th className="px-6 py-3">Contact</th>
                <th className="px-6 py-3">Type</th>
                <th className="px-6 py-3 text-center">Purchases</th>
                <th className="px-6 py-3 text-right">Total Spent</th>
                <th className="px-6 py-3">Last Purchase</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredCustomers.map((customer) => (
                <tr
                  key={customer.id}
                  className={`hover:bg-muted/30 transition-colors cursor-pointer ${
                    selectedCustomer?.id === customer.id ? "bg-primary/5" : ""
                  }`}
                  onClick={() => setSelectedCustomer(customer)}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-sm font-bold text-primary">
                          {customer.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium">{customer.name}</div>
                        {customer.gstin && (
                          <div className="text-xs text-muted-foreground">
                            GSTIN: {customer.gstin}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1 text-sm">
                      <Phone className="w-3.5 h-3.5 text-muted-foreground" />
                      {customer.phone}
                    </div>
                    {customer.email && (
                      <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                        <Mail className="w-3 h-3" />
                        {customer.email}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2.5 py-1 text-xs font-medium rounded-full ${
                        customer.type === "wholesale"
                          ? "bg-warning/10 text-warning"
                          : customer.type === "regular"
                          ? "bg-primary/10 text-primary"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {customer.type.charAt(0).toUpperCase() + customer.type.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <ShoppingCart className="w-4 h-4 text-muted-foreground" />
                      <span className="font-medium">{customer.totalPurchases}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="font-bold">₹{customer.totalSpent.toLocaleString()}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm">{formatDate(customer.lastPurchase)}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                        customer.isActive
                          ? "bg-success/10 text-success"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {customer.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedCustomer(customer);
                        }}
                        className="p-2 rounded-lg hover:bg-muted transition-colors"
                        title="View"
                      >
                        <Eye className="w-4 h-4 text-muted-foreground" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openEditModal(customer);
                        }}
                        className="p-2 rounded-lg hover:bg-muted transition-colors"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4 text-muted-foreground" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowDeleteConfirm(customer.id);
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

        {/* Customer Detail Panel */}
        <AnimatePresence>
          {selectedCustomer && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 400, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              className="flex-shrink-0 border-l border-border bg-card overflow-hidden"
            >
              <div className="w-[400px] h-full flex flex-col">
                <div className="p-6 border-b border-border">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold">Customer Details</h3>
                    <button
                      onClick={() => setSelectedCustomer(null)}
                      className="p-2 rounded-lg hover:bg-muted transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-2xl font-bold text-primary">
                        {selectedCustomer.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <h4 className="text-xl font-bold">{selectedCustomer.name}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span
                          className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                            selectedCustomer.type === "wholesale"
                              ? "bg-warning/10 text-warning"
                              : selectedCustomer.type === "regular"
                              ? "bg-primary/10 text-primary"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {selectedCustomer.type.charAt(0).toUpperCase() +
                            selectedCustomer.type.slice(1)}
                        </span>
                        <span
                          className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                            selectedCustomer.isActive
                              ? "bg-success/10 text-success"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {selectedCustomer.isActive ? "Active" : "Inactive"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
                      <div className="text-xs text-muted-foreground">Total Spent</div>
                      <div className="text-lg font-bold text-primary mt-1">
                        ₹{selectedCustomer.totalSpent.toLocaleString()}
                      </div>
                    </div>
                    <div className="p-3 rounded-lg bg-success/5 border border-success/20">
                      <div className="text-xs text-muted-foreground">Purchases</div>
                      <div className="text-lg font-bold text-success mt-1">
                        {selectedCustomer.totalPurchases}
                      </div>
                    </div>
                  </div>

                  {/* Credit Balance */}
                  {(selectedCustomer.creditLimit ?? 0) > 0 && (
                    <div className="p-4 rounded-xl bg-card border border-border">
                      <div className="flex items-center justify-between mb-3">
                        <h5 className="text-sm font-medium flex items-center gap-2">
                          <Wallet className="w-4 h-4 text-warning" />
                          Credit Account
                        </h5>
                        <span className={`text-xs px-2 py-1 rounded-full ${(selectedCustomer.creditBalance ?? 0) > 0 ? "bg-destructive/10 text-destructive" : "bg-success/10 text-success"}`}>
                          {(selectedCustomer.creditBalance ?? 0) > 0 ? "Outstanding" : "Clear"}
                        </span>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Credit Limit</span>
                          <span className="font-medium">₹{(selectedCustomer.creditLimit ?? 0).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Outstanding</span>
                          <span className="font-bold text-destructive">₹{(selectedCustomer.creditBalance ?? 0).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Available</span>
                          <span className="font-medium text-success">₹{((selectedCustomer.creditLimit ?? 0) - (selectedCustomer.creditBalance ?? 0)).toLocaleString()}</span>
                        </div>
                        <div className="w-full h-2 bg-muted rounded-full mt-2 overflow-hidden">
                          <div 
                            className="h-full bg-warning rounded-full transition-all"
                            style={{ width: `${Math.min(100, ((selectedCustomer.creditBalance ?? 0) / (selectedCustomer.creditLimit ?? 1)) * 100)}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Sales Breakdown */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-lg bg-success/5 border border-success/20">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Banknote className="w-3 h-3" />
                        Cash Sales
                      </div>
                      <div className="text-lg font-bold text-success mt-1">
                        ₹{(selectedCustomer.cashSales ?? 0).toLocaleString()}
                      </div>
                    </div>
                    <div className="p-3 rounded-lg bg-warning/5 border border-warning/20">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <CreditCard className="w-3 h-3" />
                        Credit Sales
                      </div>
                      <div className="text-lg font-bold text-warning mt-1">
                        ₹{(selectedCustomer.creditSales ?? 0).toLocaleString()}
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
                        <Phone className="w-4 h-4 text-muted-foreground" />
                        <span>{selectedCustomer.phone}</span>
                      </div>
                      {selectedCustomer.email && (
                        <div className="flex items-center gap-3">
                          <Mail className="w-4 h-4 text-muted-foreground" />
                          <span>{selectedCustomer.email}</span>
                        </div>
                      )}
                      {selectedCustomer.address && (
                        <div className="flex items-start gap-3">
                          <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
                          <span>{selectedCustomer.address}</span>
                        </div>
                      )}
                      {selectedCustomer.gstin && (
                        <div className="flex items-center gap-3">
                          <Building2 className="w-4 h-4 text-muted-foreground" />
                          <span className="font-mono text-sm">{selectedCustomer.gstin}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Dates */}
                  <div>
                    <h5 className="text-sm font-medium text-muted-foreground mb-3">History</h5>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Customer Since</span>
                        <span>{formatDate(selectedCustomer.createdAt)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Last Purchase</span>
                        <span>{formatDate(selectedCustomer.lastPurchase)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Notes */}
                  {selectedCustomer.notes && (
                    <div>
                      <h5 className="text-sm font-medium text-muted-foreground mb-2">Notes</h5>
                      <div className="p-3 bg-muted/50 rounded-lg text-sm">
                        {selectedCustomer.notes}
                      </div>
                    </div>
                  )}
                </div>

                <div className="p-4 border-t border-border space-y-2">
                  <button
                    onClick={() => window.location.href = `/workspace/pos/customers/${selectedCustomer.id}/statement`}
                    className="w-full h-11 rounded-lg bg-warning text-warning-foreground font-medium flex items-center justify-center gap-2 hover:bg-warning/90 transition-colors"
                  >
                    <FileSpreadsheet className="w-4 h-4" />
                    View Account Statement
                    <ArrowUpRight className="w-4 h-4" />
                  </button>
                  <div className="flex gap-2">
                    <button
                      onClick={() => openEditModal(selectedCustomer)}
                      className="flex-1 h-10 rounded-lg border border-border font-medium flex items-center justify-center gap-2 hover:bg-muted transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                      Edit
                    </button>
                    <button className="flex-1 h-10 rounded-lg bg-primary text-primary-foreground font-medium flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors">
                      <ShoppingCart className="w-4 h-4" />
                      New Sale
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
              setEditingCustomer(null);
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
                  {editingCustomer ? "Edit Customer" : "Add New Customer"}
                </h2>
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingCustomer(null);
                  }}
                  className="p-2 rounded-lg hover:bg-muted transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium mb-2">Customer Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter customer name"
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

                {/* Type */}
                <div>
                  <label className="block text-sm font-medium mb-2">Customer Type</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(["regular", "wholesale", "retail"] as const).map((type) => (
                      <button
                        key={type}
                        onClick={() => setFormData((prev) => ({ ...prev, type }))}
                        className={`p-3 rounded-lg border-2 text-sm font-medium transition-colors ${
                          formData.type === type
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </button>
                    ))}
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
                  <label className="block text-sm font-medium mb-2">GSTIN (for B2B)</label>
                  <input
                    type="text"
                    value={formData.gstin}
                    onChange={(e) => setFormData((prev) => ({ ...prev, gstin: e.target.value.toUpperCase() }))}
                    placeholder="e.g., 07AAAAA0000A1Z5"
                    className="w-full h-11 px-4 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary font-mono"
                  />
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-sm font-medium mb-2">Notes</label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
                    placeholder="Any special notes about this customer"
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
                    <span className="font-medium">Active Customer</span>
                  </label>
                </div>
              </div>

              <div className="p-6 bg-muted/30 border-t border-border flex gap-3">
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingCustomer(null);
                  }}
                  className="flex-1 h-11 rounded-lg border border-border font-medium hover:bg-muted transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={!formData.name || !formData.phone}
                  className="flex-1 h-11 rounded-lg bg-primary text-primary-foreground font-medium flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  {editingCustomer ? "Update" : "Add Customer"}
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
                    <h2 className="text-xl font-bold">Delete Customer?</h2>
                    <p className="text-sm text-muted-foreground">
                      This will remove all customer data
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
                  onClick={() => deleteCustomer(showDeleteConfirm)}
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
