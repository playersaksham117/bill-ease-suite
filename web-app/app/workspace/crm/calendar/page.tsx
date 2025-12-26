"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Calendar as CalendarIcon, Plus, Clock, User, MapPin } from "lucide-react";

interface Event {
  id: string;
  title: string;
  type: "meeting" | "call" | "demo" | "follow-up";
  attendees: string[];
  date: string;
  time: string;
  duration: string;
  location: string;
  notes: string;
}

const mockEvents: Event[] = [
  { id: "1", title: "Product Demo", type: "demo", attendees: ["Priya Patel"], date: "2024-12-26", time: "10:00 AM", duration: "1h", location: "Virtual", notes: "Show key features" },
  { id: "2", title: "Follow-up Call", type: "call", attendees: ["Rahul Sharma"], date: "2024-12-25", time: "2:00 PM", duration: "30m", location: "Phone", notes: "Discuss pricing" },
  { id: "3", title: "Client Meeting", type: "meeting", attendees: ["Vikram Singh", "Team"], date: "2024-12-27", time: "11:00 AM", duration: "2h", location: "Office", notes: "Quarterly review" },
];

export default function CalendarPage() {
  const [events] = useState<Event[]>(mockEvents);

  const getTypeColor = (type: string) => {
    switch (type) {
      case "meeting": return "bg-blue-500/10 text-blue-500";
      case "call": return "bg-green-500/10 text-green-500";
      case "demo": return "bg-purple-500/10 text-purple-500";
      case "follow-up": return "bg-orange-500/10 text-orange-500";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      <div className="flex-shrink-0 h-14 bg-card border-b border-border flex items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center">
            <CalendarIcon className="w-5 h-5 text-indigo-500" />
          </div>
          <div>
            <h1 className="text-lg font-bold">Calendar</h1>
            <p className="text-xs text-muted-foreground">Appointments</p>
          </div>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-indigo-500 text-white rounded-lg text-sm font-medium hover:bg-indigo-600">
          <Plus className="w-4 h-4" />
          Schedule Event
        </button>
      </div>

      <div className="flex-shrink-0 p-4 border-b border-border">
        <div className="grid grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-indigo-500/5 border border-indigo-500/20">
            <div className="text-sm text-muted-foreground">Total Events</div>
            <div className="text-2xl font-bold text-indigo-500 mt-1">{events.length}</div>
          </div>
          <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/20">
            <div className="text-sm text-muted-foreground">Meetings</div>
            <div className="text-2xl font-bold text-blue-500 mt-1">{events.filter(e => e.type === "meeting").length}</div>
          </div>
          <div className="p-4 rounded-xl bg-purple-500/5 border border-purple-500/20">
            <div className="text-sm text-muted-foreground">Demos</div>
            <div className="text-2xl font-bold text-purple-500 mt-1">{events.filter(e => e.type === "demo").length}</div>
          </div>
          <div className="p-4 rounded-xl bg-green-500/5 border border-green-500/20">
            <div className="text-sm text-muted-foreground">Calls</div>
            <div className="text-2xl font-bold text-green-500 mt-1">{events.filter(e => e.type === "call").length}</div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4">
        <div className="space-y-3">
          {events.map((event, idx) => (
            <motion.div key={event.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: idx * 0.05 }}
              className="bg-card border border-border rounded-xl p-5 hover:shadow-lg transition-all">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 text-white flex flex-col items-center justify-center">
                  <span className="text-xs font-medium">{new Date(event.date).toLocaleDateString('en-US', { month: 'short' })}</span>
                  <span className="text-2xl font-bold">{new Date(event.date).getDate()}</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-bold">{event.title}</h3>
                    <span className={`px-2 py-1 rounded text-xs font-medium capitalize ${getTypeColor(event.type)}`}>
                      {event.type}
                    </span>
                  </div>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      {event.time} • {event.duration}
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      {event.attendees.join(", ")}
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      {event.location}
                    </div>
                    {event.notes && (
                      <p className="mt-2 italic">{event.notes}</p>
                    )}
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
