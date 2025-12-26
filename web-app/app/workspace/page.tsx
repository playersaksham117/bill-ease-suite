"use client";

import { motion } from "framer-motion";
import { Card, Stat } from "@/components/design-system";
import {
  ShoppingCart,
  Users,
  TrendingUp,
  Package,
  DollarSign,
  ArrowRight,
  Clock,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

export default function WorkspacePage() {
  // Get current hour for greeting
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
      className="space-y-8 pb-12"
    >
      {/* Header with Greeting */}
      <motion.div variants={fadeInUp} className="space-y-2">
        <h1 className="text-4xl md:text-5xl font-bold">
          {greeting}, Welcome Back! 👋
        </h1>
        <p className="text-lg text-muted-foreground">
          Here&apos;s what&apos;s happening with your business today
        </p>
      </motion.div>

      {/* KPI Cards Grid */}
      <motion.div
        variants={staggerContainer}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <motion.div variants={fadeInUp}>
          <Stat
            label="Today's Sales"
            value="₹12,458.50"
            change={{ value: 8.2, isPositive: true }}
            icon={<TrendingUp className="w-5 h-5" />}
          />
        </motion.div>

        <motion.div variants={fadeInUp}>
          <Stat
            label="Inventory Value"
            value="₹2,84,500.00"
            change={{ value: 3.5, isPositive: true }}
            icon={<Package className="w-5 h-5" />}
          />
        </motion.div>

        <motion.div variants={fadeInUp}>
          <Stat
            label="Monthly Profit"
            value="₹3,25,678.90"
            change={{ value: 12.3, isPositive: true }}
            icon={<DollarSign className="w-5 h-5" />}
          />
        </motion.div>

        <motion.div variants={fadeInUp}>
          <Stat
            label="Outstanding Dues"
            value="₹45,200.00"
            change={{ value: 2.1, isPositive: false }}
            icon={<AlertCircle className="w-5 h-5" />}
          />
        </motion.div>
      </motion.div>

      {/* App Launcher Section */}
      <motion.div variants={fadeInUp} className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold">Launch Applications</h2>
          <p className="text-muted-foreground mt-1">
            Access all your business tools
          </p>
        </div>

        <motion.div
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {[
            {
              name: "POS System",
              icon: ShoppingCart,
              description: "Fast, reliable point-of-sale transactions",
              href: "/workspace/pos",
              color: "from-blue-500/20 to-cyan-500/20",
              iconColor: "text-blue-600",
              stats: "12 transactions today",
            },
            {
              name: "CRM",
              icon: Users,
              description: "Manage customers and sales pipeline",
              href: "/workspace/crm",
              color: "from-purple-500/20 to-pink-500/20",
              iconColor: "text-purple-600",
              stats: "8 active contacts",
            },
            {
              name: "Income & Expenses",
              icon: TrendingUp,
              description: "Track income and expense transactions",
              href: "/workspace/exin",
              color: "from-green-500/20 to-emerald-500/20",
              iconColor: "text-green-600",
              stats: "₹15,658 this month",
            },
            {
              name: "Inventory",
              icon: Package,
              description: "Track and manage product inventory",
              href: "/workspace/tracinvent",
              color: "from-orange-500/20 to-red-500/20",
              iconColor: "text-orange-600",
              stats: "245 products",
            },
            {
              name: "Accounts+",
              icon: DollarSign,
              description: "Accounting and GST compliance",
              href: "/workspace/accounts",
              color: "from-yellow-500/20 to-orange-500/20",
              iconColor: "text-yellow-600",
              stats: "4 invoices pending",
            },
          ].map((app, idx) => (
            <motion.div key={idx} variants={fadeInUp}>
              <Link href={app.href}>
                <Card className="h-full group hover:shadow-elevated transition-all duration-300 cursor-pointer">
                  {/* Background Gradient */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${app.color} rounded-card opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                  />

                  {/* Content */}
                  <div className="relative space-y-4">
                    {/* Icon */}
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-muted group-hover:bg-muted/80 transition-colors">
                      <app.icon className={`w-6 h-6 ${app.iconColor}`} />
                    </div>

                    {/* Title & Description */}
                    <div>
                      <h3 className="text-lg font-semibold group-hover:text-primary transition-colors">
                        {app.name}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1 group-hover:text-muted-foreground/80 transition-colors">
                        {app.description}
                      </p>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center justify-between pt-2">
                      <span className="text-xs font-medium text-muted-foreground bg-muted px-2.5 py-1 rounded-full">
                        {app.stats}
                      </span>
                      <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>
                </Card>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div variants={fadeInUp} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-gradient-to-br from-primary/5 to-success/5 border-primary/20">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" />
                Recent Activity
              </h3>
              <p className="text-sm text-muted-foreground">
                3 transactions in the last 24 hours
              </p>
            </div>
            <Link
              href="/workspace/dashboard"
              className="text-primary hover:text-primary/80 transition-colors"
            >
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-warning/5 to-destructive/5 border-warning/20">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-warning" />
                Pending Items
              </h3>
              <p className="text-sm text-muted-foreground">
                2 invoices, 3 purchase orders awaiting approval
              </p>
            </div>
            <Link
              href="/workspace/accounts"
              className="text-warning hover:text-warning/80 transition-colors"
            >
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
}
