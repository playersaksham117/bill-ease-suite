/**
 * ESC/POS Command Generator
 * Generates raw ESC/POS byte commands for thermal receipt printers
 * Compatible with EscPosPrinterService Android class
 */

// ESC/POS Command Constants
export const ESC = 0x1b; // Escape
export const GS = 0x1d; // Group Separator
export const LF = 0x0a; // Line Feed
export const CR = 0x0d; // Carriage Return
export const HT = 0x09; // Horizontal Tab
export const FF = 0x0c; // Form Feed

// Alignment
export const ALIGN_LEFT = 0x00;
export const ALIGN_CENTER = 0x01;
export const ALIGN_RIGHT = 0x02;

// Text Size
export const TEXT_NORMAL = 0x00;
export const TEXT_DOUBLE_HEIGHT = 0x10;
export const TEXT_DOUBLE_WIDTH = 0x20;
export const TEXT_DOUBLE = 0x30; // Double height and width

// Underline
export const UNDERLINE_NONE = 0x00;
export const UNDERLINE_1DOT = 0x01;
export const UNDERLINE_2DOT = 0x02;

/**
 * ESC/POS Command Builder
 */
export class EscPosBuilder {
  private commands: number[] = [];
  private encoding: string = "utf-8";

  constructor(encoding: string = "utf-8") {
    this.encoding = encoding;
  }

  /**
   * Initialize printer (ESC @)
   */
  init(): EscPosBuilder {
    this.commands.push(ESC, 0x40);
    return this;
  }

  /**
   * Add raw bytes
   */
  raw(bytes: number[]): EscPosBuilder {
    this.commands.push(...bytes);
    return this;
  }

  /**
   * Add text
   */
  text(str: string): EscPosBuilder {
    const encoder = new TextEncoder();
    const bytes = encoder.encode(str);
    this.commands.push(...Array.from(bytes));
    return this;
  }

  /**
   * Line feed (new line)
   */
  newLine(count: number = 1): EscPosBuilder {
    for (let i = 0; i < count; i++) {
      this.commands.push(LF);
    }
    return this;
  }

  /**
   * Feed n lines (ESC d n)
   */
  feed(lines: number): EscPosBuilder {
    this.commands.push(ESC, 0x64, lines);
    return this;
  }

  /**
   * Set text alignment (ESC a n)
   */
  align(alignment: number): EscPosBuilder {
    this.commands.push(ESC, 0x61, alignment);
    return this;
  }

  alignLeft(): EscPosBuilder {
    return this.align(ALIGN_LEFT);
  }

  alignCenter(): EscPosBuilder {
    return this.align(ALIGN_CENTER);
  }

  alignRight(): EscPosBuilder {
    return this.align(ALIGN_RIGHT);
  }

  /**
   * Set bold mode (ESC E n)
   */
  bold(on: boolean = true): EscPosBuilder {
    this.commands.push(ESC, 0x45, on ? 0x01 : 0x00);
    return this;
  }

  /**
   * Set underline mode (ESC - n)
   */
  underline(mode: number = UNDERLINE_1DOT): EscPosBuilder {
    this.commands.push(ESC, 0x2d, mode);
    return this;
  }

  /**
   * Set text size (GS ! n)
   */
  textSize(size: number): EscPosBuilder {
    this.commands.push(GS, 0x21, size);
    return this;
  }

  /**
   * Double width text
   */
  doubleWidth(on: boolean = true): EscPosBuilder {
    return this.textSize(on ? TEXT_DOUBLE_WIDTH : TEXT_NORMAL);
  }

  /**
   * Double height text
   */
  doubleHeight(on: boolean = true): EscPosBuilder {
    return this.textSize(on ? TEXT_DOUBLE_HEIGHT : TEXT_NORMAL);
  }

  /**
   * Double width and height
   */
  doubleSize(on: boolean = true): EscPosBuilder {
    return this.textSize(on ? TEXT_DOUBLE : TEXT_NORMAL);
  }

  /**
   * Normal text size
   */
  normalSize(): EscPosBuilder {
    return this.textSize(TEXT_NORMAL);
  }

  /**
   * Set font (ESC M n) - 0=Font A, 1=Font B
   */
  font(fontNumber: number): EscPosBuilder {
    this.commands.push(ESC, 0x4d, fontNumber);
    return this;
  }

