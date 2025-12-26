"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ClipboardList, CheckCircle, Clock, AlertCircle, User } from "lucide-react";

interface Task {
  id: string;
  title: string;
  description: string;
  assignedTo: string;
  dueDate: string;
  priority: "high" | "medium" | "low";
  status: "pending" | "in-progress" | "completed";
  relatedTo: string;
}

const mockTasks: Task[] = [
  { id: "1", title: "Follow up with Rahul Sharma", description: "Discuss product demo", assignedTo: "Admin", dueDate: "2024-12-25", priority: "high", status: "pending", relatedTo: "Rahul Sharma" },
  { id: "2", title: "Prepare proposal for Startup Inc", description: "Create detailed proposal", assignedTo: "Admin", dueDate: "2024-12-26", priority: "high", status: "in-progress", relatedTo: "Priya Patel" },
  { id: "3", title: "Send quotation to Business Hub", description: "Price quotation", assignedTo: "Admin", dueDate: "2024-12-27", priority: "medium", status: "pending", relatedTo: "Vikram Singh" },
  { id: "4", title: "Schedule call with Enterprise Ltd", description: "Demo call", assignedTo: "Admin", dueDate: "2024-12-24", priority: "high", status: "completed", relatedTo: "Sneha Reddy" },
];

export default function TasksPage() {
  const [tasks] = useState<Task[]>(mockTasks);

  const stats = {
    total: tasks.length,
    pending: tasks.filter(t => t.status === "pending").length,
    inProgress: tasks.filter(t => t.status === "in-progress").length,
    completed: tasks.filter(t => t.status === "completed").length,
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "text-red-500";
      case "medium": return "text-yellow-500";
      case "low": return "text-green-500";
      default: return "text-muted-foreground";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed": return <CheckCircle className="w-5 h-5 text-success" />;
      case "in-progress": return <Clock className="w-5 h-5 text-warning" />;
      case "pending": return <AlertCircle className="w-5 h-5 text-muted-foreground" />;
      default: return <ClipboardList className="w-5 h-5" />;
    }
  };

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      <div className="flex-shrink-0 h-14 bg-card border-b border-border flex items-center px-6">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
            <ClipboardList className="w-5 h-5 text-blue-500" />
          </div>
          <div>
            <h1 className="text-lg font-bold">Tasks</h1>
            <p className="text-xs text-muted-foreground">Follow-up tasks</p>
          </div>
        </div>
      </div>

      <div className="flex-shrink-0 p-4 border-b border-border">
        <div className="grid grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/20">
            <div className="text-sm text-muted-foreground">Total Tasks</div>
            <div className="text-2xl font-bold text-blue-500 mt-1">{stats.total}</div>
          </div>
          <div className="p-4 rounded-xl bg-muted/50 border border-border">
            <div className="text-sm text-muted-foreground">Pending</div>
            <div className="text-2xl font-bold mt-1">{stats.pending}</div>
          </div>
          <div className="p-4 rounded-xl bg-warning/5 border border-warning/20">
            <div className="text-sm text-muted-foreground">In Progress</div>
            <div className="text-2xl font-bold text-warning mt-1">{stats.inProgress}</div>
          </div>
          <div className="p-4 rounded-xl bg-success/5 border border-success/20">
            <div className="text-sm text-muted-foreground">Completed</div>
            <div className="text-2xl font-bold text-success mt-1">{stats.completed}</div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4">
        <div className="space-y-3">
          {tasks.map((task, idx) => (
            <motion.div key={task.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: idx * 0.05 }}
              className={`bg-card border rounded-xl p-5 hover:shadow-lg transition-all ${
                task.status === "completed" ? "border-success/20 opacity-70" : "border-border"}`}>
              <div className="flex items-start gap-4">
                <div className="mt-1">
                  {getStatusIcon(task.status)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-bold">{task.title}</h3>
                    <span className={`px-2 py-1 rounded text-xs font-medium capitalize ${getPriorityColor(task.priority)}`}>
                      ● {task.priority}
                    </span>
                    <span className="px-2 py-1 bg-muted rounded text-xs font-medium capitalize">
                      {task.status}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{task.description}</p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Related to: {task.relatedTo}
                    </div>
                    <span>•</span>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Due: {task.dueDate}
                    </div>
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
