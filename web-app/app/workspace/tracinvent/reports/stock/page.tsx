"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  FileText,
  Search,
  Download,
  Package,
  TrendingUp,
  TrendingDown,
  IndianRupee,
  Calendar,
  Printer,
  Loader2,
  AlertCircle,
  RefreshCcw,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { fetchStockItems, fetchCategories, fetchLocations, getCurrentUser } from "@/lib/queries/stock-queries";
import { StockReportItem } from "@/types/stock";

export default function StockReportPage() {
  const router = useRouter();
  
  // State management
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [locationFilter, setLocationFilter] = useState("All");
  const [dateRange, setDateRange] = useState({
    from: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split("T")[0],
    to: new Date().toISOString().split("T")[0],
  });

  // Fetch current user with caching (cached for 5 minutes)
  const { data: user, isLoading: userLoading, error: userError } = useQuery({
    queryKey: ['currentUser'],
    queryFn: getCurrentUser,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });

  // Redirect to login if no user
  if (!userLoading && (!user || userError)) {
    router.push('/login');
    return null;
  }

  // Fetch stock items with smart caching
  const { 
    data: stockItems = [], 
    isLoading: stockLoading,
    error: stockError,
    refetch: refetchStock,
    isFetching
  } = useQuery({
    queryKey: ['stockItems', user?.id, categoryFilter, locationFilter, searchQuery, dateRange.from, dateRange.to],
    queryFn: () => fetchStockItems({
      userId: user!.id,
      categoryFilter,
      locationFilter,
      searchQuery,
      dateFrom: dateRange.from,
      dateTo: dateRange.to,
    }),
    enabled: !!user,
    staleTime: 2 * 60 * 1000, // Consider data fresh for 2 minutes
    gcTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
  });

  // Fetch categories with caching (rarely changes)
  const { data: categories = ['All'] } = useQuery({
    queryKey: ['categories', user?.id],
    queryFn: () => fetchCategories(user!.id),
    enabled: !!user,
    staleTime: 30 * 60 * 1000, // 30 minutes - categories don't change often
  });

  // Fetch locations with caching (rarely changes)
  const { data: locations = ['All'] } = useQuery({
    queryKey: ['locations', user?.id],
    queryFn: () => fetchLocations(user!.id),
    enabled: !!user,
    staleTime: 30 * 60 * 1000, // 30 minutes - locations don't change often
  });

  // Memoized summary calculations for performance
  const summary = useMemo(() => {
    return {
      totalProducts: stockItems.length,
      totalOpeningStock: stockItems.reduce((sum, i) => sum + i.openingStock, 0),
      totalStockIn: stockItems.reduce((sum, i) => sum + i.stockIn, 0),
      totalStockOut: stockItems.reduce((sum, i) => sum + i.stockOut, 0),
      totalAdjustments: stockItems.reduce((sum, i) => sum + i.adjustments, 0),
      totalClosingStock: stockItems.reduce((sum, i) => sum + i.closingStock, 0),
      totalStockValue: stockItems.reduce((sum, i) => sum + i.stockValue, 0),
    };
  }, [stockItems]);

  // Export to CSV function
  const exportToCSV = () => {
    const headers = ['Product', 'SKU', 'Category', 'Location', 'Opening', 'Stock In', 'Stock Out', 'Adjustments', 'Closing', 'Unit', 'Cost Price', 'Stock Value'];
    const csvData = stockItems.map(item => [
      item.name,
      item.sku,
      item.category,
      item.location,
      item.openingStock,
      item.stockIn,
      item.stockOut,
      item.adjustments,
      item.closingStock,
      item.unit,
      item.costPrice,
      item.stockValue
    ]);

    const csv = [
      headers.join(','),
      ...csvData.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `stock-report-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Print function
  const handlePrint = () => {
    window.print();
  };

  // Combined loading state
  const isLoading = userLoading || stockLoading;

  // Loading state
  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading stock report...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (stockError) {
    const error = stockError as Error;
    return (
      <div className="h-screen flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Error Loading Data</h2>
          <p className="text-muted-foreground mb-4">{error.message}</p>
          <button
            onClick={() => refetchStock()}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 inline-flex items-center gap-2"
          >
            <RefreshCcw className="w-4 h-4" />
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0 px-3 sm:px-6 py-3 sm:py-4 border-b border-border bg-card/50">
        <div className="flex items-center justify-between gap-3">
          <div className="flex-1 min-w-0 flex items-center gap-3">
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-foreground truncate">Stock Report</h1>
              <p className="text-xs sm:text-sm text-muted-foreground hidden sm:block">
                {isFetching ? 'Updating...' : 'Real-time inventory data'}
              </p>
            </div>
            {isFetching && (
              <Loader2 className="w-4 h-4 animate-spin text-primary" />
            )}
          </div>
          <div className="flex gap-2">
            <button 
              onClick={handlePrint}
              className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 bg-muted text-foreground rounded-lg text-xs sm:text-sm font-medium hover:bg-muted/80 transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline">Print</span>
            </button>
            <button 
              onClick={exportToCSV}
              disabled={stockItems.length === 0}
              className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 bg-primary text-primary-foreground rounded-lg text-xs sm:text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Export</span>
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-3 sm:p-6">
        {/* Summary Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
          <div className="bg-card border border-border rounded-xl p-3 sm:p-4">
            <div className="flex items-center gap-2 sm:gap-3 mb-2">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Package className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
              </div>
              <span className="text-xs sm:text-sm text-muted-foreground">Opening Stock</span>
            </div>
            <p className="text-xl sm:text-2xl font-bold">{summary.totalOpeningStock.toLocaleString()}</p>
          </div>
          <div className="bg-card border border-border rounded-xl p-3 sm:p-4">
            <div className="flex items-center gap-2 sm:gap-3 mb-2">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-success/10 flex items-center justify-center">
                <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-success" />
              </div>
              <span className="text-xs sm:text-sm text-muted-foreground">Stock In</span>
            </div>
            <p className="text-xl sm:text-2xl font-bold text-success">+{summary.totalStockIn.toLocaleString()}</p>
          </div>
          <div className="bg-card border border-border rounded-xl p-3 sm:p-4">
            <div className="flex items-center gap-2 sm:gap-3 mb-2">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-destructive/10 flex items-center justify-center">
                <TrendingDown className="w-4 h-4 sm:w-5 sm:h-5 text-destructive" />
              </div>
              <span className="text-xs sm:text-sm text-muted-foreground">Stock Out</span>
            </div>
            <p className="text-xl sm:text-2xl font-bold text-destructive">-{summary.totalStockOut.toLocaleString()}</p>
          </div>
          <div className="bg-card border border-border rounded-xl p-3 sm:p-4">
            <div className="flex items-center gap-2 sm:gap-3 mb-2">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-warning/10 flex items-center justify-center">
                <IndianRupee className="w-4 h-4 sm:w-5 sm:h-5 text-warning" />
              </div>
              <span className="text-xs sm:text-sm text-muted-foreground">Stock Value</span>
            </div>
            <p className="text-xl sm:text-2xl font-bold">₹{(summary.totalStockValue / 1000).toFixed(1)}K</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-card border border-border rounded-xl p-3 sm:p-4 mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
            {/* Date Range - Stack on mobile */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-2">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap">Period:</span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="date"
                  value={dateRange.from}
                  onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
                  className="flex-1 sm:flex-none h-9 px-2 sm:px-3 bg-background border border-border rounded-lg text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <span className="text-xs sm:text-sm text-muted-foreground">to</span>
                <input
                  type="date"
                  value={dateRange.to}
                  onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
                  className="flex-1 sm:flex-none h-9 px-2 sm:px-3 bg-background border border-border rounded-lg text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
            
            <div className="hidden sm:block h-8 w-px bg-border" />
            
            {/* Search */}
            <div className="relative flex-1 sm:max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-9 pl-10 pr-4 bg-background border border-border rounded-lg text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            
            {/* Filters - Stack on mobile */}
            <div className="flex gap-2">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="flex-1 sm:flex-none h-9 px-2 sm:px-3 bg-background border border-border rounded-lg text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <select
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className="flex-1 sm:flex-none h-9 px-2 sm:px-3 bg-background border border-border rounded-lg text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {locations.map((loc) => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Report Table - Desktop View */}
        <div className="bg-card border border-border rounded-xl overflow-hidden hidden md:block">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50 border-b border-border">
                <tr>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Product</th>
                  <th className="text-left px-3 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Location</th>
                  <th className="text-right px-3 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Opening</th>
                  <th className="text-right px-3 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">In</th>
                  <th className="text-right px-3 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Out</th>
                  <th className="text-right px-3 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Adj.</th>
                  <th className="text-right px-3 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Closing</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {stockItems.map((item, idx) => (
                  <motion.tr
                    key={item.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: idx * 0.02 }}
                    className="hover:bg-muted/30 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <p className="font-medium text-foreground">{item.name}</p>
                      <p className="text-xs text-muted-foreground">{item.sku} • {item.category}</p>
                    </td>
                    <td className="px-3 py-3 text-sm">{item.location}</td>
                    <td className="px-3 py-3 text-right text-sm">{item.openingStock}</td>
                    <td className="px-3 py-3 text-right text-sm text-success">+{item.stockIn}</td>
                    <td className="px-3 py-3 text-right text-sm text-destructive">-{item.stockOut}</td>
                    <td className="px-3 py-3 text-right text-sm">
                      <span className={item.adjustments !== 0 ? (item.adjustments > 0 ? "text-success" : "text-destructive") : ""}>
                        {item.adjustments !== 0 ? (item.adjustments > 0 ? `+${item.adjustments}` : item.adjustments) : "—"}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-right font-semibold">{item.closingStock}</td>
                    <td className="px-4 py-3 text-right font-semibold">₹{item.stockValue.toLocaleString()}</td>
                  </motion.tr>
                ))}
              </tbody>
              <tfoot className="bg-muted/30 border-t border-border">
                <tr>
                  <td colSpan={2} className="px-4 py-3 font-semibold">Total ({stockItems.length} products)</td>
                  <td className="px-3 py-3 text-right font-semibold">{summary.totalOpeningStock}</td>
                  <td className="px-3 py-3 text-right font-semibold text-success">+{summary.totalStockIn}</td>
                  <td className="px-3 py-3 text-right font-semibold text-destructive">-{summary.totalStockOut}</td>
                  <td className="px-3 py-3 text-right font-semibold">
                    {summary.totalAdjustments !== 0 ? (summary.totalAdjustments > 0 ? `+${summary.totalAdjustments}` : summary.totalAdjustments) : "—"}
                  </td>
                  <td className="px-3 py-3 text-right font-bold">{summary.totalClosingStock}</td>
                  <td className="px-4 py-3 text-right font-bold">₹{summary.totalStockValue.toLocaleString()}</td>
                </tr>
              </tfoot>
            </table>
          </div>

          {stockItems.length === 0 && (
            <div className="p-12 text-center">
              <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">No stock data found</p>
              <p className="text-sm text-muted-foreground mt-1">Add items to see them here</p>
            </div>
          )}
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden space-y-3">
          {stockItems.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.02 }}
              className="bg-card border border-border rounded-xl p-4"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground mb-1">{item.name}</h3>
                  <p className="text-xs text-muted-foreground">{item.sku} • {item.category}</p>
                  <p className="text-xs text-muted-foreground mt-1">📍 {item.location}</p>
                </div>
                <div className="text-right ml-3">
                  <p className="text-lg font-bold text-foreground">{item.closingStock}</p>
                  <p className="text-xs text-muted-foreground">Closing</p>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-3 pt-3 border-t border-border">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Opening</p>
                  <p className="font-semibold text-sm">{item.openingStock}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">In</p>
                  <p className="font-semibold text-sm text-success">+{item.stockIn}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Out</p>
                  <p className="font-semibold text-sm text-destructive">-{item.stockOut}</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
                <div>
                  <p className="text-xs text-muted-foreground">Adjustments</p>
                  <p className={`font-semibold text-sm ${item.adjustments !== 0 ? (item.adjustments > 0 ? "text-success" : "text-destructive") : ""}`}>
                    {item.adjustments !== 0 ? (item.adjustments > 0 ? `+${item.adjustments}` : item.adjustments) : "—"}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">Total Value</p>
                  <p className="font-bold text-sm">₹{item.stockValue.toLocaleString()}</p>
                </div>
              </div>
            </motion.div>
          ))}
          
          {/* Mobile Summary */}
          {stockItems.length > 0 && (
            <div className="bg-muted/30 border border-border rounded-xl p-4 mt-4">
              <h3 className="font-bold text-sm mb-3">Total Summary ({stockItems.length} products)</h3>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Opening Stock</p>
                  <p className="font-semibold text-sm">{summary.totalOpeningStock}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Stock In</p>
                  <p className="font-semibold text-sm text-success">+{summary.totalStockIn}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Stock Out</p>
                  <p className="font-semibold text-sm text-destructive">-{summary.totalStockOut}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Closing Stock</p>
                  <p className="font-bold text-sm">{summary.totalClosingStock}</p>
                </div>
                <div className="col-span-2 pt-3 border-t border-border">
                  <p className="text-xs text-muted-foreground mb-1">Total Stock Value</p>
                  <p className="font-bold text-lg">₹{summary.totalStockValue.toLocaleString()}</p>
                </div>
              </div>
            </div>
          )}
          
          {stockItems.length === 0 && (
            <div className="p-12 text-center bg-card border border-border rounded-xl">
              <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground text-sm">No stock data found</p>
              <p className="text-xs text-muted-foreground mt-1">Add items to see them here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
