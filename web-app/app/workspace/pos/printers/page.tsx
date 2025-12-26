"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Printer,
  Plus,
  Edit2,
  Trash2,
  X,
  Save,
  CheckCircle2,
  AlertCircle,
  Wifi,
  Usb,
  Bluetooth,
  RefreshCcw,
  Play,
  Settings,
  FileText,
  Receipt,
} from "lucide-react";
import { generateTestPrintEscPos } from "@/lib/escpos-commands";

// Types
interface PrinterConfig {
  id: string;
  name: string;
  type: "receipt" | "label" | "report";
  connection: "usb" | "network" | "bluetooth";
  ipAddress?: string;
  port?: number;
  macAddress?: string;
  model: string;
  paperWidth: number;
  isDefault: boolean;
  isActive: boolean;
  lastUsed: Date | null;
  printCount: number;
}

// Mock data
const mockPrinters: PrinterConfig[] = [
  {
    id: "1",
    name: "Main Receipt Printer",
    type: "receipt",
    connection: "usb",
    model: "Epson TM-T82X",
    paperWidth: 80,
    isDefault: true,
    isActive: true,
    lastUsed: new Date(),
    printCount: 1245,
  },
  {
    id: "2",
    name: "Backup Receipt Printer",
    type: "receipt",
    connection: "network",
    ipAddress: "192.168.1.100",
    port: 9100,
    model: "Epson TM-T82",
    paperWidth: 80,
    isDefault: false,
    isActive: true,
    lastUsed: new Date(2025, 11, 20),
    printCount: 342,
  },
  {
    id: "3",
    name: "Label Printer",
    type: "label",
    connection: "usb",
    model: "TSC TE244",
    paperWidth: 50,
    isDefault: false,
    isActive: true,
    lastUsed: new Date(2025, 11, 15),
    printCount: 856,
  },
  {
    id: "4",
    name: "Office Report Printer",
    type: "report",
    connection: "network",
    ipAddress: "192.168.1.101",
    port: 9100,
    model: "HP LaserJet Pro",
    paperWidth: 210,
    isDefault: false,
    isActive: false,
    lastUsed: new Date(2025, 11, 10),
    printCount: 128,
  },
];

const printerTypes = [
  { value: "receipt", label: "Receipt Printer", icon: Receipt },
  { value: "label", label: "Label Printer", icon: FileText },
  { value: "report", label: "Report Printer", icon: Printer },
];

const connectionTypes = [
  { value: "usb", label: "USB", icon: Usb },
  { value: "network", label: "Network", icon: Wifi },
  { value: "bluetooth", label: "Bluetooth", icon: Bluetooth },
];

