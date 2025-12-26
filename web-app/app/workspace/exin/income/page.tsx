"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowUpCircle,
  Search,
  Plus,
  Calendar,
  X,
  Save,
  Landmark,
  IndianRupee,
  CreditCard,
  Filter,
  Download,
  Edit2,
  Trash2,
  CheckCircle2,
  Tag,
  FileText,
  MoreVertical,
  TrendingUp,
} from "lucide-react";

// Types
interface IncomeRecord {
  id: string;
  date: string;
  category: string;
  description: string;
  amount: number;
  account: string;
  reference: string;
  notes: string;
  status: "confirmed" | "pending";
}

// Mock data
const mockIncomeRecords: IncomeRecord[] = [
  { id: "1", date: "2024-12-23", category: "Sales", description: "Product sale - Invoice #1234", amount: 45000, account: "HDFC Bank", reference: "INV-1234", notes: "", status: "confirmed" },
  { id: "2", date: "2024-12-22", category: "Services", description: "Consulting fee - ABC Corp", amount: 15000, account: "ICICI Bank", reference: "SRV-001", notes: "Monthly retainer", status: "confirmed" },
  { id: "3", date: "2024-12-21", category: "Sales", description: "Product sale - Invoice #1235", amount: 32000, account: "HDFC Bank", reference: "INV-1235", notes: "", status: "confirmed" },
  { id: "4", date: "2024-12-20", category: "Interest", description: "FD Interest - SBI", amount: 5500, account: "SBI Bank", reference: "INT-001", notes: "Quarterly interest", status: "confirmed" },
  { id: "5", date: "2024-12-19", category: "Rental", description: "Shop rental income", amount: 12000, account: "Cash", reference: "RENT-001", notes: "", status: "pending" },
  { id: "6", date: "2024-12-18", category: "Commission", description: "Sales commission", amount: 8500, account: "HDFC Bank", reference: "COM-001", notes: "", status: "confirmed" },
  { id: "7", date: "2024-12-17", category: "Refund", description: "Tax refund received", amount: 25000, account: "SBI Bank", reference: "TAX-REF-001", notes: "FY 2023-24", status: "confirmed" },
];

const incomeCategories = ["Sales", "Services", "Interest", "Rental", "Commission", "Refund", "Dividend", "Other"];
const accounts = ["HDFC Bank", "ICICI Bank", "SBI Bank", "Cash", "Credit Card"];

