"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Target, DollarSign, TrendingUp, Calendar, User } from "lucide-react";

interface Deal {
  id: string;
  title: string;
  client: string;
  value: number;
  stage: "prospect" | "qualified" | "proposal" | "negotiation" | "closed";
  probability: number;
  closeDate: string;
  owner: string;
}

const mockDeals: Deal[] = [
  { id: "1", title: "Enterprise Software License", client: "Tech Solutions", value: 500000, stage: "negotiation", probability: 80, closeDate: "2025-01-15", owner: "Admin" },
  { id: "2", title: "Annual Maintenance Contract", client: "Business Hub", value: 150000, stage: "proposal", probability: 60, closeDate: "2025-01-20", owner: "Admin" },
  { id: "3", title: "Consulting Services", client: "Startup Inc", value: 250000, stage: "qualified", probability: 40, closeDate: "2025-02-01", owner: "Admin" },
  { id: "4", title: "Product Suite", client: "Enterprise Ltd", value: 800000, stage: "negotiation", probability: 75, closeDate: "2025-01-10", owner: "Admin" },
];

export default function DealsPage() {
  const [deals] = useState<Deal[]>(mockDeals);

  const stages = ["prospect", "qualified", "proposal", "negotiation", "closed"];
  
  const stats = {
    totalValue: deals.reduce((s, d) => s + d.value, 0),
    weightedValue: deals.reduce((s, d) => s + (d.value * d.probability / 100), 0),
    avgDealSize: deals.reduce((s, d) => s + d.value, 0) / deals.length,
    totalDeals: deals.length,
  };

  const getStageColor = (stage: string) => {
    switch (stage) {
      case "prospect": return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "qualified": return "bg-cyan-500/10 text-cyan-500 border-cyan-500/20";
      case "proposal": return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      case "negotiation": return "bg-orange-500/10 text-orange-500 border-orange-500/20";
      case "closed": return "bg-green-500/10 text-green-500 border-green-500/20";
      default: return "bg-muted text-muted-foreground border-border";
    }
  };

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      <div className="flex-shrink-0 h-14 bg-card border-b border-border flex items-center px-6">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
            <Target className="w-5 h-5 text-green-500" />
          </div>
          <div>
            <h1 className="text-lg font-bold">Deals</h1>
            <p className="text-xs text-muted-foreground">Deal tracking</p>
          </div>
        </div>
      </div>

      <div className="flex-shrink-0 p-4 border-b border-border">
        <div className="grid grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
            <div className="text-sm text-muted-foreground">Pipeline Value</div>
            <div className="text-2xl font-bold text-primary mt-1">₹{stats.totalValue.toLocaleString()}</div>
          </div>
          <div className="p-4 rounded-xl bg-success/5 border border-success/20">
            <div className="text-sm text-muted-foreground">Weighted Value</div>
            <div className="text-2xl font-bold text-success mt-1">₹{stats.weightedValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
          </div>
          <div className="p-4 rounded-xl bg-warning/5 border border-warning/20">
            <div className="text-sm text-muted-foreground">Avg Deal Size</div>
            <div className="text-2xl font-bold text-warning mt-1">₹{stats.avgDealSize.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
          </div>
          <div className="p-4 rounded-xl bg-muted/50 border border-border">
            <div className="text-sm text-muted-foreground">Total Deals</div>
            <div className="text-2xl font-bold mt-1">{stats.totalDeals}</div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4">
        <div className="grid grid-cols-5 gap-4">
          {stages.map(stage => {
            const stageDeals = deals.filter(d => d.stage === stage);
            const stageValue = stageDeals.reduce((s, d) => s + d.value, 0);
            return (
              <div key={stage} className="flex flex-col gap-3">
                <div className="bg-card border border-border rounded-xl p-3 sticky top-0">
                  <h3 className="font-bold capitalize mb-1">{stage}</h3>
                  <p className="text-xs text-muted-foreground">{stageDeals.length} deals • ₹{(stageValue / 1000).toFixed(0)}k</p>
                </div>
                <div className="space-y-3">
                  {stageDeals.map((deal, idx) => (
                    <motion.div key={deal.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className={`p-4 rounded-xl border ${getStageColor(stage)} hover:shadow-lg transition-all cursor-pointer`}>
                      <h4 className="font-bold text-sm mb-2">{deal.title}</h4>
                      <div className="space-y-2 text-xs">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <User className="w-3 h-3" />
                          {deal.client}
                        </div>
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-3 h-3" />
                          <span className="font-bold">₹{deal.value.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <TrendingUp className="w-3 h-3" />
                          {deal.probability}% probability
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Calendar className="w-3 h-3" />
                          {deal.closeDate}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