  /**
   * Invert colors (GS B n)
   */
  invert(on: boolean = true): EscPosBuilder {
    this.commands.push(GS, 0x42, on ? 0x01 : 0x00);
    return this;
  }

  /**
   * Print horizontal line using character
   */
  horizontalLine(char: string = "-", width: number = 32): EscPosBuilder {
    return this.text(char.repeat(width)).newLine();
  }

  /**
   * Print double horizontal line
   */
  doubleLine(width: number = 32): EscPosBuilder {
    return this.horizontalLine("=", width);
  }

  /**
   * Print two-column text (left and right aligned)
   */
  twoColumn(left: string, right: string, width: number = 32): EscPosBuilder {
    const space = width - left.length - right.length;
    if (space > 0) {
      this.text(left + " ".repeat(space) + right);
    } else {
      this.text(left.substring(0, width - right.length - 1) + " " + right);
    }
    return this.newLine();
  }

  /**
   * Print three-column text
   */
  threeColumn(left: string, center: string, right: string, width: number = 32): EscPosBuilder {
    const leftWidth = Math.floor(width * 0.4);
    const centerWidth = Math.floor(width * 0.3);
    const rightWidth = width - leftWidth - centerWidth;
    
    const paddedLeft = left.substring(0, leftWidth).padEnd(leftWidth);
    const paddedCenter = center.substring(0, centerWidth).padStart(Math.floor((centerWidth + center.length) / 2)).padEnd(centerWidth);
    const paddedRight = right.substring(0, rightWidth).padStart(rightWidth);
    
    return this.text(paddedLeft + paddedCenter + paddedRight).newLine();
  }

  /**
   * Print QR Code (GS ( k)
   * Size: 1-16 (default 6)
   * Error correction: 48=L, 49=M, 50=Q, 51=H
   */
  qrCode(data: string, size: number = 6, errorCorrection: number = 0x30): EscPosBuilder {
    const bytes = new TextEncoder().encode(data);
    const dataLength = bytes.length;

    // QR Code: Select model (Model 2)
    this.commands.push(GS, 0x28, 0x6b, 0x04, 0x00, 0x31, 0x41, 0x32, 0x00);

    // QR Code: Set size
    this.commands.push(GS, 0x28, 0x6b, 0x03, 0x00, 0x31, 0x43, size);

    // QR Code: Set error correction level
    this.commands.push(GS, 0x28, 0x6b, 0x03, 0x00, 0x31, 0x45, errorCorrection);

    // QR Code: Store data
    const pL = (dataLength + 3) & 0xff;
    const pH = ((dataLength + 3) >> 8) & 0xff;
    this.commands.push(GS, 0x28, 0x6b, pL, pH, 0x31, 0x50, 0x30);
    this.commands.push(...Array.from(bytes));

    // QR Code: Print
    this.commands.push(GS, 0x28, 0x6b, 0x03, 0x00, 0x31, 0x51, 0x30);

    return this;
  }

  /**
   * Print Barcode (GS k)
   * Type: 0=UPC-A, 1=UPC-E, 2=EAN13, 3=EAN8, 4=CODE39, 5=ITF, 6=CODABAR, 73=CODE128
   */
  barcode(data: string, type: number = 73, height: number = 80, width: number = 2): EscPosBuilder {
    // Set barcode height (GS h n)
    this.commands.push(GS, 0x68, height);

    // Set barcode width (GS w n)
    this.commands.push(GS, 0x77, width);

    // Set HRI position (GS H n) - 2 = below barcode
    this.commands.push(GS, 0x48, 0x02);

    // Print barcode
    const bytes = new TextEncoder().encode(data);
    this.commands.push(GS, 0x6b, type, bytes.length);
    this.commands.push(...Array.from(bytes));

    return this;
  }

  /**
   * Print raster image (GS v 0)
   * Image should be 1-bit bitmap data
   */
  image(imageData: Uint8Array, width: number, height: number): EscPosBuilder {
    const xL = (width / 8) & 0xff;
    const xH = ((width / 8) >> 8) & 0xff;
    const yL = height & 0xff;
    const yH = (height >> 8) & 0xff;

    this.commands.push(GS, 0x76, 0x30, 0x00, xL, xH, yL, yH);
    this.commands.push(...Array.from(imageData));

    return this;
  }

