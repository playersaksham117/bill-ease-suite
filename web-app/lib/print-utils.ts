/**
 * Print Utilities for Bluetooth Receipt Printer
 * Compatible with mate.bluetoothprint Android app
 * 
 * Tag Format Reference:
 * - <HTML></HTML> - HTML content wrapper
 * - <IMAGE>0#base64data; - Print image (0=left, 1=center, 2=right)
 * - <BARCODE>0#data; - Print barcode
 * - <QR>1#data; - Print QR code (1=center)
 * - <ABC> - Text formatting where:
 *   - A: 0=normal, 1=bold
 *   - B: 0=normal, 1=double width, 2=double height
 *   - C: 0=left, 1=center, 2=right, 3=justify
 */

// Print alignment
export const PrintAlign = {
  LEFT: 0,
  CENTER: 1,
  RIGHT: 2,
  JUSTIFY: 3,
} as const;

// Text size
export const PrintSize = {
  NORMAL: 0,
  DOUBLE_WIDTH: 1,
  DOUBLE_HEIGHT: 2,
} as const;

// Text style
export const PrintStyle = {
  NORMAL: 0,
  BOLD: 1,
} as const;

export interface PrinterConfig {
  macAddress: string;
  paperWidth: number; // 58mm or 80mm
  characterPerLine: number; // 32 for 58mm, 48 for 80mm
}

export interface InvoiceData {
  invoiceNo: string;
  date: Date;
  customerName?: string;
  customerPhone?: string;
  customerGstin?: string;
  supplierName?: string;
  paymentType: "cash" | "credit" | "partial";
  paymentMethod?: string;
  items: InvoiceItem[];
  subtotal: number;
  discount?: number;
  taxAmount?: number;
  cgst?: number;
  sgst?: number;
  igst?: number;
  grandTotal: number;
  amountPaid?: number;
  balanceDue?: number;
  notes?: string;
}

export interface InvoiceItem {
  name: string;
  quantity: number;
  unit?: string;
  price: number;
  discount?: number;
  gst?: number;
  total: number;
}

export interface BusinessInfo {
  name: string;
  address?: string;
  phone?: string;
  email?: string;
  gstin?: string;
  logo?: string; // base64
}

/**
 * Generate text tag with formatting
 */
export function formatText(
  text: string,
  style: number = PrintStyle.NORMAL,
  size: number = PrintSize.NORMAL,
  align: number = PrintAlign.LEFT
): string {
  return `<${style}${size}${align}>${text};`;
}

/**
 * Generate centered bold text (for headers)
 */
export function headerText(text: string): string {
  return formatText(text, PrintStyle.BOLD, PrintSize.DOUBLE_WIDTH, PrintAlign.CENTER);
}

/**
 * Generate centered normal text
 */
export function centerText(text: string): string {
  return formatText(text, PrintStyle.NORMAL, PrintSize.NORMAL, PrintAlign.CENTER);
}

/**
 * Generate left-aligned text
 */
export function leftText(text: string): string {
  return formatText(text, PrintStyle.NORMAL, PrintSize.NORMAL, PrintAlign.LEFT);
}

/**
 * Generate right-aligned text
 */
export function rightText(text: string): string {
  return formatText(text, PrintStyle.NORMAL, PrintSize.NORMAL, PrintAlign.RIGHT);
}

/**
 * Generate bold text
 */
export function boldText(text: string, align: number = PrintAlign.LEFT): string {
  return formatText(text, PrintStyle.BOLD, PrintSize.NORMAL, align);
}

/**
 * Generate a separator line
 */
export function separatorLine(char: string = "-", width: number = 32): string {
  return formatText(char.repeat(width), PrintStyle.NORMAL, PrintSize.NORMAL, PrintAlign.CENTER);
}

/**
 * Generate double separator line
 */
export function doubleLine(width: number = 32): string {
  return separatorLine("=", width);
}

/**
 * Format currency for Indian Rupees
 */
export function formatCurrency(amount: number): string {
  return `Rs.${amount.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

/**
 * Format two-column text (left and right aligned)
 */
export function twoColumnText(left: string, right: string, width: number = 32): string {
  const spaceNeeded = width - left.length - right.length;
  if (spaceNeeded > 0) {
    return leftText(left + " ".repeat(spaceNeeded) + right);
  }
  return leftText(left.substring(0, width - right.length - 1) + " " + right);
}

/**
 * Generate QR code tag
 */
export function qrCode(data: string, align: number = PrintAlign.CENTER): string {
  return `<QR>${align}#${data};`;
}

