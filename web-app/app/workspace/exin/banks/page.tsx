"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Landmark, Plus, Edit2, Trash2, CheckCircle2, X, Save, TrendingUp, TrendingDown, Eye, EyeOff } from "lucide-react";

interface BankAccount {
  id: string;
  bankName: string;
  accountNumber: string;
  accountType: string;
  balance: number;
  ifsc: string;
  branch: string;
  status: "active" | "inactive";
}

const mockBanks: BankAccount[] = [
  { id: "1", bankName: "HDFC Bank", accountNumber: "1234567890", accountType: "Current", balance: 245000, ifsc: "HDFC0001234", branch: "Mumbai Main", status: "active" },
  { id: "2", bankName: "ICICI Bank", accountNumber: "9876543210", accountType: "Savings", balance: 128000, ifsc: "ICIC0009876", branch: "Andheri West", status: "active" },
  { id: "3", bankName: "SBI Bank", accountNumber: "5555666677", accountType: "Current", balance: 185000, ifsc: "SBIN0005555", branch: "Fort Branch", status: "active" },
];

export default function BanksPage() {
  const [accounts, setAccounts] = useState<BankAccount[]>(mockBanks);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<BankAccount | null>(null);
  const [showSuccess, setShowSuccess] = useState<string | null>(null);
  const [hideNumbers, setHideNumbers] = useState(true);
  const [form, setForm] = useState({
    bankName: "", accountNumber: "", accountType: "Savings", balance: "", ifsc: "", branch: ""
  });

  const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);
  const activeAccounts = accounts.filter(a => a.status === "active").length;

  const resetForm = () => {
    setForm({ bankName: "", accountNumber: "", accountType: "Savings", balance: "", ifsc: "", branch: "" });
    setEditing(null);
  };

  const handleSubmit = () => {
    if (!form.bankName || !form.accountNumber || !form.balance) return;
    
    if (editing) {
      setAccounts(accounts.map(a => a.id === editing.id ? { ...a, ...form, balance: parseFloat(form.balance) } : a));
      setShowSuccess("Account updated!");
    } else {
      setAccounts([...accounts, { id: Date.now().toString(), ...form, balance: parseFloat(form.balance), status: "active" }]);
      setShowSuccess("Account added!");
    }
    setShowModal(false);
    resetForm();
    setTimeout(() => setShowSuccess(null), 3000);
  };

  const handleEdit = (acc: BankAccount) => {
    setForm({ ...acc, balance: acc.balance.toString() });
    setEditing(acc);
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    setAccounts(accounts.filter(a => a.id !== id));
    setShowSuccess("Account deleted!");
    setTimeout(() => setShowSuccess(null), 3000);
  };

  const maskAccount = (num: string) => hideNumbers ? "XXXX" + num.slice(-4) : num;

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      <AnimatePresence>
        {showSuccess && (
          <motion.div initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -50 }}
            className="fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 bg-success text-white rounded-lg shadow-lg">
            <CheckCircle2 className="w-5 h-5" /> {showSuccess}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex-shrink-0 h-14 bg-card border-b border-border flex items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
            <Landmark className="w-5 h-5 text-blue-500" />
          </div>
          <div>
            <h1 className="text-lg font-bold">Bank Accounts</h1>
            <p className="text-xs text-muted-foreground">Manage your bank accounts</p>
          </div>
        </div>
        <button onClick={() => { resetForm(); setShowModal(true); }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors">
          <Plus className="w-4 h-4" /> Add Account
        </button>
      </div>

      <div className="flex-shrink-0 p-4 border-b border-border">
        <div className="grid grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/20">
            <div className="text-sm text-muted-foreground">Total Balance</div>
            <div className="text-2xl font-bold text-blue-500 mt-1">₹{totalBalance.toLocaleString()}</div>
          </div>
          <div className="p-4 rounded-xl bg-success/5 border border-success/20">
            <div className="text-sm text-muted-foreground">Active Accounts</div>
            <div className="text-2xl font-bold text-success mt-1">{activeAccounts}</div>
          </div>
          <div className="p-4 rounded-xl bg-muted/50 border border-border">
            <div className="text-sm text-muted-foreground">Average Balance</div>
            <div className="text-2xl font-bold mt-1">₹{(totalBalance / activeAccounts || 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4">
        <div className="flex justify-end mb-4">
          <button onClick={() => setHideNumbers(!hideNumbers)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border text-sm hover:bg-muted transition-colors">
            {hideNumbers ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            {hideNumbers ? "Show" : "Hide"} Numbers
          </button>
        </div>
        
        <div className="grid gap-4">
          {accounts.map((acc, idx) => (
            <motion.div key={acc.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}
              className="bg-card border border-border rounded-xl p-5 hover:shadow-lg transition-all">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                      <Landmark className="w-6 h-6 text-blue-500" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold">{acc.bankName}</h3>
                      <p className="text-sm text-muted-foreground">{acc.accountType} Account</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Account Number</p>
                      <p className="text-sm font-medium">{maskAccount(acc.accountNumber)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">IFSC Code</p>
                      <p className="text-sm font-medium">{acc.ifsc}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Branch</p>
                      <p className="text-sm font-medium">{acc.branch}</p>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-3">
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground mb-1">Balance</p>
                    <p className="text-2xl font-bold text-blue-500">₹{acc.balance.toLocaleString()}</p>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => handleEdit(acc)} className="p-2 rounded-lg hover:bg-muted transition-colors">
                      <Edit2 className="w-4 h-4 text-muted-foreground" />
                    </button>
                    <button onClick={() => handleDelete(acc.id)} className="p-2 rounded-lg hover:bg-destructive/10 transition-colors">
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowModal(false)}>
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
              className="bg-card border border-border rounded-2xl w-full max-w-lg shadow-2xl" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between p-4 border-b border-border">
                <h2 className="text-lg font-bold">{editing ? "Edit" : "Add"} Bank Account</h2>
                <button onClick={() => setShowModal(false)} className="p-2 rounded-lg hover:bg-muted">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-4 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground mb-1 block">Bank Name *</label>
                    <input type="text" value={form.bankName} onChange={(e) => setForm({ ...form, bankName: e.target.value })}
                      className="w-full h-10 px-3 bg-muted/50 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground mb-1 block">Account Type</label>
                    <select value={form.accountType} onChange={(e) => setForm({ ...form, accountType: e.target.value })}
                      className="w-full h-10 px-3 bg-muted/50 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50">
                      <option value="Savings">Savings</option>
                      <option value="Current">Current</option>
                      <option value="Fixed Deposit">Fixed Deposit</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-1 block">Account Number *</label>
                  <input type="text" value={form.accountNumber} onChange={(e) => setForm({ ...form, accountNumber: e.target.value })}
                    className="w-full h-10 px-3 bg-muted/50 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground mb-1 block">IFSC Code</label>
                    <input type="text" value={form.ifsc} onChange={(e) => setForm({ ...form, ifsc: e.target.value })}
                      className="w-full h-10 px-3 bg-muted/50 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground mb-1 block">Balance *</label>
                    <input type="number" value={form.balance} onChange={(e) => setForm({ ...form, balance: e.target.value })}
                      className="w-full h-10 px-3 bg-muted/50 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50" />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-1 block">Branch</label>
                  <input type="text" value={form.branch} onChange={(e) => setForm({ ...form, branch: e.target.value })}
                    className="w-full h-10 px-3 bg-muted/50 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50" />
                </div>
              </div>
              <div className="flex gap-3 p-4 border-t border-border">
                <button onClick={() => setShowModal(false)} className="flex-1 h-10 rounded-lg border border-border text-sm font-medium hover:bg-muted">Cancel</button>
                <button onClick={handleSubmit} disabled={!form.bankName || !form.accountNumber || !form.balance}
                  className="flex-1 h-10 rounded-lg bg-blue-500 text-white text-sm font-medium hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                  <Save className="w-4 h-4" /> {editing ? "Update" : "Save"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
