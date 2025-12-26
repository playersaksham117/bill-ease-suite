"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/design-system";
import {
  ShoppingCart,
  Users,
  TrendingUp,
  Package,
  DollarSign,
  ArrowRight,
  Smartphone,
  Laptop,
  MessageCircle,
  Zap,
  Check,
  Download,
  Github,
  Twitter,
  Linkedin,
} from "lucide-react";
import Link from "next/link";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border"
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="w-6 h-6 text-primary" />
            <span className="text-xl font-bold">BillEase Suite</span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="px-5 py-2 rounded-lg border border-border font-medium hover:bg-muted transition-colors"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="px-5 py-2 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
            >
              Register
            </Link>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={staggerContainer}
        className="max-w-7xl mx-auto px-6 py-24"
      >
        <div className="text-center space-y-6">
          <motion.h1
            variants={fadeInUp}
            className="text-6xl md:text-7xl font-bold tracking-tight"
          >
            Unified Business Platform
            <br />
            <span className="bg-gradient-to-r from-primary via-success to-primary bg-clip-text text-transparent">
              for Modern Enterprises
            </span>
          </motion.h1>

          <motion.p
            variants={fadeInUp}
            className="text-xl text-muted-foreground max-w-2xl mx-auto"
          >
            All-in-one solution for POS, CRM, accounting, inventory, and financial management. Designed for growth.
          </motion.p>

          <motion.div variants={fadeInUp} className="flex gap-4 justify-center pt-4">
            <Link
              href="/register"
              className="px-8 py-4 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all hover:shadow-lg flex items-center gap-2"
            >
              Get Started Free <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/login"
              className="px-8 py-4 rounded-lg border border-border font-semibold hover:bg-muted transition-colors"
            >
              Sign In
            </Link>
          </motion.div>

          {/* Demo Credentials Card */}
          <motion.div
            variants={fadeInUp}
            className="mt-8 inline-block"
          >
            <div className="bg-card/50 backdrop-blur-sm border border-border rounded-xl p-4 text-left max-w-md mx-auto">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                <span className="text-sm font-medium text-foreground">Demo Access Available</span>
              </div>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground text-xs">Username</p>
                  <p className="font-mono text-foreground">demo_user</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Email</p>
                  <p className="font-mono text-foreground">demo@billease.com</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Password</p>
                  <p className="font-mono text-foreground">Demo@123</p>
                </div>
              </div>
              <Link
                href="/login"
                className="mt-3 text-xs text-primary hover:underline inline-flex items-center gap-1"
              >
                Try Demo Login <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Floating Card Preview */}
        <motion.div
          variants={fadeInUp}
          className="mt-16 relative"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-success/20 to-primary/20 blur-3xl opacity-50" />
          <div className="relative bg-gradient-to-b from-muted/50 to-background border border-border rounded-2xl p-8 backdrop-blur-sm">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {[
                { icon: ShoppingCart, label: "POS" },
                { icon: Users, label: "CRM" },
                { icon: TrendingUp, label: "Analytics" },
                { icon: Package, label: "Inventory" },
                { icon: DollarSign, label: "Finance" },
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="flex flex-col items-center gap-3 p-4 rounded-lg border border-border/50 bg-background/50"
                >
                  <item.icon className="w-8 h-8 text-primary" />
                  <span className="text-sm font-medium">{item.label}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.section>

      {/* Apps Showcase Section */}
      <motion.section
        id="features"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={staggerContainer}
        className="max-w-7xl mx-auto px-6 py-24"
      >
        <motion.div variants={fadeInUp} className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Powerful Apps, One Platform</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            All the tools you need to run your business seamlessly integrated
          </p>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {[
            {
              name: "POS System",
              icon: ShoppingCart,
              description: "Fast, reliable point-of-sale system for retail and restaurants",
              features: ["Offline mode", "Receipt printing", "Multi-payments"],
              color: "from-blue-500 to-cyan-500",
            },
            {
              name: "CRM",
              icon: Users,
              description: "Customer relationship management and communication tracking",
              features: ["Contact management", "Sales pipeline", "Communication log"],
              color: "from-purple-500 to-pink-500",
            },
            {
              name: "ExIn",
              icon: TrendingUp,
              description: "Income and expense tracking with detailed categorization",
              features: ["Auto-categorization", "Reports", "Budget tracking"],
              color: "from-green-500 to-emerald-500",
            },
            {
              name: "TracInvent",
              icon: Package,
              description: "Complete inventory and warehouse management solution",
              features: ["Stock tracking", "Alerts", "Reorder management"],
              color: "from-orange-500 to-red-500",
            },
            {
              name: "Accounts+",
              icon: DollarSign,
              description: "Professional accounting and GST compliance management",
              features: ["Ledger management", "GST filing", "Financial reports"],
              color: "from-yellow-500 to-orange-500",
            },
            {
              name: "Analytics",
              icon: TrendingUp,
              description: "Real-time insights and comprehensive business analytics",
              features: ["Real-time dashboards", "Custom reports", "Forecasting"],
              color: "from-indigo-500 to-purple-500",
            },
          ].map((app, idx) => (
            <motion.div key={idx} variants={fadeInUp}>
              <Card className="h-full hover:shadow-elevated transition-all duration-300 cursor-pointer group">
                <div
                  className={`h-32 rounded-lg bg-gradient-to-br ${app.color} opacity-10 mb-4 flex items-center justify-center group-hover:opacity-20 transition-opacity`}
                >
                  <app.icon className="w-12 h-12 text-primary opacity-50" />
                </div>

                <h3 className="text-xl font-semibold mb-2">{app.name}</h3>
                <p className="text-sm text-muted-foreground mb-4">{app.description}</p>

                <ul className="space-y-2">
                  {app.features.map((feature, fidx) => (
                    <li key={fidx} className="flex items-center gap-2 text-sm">
                      <Check className="w-4 h-4 text-success" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      {/* Unified Workflow Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={staggerContainer}
        className="max-w-7xl mx-auto px-6 py-24"
      >
        <motion.div variants={fadeInUp} className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Unified Workflow</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            All your business data flows seamlessly across applications
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              number: "1",
              title: "Centralized Data",
              description: "Single source of truth for customer, inventory, and financial data",
            },
            {
              number: "2",
              title: "Real-Time Sync",
              description: "Changes instantly reflect across all applications",
            },
            {
              number: "3",
              title: "Unified Reports",
              description: "Comprehensive analytics combining data from all modules",
            },
          ].map((item, idx) => (
            <motion.div key={idx} variants={fadeInUp}>
              <Card className="text-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <span className="text-lg font-bold text-primary">{item.number}</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Desktop Apps Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={staggerContainer}
        className="max-w-7xl mx-auto px-6 py-24"
      >
        <motion.div variants={fadeInUp} className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Native Desktop Apps</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Optimized desktop experience for retail and back-office operations
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[
            {
              icon: Laptop,
              name: "Windows",
              description: "Full-featured desktop application for Windows",
              specs: ["Windows 10+", "Offline support", "Hardware integration"],
            },
            {
              icon: Apple,
              name: "macOS",
              description: "Native application optimized for Apple devices",
              specs: ["macOS 12+", "Touch Bar support", "iCloud sync"],
            },
          ].map((platform, idx) => (
            <motion.div key={idx} variants={fadeInUp}>
              <Card className="flex flex-col items-center text-center p-8">
                <platform.icon className="w-16 h-16 text-primary mb-4 opacity-80" />
                <h3 className="text-2xl font-semibold mb-2">{platform.name}</h3>
                <p className="text-muted-foreground mb-6">{platform.description}</p>
                <ul className="text-sm text-muted-foreground space-y-2 mb-6">
                  {platform.specs.map((spec, sidx) => (
                    <li key={sidx} className="flex items-center justify-center gap-2">
                      <Check className="w-4 h-4 text-success" />
                      {spec}
                    </li>
                  ))}
                </ul>
                <button className="flex items-center gap-2 px-6 py-2 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors">
                  <Download className="w-4 h-4" />
                  Download
                </button>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* POS Hardware Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={staggerContainer}
        className="max-w-7xl mx-auto px-6 py-24"
      >
        <motion.div variants={fadeInUp} className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">POS Hardware Integration</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Compatible with industry-standard hardware for seamless setup
          </p>
        </motion.div>

        <motion.div variants={staggerContainer} className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { name: "Barcode Scanners", icon: ShoppingCart },
            { name: "Receipt Printers", icon: Smartphone },
            { name: "Payment Terminals", icon: DollarSign },
            { name: "Customer Displays", icon: Laptop },
          ].map((hardware, idx) => (
            <motion.div key={idx} variants={fadeInUp}>
              <Card className="text-center p-6 hover:shadow-elevated transition-all">
                <hardware.icon className="w-12 h-12 text-primary mx-auto mb-4 opacity-70" />
                <h3 className="font-semibold">{hardware.name}</h3>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      {/* Support & Chatbot Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={staggerContainer}
        className="max-w-7xl mx-auto px-6 py-24"
      >
        <motion.div variants={fadeInUp} className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Always Here to Help</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            24/7 support through multiple channels and AI-powered assistance
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: MessageCircle,
              title: "Live Chat",
              description: "Instant support from our expert team during business hours",
            },
            {
              icon: Users,
              title: "Community",
              description: "Connect with thousands of BillEase Suite users and share tips",
            },
            {
              icon: Zap,
              title: "AI Assistant",
              description: "Smart assistant available 24/7 for instant answers and guidance",
            },
          ].map((support, idx) => (
            <motion.div key={idx} variants={fadeInUp}>
              <Card className="text-center">
                <support.icon className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">{support.title}</h3>
                <p className="text-sm text-muted-foreground">{support.description}</p>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div variants={fadeInUp} className="mt-12 text-center">
          <Link
            href="/workspace/support"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors"
          >
            Contact Support <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>
      </motion.section>

      {/* CTA Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={staggerContainer}
        className="max-w-7xl mx-auto px-6 py-24"
      >
        <Card className="bg-gradient-to-r from-primary/10 via-success/10 to-primary/10 p-12 text-center border border-primary/20">
          <motion.h2 variants={fadeInUp} className="text-4xl md:text-5xl font-bold mb-4">
            Ready to Transform Your Business?
          </motion.h2>
          <motion.p
            variants={fadeInUp}
            className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8"
          >
            Start your free trial today. No credit card required. Full access to all features.
          </motion.p>
          <motion.div variants={fadeInUp} className="flex gap-4 justify-center">
            <Link
              href="/workspace"
              className="px-8 py-4 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all hover:shadow-lg flex items-center gap-2"
            >
              Launch Free Trial <ArrowRight className="w-5 h-5" />
            </Link>
            <a
              href="mailto:support@billease.local"
              className="px-8 py-4 rounded-lg border border-border font-semibold hover:bg-muted transition-colors"
            >
              Schedule Demo
            </a>
          </motion.div>
        </Card>
      </motion.section>

      {/* Footer */}
      <footer className="border-t border-border bg-muted/30 mt-24">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Zap className="w-6 h-6 text-primary" />
                <span className="font-bold text-lg">BillEase Suite</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Unified business platform for modern enterprises
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#features" className="hover:text-foreground transition-colors">Features</a></li>
                <li><a href="/workspace" className="hover:text-foreground transition-colors">Pricing</a></li>
                <li><a href="/workspace" className="hover:text-foreground transition-colors">Security</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">About</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Contact</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Social</h3>
              <div className="flex gap-4">
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  <Github className="w-5 h-5" />
                </a>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  <Twitter className="w-5 h-5" />
                </a>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  <Linkedin className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-border pt-8 flex flex-col md:flex-row items-center justify-between text-sm text-muted-foreground">
            <p>&copy; 2024 BillEase Suite. All rights reserved.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-foreground transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Apple icon since it's not in lucide-react
function Apple(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      fill="currentColor"
      viewBox="0 0 24 24"
    >
      <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.61-2.53 3.44l-.87.5z" />
    </svg>
  );
}