/**
 * Generate barcode tag
 */
export function barcode(data: string, align: number = PrintAlign.CENTER): string {
  return `<BARCODE>${align}#${data};`;
}

/**
 * Generate image tag from base64
 */
export function printImage(base64Data: string, align: number = PrintAlign.CENTER): string {
  return `<IMAGE>${align}#${base64Data};`;
}

/**
 * Generate complete invoice receipt
 */
export function generateInvoiceReceipt(
  invoice: InvoiceData,
  business: BusinessInfo,
  config: PrinterConfig
): string {
  const width = config.characterPerLine;
  const lines: string[] = [];

  // Start HTML wrapper
  lines.push("<HTML>");

  // Business Logo (if available)
  if (business.logo) {
    lines.push(printImage(business.logo, PrintAlign.CENTER));
  }

  // Business Header
  lines.push(headerText(business.name));
  if (business.address) {
    lines.push(centerText(business.address));
  }
  if (business.phone) {
    lines.push(centerText(`Ph: ${business.phone}`));
  }
  if (business.gstin) {
    lines.push(centerText(`GSTIN: ${business.gstin}`));
  }

  lines.push(doubleLine(width));

  // Invoice Details
  lines.push(boldText("TAX INVOICE", PrintAlign.CENTER));
  lines.push(separatorLine("-", width));
  
  lines.push(twoColumnText("Invoice No:", invoice.invoiceNo, width));
  lines.push(twoColumnText("Date:", formatDate(invoice.date), width));
  
  // Customer Details
  if (invoice.customerName) {
    lines.push(separatorLine("-", width));
    lines.push(boldText("Customer:", PrintAlign.LEFT));
    lines.push(leftText(invoice.customerName));
    if (invoice.customerPhone) {
      lines.push(leftText(`Ph: ${invoice.customerPhone}`));
    }
    if (invoice.customerGstin) {
      lines.push(leftText(`GSTIN: ${invoice.customerGstin}`));
    }
  }

  // Supplier Details (for purchase invoices)
  if (invoice.supplierName) {
    lines.push(separatorLine("-", width));
    lines.push(boldText("Supplier:", PrintAlign.LEFT));
    lines.push(leftText(invoice.supplierName));
  }

  // Payment Type Badge
  lines.push(separatorLine("-", width));
  const paymentBadge = invoice.paymentType.toUpperCase();
  lines.push(boldText(`Payment: ${paymentBadge}`, PrintAlign.CENTER));

  // Items Header
  lines.push(doubleLine(width));
  lines.push(boldText(formatItemHeader(width), PrintAlign.LEFT));
  lines.push(separatorLine("-", width));

  // Items
  invoice.items.forEach((item, index) => {
    lines.push(leftText(`${index + 1}. ${item.name}`));
    lines.push(leftText(formatItemLine(item, width)));
  });

  // Totals
  lines.push(doubleLine(width));
  lines.push(twoColumnText("Subtotal:", formatCurrency(invoice.subtotal), width));
  
  if (invoice.discount && invoice.discount > 0) {
    lines.push(twoColumnText("Discount:", `-${formatCurrency(invoice.discount)}`, width));
  }

  // GST Breakdown
  if (invoice.cgst && invoice.cgst > 0) {
    lines.push(twoColumnText("CGST:", formatCurrency(invoice.cgst), width));
  }
  if (invoice.sgst && invoice.sgst > 0) {
    lines.push(twoColumnText("SGST:", formatCurrency(invoice.sgst), width));
  }
  if (invoice.igst && invoice.igst > 0) {
    lines.push(twoColumnText("IGST:", formatCurrency(invoice.igst), width));
  }
  if (invoice.taxAmount && invoice.taxAmount > 0 && !invoice.cgst && !invoice.sgst) {
    lines.push(twoColumnText("Tax:", formatCurrency(invoice.taxAmount), width));
  }

  lines.push(separatorLine("-", width));
  
  // Grand Total (larger)
  lines.push(formatText(`TOTAL: ${formatCurrency(invoice.grandTotal)}`, PrintStyle.BOLD, PrintSize.DOUBLE_WIDTH, PrintAlign.CENTER));

  // Payment Details
  if (invoice.paymentType !== "cash" || invoice.amountPaid) {
    lines.push(separatorLine("-", width));
    if (invoice.amountPaid !== undefined) {
      lines.push(twoColumnText("Amount Paid:", formatCurrency(invoice.amountPaid), width));
    }
    if (invoice.balanceDue !== undefined && invoice.balanceDue > 0) {
      lines.push(boldText(twoColumnText("Balance Due:", formatCurrency(invoice.balanceDue), width), PrintAlign.LEFT));
    }
    if (invoice.paymentMethod) {
      lines.push(twoColumnText("Payment Mode:", invoice.paymentMethod.toUpperCase(), width));
    }
  }

  // Notes
  if (invoice.notes) {
    lines.push(separatorLine("-", width));
    lines.push(leftText(`Note: ${invoice.notes}`));
  }

  // QR Code for digital verification
  lines.push(separatorLine("-", width));
  const qrData = `INV:${invoice.invoiceNo}|AMT:${invoice.grandTotal}|DT:${formatDate(invoice.date)}`;
  lines.push(qrCode(qrData, PrintAlign.CENTER));

  // Footer
  lines.push(doubleLine(width));
  lines.push(centerText("Thank you for your business!"));
  lines.push(centerText("Visit again"));
  
  if (business.email) {
    lines.push(centerText(business.email));
  }

  // Powered by
  lines.push(separatorLine("-", width));
  lines.push(centerText("Powered by BillEase Suite"));

  // End HTML wrapper
  lines.push("</HTML>");

  return lines.join("\n");
}