  /**
   * Cut paper (GS V)
   * mode: 0=Full cut, 1=Partial cut
   */
  cut(mode: number = 1): EscPosBuilder {
    this.commands.push(GS, 0x56, mode);
    return this;
  }

  /**
   * Full paper cut
   */
  fullCut(): EscPosBuilder {
    return this.cut(0);
  }

  /**
   * Partial paper cut
   */
  partialCut(): EscPosBuilder {
    return this.cut(1);
  }

  /**
   * Open cash drawer (ESC p m t1 t2)
   */
  openCashDrawer(pin: number = 0): EscPosBuilder {
    this.commands.push(ESC, 0x70, pin, 0x19, 0xfa);
    return this;
  }

  /**
   * Beep (ESC B n t)
   */
  beep(times: number = 1, duration: number = 2): EscPosBuilder {
    this.commands.push(ESC, 0x42, times, duration);
    return this;
  }

  /**
   * Set line spacing (ESC 3 n)
   */
  lineSpacing(dots: number): EscPosBuilder {
    this.commands.push(ESC, 0x33, dots);
    return this;
  }

  /**
   * Reset line spacing to default (ESC 2)
   */
  defaultLineSpacing(): EscPosBuilder {
    this.commands.push(ESC, 0x32);
    return this;
  }

  /**
   * Set character code table (ESC t n)
   */
  codeTable(table: number): EscPosBuilder {
    this.commands.push(ESC, 0x74, table);
    return this;
  }

  /**
   * Get the command bytes as Uint8Array
   */
  build(): Uint8Array {
    return new Uint8Array(this.commands);
  }

  /**
   * Get the command bytes as number array
   */
  toArray(): number[] {
    return [...this.commands];
  }

