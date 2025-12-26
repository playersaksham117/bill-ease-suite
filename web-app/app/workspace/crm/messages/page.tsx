"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { MessageSquare, Send, Search, User, Clock } from "lucide-react";

interface Message {
  id: string;
  contact: string;
  message: string;
  timestamp: string;
  type: "sent" | "received";
  read: boolean;
}

const mockMessages: Message[] = [
  { id: "1", contact: "Rahul Sharma", message: "Thanks for the quick response!", timestamp: "2024-12-24 10:30", type: "received", read: true },
  { id: "2", contact: "Priya Patel", message: "Can we schedule a call?", timestamp: "2024-12-24 09:15", type: "received", read: false },
  { id: "3", contact: "Amit Kumar", message: "Order placed successfully", timestamp: "2024-12-23 16:45", type: "sent", read: true },
];

export default function MessagesPage() {
  const [messages] = useState<Message[]>(mockMessages);
  const unread = messages.filter(m => !m.read && m.type === "received").length;

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      <div className="flex-shrink-0 h-14 bg-card border-b border-border flex items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
            <MessageSquare className="w-5 h-5 text-blue-500" />
          </div>
          <div>
            <h1 className="text-lg font-bold">Messages</h1>
            <p className="text-xs text-muted-foreground">Chat & messages</p>
          </div>
        </div>
        {unread > 0 && (
          <div className="px-3 py-1 bg-destructive text-white rounded-full text-sm font-medium">
            {unread} unread
          </div>
        )}
      </div>

      <div className="flex-1 overflow-auto p-4">
        <div className="space-y-3">
          {messages.map((msg, idx) => (
            <motion.div key={msg.id} initial={{ opacity: 0, x: msg.type === "sent" ? 20 : -20 }}
              animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.05 }}
              className={`flex ${msg.type === "sent" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-md ${msg.type === "sent" ? "bg-primary text-white" : "bg-card border border-border"} rounded-xl p-4`}>
                <div className="flex items-center gap-2 mb-2">
                  <User className="w-4 h-4" />
                  <span className="font-medium text-sm">{msg.contact}</span>
                  {!msg.read && msg.type === "received" && (
                    <span className="w-2 h-2 bg-destructive rounded-full"></span>
                  )}
                </div>
                <p className="text-sm mb-2">{msg.message}</p>
                <div className="flex items-center gap-2 text-xs opacity-70">
                  <Clock className="w-3 h-3" />
                  {msg.timestamp}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="flex-shrink-0 p-4 border-t border-border">
        <div className="flex gap-3">
          <input type="text" placeholder="Type a message..."
            className="flex-1 h-10 px-4 bg-muted/50 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
          <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 flex items-center gap-2">
            <Send className="w-4 h-4" />
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