export default function IncomePage() {
  const [records, setRecords] = useState<IncomeRecord[]>(mockIncomeRecords);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingRecord, setEditingRecord] = useState<IncomeRecord | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [showSuccess, setShowSuccess] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    category: "",
    description: "",
    amount: "",
    account: "",
    reference: "",
    notes: "",
  });

  // Filter records
  const filteredRecords = records.filter((record) => {
    const matchesSearch =
      record.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "all" || record.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  // Stats
  const totalIncome = records.reduce((sum, r) => sum + r.amount, 0);
  const thisMonthIncome = records
    .filter((r) => r.date.startsWith("2024-12"))
    .reduce((sum, r) => sum + r.amount, 0);
  const pendingIncome = records
    .filter((r) => r.status === "pending")
    .reduce((sum, r) => sum + r.amount, 0);
  const avgTransaction = records.length > 0 ? totalIncome / records.length : 0;

  // Reset form
  const resetForm = () => {
    setFormData({
      date: new Date().toISOString().split("T")[0],
      category: "",
      description: "",
      amount: "",
      account: "",
      reference: "",
      notes: "",
    });
    setEditingRecord(null);
  };

  // Handle submit
  const handleSubmit = () => {
    if (!formData.category || !formData.description || !formData.amount || !formData.account) return;

    if (editingRecord) {
      setRecords(
        records.map((r) =>
          r.id === editingRecord.id
            ? { ...r, ...formData, amount: parseFloat(formData.amount) }
            : r
        )
      );
      setShowSuccess("Income record updated successfully!");
    } else {
      const newRecord: IncomeRecord = {
        id: Date.now().toString(),
        date: formData.date,
        category: formData.category,
        description: formData.description,
        amount: parseFloat(formData.amount),
        account: formData.account,
        reference: formData.reference || `INC-${Date.now()}`,
        notes: formData.notes,
        status: "confirmed",
      };
      setRecords([newRecord, ...records]);
      setShowSuccess("Income recorded successfully!");
    }

    setShowAddModal(false);
    resetForm();
    setTimeout(() => setShowSuccess(null), 3000);
  };

  // Edit record
  const handleEdit = (record: IncomeRecord) => {
    setFormData({
      date: record.date,
      category: record.category,
      description: record.description,
      amount: record.amount.toString(),
      account: record.account,
      reference: record.reference,
      notes: record.notes,
    });
    setEditingRecord(record);
    setShowAddModal(true);
  };

  // Delete record
  const handleDelete = (id: string) => {
    setRecords(records.filter((r) => r.id !== id));
    setShowSuccess("Record deleted successfully!");
    setTimeout(() => setShowSuccess(null), 3000);
  };

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      {/* Success Toast */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 bg-success text-white rounded-lg shadow-lg"
          >
            <CheckCircle2 className="w-5 h-5" />
            {showSuccess}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex-shrink-0 h-14 bg-card border-b border-border flex items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center">
            <ArrowUpCircle className="w-5 h-5 text-success" />
          </div>
          <div>
            <h1 className="text-lg font-bold">Income</h1>
            <p className="text-xs text-muted-foreground">Record and track income</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-sm font-medium hover:bg-muted transition-colors">
            <Download className="w-4 h-4" />
            Export
          </button>
          <button
            onClick={() => {
              resetForm();
              setShowAddModal(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-success text-white rounded-lg text-sm font-medium hover:bg-success/90 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Income
          </button>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="flex-shrink-0 p-4 border-b border-border">
        <div className="grid grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-success/5 border border-success/20">
            <div className="text-sm text-muted-foreground">Total Income</div>
            <div className="text-2xl font-bold text-success mt-1">₹{totalIncome.toLocaleString()}</div>
          </div>
          <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
            <div className="text-sm text-muted-foreground">This Month</div>
            <div className="text-2xl font-bold text-primary mt-1">₹{thisMonthIncome.toLocaleString()}</div>
          </div>
          <div className="p-4 rounded-xl bg-warning/5 border border-warning/20">
            <div className="text-sm text-muted-foreground">Pending</div>
            <div className="text-2xl font-bold text-warning mt-1">₹{pendingIncome.toLocaleString()}</div>
          </div>
          <div className="p-4 rounded-xl bg-muted/50 border border-border">
            <div className="text-sm text-muted-foreground">Avg. Transaction</div>
            <div className="text-2xl font-bold mt-1">₹{avgTransaction.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex-shrink-0 p-4 border-b border-border flex items-center gap-4">
        <div className="flex-1 relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search income records..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 pl-10 pr-4 bg-muted/50 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-success/50"
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="h-10 px-4 bg-muted/50 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-success/50"
        >
          <option value="all">All Categories</option>
          {incomeCategories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        <button className="h-10 px-4 rounded-lg border border-border text-sm font-medium hover:bg-muted transition-colors flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          This Month
        </button>
      </div>

      {/* Records List */}
      <div className="flex-1 overflow-auto p-4">
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-muted/50 border-b border-border">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Date</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Category</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Description</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Account</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Reference</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase">Amount</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-muted-foreground uppercase">Status</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-muted-foreground uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredRecords.map((record, idx) => (
                <motion.tr
                  key={record.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: idx * 0.02 }}
                  className="hover:bg-muted/30 transition-colors"
                >
                  <td className="px-4 py-3 text-sm">{record.date}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 bg-success/10 text-success text-xs font-medium rounded">
                      {record.category}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm font-medium">{record.description}</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{record.account}</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{record.reference}</td>
                  <td className="px-4 py-3 text-sm font-bold text-success text-right">
                    +₹{record.amount.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded ${
                        record.status === "confirmed"
                          ? "bg-success/10 text-success"
                          : "bg-warning/10 text-warning"
                      }`}
                    >
                      {record.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => handleEdit(record)}
                        className="p-2 rounded-lg hover:bg-muted transition-colors"
                      >
                        <Edit2 className="w-4 h-4 text-muted-foreground" />
                      </button>
                      <button
                        onClick={() => handleDelete(record.id)}
                        className="p-2 rounded-lg hover:bg-destructive/10 transition-colors"
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>

          {filteredRecords.length === 0 && (
            <div className="p-8 text-center text-muted-foreground">
              <TrendingUp className="w-12 h-12 mx-auto mb-3 opacity-20" />
              <p>No income records found</p>
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowAddModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-card border border-border rounded-2xl w-full max-w-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-4 border-b border-border">
                <h2 className="text-lg font-bold">
                  {editingRecord ? "Edit Income" : "Add Income"}
                </h2>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-2 rounded-lg hover:bg-muted transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-4 space-y-4 max-h-[60vh] overflow-auto">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground mb-1 block">
                      Date
                    </label>
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="w-full h-10 px-3 bg-muted/50 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-success/50"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground mb-1 block">
                      Category *
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full h-10 px-3 bg-muted/50 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-success/50"
                    >
                      <option value="">Select category</option>
                      {incomeCategories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-1 block">
                    Description *
                  </label>
                  <input
                    type="text"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Enter description"
                    className="w-full h-10 px-3 bg-muted/50 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-success/50"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground mb-1 block">
                      Amount *
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">₹</span>
                      <input
                        type="number"
                        value={formData.amount}
                        onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                        placeholder="0.00"
                        className="w-full h-10 pl-8 pr-3 bg-muted/50 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-success/50"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground mb-1 block">
                      Account *
                    </label>
                    <select
                      value={formData.account}
                      onChange={(e) => setFormData({ ...formData, account: e.target.value })}
                      className="w-full h-10 px-3 bg-muted/50 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-success/50"
                    >
                      <option value="">Select account</option>
                      {accounts.map((acc) => (
                        <option key={acc} value={acc}>
                          {acc}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-1 block">
                    Reference Number
                  </label>
                  <input
                    type="text"
                    value={formData.reference}
                    onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
                    placeholder="Invoice/Receipt number"
                    className="w-full h-10 px-3 bg-muted/50 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-success/50"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-1 block">
                    Notes
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Additional notes..."
                    rows={3}
                    className="w-full px-3 py-2 bg-muted/50 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-success/50 resize-none"
                  />
                </div>
              </div>

              <div className="flex gap-3 p-4 border-t border-border">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 h-10 rounded-lg border border-border text-sm font-medium hover:bg-muted transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={!formData.category || !formData.description || !formData.amount || !formData.account}
                  className="flex-1 h-10 rounded-lg bg-success text-white text-sm font-medium hover:bg-success/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  {editingRecord ? "Update" : "Save Income"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
