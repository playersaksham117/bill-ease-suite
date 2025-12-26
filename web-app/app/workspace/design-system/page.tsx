"use client";

import { motion } from "framer-motion";
import { Card, Stat, Badge, FinancialTable, Alert } from "@/components/design-system";
import { TrendingUp, AlertCircle, CheckCircle } from "lucide-react";

export default function DesignSystemShowcase() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-12"
    >
      {/* Header */}
      <motion.section variants={itemVariants} className="space-y-2">
        <h1 className="text-5xl font-bold">Design System Showcase</h1>
        <p className="text-muted-foreground text-lg">
          Comprehensive design tokens and components for BillEase Suite
        </p>
      </motion.section>

      {/* Colors Section */}
      <motion.section variants={itemVariants} className="space-y-6">
        <h2 className="text-3xl font-bold">Color Palette</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Primary */}
          <div className="space-y-2">
            <div className="h-32 rounded-card bg-gradient-to-b from-primary-100 to-primary-600 shadow-card" />
            <div>
              <h3 className="font-semibold">Primary</h3>
              <p className="text-sm text-muted-foreground">Professional Blue</p>
              <p className="text-xs font-mono mt-1">hsl(222.2, 47.6%, 11.2%)</p>
            </div>
          </div>

          {/* Success */}
          <div className="space-y-2">
            <div className="h-32 rounded-card bg-gradient-to-b from-success-100 to-success-600 shadow-card" />
            <div>
              <h3 className="font-semibold">Success</h3>
              <p className="text-sm text-muted-foreground">Financial Green</p>
              <p className="text-xs font-mono mt-1">hsl(120, 61%, 34%)</p>
            </div>
          </div>

          {/* Warning */}
          <div className="space-y-2">
            <div className="h-32 rounded-card bg-gradient-to-b from-warning-100 to-warning-600 shadow-card" />
            <div>
              <h3 className="font-semibold">Warning</h3>
              <p className="text-sm text-muted-foreground">Attention Orange</p>
              <p className="text-xs font-mono mt-1">hsl(40, 96%, 32%)</p>
            </div>
          </div>

          {/* Destructive */}
          <div className="space-y-2">
            <div className="h-32 rounded-card bg-gradient-to-b from-destructive-100 to-destructive-600 shadow-card" />
            <div>
              <h3 className="font-semibold">Destructive</h3>
              <p className="text-sm text-muted-foreground">Error Red</p>
              <p className="text-xs font-mono mt-1">hsl(0, 91%, 50%)</p>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Typography Section */}
      <motion.section variants={itemVariants} className="space-y-6">
        <h2 className="text-3xl font-bold">Typography Scale</h2>

        <Card>
          <div className="space-y-6">
            <div>
              <h1>Heading 1 (H1)</h1>
              <p className="text-sm text-muted-foreground">3rem, 700 weight</p>
            </div>
            <div>
              <h2>Heading 2 (H2)</h2>
              <p className="text-sm text-muted-foreground">2.25rem, 700 weight</p>
            </div>
            <div>
              <h3>Heading 3 (H3)</h3>
              <p className="text-sm text-muted-foreground">1.875rem, 600 weight</p>
            </div>
            <div>
              <p className="text-body-lg">
                Body Large - Used for highlighted content (1.125rem)
              </p>
            </div>
            <div>
              <p className="text-body-md">
                Body Medium - Default body text (1rem)
              </p>
            </div>
            <div>
              <p className="text-body-sm">
                Body Small - Secondary information (0.875rem)
              </p>
            </div>
            <div>
              <p className="text-number">₹45,231.89</p>
              <p className="text-sm text-muted-foreground">Number style (monospace)</p>
            </div>
            <div>
              <label className="label">Form Label</label>
              <p className="text-sm text-muted-foreground">0.8125rem, 500 weight</p>
            </div>
          </div>
        </Card>
      </motion.section>

      {/* Components Section */}
      <motion.section variants={itemVariants} className="space-y-6">
        <h2 className="text-3xl font-bold">Components</h2>

        {/* Cards */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Cards</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <h4 className="font-semibold mb-2">Default Card</h4>
              <p className="text-sm text-muted-foreground">
                Standard card with shadow
              </p>
            </Card>
            <Card elevated>
              <h4 className="font-semibold mb-2">Elevated Card</h4>
              <p className="text-sm text-muted-foreground">
                Higher elevation for emphasis
              </p>
            </Card>
            <Card bordered>
              <h4 className="font-semibold mb-2">Bordered Card</h4>
              <p className="text-sm text-muted-foreground">
                Subtle border instead of shadow
              </p>
            </Card>
          </div>
        </div>

        {/* Stats */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Financial Stats</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Stat
              label="Total Revenue"
              value="₹45,231.89"
              change={{ value: 12.5, isPositive: true }}
              icon={<TrendingUp className="w-5 h-5" />}
            />
            <Stat
              label="Total Expenses"
              value="₹28,500.00"
              change={{ value: 5.2, isPositive: false }}
            />
            <Stat
              label="Net Profit"
              value="₹16,731.89"
              change={{ value: 18.3, isPositive: true }}
            />
          </div>
        </div>

        {/* Badges */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Status Badges</h3>
          <Card className="flex flex-wrap gap-3">
            <Badge variant="primary">Primary</Badge>
            <Badge variant="success">Completed</Badge>
            <Badge variant="warning">Pending Review</Badge>
            <Badge variant="destructive">Failed</Badge>
            <Badge variant="muted">Inactive</Badge>
          </Card>
        </div>

        {/* Table */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Financial Table</h3>
          <FinancialTable
            headers={["Date", "Description", "Amount", "Status"]}
            rows={[
              [
                "2024-01-15",
                "Invoice #INV-2024-001",
                "₹5,000.00",
                <Badge key="row-0" variant="success">
                  Paid
                </Badge>,
              ],
              [
                "2024-01-12",
                "Purchase Order #PO-001",
                "₹2,500.00",
                <Badge key="row-1" variant="warning">
                  Pending
                </Badge>,
              ],
              [
                "2024-01-10",
                "Invoice #INV-2024-000",
                "₹3,750.00",
                <Badge key="row-2" variant="success">
                  Paid
                </Badge>,
              ],
              [
                "2024-01-08",
                "Expense Report",
                "₹1,200.00",
                <Badge key="row-3" variant="destructive">
                  Rejected
                </Badge>,
              ],
            ]}
          />
        </div>

        {/* Alerts */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Alerts</h3>
          <div className="space-y-3">
            <Alert
              variant="success"
              title="Transaction Successful"
              icon={<CheckCircle className="w-5 h-5" />}
            >
              Your payment has been processed and credited to your account.
            </Alert>
            <Alert
              variant="warning"
              title="Pending Review"
              icon={<AlertCircle className="w-5 h-5" />}
            >
              This invoice is awaiting manager approval. Expected review within 2
              business days.
            </Alert>
            <Alert
              variant="destructive"
              title="Payment Failed"
              icon={<AlertCircle className="w-5 h-5" />}
            >
              Unable to process payment. Please verify your payment method and try again.
            </Alert>
          </div>
        </div>
      </motion.section>

      {/* Spacing Section */}
      <motion.section variants={itemVariants} className="space-y-6">
        <h2 className="text-3xl font-bold">Spacing Scale</h2>

        <Card>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-16 text-sm font-mono font-semibold">xs</div>
              <div className="h-6 w-1 rounded bg-primary" />
              <span className="text-sm text-muted-foreground">0.25rem (4px)</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-16 text-sm font-mono font-semibold">sm</div>
              <div className="h-6 w-2 rounded bg-primary" />
              <span className="text-sm text-muted-foreground">0.5rem (8px)</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-16 text-sm font-mono font-semibold">md</div>
              <div className="h-6 w-3 rounded bg-primary" />
              <span className="text-sm text-muted-foreground">0.75rem (12px)</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-16 text-sm font-mono font-semibold">lg</div>
              <div className="h-6 w-4 rounded bg-primary" />
              <span className="text-sm text-muted-foreground">1rem (16px)</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-16 text-sm font-mono font-semibold">xl</div>
              <div className="h-6 w-5 rounded bg-primary" />
              <span className="text-sm text-muted-foreground">1.25rem (20px)</span>
            </div>
          </div>
        </Card>
      </motion.section>

      {/* Footer */}
      <motion.section
        variants={itemVariants}
        className="border-t border-border pt-8 pb-12"
      >
        <div className="text-center space-y-2">
          <p className="text-sm text-muted-foreground">
            View full documentation in <code className="bg-muted px-2 py-1 rounded">DESIGN_SYSTEM.md</code>
          </p>
          <p className="text-xs text-muted-foreground">
            Built with ⚡ for professional financial applications
          </p>
        </div>
      </motion.section>
    </motion.div>
  );
}
