"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { UserCheck, TrendingUp, DollarSign, ShoppingBag } from "lucide-react";

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  totalPurchases: number;
  lifetimeValue: number;
  lastPurchase: string;
  status: "active" | "inactive";
}

const mockCustomers: Customer[] = [
  { id: "1", name: "Rahul Sharma", email: "rahul@example.com", phone: "9876543210", company: "Tech Solutions", totalPurchases: 15, lifetimeValue: 450000, lastPurchase: "2024-12-23", status: "active" },
  { id: "2", name: "Sneha Reddy", email: "sneha@enterprise.com", phone: "9876501234", company: "Enterprise Ltd", totalPurchases: 22, lifetimeValue: 680000, lastPurchase: "2024-12-21", status: "active" },
  { id: "3", name: "Arun Mehta", email: "arun@business.com", phone: "9123456789", company: "Business Corp", totalPurchases: 8, lifetimeValue: 225000, lastPurchase: "2024-12-18", status: "active" },
];

export default function CustomersPage() {
  const [customers] = useState<Customer[]>(mockCustomers);

  const totalCustomers = customers.length;
  const totalRevenue = customers.reduce((s, c) => s + c.lifetimeValue, 0);
  const avgValue = totalRevenue / totalCustomers;
  const activeCustomers = customers.filter(c => c.status === "active").length;

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      <div className="flex-shrink-0 h-14 bg-card border-b border-border flex items-center px-6">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
            <UserCheck className="w-5 h-5 text-blue-500" />
          </div>
          <div>
            <h1 className="text-lg font-bold">Customers</h1>
            <p className="text-xs text-muted-foreground">Customer database</p>
          </div>
        </div>
      </div>

      <div className="flex-shrink-0 p-4 border-b border-border">
        <div className="grid grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/20">
            <div className="text-sm text-muted-foreground">Total Customers</div>
            <div className="text-2xl font-bold text-blue-500 mt-1">{totalCustomers}</div>
          </div>
          <div className="p-4 rounded-xl bg-success/5 border border-success/20">
            <div className="text-sm text-muted-foreground">Total Revenue</div>
            <div className="text-2xl font-bold text-success mt-1">₹{totalRevenue.toLocaleString()}</div>
          </div>
          <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
            <div className="text-sm text-muted-foreground">Avg Customer Value</div>
            <div className="text-2xl font-bold text-primary mt-1">₹{avgValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
          </div>
          <div className="p-4 rounded-xl bg-muted/50 border border-border">
            <div className="text-sm text-muted-foreground">Active</div>
            <div className="text-2xl font-bold mt-1">{activeCustomers}</div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4">
        <div className="space-y-3">
          {customers.map((customer, idx) => (
            <motion.div key={customer.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: idx * 0.05 }}
              className="bg-card border border-border rounded-xl p-5 hover:shadow-lg transition-all">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-bold mb-1">{customer.name}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{customer.company}</p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>{customer.email}</span>
                    <span>•</span>
                    <span>{customer.phone}</span>
                    <span>•</span>
                    <span>Last purchase: {customer.lastPurchase}</span>
                  </div>
                </div>
                <div className="flex gap-6">
                  <div className="text-center">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                      <ShoppingBag className="w-4 h-4" />
                      Purchases
                    </div>
                    <p className="text-2xl font-bold">{customer.totalPurchases}</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                      <DollarSign className="w-4 h-4" />
                      Lifetime Value
                    </div>
                    <p className="text-2xl font-bold text-success">₹{customer.lifetimeValue.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
