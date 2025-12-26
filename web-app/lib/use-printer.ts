"use client";

import { useState, useCallback } from "react";
import {
  generateInvoiceReceipt,
  generateEstimateReceipt,
  generateDailySummaryReceipt,
  generatePrintableHTML,
  printInBrowser,
  createPrintPayload,
  type InvoiceData,
  type BusinessInfo,
  type PrinterConfig,
  type DailySummary,
  type PrintPayload,
} from "./print-utils";
import {
  generateInvoiceEscPos,
  generateTestPrintEscPos,
  generateDailySummaryEscPos,
  escpos,
} from "./escpos-commands";

// Default business info (should be loaded from settings/database)
const defaultBusiness: BusinessInfo = {
  name: "BillEase Business",
  address: "Business Address Line",
  phone: "0000000000",
  gstin: "",
};

// Printer connection status
export type PrinterStatus = "disconnected" | "connecting" | "connected" | "printing" | "error";

export interface UsePrinterOptions {
  printerConfig?: PrinterConfig;
  businessInfo?: BusinessInfo;
  onPrintSuccess?: (invoiceNo: string) => void;
  onPrintError?: (error: string) => void;
}

export interface UsePrinterReturn {
  status: PrinterStatus;
  lastError: string | null;
  printInvoice: (invoice: InvoiceData) => Promise<boolean>;
  printEstimate: (invoice: InvoiceData) => Promise<boolean>;
  printDailySummary: (summary: DailySummary) => Promise<boolean>;
  printCustom: (data: string) => Promise<boolean>;
  testPrint: () => Promise<boolean>;
  printInvoiceEscPos: (invoice: InvoiceData) => Promise<boolean>;
  printRawEscPos: (escposBytes: Uint8Array) => Promise<boolean>;
  browserPrint: (invoice: InvoiceData) => void;
  escpos: typeof import("./escpos-commands").escpos;
}

/**
 * Hook for printer functionality
 */