  /**
   * Get as Base64 string (for transmission)
   */
  toBase64(): string {
    const bytes = this.build();
    let binary = "";
    for (let i = 0; i < bytes.length; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }

  /**
   * Get as hex string (for debugging)
   */
  toHex(): string {
    return this.commands.map((b) => b.toString(16).padStart(2, "0")).join(" ");
  }

  /**
   * Reset the builder
   */
  reset(): EscPosBuilder {
    this.commands = [];
    return this;
  }
}

/**
 * Create a new ESC/POS builder
 */
export function escpos(): EscPosBuilder {
  return new EscPosBuilder();
}

/**
 * Format currency for Indian Rupees
 */
export function formatRupees(amount: number): string {
  return `Rs.${amount.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

/**
 * Format date for receipt
 */
export function formatReceiptDate(date: Date): string {
  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

/**
 * Format time for receipt
 */
export function formatReceiptTime(date: Date): string {
  return date.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

// Re-export types
export interface InvoiceItem {
  name: string;
  quantity: number;
  unit?: string;
  price: number;
  discount?: number;
  gst?: number;
  total: number;
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

export interface BusinessInfo {
  name: string;
  address?: string;
  phone?: string;
  email?: string;
  gstin?: string;
}

/**
 * Generate complete invoice receipt as ESC/POS commands
 */
export function generateInvoiceEscPos(
  invoice: InvoiceData,
  business: BusinessInfo,
  paperWidth: number = 80
): Uint8Array {
  const width = paperWidth === 58 ? 32 : 48;
  const builder = escpos();

  builder
    .init()
    // Header
    .alignCenter()
    .bold(true)
    .doubleWidth(true)
    .text(business.name)
    .newLine()
    .doubleWidth(false)
    .bold(false);

  if (business.address) {
    builder.text(business.address).newLine();
  }
  if (business.phone) {
    builder.text(`Ph: ${business.phone}`).newLine();
  }
  if (business.gstin) {
    builder.text(`GSTIN: ${business.gstin}`).newLine();
  }

  builder
    .doubleLine(width)
    .bold(true)
    .text("TAX INVOICE")
    .newLine()
    .bold(false)
    .horizontalLine("-", width)
    .alignLeft()
    .twoColumn("Invoice No:", invoice.invoiceNo, width)
    .twoColumn("Date:", formatReceiptDate(invoice.date), width)
    .twoColumn("Time:", formatReceiptTime(invoice.date), width);

  // Customer info
  if (invoice.customerName) {
    builder.horizontalLine("-", width).text(`Customer: ${invoice.customerName}`).newLine();
    if (invoice.customerPhone) {
      builder.text(`Ph: ${invoice.customerPhone}`).newLine();
    }
    if (invoice.customerGstin) {
      builder.text(`GSTIN: ${invoice.customerGstin}`).newLine();
    }
  }

  // Payment type badge
  builder
    .horizontalLine("-", width)
    .alignCenter()
    .bold(true)
    .text(`[${invoice.paymentType.toUpperCase()}]`)
    .newLine()
    .bold(false)
    .alignLeft();

  // Items header
  builder.doubleLine(width);
  if (width >= 48) {
    builder.bold(true).text("Item            Qty    Rate    Amount").newLine().bold(false);
  } else {
    builder.bold(true).text("Item        Qty   Rate  Amt").newLine().bold(false);
  }
  builder.horizontalLine("-", width);

  // Items
  invoice.items.forEach((item, index) => {
    builder.text(`${index + 1}. ${item.name}`).newLine();

    const qty = `${item.quantity}${item.unit || ""}`;
    const rate = item.price.toFixed(2);
    const total = item.total.toFixed(2);

    if (width >= 48) {
      builder.text(`                ${qty.padStart(4)}  ${rate.padStart(8)}  ${total.padStart(8)}`).newLine();
    } else {
      builder.text(`            ${qty.padStart(3)} ${rate.padStart(6)} ${total.padStart(6)}`).newLine();
    }
  });

  // Totals
  builder.doubleLine(width).twoColumn("Subtotal:", formatRupees(invoice.subtotal), width);

  if (invoice.discount && invoice.discount > 0) {
    builder.twoColumn("Discount:", `-${formatRupees(invoice.discount)}`, width);
  }

  if (invoice.cgst && invoice.cgst > 0) {
    builder.twoColumn("CGST:", formatRupees(invoice.cgst), width);
  }
  if (invoice.sgst && invoice.sgst > 0) {
    builder.twoColumn("SGST:", formatRupees(invoice.sgst), width);
  }
  if (invoice.igst && invoice.igst > 0) {
    builder.twoColumn("IGST:", formatRupees(invoice.igst), width);
  }

  builder.horizontalLine("-", width).alignCenter().bold(true).doubleSize(true);

  builder.text(`TOTAL: ${formatRupees(invoice.grandTotal)}`).newLine().doubleSize(false).bold(false).alignLeft();

  // Payment details
  if (invoice.paymentType !== "cash" || invoice.amountPaid !== undefined) {
    builder.horizontalLine("-", width);
    if (invoice.amountPaid !== undefined) {
      builder.twoColumn("Amount Paid:", formatRupees(invoice.amountPaid), width);
    }
    if (invoice.balanceDue !== undefined && invoice.balanceDue > 0) {
      builder.bold(true).twoColumn("Balance Due:", formatRupees(invoice.balanceDue), width).bold(false);
    }
    if (invoice.paymentMethod) {
      builder.twoColumn("Payment Mode:", invoice.paymentMethod.toUpperCase(), width);
    }
  }

  // Notes
  if (invoice.notes) {
    builder.horizontalLine("-", width).text(`Note: ${invoice.notes}`).newLine();
  }

  // QR Code
  const qrData = `INV:${invoice.invoiceNo}|AMT:${invoice.grandTotal}|DT:${formatReceiptDate(invoice.date)}`;
  builder.horizontalLine("-", width).alignCenter().qrCode(qrData, 6);

  // Footer
  builder
    .newLine()
    .doubleLine(width)
    .text("Thank you for your business!")
    .newLine()
    .text("Visit again")
    .newLine()
    .horizontalLine("-", width)
    .text("Powered by BillEase Suite")
    .newLine()
    .newLine()
    .newLine()
    .partialCut();

  return builder.build();
}

/**
 * Generate test print as ESC/POS commands
 */
export function generateTestPrintEscPos(
  printerName: string,
  macAddress: string,
  paperWidth: number = 80
): Uint8Array {
  const width = paperWidth === 58 ? 32 : 48;
  const builder = escpos();

  builder
    .init()
    .alignCenter()
    .doubleLine(width)
    .bold(true)
    .doubleWidth(true)
    .text("PRINTER TEST")
    .newLine()
    .doubleWidth(false)
    .bold(false)
    .doubleLine(width)
    .newLine()
    .alignLeft()
    .text(`Printer: ${printerName}`)
    .newLine()
    .text(`MAC: ${macAddress}`)
    .newLine()
    .text(`Width: ${paperWidth}mm`)
    .newLine()
    .text(`Date: ${formatReceiptDate(new Date())} ${formatReceiptTime(new Date())}`)
    .newLine()
    .newLine()
    .horizontalLine("-", width)
    .text("Character Test:")
    .newLine()
    .text("ABCDEFGHIJKLMNOPQRSTUVWXYZ")
    .newLine()
    .text("abcdefghijklmnopqrstuvwxyz")
    .newLine()
    .text("0123456789")
    .newLine()
    .text("!@#$%^&*()_+-=[]{}|")
    .newLine()
    .newLine()
    .horizontalLine("-", width)
    .bold(true)
    .text("Bold Text Test")
    .newLine()
    .bold(false)
    .doubleWidth(true)
    .text("Double Width")
    .newLine()
    .doubleWidth(false)
    .doubleHeight(true)
    .text("Double Height")
    .newLine()
    .doubleHeight(false)
    .newLine()
    .alignCenter()
    .qrCode(`BILLEASE-TEST-${Date.now()}`, 6)
    .newLine()
    .horizontalLine("-", width)
    .bold(true)
    .text("If you can read this,")
    .newLine()
    .text("your printer is working!")
    .newLine()
    .bold(false)
    .horizontalLine("-", width)
    .text("Powered by BillEase Suite")
    .newLine()
    .doubleLine(width)
    .newLine()
    .newLine()
    .partialCut();

  return builder.build();
}

/**
 * Generate daily summary as ESC/POS commands
 */
export function generateDailySummaryEscPos(
  summary: {
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
  },
  business: BusinessInfo,
  paperWidth: number = 80
): Uint8Array {
  const width = paperWidth === 58 ? 32 : 48;
  const builder = escpos();

  builder
    .init()
    .alignCenter()
    .bold(true)
    .text(business.name)
    .newLine()
    .bold(false)
    .doubleLine(width)
    .bold(true)
    .doubleWidth(true)
    .text("DAILY SUMMARY")
    .newLine()
    .doubleWidth(false)
    .bold(false)
    .horizontalLine("-", width)
    .text(formatReceiptDate(summary.date))
    .newLine()
    .doubleLine(width)
    .alignLeft()
    .bold(true)
    .text("SALES SUMMARY")
    .newLine()
    .bold(false)
    .horizontalLine("-", width)
    .twoColumn("Total Sales:", formatRupees(summary.totalSales), width)
    .twoColumn("Cash Sales:", formatRupees(summary.cashSales), width)
    .twoColumn("Credit Sales:", formatRupees(summary.creditSales), width)
    .twoColumn("Card/UPI:", formatRupees(summary.cardSales), width)
    .twoColumn("Invoices:", summary.invoiceCount.toString(), width)
    .horizontalLine("-", width)
    .bold(true)
    .text("COLLECTIONS")
    .newLine()
    .bold(false)
    .horizontalLine("-", width)
    .twoColumn("Cash Received:", formatRupees(summary.cashReceived), width)
    .twoColumn("Card/UPI:", formatRupees(summary.cardReceived), width)
    .twoColumn("Credit Collected:", formatRupees(summary.creditCollected), width);

  if (summary.returns > 0) {
    builder.horizontalLine("-", width).bold(true).text("RETURNS").newLine().bold(false).twoColumn("Total Returns:", formatRupees(summary.returns), width);
  }

  builder
    .doubleLine(width)
    .alignCenter()
    .bold(true)
    .text("CASH IN DRAWER")
    .newLine()
    .doubleSize(true)
    .text(formatRupees(summary.cashInDrawer))
    .newLine()
    .doubleSize(false)
    .bold(false)
    .doubleLine(width)
    .text("Generated by BillEase Suite")
    .newLine()
    .text(`${formatReceiptDate(new Date())} ${formatReceiptTime(new Date())}`)
    .newLine()
    .newLine()
    .newLine()
    .partialCut();

  return builder.build();
}
