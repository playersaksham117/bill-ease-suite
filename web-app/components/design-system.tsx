"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/cn";

interface CardProps {
  children?: ReactNode;
  className?: string;
  elevated?: boolean;
  bordered?: boolean;
  interactive?: boolean;
}

/**
 * Card Component
 * 
 * Base container for financial data/content
 * Supports multiple visual styles for hierarchy
 * 
 * @example
 * <Card>
 *   <h3>Transaction Summary</h3>
 *   <p>Content here</p>
 * </Card>
 */
export function Card({
  children,
  className,
  elevated = false,
  bordered = false,
  interactive = false,
}: CardProps) {
  return (
    <div
      className={cn(
        "rounded-card bg-card p-6 transition-all duration-base",
        elevated ? "shadow-elevated" : "shadow-card",
        bordered && "border border-border",
        interactive && "cursor-pointer hover:shadow-hover",
        className
      )}
    >
      {children}
    </div>
  );
}

interface StatProps {
  label: string;
  value: string | number;
  change?: { value: number; isPositive: boolean };
  icon?: ReactNode;
  className?: string;
}

/**
 * Stat Component
 * 
 * Displays a financial metric with value, label, and optional change indicator
 * Perfect for dashboards and summary cards
 * 
 * @example
 * <Stat 
 *   label="Total Revenue" 
 *   value="₹45,231.89"
 *   change={{ value: 12.5, isPositive: true }}
 * />
 */
export function Stat({ label, value, change, icon, className }: StatProps) {
  return (
    <Card className={cn("flex flex-col gap-2", className)}>
      <div className="flex items-center justify-between">
        <span className="stat-label">{label}</span>
        {icon && <div className="text-primary">{icon}</div>}
      </div>
      <div className="stat-value">{value}</div>
      {change && (
        <div
          className={cn(
            "stat-change text-sm",
            change.isPositive ? "stat-change-positive" : "stat-change-negative"
          )}
        >
          {change.isPositive ? "+" : ""}
          {change.value}% {change.isPositive ? "increase" : "decrease"}
        </div>
      )}
    </Card>
  );
}

interface BadgeProps {
  children?: ReactNode;
  variant?: "primary" | "success" | "warning" | "destructive" | "muted";
  className?: string;
}

/**
 * Badge Component
 * 
 * Compact status indicator or label
 * Used for transaction status, tags, states
 * 
 * @example
 * <Badge variant="success">Completed</Badge>
 * <Badge variant="warning">Pending Review</Badge>
 * <Badge variant="destructive">Failed</Badge>
 */
export function Badge({ children, variant = "primary", className }: BadgeProps) {
  const variants = {
    primary: "badge-primary",
    success: "badge-success",
    warning: "badge-warning",
    destructive: "badge-destructive",
    muted: "badge-muted",
  };

  return (
    <span className={cn(variants[variant], className)}>
      {children}
    </span>
  );
}

interface TableProps {
  headers: string[];
  rows: (string | number | ReactNode)[][];
  className?: string;
  striped?: boolean;
}

/**
 * Table Component
 * 
 * Financial data presentation
 * Supports striped rows for readability
 * 
 * @example
 * <FinancialTable
 *   headers={["Date", "Description", "Amount", "Status"]}
 *   rows={[
 *     ["2024-01-15", "Invoice #001", "₹5,000", <Badge>Paid</Badge>],
 *     ["2024-01-10", "Purchase", "₹2,500", <Badge variant="warning">Pending</Badge>],
 *   ]}
 * />
 */
export function FinancialTable({ headers, rows, className, striped = true }: TableProps) {
  return (
    <div className={cn("overflow-x-auto rounded-card border border-border", className)}>
      <table className="table-base w-full">
        <thead className="table-header">
          <tr>
            {headers.map((header, idx) => (
              <th key={idx} className="table-header-cell">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIdx) => (
            <tr
              key={rowIdx}
              className={cn(
                "table-row",
                striped && rowIdx % 2 === 0 && "bg-muted/20"
              )}
            >
              {row.map((cell, cellIdx) => (
                <td key={cellIdx} className="table-cell">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

interface AlertProps {
  children?: ReactNode;
  variant?: "success" | "warning" | "destructive" | "info";
  title?: string;
  icon?: ReactNode;
  className?: string;
}

/**
 * Alert Component
 * 
 * Contextual information or warnings for users
 * Used for validation messages, confirmations
 * 
 * @example
 * <Alert variant="warning" title="Pending Review">
 *   This invoice is awaiting approval
 * </Alert>
 */
export function Alert({
  children,
  variant = "info",
  title,
  icon,
  className,
}: AlertProps) {
  const variants = {
    success: "bg-success/10 border-success/30 text-success-700",
    warning: "bg-warning/10 border-warning/30 text-warning-700",
    destructive: "bg-destructive/10 border-destructive/30 text-destructive-700",
    info: "bg-primary/10 border-primary/30 text-primary",
  };

  return (
    <div
      className={cn(
        "rounded-md border p-4",
        variants[variant],
        className
      )}
    >
      <div className="flex gap-3">
        {icon && <div className="flex-shrink-0">{icon}</div>}
        <div className="flex-1">
          {title && <h4 className="font-semibold">{title}</h4>}
          <div className="text-sm">{children}</div>
        </div>
      </div>
    </div>
  );
}
