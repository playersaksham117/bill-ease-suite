"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Inbox, Send, Star, Trash2, Eye } from "lucide-react";

interface Email {
  id: string;
  from: string;
  subject: string;
  preview: string;
  timestamp: string;
  read: boolean;
  starred: boolean;
}

const mockEmails: Email[] = [
  { id: "1", from: "Rahul Sharma", subject: "Product Inquiry", preview: "I'm interested in your services...", timestamp: "10:30 AM", read: false, starred: true },
  { id: "2", from: "Priya Patel", subject: "Meeting Request", preview: "Can we schedule a demo call?", timestamp: "09:15 AM", read: false, starred: false },
  { id: "3", from: "Amit Kumar", subject: "Order Confirmation", preview: "Thanks for placing the order...", timestamp: "Yesterday", read: true, starred: false },
];

export default function EmailsPage() {
  const [emails, setEmails] = useState<Email[]>(mockEmails);
  const unread = emails.filter(e => !e.read).length;

  const toggleStar = (id: string) => {
    setEmails(emails.map(e => e.id === id ? { ...e, starred: !e.starred } : e));
  };

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      <div className="flex-shrink-0 h-14 bg-card border-b border-border flex items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
            <Mail className="w-5 h-5 text-red-500" />
          </div>
          <div>
            <h1 className="text-lg font-bold">Emails</h1>
            <p className="text-xs text-muted-foreground">{unread} unread messages</p>
          </div>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600">
          <Send className="w-4 h-4" />
          Compose
        </button>
      </div>

      <div className="flex-1 overflow-auto">
        {emails.map((email, idx) => (
          <motion.div key={email.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: idx * 0.05 }}
            className={`flex items-center gap-4 p-4 border-b border-border hover:bg-muted/30 transition-colors ${!email.read ? "bg-muted/10" : ""}`}>
            <button onClick={() => toggleStar(email.id)}>
              <Star className={`w-5 h-5 ${email.starred ? "fill-yellow-500 text-yellow-500" : "text-muted-foreground"}`} />
            </button>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <p className={`font-medium ${!email.read ? "font-bold" : ""}`}>{email.from}</p>
                {!email.read && <span className="w-2 h-2 bg-primary rounded-full"></span>}
              </div>
              <p className={`text-sm mb-1 ${!email.read ? "font-medium" : "text-muted-foreground"}`}>{email.subject}</p>
              <p className="text-xs text-muted-foreground truncate">{email.preview}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">{email.timestamp}</span>
              <button className="p-2 rounded hover:bg-muted">
                <Eye className="w-4 h-4 text-muted-foreground" />
              </button>
              <button className="p-2 rounded hover:bg-destructive/10">
                <Trash2 className="w-4 h-4 text-destructive" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