/**
 * Generate estimate receipt
 */
export function generateEstimateReceipt(
  invoice: InvoiceData,
  business: BusinessInfo,
  config: PrinterConfig
): string {
  const width = config.characterPerLine;
  const lines: string[] = [];

  lines.push("<HTML>");

  // Business Header
  if (business.logo) {
    lines.push(printImage(business.logo, PrintAlign.CENTER));
  }
  lines.push(headerText(business.name));
  if (business.address) {
    lines.push(centerText(business.address));
  }
  if (business.phone) {
    lines.push(centerText(`Ph: ${business.phone}`));
  }

  lines.push(doubleLine(width));
  lines.push(formatText("ESTIMATE", PrintStyle.BOLD, PrintSize.DOUBLE_WIDTH, PrintAlign.CENTER));
  lines.push(centerText("(Not a Tax Invoice)"));
  lines.push(separatorLine("-", width));

  lines.push(twoColumnText("Estimate No:", invoice.invoiceNo, width));
  lines.push(twoColumnText("Date:", formatDate(invoice.date), width));

  if (invoice.customerName) {
    lines.push(separatorLine("-", width));
    lines.push(leftText(`Customer: ${invoice.customerName}`));
  }

  // Items
  lines.push(doubleLine(width));
  lines.push(boldText(formatItemHeader(width), PrintAlign.LEFT));
  lines.push(separatorLine("-", width));

  invoice.items.forEach((item, index) => {
    lines.push(leftText(`${index + 1}. ${item.name}`));
    lines.push(leftText(formatItemLine(item, width)));
  });

  lines.push(doubleLine(width));
  lines.push(twoColumnText("Subtotal:", formatCurrency(invoice.subtotal), width));
  
  if (invoice.discount && invoice.discount > 0) {
    lines.push(twoColumnText("Discount:", `-${formatCurrency(invoice.discount)}`, width));
  }
  if (invoice.taxAmount && invoice.taxAmount > 0) {
    lines.push(twoColumnText("Est. Tax:", formatCurrency(invoice.taxAmount), width));
  }

  lines.push(separatorLine("-", width));
  lines.push(formatText(`TOTAL: ${formatCurrency(invoice.grandTotal)}`, PrintStyle.BOLD, PrintSize.DOUBLE_WIDTH, PrintAlign.CENTER));

  lines.push(doubleLine(width));
  lines.push(centerText("This is an estimate only"));
  lines.push(centerText("Valid for 7 days"));
  lines.push(separatorLine("-", width));
  lines.push(centerText("Powered by BillEase Suite"));

  lines.push("</HTML>");

  return lines.join("\n");
}

/**
 * Generate daily summary receipt
 */
