"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Users,
  UserPlus,
  Search,
  Filter,
  MoreVertical,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Star,
  StarOff,
  Edit,
  Trash2,
  MessageSquare,
  TrendingUp,
  IndianRupee,
} from "lucide-react";

// Mock customer data
const mockCustomers = [
  { id: "1", name: "Rajesh Kumar", email: "rajesh@example.com", phone: "9876543210", city: "Mumbai", totalOrders: 45, totalSpent: 125000, lastOrder: "2024-12-15", starred: true, status: "active" },
  { id: "2", name: "Priya Sharma", email: "priya@example.com", phone: "9876543211", city: "Delhi", totalOrders: 32, totalSpent: 89000, lastOrder: "2024-12-18", starred: true, status: "active" },
  { id: "3", name: "Amit Patel", email: "amit@example.com", phone: "9876543212", city: "Ahmedabad", totalOrders: 28, totalSpent: 67000, lastOrder: "2024-12-10", starred: false, status: "active" },
  { id: "4", name: "Sneha Reddy", email: "sneha@example.com", phone: "9876543213", city: "Hyderabad", totalOrders: 19, totalSpent: 45000, lastOrder: "2024-12-05", starred: false, status: "inactive" },
  { id: "5", name: "Vikram Singh", email: "vikram@example.com", phone: "9876543214", city: "Jaipur", totalOrders: 56, totalSpent: 178000, lastOrder: "2024-12-20", starred: true, status: "active" },
  { id: "6", name: "Ananya Gupta", email: "ananya@example.com", phone: "9876543215", city: "Bangalore", totalOrders: 12, totalSpent: 34000, lastOrder: "2024-11-28", starred: false, status: "active" },
];

export default function CRMPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");

  const filteredCustomers = mockCustomers.filter((customer) => {
    const matchesSearch =
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.phone.includes(searchQuery);
    const matchesFilter =
      selectedFilter === "all" ||
      (selectedFilter === "starred" && customer.starred) ||
      (selectedFilter === "active" && customer.status === "active") ||
      (selectedFilter === "inactive" && customer.status === "inactive");
    return matchesSearch && matchesFilter;
  });

  const stats = {
    total: mockCustomers.length,
    active: mockCustomers.filter((c) => c.status === "active").length,
    totalRevenue: mockCustomers.reduce((sum, c) => sum + c.totalSpent, 0),
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0 px-6 py-4 border-b border-border bg-card/50">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-foreground">All Contacts</h1>
            <p className="text-sm text-muted-foreground">Manage your customer relationships</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
            <UserPlus className="w-4 h-4" />
            Add Contact
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-auto p-6">
        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-card border border-border rounded-xl p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Users className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.total}</p>
              <p className="text-xs text-muted-foreground">Total Contacts</p>
            </div>
          </div>
          <div className="bg-card border border-border rounded-xl p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.active}</p>
              <p className="text-xs text-muted-foreground">Active Customers</p>
            </div>
          </div>
          <div className="bg-card border border-border rounded-xl p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-warning/10 flex items-center justify-center">
              <IndianRupee className="w-6 h-6 text-warning" />
            </div>
            <div>
              <p className="text-2xl font-bold">₹{(stats.totalRevenue / 1000).toFixed(0)}K</p>
              <p className="text-xs text-muted-foreground">Total Revenue</p>
            </div>
          </div>
        </div>

        {/* Filters Row */}
        <div className="flex gap-4 items-center mb-6">
          <div className="flex-1 relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search contacts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-10 pr-4 bg-card border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          <div className="flex bg-muted rounded-lg p-1">
            {["all", "starred", "active", "inactive"].map((filter) => (
              <button
                key={filter}
                onClick={() => setSelectedFilter(filter)}
                className={`px-4 py-1.5 rounded-md text-sm font-medium capitalize transition-colors ${
                  selectedFilter === filter
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-muted/50 border-b border-border">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Customer</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Contact</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Location</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Orders</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Spent</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Status</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredCustomers.map((customer, idx) => (
                <motion.tr
                  key={customer.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: idx * 0.02 }}
                  className="hover:bg-muted/30 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <button className="text-muted-foreground hover:text-warning transition-colors">
                        {customer.starred ? (
                          <Star className="w-4 h-4 fill-warning text-warning" />
                        ) : (
                          <StarOff className="w-4 h-4" />
                        )}
                      </button>
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                        {customer.name.split(" ").map((n) => n[0]).join("")}
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{customer.name}</p>
                        <p className="text-xs text-muted-foreground">Last order: {customer.lastOrder}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="w-3.5 h-3.5 text-muted-foreground" />
                        {customer.email}
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="w-3.5 h-3.5 text-muted-foreground" />
                        {customer.phone}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="w-3.5 h-3.5 text-muted-foreground" />
                      {customer.city}
                    </div>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <span className="text-lg font-bold">{customer.totalOrders}</span>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <span className="font-semibold text-success">₹{customer.totalSpent.toLocaleString()}</span>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                        customer.status === "active"
                          ? "bg-success/10 text-success"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {customer.status}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center justify-center gap-1">
                      <button className="p-2 rounded-lg hover:bg-muted transition-colors" title="Message">
                        <MessageSquare className="w-4 h-4 text-muted-foreground" />
                      </button>
                      <button className="p-2 rounded-lg hover:bg-muted transition-colors" title="Edit">
                        <Edit className="w-4 h-4 text-muted-foreground" />
                      </button>
                      <button className="p-2 rounded-lg hover:bg-destructive/10 transition-colors" title="Delete">
                        <Trash2 className="w-4 h-4 text-muted-foreground hover:text-destructive" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
