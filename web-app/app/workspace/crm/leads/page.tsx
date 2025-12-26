"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { UserPlus, Flame, Clock, CheckCircle } from "lucide-react";

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  source: string;
  status: "new" | "contacted" | "qualified" | "negotiating";
  temperature: "hot" | "warm" | "cold";
  value: number;
  createdAt: string;
}

const mockLeads: Lead[] = [
  { id: "1", name: "Priya Patel", email: "priya@startup.com", phone: "9123456780", company: "Startup Inc", source: "Website", status: "qualified", temperature: "hot", value: 150000, createdAt: "2024-12-22" },
  { id: "2", name: "Vikram Singh", email: "vikram@business.com", phone: "9123498765", company: "Business Hub", source: "Referral", status: "contacted", temperature: "warm", value: 85000, createdAt: "2024-12-19" },
  { id: "3", name: "Anjali Desai", email: "anjali@corp.com", phone: "9876549876", company: "Corporate Ltd", source: "LinkedIn", status: "new", temperature: "warm", value: 200000, createdAt: "2024-12-24" },
];

export default function LeadsPage() {
  const [leads] = useState<Lead[]>(mockLeads);

  const stats = {
    total: leads.length,
    hot: leads.filter(l => l.temperature === "hot").length,
    qualified: leads.filter(l => l.status === "qualified").length,
    totalValue: leads.reduce((s, l) => s + l.value, 0),
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "new": return "bg-blue-500/10 text-blue-500";
      case "contacted": return "bg-yellow-500/10 text-yellow-500";
      case "qualified": return "bg-green-500/10 text-green-500";
      case "negotiating": return "bg-orange-500/10 text-orange-500";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getTempIcon = (temp: string) => {
    if (temp === "hot") return <Flame className="w-5 h-5 text-red-500" />;
    if (temp === "warm") return <Flame className="w-5 h-5 text-orange-500" />;
    return <Flame className="w-5 h-5 text-blue-500" />;
  };

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      <div className="flex-shrink-0 h-14 bg-card border-b border-border flex items-center px-6">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center">
            <UserPlus className="w-5 h-5 text-orange-500" />
          </div>
          <div>
            <h1 className="text-lg font-bold">Leads</h1>
            <p className="text-xs text-muted-foreground">Lead management</p>
          </div>
        </div>
      </div>

      <div className="flex-shrink-0 p-4 border-b border-border">
        <div className="grid grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-orange-500/5 border border-orange-500/20">
            <div className="text-sm text-muted-foreground">Total Leads</div>
            <div className="text-2xl font-bold text-orange-500 mt-1">{stats.total}</div>
          </div>
          <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/20">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Flame className="w-4 h-4 text-red-500" />
              Hot Leads
            </div>
            <div className="text-2xl font-bold text-red-500 mt-1">{stats.hot}</div>
          </div>
          <div className="p-4 rounded-xl bg-success/5 border border-success/20">
            <div className="text-sm text-muted-foreground">Qualified</div>
            <div className="text-2xl font-bold text-success mt-1">{stats.qualified}</div>
          </div>
          <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
            <div className="text-sm text-muted-foreground">Pipeline Value</div>
            <div className="text-2xl font-bold text-primary mt-1">₹{stats.totalValue.toLocaleString()}</div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4">
        <div className="space-y-3">
          {leads.map((lead, idx) => (
            <motion.div key={lead.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.05 }}
              className="bg-card border border-border rounded-xl p-5 hover:shadow-lg transition-all">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-bold">{lead.name}</h3>
                    {getTempIcon(lead.temperature)}
                    <span className={`px-2 py-1 rounded text-xs font-medium capitalize ${getStatusColor(lead.status)}`}>
                      {lead.status}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{lead.company}</p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>{lead.email}</span>
                    <span>•</span>
                    <span>{lead.phone}</span>
                    <span>•</span>
                    <span>Source: {lead.source}</span>
                    <span>•</span>
                    <span>Created: {lead.createdAt}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground mb-1">Est. Value</p>
                  <p className="text-2xl font-bold text-primary">₹{lead.value.toLocaleString()}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