export default function PrintersPage() {
  const [printers, setPrinters] = useState<PrinterConfig[]>(mockPrinters);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingPrinter, setEditingPrinter] = useState<PrinterConfig | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState<string | null>(null);
  const [testingPrinter, setTestingPrinter] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    type: "receipt" as "receipt" | "label" | "report",
    connection: "usb" as "usb" | "network" | "bluetooth",
    ipAddress: "",
    port: "9100",
    macAddress: "",
    model: "",
    paperWidth: "80",
    isDefault: false,
    isActive: true,
  });

  // Reset form
  const resetForm = () => {
    setFormData({
      name: "",
      type: "receipt",
      connection: "usb",
      ipAddress: "",
      port: "9100",
      macAddress: "",
      model: "",
      paperWidth: "80",
      isDefault: false,
      isActive: true,
    });
  };

  // Open edit modal
  const openEditModal = (printer: PrinterConfig) => {
    setEditingPrinter(printer);
    setFormData({
      name: printer.name,
      type: printer.type,
      connection: printer.connection,
      ipAddress: printer.ipAddress || "",
      port: printer.port?.toString() || "9100",
      macAddress: printer.macAddress || "",
      model: printer.model,
      paperWidth: printer.paperWidth.toString(),
      isDefault: printer.isDefault,
      isActive: printer.isActive,
    });
    setShowAddModal(true);
  };

  // Handle submit
  const handleSubmit = () => {
    if (editingPrinter) {
      setPrinters((prev) =>
        prev.map((p) => {
          if (p.id === editingPrinter.id) {
            return {
              ...p,
              name: formData.name,
              type: formData.type,
              connection: formData.connection,
              ipAddress: formData.connection === "network" ? formData.ipAddress : undefined,
              port: formData.connection === "network" ? parseInt(formData.port) : undefined,
              macAddress: formData.connection === "bluetooth" ? formData.macAddress : undefined,
              model: formData.model,
              paperWidth: parseInt(formData.paperWidth),
              isDefault: formData.isDefault,
              isActive: formData.isActive,
            };
          }
          // If setting this as default, unset others of same type
          if (formData.isDefault && p.type === formData.type && p.id !== editingPrinter.id) {
            return { ...p, isDefault: false };
          }
          return p;
        })
      );
      setShowSuccess("Printer updated successfully!");
    } else {
      const newPrinter: PrinterConfig = {
        id: Date.now().toString(),
        name: formData.name,
        type: formData.type,
        connection: formData.connection,
        ipAddress: formData.connection === "network" ? formData.ipAddress : undefined,
        port: formData.connection === "network" ? parseInt(formData.port) : undefined,
        macAddress: formData.connection === "bluetooth" ? formData.macAddress : undefined,
        model: formData.model,
        paperWidth: parseInt(formData.paperWidth),
        isDefault: formData.isDefault,
        isActive: formData.isActive,
        lastUsed: null,
        printCount: 0,
      };

      setPrinters((prev) => {
        // If setting as default, unset others of same type
        if (formData.isDefault) {
          return [
            ...prev.map((p) =>
              p.type === formData.type ? { ...p, isDefault: false } : p
            ),
            newPrinter,
          ];
        }
        return [...prev, newPrinter];
      });
      setShowSuccess("Printer added successfully!");
    }

    setShowAddModal(false);
    setEditingPrinter(null);
    resetForm();
    setTimeout(() => setShowSuccess(null), 3000);
  };

  // Delete printer
  const deletePrinter = (id: string) => {
    setPrinters((prev) => prev.filter((p) => p.id !== id));
    setShowDeleteConfirm(null);
    setShowSuccess("Printer deleted successfully!");
    setTimeout(() => setShowSuccess(null), 3000);
  };

  // Generate test print data in HTML format (for intent-based printing)
  const generateTestPrintDataHTML = (printer: PrinterConfig): string => {
    const width = printer.paperWidth === 58 ? 32 : 48;
    const line = "=".repeat(width);
    const dashLine = "-".repeat(width);
    const dateStr = new Intl.DateTimeFormat("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date());
    
    return `<HTML>
<111>${line};
<111>      PRINTER TEST PAGE      ;
<111>${line};
<100>;
<100>Printer: ${printer.name};
<100>Model: ${printer.model};
<100>Connection: ${printer.connection.toUpperCase()};
${printer.connection === "bluetooth" && printer.macAddress ? `<100>MAC: ${printer.macAddress};` : ""}
${printer.connection === "network" && printer.ipAddress ? `<100>IP: ${printer.ipAddress}:${printer.port};` : ""}
<100>Paper: ${printer.paperWidth}mm;
<100>;
<100>Date: ${dateStr};
<100>;
<111>${dashLine};
<101>Character Test:;
<100>ABCDEFGHIJKLMNOPQRSTUVWXYZ;
<100>abcdefghijklmnopqrstuvwxyz;
<100>0123456789;
<100>!@#$%^&*()_+-=[]{}|;
<100>;
<111>${dashLine};
<110>Bold Text Test;
<102>Double Width Test;
<100>;
<QR>1#BILLEASE-${printer.id}-${Date.now()};
<100>;
<101>If you can read this,;
<101>your printer is working!;
<100>;
<101>Powered by BillEase Suite;
<111>${line};
</HTML>`;
  };

  // Generate ESC/POS raw byte commands for direct Bluetooth printing
  const generateTestPrintDataEscPos = (printer: PrinterConfig): Uint8Array => {
    const escposData = generateTestPrintEscPos(
      printer.name,
      printer.macAddress || "N/A",
      printer.paperWidth
    );
    return escposData;
  };

  // Convert Uint8Array to base64 for transmission
  const uint8ArrayToBase64 = (bytes: Uint8Array): string => {
    let binary = "";
    for (let i = 0; i < bytes.length; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  };

  // Test printer with actual print command
  const testPrinter = (printer: PrinterConfig) => {
    setTestingPrinter(printer.id);
    
    // Try to send to Android bridge
    if (typeof window !== "undefined") {
      // Generate ESC/POS raw bytes for direct Bluetooth printing
      const escposBytes = generateTestPrintDataEscPos(printer);
      const escposBase64 = uint8ArrayToBase64(escposBytes);
      
      // Also generate HTML format for intent-based printing
      const htmlData = generateTestPrintDataHTML(printer);

      const payload = {
        action: "PRINT",
        printerMac: printer.macAddress || "",
        invoiceNo: `TEST-${Date.now()}`,
        data: htmlData,
        escposData: escposBase64, // Base64 encoded ESC/POS bytes
        dataType: "escpos", // Signal that we prefer ESC/POS
        timestamp: new Date().toISOString(),
        printerName: printer.name,
        connection: printer.connection,
        ipAddress: printer.ipAddress,
        port: printer.port,
        paperWidth: printer.paperWidth,
        // Bluetooth socket UUID for direct printing
        btUUID: "00001101-0000-1000-8000-00805F9B34FB",
      };

      // Check for Android WebView bridge with ESC/POS support
      if ((window as any).AndroidBridge) {
        try {
          // Try ESC/POS direct print first
          if ((window as any).AndroidBridge.printEscPos) {
            (window as any).AndroidBridge.printEscPos(
              printer.macAddress || "",
              escposBase64
            );
            setShowSuccess("ESC/POS test print sent!");
          } else {
            // Fallback to regular print
            (window as any).AndroidBridge.print(JSON.stringify(payload));
            setShowSuccess("Test print sent to printer!");
          }
        } catch (error) {
          console.error("Print error:", error);
          setShowSuccess("Print command sent (check printer)");
        }
      }
      // Check for React Native bridge
      else if ((window as any).ReactNativeWebView) {
        (window as any).ReactNativeWebView.postMessage(JSON.stringify({
          type: "PRINT_ESCPOS",
          payload: {
            ...payload,
            rawBytes: escposBase64,
          },
        }));
        setShowSuccess("Test print sent to app!");
      }
      else {
        localStorage.setItem("pendingTestPrint", JSON.stringify(payload));
        
        setShowSuccess("Test print queued (open in mobile app to print)");
      }
    }

    setTimeout(() => {
      setTestingPrinter(null);
      setTimeout(() => setShowSuccess(null), 3000);
    }, 2000);
  };

  // Set default
  const setDefault = (printer: PrinterConfig) => {
    setPrinters((prev) =>
      prev.map((p) => ({
        ...p,
        isDefault: p.type === printer.type ? p.id === printer.id : p.isDefault,
      }))
    );
    setShowSuccess(`${printer.name} set as default!`);
    setTimeout(() => setShowSuccess(null), 3000);
  };

  // Toggle active
  const toggleActive = (id: string) => {
    setPrinters((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isActive: !p.isActive } : p))
    );
  };

  // Get connection icon
  const getConnectionIcon = (connection: string) => {
    switch (connection) {
      case "usb":
        return Usb;
      case "network":
        return Wifi;
      case "bluetooth":
        return Bluetooth;
      default:
        return Wifi;
    }
  };

  // Get type icon
  const getTypeIcon = (type: string) => {
    switch (type) {
      case "receipt":
        return Receipt;
      case "label":
        return FileText;
      case "report":
        return Printer;
      default:
        return Printer;
    }
  };

  // Format date
  const formatDate = (date: Date | null) => {
    if (!date) return "Never";
    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0 h-14 bg-card border-b border-border flex items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <Printer className="w-5 h-5 text-primary" />
          <h1 className="text-lg font-bold">Printer Configuration</h1>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-sm font-medium hover:bg-muted transition-colors">
            <RefreshCcw className="w-4 h-4" />
            Detect Printers
          </button>
          <button
            onClick={() => {
              resetForm();
              setEditingPrinter(null);
              setShowAddModal(true);
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Printer
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-5xl mx-auto space-y-4">
          {/* Printer Cards */}
          {printers.map((printer) => {
            const ConnectionIcon = getConnectionIcon(printer.connection);
            const TypeIcon = getTypeIcon(printer.type);
            const isTesting = testingPrinter === printer.id;

            return (
              <motion.div
                key={printer.id}
                layout
                className={`p-6 rounded-2xl bg-card border transition-all ${
                  printer.isDefault ? "border-primary" : "border-border"
                } ${!printer.isActive ? "opacity-60" : ""}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div
                      className={`w-14 h-14 rounded-xl flex items-center justify-center ${
                        printer.isActive
                          ? "bg-primary/10"
                          : "bg-muted"
                      }`}
                    >
                      <TypeIcon
                        className={`w-7 h-7 ${
                          printer.isActive ? "text-primary" : "text-muted-foreground"
                        }`}
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-3">
                        <h3 className="text-lg font-bold">{printer.name}</h3>
                        {printer.isDefault && (
                          <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-primary/10 text-primary">
                            Default
                          </span>
                        )}
                        <span
                          className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                            printer.isActive
                              ? "bg-success/10 text-success"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {printer.isActive ? "Active" : "Inactive"}
                        </span>
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        {printer.model}
                      </div>

                      <div className="flex items-center gap-4 mt-3">
                        <div className="flex items-center gap-2 text-sm">
                          <ConnectionIcon className="w-4 h-4 text-muted-foreground" />
                          <span className="capitalize">{printer.connection}</span>
                          {printer.connection === "network" && printer.ipAddress && (
                            <span className="font-mono text-xs text-muted-foreground">
                              ({printer.ipAddress}:{printer.port})
                            </span>
                          )}
                          {printer.connection === "bluetooth" && printer.macAddress && (
                            <span className="font-mono text-xs text-muted-foreground">
                              ({printer.macAddress})
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Paper: {printer.paperWidth}mm
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Type:{" "}
                          <span className="capitalize">{printer.type}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                        <span>Last used: {formatDate(printer.lastUsed)}</span>
                        <span>Total prints: {printer.printCount}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => testPrinter(printer)}
                      disabled={isTesting || !printer.isActive}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                        isTesting
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border hover:bg-muted"
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      {isTesting ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          >
                            <RefreshCcw className="w-4 h-4" />
                          </motion.div>
                          Testing...
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4" />
                          Test Print
                        </>
                      )}
                    </button>
                    {!printer.isDefault && printer.isActive && (
                      <button
                        onClick={() => setDefault(printer)}
                        className="px-4 py-2 rounded-lg border border-border text-sm font-medium hover:bg-muted transition-colors"
                      >
                        Set Default
                      </button>
                    )}
                    <button
                      onClick={() => toggleActive(printer.id)}
                      className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                        printer.isActive
                          ? "border-warning/50 text-warning hover:bg-warning/10"
                          : "border-success/50 text-success hover:bg-success/10"
                      }`}
                    >
                      {printer.isActive ? "Disable" : "Enable"}
                    </button>
                    <button
                      onClick={() => openEditModal(printer)}
                      className="p-2 rounded-lg hover:bg-muted transition-colors"
                    >
                      <Settings className="w-5 h-5 text-muted-foreground" />
                    </button>
                    <button
                      onClick={() => setShowDeleteConfirm(printer.id)}
                      className="p-2 rounded-lg hover:bg-destructive/10 hover:text-destructive transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}

          {/* Empty State */}
          {printers.length === 0 && (
            <div className="p-12 rounded-2xl bg-card border border-border text-center">
              <Printer className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">No Printers Configured</h3>
              <p className="text-muted-foreground mb-6">
                Add a printer to start printing receipts, labels, and reports.
              </p>
              <button
                onClick={() => {
                  resetForm();
                  setShowAddModal(true);
                }}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
              >
                <Plus className="w-5 h-5" />
                Add Printer
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => {
              setShowAddModal(false);
              setEditingPrinter(null);
            }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-lg bg-card rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-border flex items-center justify-between">
                <h2 className="text-xl font-bold">
                  {editingPrinter ? "Edit Printer" : "Add New Printer"}
                </h2>
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingPrinter(null);
                  }}
                  className="p-2 rounded-lg hover:bg-muted transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-5">
                {/* Printer Name */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Printer Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, name: e.target.value }))
                    }
                    placeholder="e.g., Main Receipt Printer"
                    className="w-full h-11 px-4 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                {/* Printer Type */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Printer Type
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {printerTypes.map(({ value, label, icon: Icon }) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            type: value as "receipt" | "label" | "report",
                          }))
                        }
                        className={`p-4 rounded-lg border-2 transition-all flex flex-col items-center gap-2 ${
                          formData.type === value
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        <Icon
                          className={`w-6 h-6 ${
                            formData.type === value
                              ? "text-primary"
                              : "text-muted-foreground"
                          }`}
                        />
                        <span className="text-sm font-medium">{label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Connection Type */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Connection Type
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {connectionTypes.map(({ value, label, icon: Icon }) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            connection: value as "usb" | "network" | "bluetooth",
                          }))
                        }
                        className={`p-4 rounded-lg border-2 transition-all flex flex-col items-center gap-2 ${
                          formData.connection === value
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        <Icon
                          className={`w-6 h-6 ${
                            formData.connection === value
                              ? "text-primary"
                              : "text-muted-foreground"
                          }`}
                        />
                        <span className="text-sm font-medium">{label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Network Settings */}
                {formData.connection === "network" && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        IP Address
                      </label>
                      <input
                        type="text"
                        value={formData.ipAddress}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            ipAddress: e.target.value,
                          }))
                        }
                        placeholder="192.168.1.100"
                        className="w-full h-11 px-4 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Port</label>
                      <input
                        type="text"
                        value={formData.port}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, port: e.target.value }))
                        }
                        placeholder="9100"
                        className="w-full h-11 px-4 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary font-mono"
                      />
                    </div>
                  </div>
                )}

                {/* Bluetooth Settings */}
                {formData.connection === "bluetooth" && (
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      MAC Address <span className="text-destructive">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.macAddress}
                      onChange={(e) => {
                        // Auto-format MAC address with colons
                        let value = e.target.value.toUpperCase().replace(/[^A-F0-9:]/g, "");
                        // Remove extra colons
                        value = value.replace(/:+/g, ":");
                        // Auto-add colons
                        if (value.length > 0 && !value.includes(":")) {
                          value = value.match(/.{1,2}/g)?.join(":") || value;
                        }
                        // Limit to 17 characters (XX:XX:XX:XX:XX:XX)
                        if (value.length > 17) value = value.substring(0, 17);
                        setFormData((prev) => ({
                          ...prev,
                          macAddress: value,
                        }));
                      }}
                      placeholder="XX:XX:XX:XX:XX:XX"
                      className={`w-full h-11 px-4 bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary font-mono uppercase ${
                        formData.macAddress && formData.macAddress.length === 17
                          ? "border-success"
                          : formData.macAddress && formData.macAddress.length > 0
                          ? "border-warning"
                          : "border-input"
                      }`}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Enter the Bluetooth MAC address of your printer (format: XX:XX:XX:XX:XX:XX)
                    </p>
                    {formData.macAddress && formData.macAddress.length === 17 && (
                      <p className="text-xs text-success mt-1 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        Valid MAC address format
                      </p>
                    )}
                  </div>
                )}

                {/* Model & Paper Width */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Printer Model
                    </label>
                    <input
                      type="text"
                      value={formData.model}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, model: e.target.value }))
                      }
                      placeholder="e.g., Epson TM-T82X"
                      className="w-full h-11 px-4 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Paper Width (mm)
                    </label>
                    <select
                      value={formData.paperWidth}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          paperWidth: e.target.value,
                        }))
                      }
                      className="w-full h-11 px-4 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="48">48mm (2 inch)</option>
                      <option value="50">50mm (Label)</option>
                      <option value="58">58mm (2.25 inch)</option>
                      <option value="80">80mm (3 inch)</option>
                      <option value="210">210mm (A4)</option>
                    </select>
                  </div>
                </div>

                {/* Options */}
                <div className="flex items-center gap-6">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isDefault}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          isDefault: e.target.checked,
                        }))
                      }
                      className="w-5 h-5 rounded border-input text-primary focus:ring-primary"
                    />
                    <span className="font-medium">Set as Default</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          isActive: e.target.checked,
                        }))
                      }
                      className="w-5 h-5 rounded border-input text-primary focus:ring-primary"
                    />
                    <span className="font-medium">Active</span>
                  </label>
                </div>
              </div>

              <div className="p-6 bg-muted/30 border-t border-border flex gap-3">
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingPrinter(null);
                  }}
                  className="flex-1 h-11 rounded-lg border border-border font-medium hover:bg-muted transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={
                    !formData.name || 
                    !formData.model ||
                    (formData.connection === "network" && !formData.ipAddress) ||
                    (formData.connection === "bluetooth" && !formData.macAddress)
                  }
                  className="flex-1 h-11 rounded-lg bg-primary text-primary-foreground font-medium flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  {editingPrinter ? "Update Printer" : "Add Printer"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setShowDeleteConfirm(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-md bg-card rounded-2xl shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-border">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center">
                    <AlertCircle className="w-6 h-6 text-destructive" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">Delete Printer?</h2>
                    <p className="text-sm text-muted-foreground">
                      This will remove the printer configuration
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-muted/30 border-t border-border flex gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(null)}
                  className="flex-1 h-11 rounded-lg border border-border font-medium hover:bg-muted transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => deletePrinter(showDeleteConfirm)}
                  className="flex-1 h-11 rounded-lg bg-destructive text-destructive-foreground font-medium hover:bg-destructive/90 transition-colors"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success Toast */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 px-6 py-4 bg-success rounded-xl shadow-lg flex items-center gap-3"
          >
            <CheckCircle2 className="w-6 h-6 text-white" />
            <span className="text-white font-medium">{showSuccess}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
