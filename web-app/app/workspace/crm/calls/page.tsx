"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Phone, PhoneIncoming, PhoneOutgoing, PhoneMissed, Clock, User } from "lucide-react";

interface Call {
  id: string;
  contact: string;
  type: "incoming" | "outgoing" | "missed";
  duration: string;
  timestamp: string;
  notes: string;
}

const mockCalls: Call[] = [
  { id: "1", contact: "Rahul Sharma", type: "outgoing", duration: "15:30", timestamp: "2024-12-24 10:00", notes: "Discussed product features" },
  { id: "2", contact: "Priya Patel", type: "incoming", duration: "8:45", timestamp: "2024-12-24 09:00", notes: "Demo call scheduled" },
  { id: "3", contact: "Amit Kumar", type: "missed", duration: "-", timestamp: "2024-12-23 16:30", notes: "" },
  { id: "4", contact: "Sneha Reddy", type: "outgoing", duration: "22:15", timestamp: "2024-12-23 14:00", notes: "Follow-up on order" },
];

export default function CallsPage() {
  const [calls] = useState<Call[]>(mockCalls);

  const stats = {
    total: calls.length,
    missed: calls.filter(c => c.type === "missed").length,
    totalDuration: "2h 46m",
  };

  const getCallIcon = (type: string) => {
    switch (type) {
      case "incoming": return <PhoneIncoming className="w-5 h-5 text-success" />;
      case "outgoing": return <PhoneOutgoing className="w-5 h-5 text-primary" />;
      case "missed": return <PhoneMissed className="w-5 h-5 text-destructive" />;
      default: return <Phone className="w-5 h-5" />;
    }
  };

  const getCallColor = (type: string) => {
    switch (type) {
      case "incoming": return "bg-success/10";
      case "outgoing": return "bg-primary/10";
      case "missed": return "bg-destructive/10";
      default: return "bg-muted";
    }
  };

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      <div className="flex-shrink-0 h-14 bg-card border-b border-border flex items-center px-6">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
            <Phone className="w-5 h-5 text-green-500" />
          </div>
          <div>
            <h1 className="text-lg font-bold">Call Log</h1>
            <p className="text-xs text-muted-foreground">Call history</p>
          </div>
        </div>
      </div>

      <div className="flex-shrink-0 p-4 border-b border-border">
        <div className="grid grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-green-500/5 border border-green-500/20">
            <div className="text-sm text-muted-foreground">Total Calls</div>
            <div className="text-2xl font-bold text-green-500 mt-1">{stats.total}</div>
          </div>
          <div className="p-4 rounded-xl bg-destructive/5 border border-destructive/20">
            <div className="text-sm text-muted-foreground">Missed Calls</div>
            <div className="text-2xl font-bold text-destructive mt-1">{stats.missed}</div>
          </div>
          <div className="p-4 rounded-xl bg-muted/50 border border-border">
            <div className="text-sm text-muted-foreground">Total Duration</div>
            <div className="text-2xl font-bold mt-1">{stats.totalDuration}</div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4">
        <div className="space-y-3">
          {calls.map((call, idx) => (
            <motion.div key={call.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: idx * 0.05 }}
              className="bg-card border border-border rounded-xl p-4 hover:shadow-md transition-all">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl ${getCallColor(call.type)} flex items-center justify-center`}>
                  {getCallIcon(call.type)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <User className="w-4 h-4 text-muted-foreground" />
                    <p className="font-medium">{call.contact}</p>
                    <span className="text-xs text-muted-foreground capitalize">• {call.type}</span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {call.timestamp}
                    </div>
                    {call.duration !== "-" && (
                      <>
                        <span>•</span>
                        <span>Duration: {call.duration}</span>
                      </>
                    )}
                  </div>
                  {call.notes && (
                    <p className="text-sm text-muted-foreground mt-2 italic">{call.notes}</p>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