export function usePrinter(options: UsePrinterOptions = {}): UsePrinterReturn {
  const {
    printerConfig = { macAddress: "", paperWidth: 80, characterPerLine: 48 },
    businessInfo = defaultBusiness,
    onPrintSuccess,
    onPrintError,
  } = options;

  const [status, setStatus] = useState<PrinterStatus>("disconnected");
  const [lastError, setLastError] = useState<string | null>(null);

  /**
   * Send print data to Android bridge
   */
  const sendToAndroid = useCallback(async (payload: PrintPayload): Promise<boolean> => {
    try {
      // Check if running in Android WebView with bridge
      if (typeof window !== "undefined" && (window as any).AndroidBridge) {
        setStatus("printing");
        const result = await (window as any).AndroidBridge.print(JSON.stringify(payload));
        
        if (result === "success") {
          setStatus("connected");
          onPrintSuccess?.(payload.invoiceNo);
          return true;
        } else {
          throw new Error(result || "Print failed");
        }
      }
      
      // Check for React Native bridge
      if (typeof window !== "undefined" && (window as any).ReactNativeWebView) {
        setStatus("printing");
        (window as any).ReactNativeWebView.postMessage(JSON.stringify({
          type: "PRINT",
          payload,
        }));
        // Assume success for RN bridge (callback will handle actual status)
        setStatus("connected");
        onPrintSuccess?.(payload.invoiceNo);
        return true;
      }

      // Check for Capacitor bridge
      if (typeof window !== "undefined" && (window as any).Capacitor) {
        setStatus("printing");
        const { BluetoothPrint } = await import("@aspect/capacitor-bluetooth-print" as any);
        await BluetoothPrint.print({
          macAddress: payload.printerMac,
          data: payload.data,
        });
        setStatus("connected");
        onPrintSuccess?.(payload.invoiceNo);
        return true;
      }

      storePrintJob(payload);
      setLastError("No printer connection available. Print job saved.");
      return false;
      
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Unknown print error";
      setStatus("error");
      setLastError(errorMsg);
      onPrintError?.(errorMsg);
      return false;
    }
  }, [onPrintSuccess, onPrintError]);

  /**
   * Print invoice
   */
  const printInvoice = useCallback(async (invoice: InvoiceData): Promise<boolean> => {
    if (!printerConfig.macAddress) {
      setLastError("No printer configured. Please set up a printer first.");
      onPrintError?.("No printer configured");
      return false;
    }

    const printData = generateInvoiceReceipt(invoice, businessInfo, printerConfig);
    const payload = createPrintPayload(printData, printerConfig.macAddress, invoice.invoiceNo);
    
    return sendToAndroid(payload);
  }, [printerConfig, businessInfo, sendToAndroid, onPrintError]);

  /**
   * Print estimate
   */
  const printEstimate = useCallback(async (invoice: InvoiceData): Promise<boolean> => {
    if (!printerConfig.macAddress) {
      setLastError("No printer configured");
      onPrintError?.("No printer configured");
      return false;
    }

    const printData = generateEstimateReceipt(invoice, businessInfo, printerConfig);
    const payload = createPrintPayload(printData, printerConfig.macAddress, invoice.invoiceNo);
    
    return sendToAndroid(payload);
  }, [printerConfig, businessInfo, sendToAndroid, onPrintError]);

  /**
   * Print daily summary
   */
  const printDailySummary = useCallback(async (summary: DailySummary): Promise<boolean> => {
    if (!printerConfig.macAddress) {
      setLastError("No printer configured");
      onPrintError?.("No printer configured");
      return false;
    }

    const printData = generateDailySummaryReceipt(summary, businessInfo, printerConfig);
    const payload = createPrintPayload(printData, printerConfig.macAddress, `SUMMARY-${Date.now()}`);
    
    return sendToAndroid(payload);
  }, [printerConfig, businessInfo, sendToAndroid, onPrintError]);

  /**
   * Print custom data
   */
  const printCustom = useCallback(async (data: string): Promise<boolean> => {
    if (!printerConfig.macAddress) {
      setLastError("No printer configured");
      onPrintError?.("No printer configured");
      return false;
    }

    const payload = createPrintPayload(data, printerConfig.macAddress, `CUSTOM-${Date.now()}`);
    return sendToAndroid(payload);
  }, [printerConfig, sendToAndroid, onPrintError]);

  /**
   * Test print
   */
  const testPrint = useCallback(async (): Promise<boolean> => {
    if (!printerConfig.macAddress) {
      setLastError("No printer MAC address configured");
      return false;
    }

    // Generate ESC/POS test print commands
    const escPosBytes = generateTestPrintEscPos(
      "Receipt Printer",
      printerConfig.macAddress,
      printerConfig.paperWidth
    );
    
    // Convert to base64 for transmission
    const base64Data = btoa(String.fromCharCode(...escPosBytes));

    const payload = {
      action: "PRINT_ESCPOS",
      printerMac: printerConfig.macAddress,
      invoiceNo: `TEST-${Date.now()}`,
      data: base64Data,
      dataType: "escpos", // Indicate raw ESC/POS commands
      timestamp: new Date().toISOString(),
    };

    return sendToAndroid(payload as PrintPayload);
  }, [printerConfig, sendToAndroid]);

  /**
   * Print invoice using ESC/POS commands
   */
  const printInvoiceEscPos = useCallback(async (invoice: InvoiceData): Promise<boolean> => {
    if (!printerConfig.macAddress) {
      setLastError("No printer configured");
      onPrintError?.("No printer configured");
      return false;
    }

    const escPosBytes = generateInvoiceEscPos(invoice, businessInfo, printerConfig.paperWidth);
    const base64Data = btoa(String.fromCharCode(...escPosBytes));

    const payload = {
      action: "PRINT_ESCPOS",
      printerMac: printerConfig.macAddress,
      invoiceNo: invoice.invoiceNo,
      data: base64Data,
      dataType: "escpos",
      timestamp: new Date().toISOString(),
    };

    return sendToAndroid(payload as PrintPayload);
  }, [printerConfig, businessInfo, sendToAndroid, onPrintError]);

  /**
   * Print raw ESC/POS bytes
   */
  const printRawEscPos = useCallback(async (bytes: Uint8Array, jobId?: string): Promise<boolean> => {
    if (!printerConfig.macAddress) {
      setLastError("No printer configured");
      onPrintError?.("No printer configured");
      return false;
    }

    const base64Data = btoa(String.fromCharCode(...bytes));

    const payload = {
      action: "PRINT_ESCPOS",
      printerMac: printerConfig.macAddress,
      invoiceNo: jobId || `RAW-${Date.now()}`,
      data: base64Data,
      dataType: "escpos",
      timestamp: new Date().toISOString(),
    };

    return sendToAndroid(payload as PrintPayload);
  }, [printerConfig, sendToAndroid, onPrintError]);

  /**
   * Browser print fallback
   */
  const browserPrint = useCallback((invoice: InvoiceData): void => {
    const html = generatePrintableHTML(invoice, businessInfo, printerConfig.paperWidth);
    printInBrowser(html);
  }, [businessInfo, printerConfig.paperWidth]);

  return {
    status,
    lastError,
    printInvoice,
    printEstimate,
    printDailySummary,
    printCustom,
    testPrint,
    printInvoiceEscPos,
    printRawEscPos,
    browserPrint,
    escpos, // Export the builder for custom commands
  };
}

/**
 * Store print job for offline/later printing
 */
function storePrintJob(payload: PrintPayload): void {
  try {
    const stored = localStorage.getItem("pendingPrintJobs");
    const jobs: PrintPayload[] = stored ? JSON.parse(stored) : [];
    jobs.push(payload);
    localStorage.setItem("pendingPrintJobs", JSON.stringify(jobs));
  } catch (error) {
    // Silent fail for storage errors
  }
}

/**
 * Get pending print jobs
 */
export function getPendingPrintJobs(): PrintPayload[] {
  try {
    const stored = localStorage.getItem("pendingPrintJobs");
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

/**
 * Clear pending print jobs
 */
export function clearPendingPrintJobs(): void {
  localStorage.removeItem("pendingPrintJobs");
}

/**
 * Remove a specific print job
 */
export function removePrintJob(invoiceNo: string): void {
  try {
    const jobs = getPendingPrintJobs();
    const filtered = jobs.filter((j) => j.invoiceNo !== invoiceNo);
    localStorage.setItem("pendingPrintJobs", JSON.stringify(filtered));
  } catch (error) {
    // Silent fail for storage errors
  }
}
