export interface StockReportItem {
  id: string;
  name: string;
  sku: string;
  category: string;
  location: string;
  openingStock: number;
  stockIn: number;
  stockOut: number;
  adjustments: number;
  closingStock: number;
  unit: string;
  costPrice: number;
  stockValue: number;
}