export function generateDailySummaryReceipt(
  summary: DailySummary,
  business: BusinessInfo,
  config: PrinterConfig
): string {
  const width = config.characterPerLine;
  const lines: string[] = [];

  lines.push("<HTML>");

  lines.push(headerText(business.name));
  lines.push(doubleLine(width));
  lines.push(formatText("DAILY SUMMARY", PrintStyle.BOLD, PrintSize.DOUBLE_WIDTH, PrintAlign.CENTER));
  lines.push(separatorLine("-", width));
  lines.push(centerText(formatDate(summary.date)));

  lines.push(doubleLine(width));

  // Sales Summary
  lines.push(boldText("SALES SUMMARY", PrintAlign.LEFT));
  lines.push(separatorLine("-", width));
  lines.push(twoColumnText("Total Sales:", formatCurrency(summary.totalSales), width));
  lines.push(twoColumnText("Cash Sales:", formatCurrency(summary.cashSales), width));
  lines.push(twoColumnText("Credit Sales:", formatCurrency(summary.creditSales), width));
  lines.push(twoColumnText("Card/UPI:", formatCurrency(summary.cardSales), width));
  lines.push(twoColumnText("Invoices:", summary.invoiceCount.toString(), width));

  lines.push(separatorLine("-", width));

  // Collections
  lines.push(boldText("COLLECTIONS", PrintAlign.LEFT));
  lines.push(separatorLine("-", width));
  lines.push(twoColumnText("Cash Received:", formatCurrency(summary.cashReceived), width));
  lines.push(twoColumnText("Card/UPI:", formatCurrency(summary.cardReceived), width));
  lines.push(twoColumnText("Credit Collected:", formatCurrency(summary.creditCollected), width));

  lines.push(separatorLine("-", width));

  // Returns
  if (summary.returns > 0) {
    lines.push(boldText("RETURNS", PrintAlign.LEFT));
    lines.push(twoColumnText("Total Returns:", formatCurrency(summary.returns), width));
    lines.push(separatorLine("-", width));
  }

  // Cash in Drawer
  lines.push(doubleLine(width));
  lines.push(formatText(`CASH IN DRAWER`, PrintStyle.BOLD, PrintSize.NORMAL, PrintAlign.CENTER));
  lines.push(formatText(formatCurrency(summary.cashInDrawer), PrintStyle.BOLD, PrintSize.DOUBLE_WIDTH, PrintAlign.CENTER));

  lines.push(doubleLine(width));
  lines.push(centerText("Generated by BillEase Suite"));
  lines.push(centerText(formatDateTime(new Date())));

  lines.push("</HTML>");

  return lines.join("\n");
}

export interface DailySummary {
  date: Date;
  totalSales: number;
  cashSales: number;
  creditSales: number;
  cardSales: number;
  invoiceCount: number;
  cashReceived: number;
  cardReceived: number;
  creditCollected: number;
  returns: number;
  cashInDrawer: number;
}

