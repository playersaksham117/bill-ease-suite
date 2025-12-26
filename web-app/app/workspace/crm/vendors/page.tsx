"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Building2, Package, DollarSign, Star } from "lucide-react";

interface Vendor {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  category: string;
  totalOrders: number;
  totalSpent: number;
  rating: number;
  lastOrder: string;
}

const mockVendors: Vendor[] = [
  { id: "1", name: "Amit Kumar", email: "amit@vendor.com", phone: "9988776655", company: "Supply Corp", category: "Raw Materials", totalOrders: 35, totalSpent: 850000, rating: 4, lastOrder: "2024-12-20" },
  { id: "2", name: "Rajesh Supplies", email: "rajesh@supplies.com", phone: "9876512345", company: "Best Supplies", category: "Equipment", totalOrders: 18, totalSpent: 450000, rating: 5, lastOrder: "2024-12-18" },
];

export default function VendorsPage() {
  const [vendors] = useState<Vendor[]>(mockVendors);

  const totalVendors = vendors.length;
  const totalSpent = vendors.reduce((s, v) => s + v.totalSpent, 0);
  const avgRating = vendors.reduce((s, v) => s + v.rating, 0) / vendors.length;

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      <div className="flex-shrink-0 h-14 bg-card border-b border-border flex items-center px-6">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-purple-600/10 flex items-center justify-center">
            <Building2 className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <h1 className="text-lg font-bold">Vendors</h1>
            <p className="text-xs text-muted-foreground">Supplier management</p>
          </div>
        </div>
      </div>

      <div className="flex-shrink-0 p-4 border-b border-border">
        <div className="grid grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-purple-600/5 border border-purple-600/20">
            <div className="text-sm text-muted-foreground">Total Vendors</div>
            <div className="text-2xl font-bold text-purple-600 mt-1">{totalVendors}</div>
          </div>
          <div className="p-4 rounded-xl bg-destructive/5 border border-destructive/20">
            <div className="text-sm text-muted-foreground">Total Spent</div>
            <div className="text-2xl font-bold text-destructive mt-1">₹{totalSpent.toLocaleString()}</div>
          </div>
          <div className="p-4 rounded-xl bg-warning/5 border border-warning/20">
            <div className="text-sm text-muted-foreground">Avg Rating</div>
            <div className="text-2xl font-bold text-warning mt-1">{avgRating.toFixed(1)} ★</div>
          </div>
          <div className="p-4 rounded-xl bg-muted/50 border border-border">
            <div className="text-sm text-muted-foreground">Active Orders</div>
            <div className="text-2xl font-bold mt-1">12</div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4">
        <div className="space-y-3">
          {vendors.map((vendor, idx) => (
            <motion.div key={vendor.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: idx * 0.05 }}
              className="bg-card border border-border rounded-xl p-5 hover:shadow-lg transition-all">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-lg font-bold">{vendor.name}</h3>
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-4 h-4 ${i < vendor.rating ? "fill-yellow-500 text-yellow-500" : "text-muted"}`} />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{vendor.company} • {vendor.category}</p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>{vendor.email}</span>
                    <span>•</span>
                    <span>{vendor.phone}</span>
                    <span>•</span>
                    <span>Last order: {vendor.lastOrder}</span>
                  </div>
                </div>
                <div className="flex gap-6">
                  <div className="text-center">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                      <Package className="w-4 h-4" />
                      Orders
                    </div>
                    <p className="text-2xl font-bold">{vendor.totalOrders}</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                      <DollarSign className="w-4 h-4" />
                      Total Spent
                    </div>
                    <p className="text-2xl font-bold text-destructive">₹{vendor.totalSpent.toLocaleString()}</p>
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