// Helper functions
function formatDate(date: Date): string {
  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatDateTime(date: Date): string {
  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatItemHeader(width: number): string {
  if (width >= 48) {
    return "Item            Qty    Rate    Amount";
  }
  return "Item        Qty   Rate  Amt";
}

function formatItemLine(item: InvoiceItem, width: number): string {
  const qty = `${item.quantity}${item.unit ? item.unit : ""}`;
  const rate = item.price.toFixed(2);
  const total = item.total.toFixed(2);
  
  if (width >= 48) {
    return `                ${qty.padStart(4)}  ${rate.padStart(8)}  ${total.padStart(8)}`;
  }
  return `            ${qty.padStart(3)} ${rate.padStart(6)} ${total.padStart(6)}`;
}

/**
 * Send print data to Android app via custom URL scheme or bridge
 * This creates data that can be passed to the Android WebView bridge
 */
export function createPrintPayload(
  printData: string,
  printerMac: string,
  invoiceNo: string
): PrintPayload {
  return {
    action: "PRINT",
    printerMac,
    invoiceNo,
    data: printData,
    timestamp: new Date().toISOString(),
  };
}

export interface PrintPayload {
  action: string;
  printerMac: string;
  invoiceNo: string;
  data: string;
  timestamp: string;
}

/**
 * For web-only: Generate printable HTML for browser printing
 */
export function generatePrintableHTML(
  invoice: InvoiceData,
  business: BusinessInfo,
  width: number = 80
): string {
  const widthMm = width === 58 ? 58 : 80;
  
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Invoice ${invoice.invoiceNo}</title>
  <style>
    @page {
      size: ${widthMm}mm auto;
      margin: 0;
    }
    body {
      font-family: 'Courier New', monospace;
      font-size: 12px;
      width: ${widthMm}mm;
      margin: 0 auto;
      padding: 2mm;
    }
    .center { text-align: center; }
    .right { text-align: right; }
    .bold { font-weight: bold; }
    .large { font-size: 16px; }
    .divider { border-top: 1px dashed #000; margin: 4px 0; }
    .double-divider { border-top: 2px solid #000; margin: 4px 0; }
    .row { display: flex; justify-content: space-between; }
    .item-row { margin: 2px 0; }
    table { width: 100%; border-collapse: collapse; }
    th, td { padding: 2px 0; }
    th { border-bottom: 1px solid #000; }
    .total-row { font-weight: bold; font-size: 14px; }
  </style>
</head>
<body>
  <div class="center bold large">${business.name}</div>
  ${business.address ? `<div class="center">${business.address}</div>` : ""}
  ${business.phone ? `<div class="center">Ph: ${business.phone}</div>` : ""}
  ${business.gstin ? `<div class="center">GSTIN: ${business.gstin}</div>` : ""}
  
  <div class="double-divider"></div>
  <div class="center bold">TAX INVOICE</div>
  <div class="divider"></div>
  
  <div class="row">
    <span>Invoice No:</span>
    <span>${invoice.invoiceNo}</span>
  </div>
  <div class="row">
    <span>Date:</span>
    <span>${formatDate(invoice.date)}</span>
  </div>
  
  ${invoice.customerName ? `
  <div class="divider"></div>
  <div class="bold">Customer:</div>
  <div>${invoice.customerName}</div>
  ${invoice.customerPhone ? `<div>Ph: ${invoice.customerPhone}</div>` : ""}
  ` : ""}
  
  <div class="divider"></div>
  <div class="center bold">[${invoice.paymentType.toUpperCase()}]</div>
  
  <div class="double-divider"></div>
  <table>
    <thead>
      <tr>
        <th style="text-align:left">Item</th>
        <th>Qty</th>
        <th>Rate</th>
        <th style="text-align:right">Amt</th>
      </tr>
    </thead>
    <tbody>
      ${invoice.items.map((item, i) => `
      <tr>
        <td>${i + 1}. ${item.name}</td>
        <td class="center">${item.quantity}</td>
        <td class="center">${item.price.toFixed(2)}</td>
        <td class="right">${item.total.toFixed(2)}</td>
      </tr>
      `).join("")}
    </tbody>
  </table>
  
  <div class="double-divider"></div>
  <div class="row">
    <span>Subtotal:</span>
    <span>${formatCurrency(invoice.subtotal)}</span>
  </div>
  ${invoice.discount ? `
  <div class="row">
    <span>Discount:</span>
    <span>-${formatCurrency(invoice.discount)}</span>
  </div>
  ` : ""}
  ${invoice.cgst ? `<div class="row"><span>CGST:</span><span>${formatCurrency(invoice.cgst)}</span></div>` : ""}
  ${invoice.sgst ? `<div class="row"><span>SGST:</span><span>${formatCurrency(invoice.sgst)}</span></div>` : ""}
  
  <div class="divider"></div>
  <div class="row total-row">
    <span>GRAND TOTAL:</span>
    <span>${formatCurrency(invoice.grandTotal)}</span>
  </div>
  
  ${invoice.amountPaid !== undefined ? `
  <div class="divider"></div>
  <div class="row"><span>Amount Paid:</span><span>${formatCurrency(invoice.amountPaid)}</span></div>
  ${invoice.balanceDue && invoice.balanceDue > 0 ? `
  <div class="row bold"><span>Balance Due:</span><span>${formatCurrency(invoice.balanceDue)}</span></div>
  ` : ""}
  ` : ""}
  
  <div class="double-divider"></div>
  <div class="center">Thank you for your business!</div>
  <div class="center">Visit again</div>
  <div class="divider"></div>
  <div class="center" style="font-size:10px">Powered by BillEase Suite</div>
</body>
</html>
  `.trim();
}

/**
 * Trigger browser print dialog
 */
export function printInBrowser(html: string): void {
  const printWindow = window.open("", "_blank");
  if (printWindow) {
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  }
}
