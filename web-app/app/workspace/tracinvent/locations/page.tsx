"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Warehouse,
  Search,
  Plus,
  Edit2,
  Trash2,
  X,
  Save,
  CheckCircle2,
  AlertCircle,
  MapPin,
  Package,
  Layers,
  Box,
} from "lucide-react";

// Types
interface Location {
  id: string;
  name: string;
  code: string;
  type: "warehouse" | "rack" | "zone" | "bin" | "cold-storage";
  parentId: string | null;
  description: string;
  capacity: number;
  currentStock: number;
  isActive: boolean;
}

// Mock data
const mockLocations: Location[] = [
  { id: "1", name: "Main Warehouse", code: "WH-01", type: "warehouse", parentId: null, description: "Primary storage facility", capacity: 10000, currentStock: 7500, isActive: true },
  { id: "2", name: "Cold Storage", code: "CS-01", type: "cold-storage", parentId: null, description: "Refrigerated storage for perishables", capacity: 2000, currentStock: 1200, isActive: true },
  { id: "3", name: "Rack A", code: "RA", type: "rack", parentId: "1", description: "Grocery items section", capacity: 2000, currentStock: 1500, isActive: true },
  { id: "4", name: "Rack A1", code: "RA1", type: "bin", parentId: "3", description: "Salts and spices", capacity: 500, currentStock: 350, isActive: true },
  { id: "5", name: "Rack A2", code: "RA2", type: "bin", parentId: "3", description: "Oils and ghee", capacity: 500, currentStock: 280, isActive: true },
  { id: "6", name: "Rack B", code: "RB", type: "rack", parentId: "1", description: "Instant foods section", capacity: 1500, currentStock: 1100, isActive: true },
  { id: "7", name: "Rack B1", code: "RB1", type: "bin", parentId: "6", description: "Noodles and pasta", capacity: 400, currentStock: 300, isActive: true },
  { id: "8", name: "Rack B2", code: "RB2", type: "bin", parentId: "6", description: "Ready to eat", capacity: 400, currentStock: 250, isActive: true },
  { id: "9", name: "Rack C", code: "RC", type: "rack", parentId: "1", description: "Snacks section", capacity: 1800, currentStock: 1400, isActive: true },
  { id: "10", name: "Rack D", code: "RD", type: "rack", parentId: "1", description: "Household items", capacity: 1500, currentStock: 900, isActive: true },
  { id: "11", name: "Fresh Counter", code: "FC-01", type: "zone", parentId: null, description: "Daily fresh items", capacity: 500, currentStock: 150, isActive: true },
  { id: "12", name: "Retail Store", code: "RS-01", type: "warehouse", parentId: null, description: "Front store display", capacity: 3000, currentStock: 2100, isActive: true },
];

const locationTypes = [
  { value: "warehouse", label: "Warehouse", icon: Warehouse },
  { value: "rack", label: "Rack", icon: Layers },
  { value: "zone", label: "Zone", icon: MapPin },
  { value: "bin", label: "Bin", icon: Box },
  { value: "cold-storage", label: "Cold Storage", icon: Package },
];

export default function LocationsPage() {
  const [locations, setLocations] = useState<Location[]>(mockLocations);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingLocation, setEditingLocation] = useState<Location | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    type: "rack" as Location["type"],
    parentId: "" as string | null,
    description: "",
    capacity: 100,
    isActive: true,
  });

  // Filter locations
  const filteredLocations = locations.filter((loc) => {
    const matchesSearch =
      loc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loc.code.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === "all" || loc.type === typeFilter;
    return matchesSearch && matchesType;
  });

  // Stats
  const totalLocations = locations.length;
  const totalCapacity = locations.filter((l) => !l.parentId).reduce((sum, l) => sum + l.capacity, 0);
  const totalStock = locations.filter((l) => !l.parentId).reduce((sum, l) => sum + l.currentStock, 0);
  const utilizationRate = totalCapacity > 0 ? Math.round((totalStock / totalCapacity) * 100) : 0;

  // Parent locations (for dropdown)
  const parentLocations = locations.filter(
    (l) => l.type === "warehouse" || l.type === "rack" || l.type === "zone"
  );

  // Handle form submit
  const handleSubmit = () => {
    if (editingLocation) {
      setLocations((prev) =>
        prev.map((l) =>
          l.id === editingLocation.id
            ? { ...l, ...formData, parentId: formData.parentId || null }
            : l
        )
      );
      setShowSuccess("Location updated successfully!");
    } else {
      const newLocation: Location = {
        id: Date.now().toString(),
        ...formData,
        parentId: formData.parentId || null,
        currentStock: 0,
      };
      setLocations((prev) => [...prev, newLocation]);
      setShowSuccess("Location added successfully!");
    }

    setShowAddModal(false);
    setEditingLocation(null);
    resetForm();
    setTimeout(() => setShowSuccess(null), 3000);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      code: "",
      type: "rack",
      parentId: "",
      description: "",
      capacity: 100,
      isActive: true,
    });
  };

  const openEditModal = (location: Location) => {
    setEditingLocation(location);
    setFormData({
      name: location.name,
      code: location.code,
      type: location.type,
      parentId: location.parentId || "",
      description: location.description,
      capacity: location.capacity,
      isActive: location.isActive,
    });
    setShowAddModal(true);
  };

  const handleDelete = (id: string) => {
    // Check for child locations
    const hasChildren = locations.some((l) => l.parentId === id);
    if (hasChildren) {
      setShowSuccess("Cannot delete: Location has child locations");
      setTimeout(() => setShowSuccess(null), 3000);
      setShowDeleteConfirm(null);
      return;
    }

    setLocations((prev) => prev.filter((l) => l.id !== id));
    setShowDeleteConfirm(null);
    setShowSuccess("Location deleted successfully!");
    setTimeout(() => setShowSuccess(null), 3000);
  };

  const getTypeIcon = (type: Location["type"]) => {
    const typeConfig = locationTypes.find((t) => t.value === type);
    return typeConfig?.icon || MapPin;
  };

  const getTypeColor = (type: Location["type"]) => {
    switch (type) {
      case "warehouse": return "bg-primary/10 text-primary";
      case "cold-storage": return "bg-cyan-500/10 text-cyan-500";
      case "rack": return "bg-warning/10 text-warning";
      case "zone": return "bg-success/10 text-success";
      case "bin": return "bg-muted text-muted-foreground";
    }
  };

  const getUtilizationColor = (current: number, capacity: number) => {
    const rate = (current / capacity) * 100;
    if (rate >= 90) return "text-destructive";
    if (rate >= 70) return "text-warning";
    return "text-success";
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Success Toast */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 bg-success text-white rounded-lg shadow-lg"
          >
            <CheckCircle2 className="w-5 h-5" />
            {showSuccess}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex-shrink-0 px-6 py-4 border-b border-border bg-card/50">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-foreground">Locations</h1>
            <p className="text-sm text-muted-foreground">Manage warehouse zones, racks, and bins</p>
          </div>
          <button
            onClick={() => {
              resetForm();
              setEditingLocation(null);
              setShowAddModal(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Location
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-card border border-border rounded-xl p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <MapPin className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{totalLocations}</p>
              <p className="text-xs text-muted-foreground">Total Locations</p>
            </div>
          </div>
          <div className="bg-card border border-border rounded-xl p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
              <Warehouse className="w-6 h-6 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold">{totalCapacity.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">Total Capacity</p>
            </div>
          </div>
          <div className="bg-card border border-border rounded-xl p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-warning/10 flex items-center justify-center">
              <Package className="w-6 h-6 text-warning" />
            </div>
            <div>
              <p className="text-2xl font-bold">{totalStock.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">Current Stock</p>
            </div>
          </div>
          <div className="bg-card border border-border rounded-xl p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Layers className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{utilizationRate}%</p>
              <p className="text-xs text-muted-foreground">Utilization</p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-4 items-center mb-6">
          <div className="flex-1 relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search locations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-10 pr-4 bg-card border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="h-10 px-4 bg-card border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="all">All Types</option>
            {locationTypes.map((type) => (
              <option key={type.value} value={type.value}>{type.label}</option>
            ))}
          </select>
        </div>

        {/* Locations Grid */}
        <div className="grid grid-cols-3 gap-4">
          {filteredLocations.map((location, idx) => {
            const Icon = getTypeIcon(location.type);
            const parentLocation = location.parentId
              ? locations.find((l) => l.id === location.parentId)
              : null;

            return (
              <motion.div
                key={location.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.03 }}
                className="bg-card border border-border rounded-xl p-5 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${getTypeColor(location.type)}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => openEditModal(location)}
                      className="p-2 rounded-lg hover:bg-muted transition-colors"
                    >
                      <Edit2 className="w-4 h-4 text-muted-foreground" />
                    </button>
                    <button
                      onClick={() => setShowDeleteConfirm(location.id)}
                      className="p-2 rounded-lg hover:bg-destructive/10 transition-colors"
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </button>
                  </div>
                </div>

                <h3 className="font-semibold text-foreground mb-1">{location.name}</h3>
                <p className="text-xs text-muted-foreground mb-1 font-mono">{location.code}</p>
                {parentLocation && (
                  <p className="text-xs text-muted-foreground mb-2">
                    in {parentLocation.name}
                  </p>
                )}
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{location.description}</p>

                {/* Capacity Bar */}
                <div className="mb-3">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-muted-foreground">Capacity</span>
                    <span className={`font-medium ${getUtilizationColor(location.currentStock, location.capacity)}`}>
                      {location.currentStock} / {location.capacity}
                    </span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        (location.currentStock / location.capacity) >= 0.9
                          ? "bg-destructive"
                          : (location.currentStock / location.capacity) >= 0.7
                          ? "bg-warning"
                          : "bg-success"
                      }`}
                      style={{ width: `${Math.min((location.currentStock / location.capacity) * 100, 100)}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${getTypeColor(location.type)}`}>
                    {location.type.replace("-", " ")}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    location.isActive ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"
                  }`}>
                    {location.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {filteredLocations.length === 0 && (
          <div className="text-center py-12">
            <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">No locations found</p>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowAddModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-card border border-border rounded-xl shadow-xl w-full max-w-lg"
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                <h2 className="text-lg font-bold">{editingLocation ? "Edit Location" : "Add New Location"}</h2>
                <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-muted rounded-lg transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Name *</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full h-10 px-4 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="e.g., Rack A1"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Code *</label>
                    <input
                      type="text"
                      value={formData.code}
                      onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                      className="w-full h-10 px-4 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="e.g., RA1"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Type *</label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value as Location["type"] })}
                      className="w-full h-10 px-4 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      {locationTypes.map((type) => (
                        <option key={type.value} value={type.value}>{type.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Parent Location</label>
                    <select
                      value={formData.parentId || ""}
                      onChange={(e) => setFormData({ ...formData, parentId: e.target.value || null })}
                      className="w-full h-10 px-4 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="">None (Top Level)</option>
                      {parentLocations
                        .filter((l) => l.id !== editingLocation?.id)
                        .map((loc) => (
                          <option key={loc.id} value={loc.id}>{loc.name} ({loc.code})</option>
                        ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full h-20 px-4 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                    placeholder="Describe this location..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Capacity</label>
                  <input
                    type="number"
                    value={formData.capacity}
                    onChange={(e) => setFormData({ ...formData, capacity: Number(e.target.value) })}
                    className="w-full h-10 px-4 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    min="1"
                  />
                </div>
                <div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                      className="w-4 h-4 rounded border-border"
                    />
                    <span className="text-sm">Active Location</span>
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-border">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-sm font-medium text-foreground hover:bg-muted rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={!formData.name || !formData.code}
                  className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  {editingLocation ? "Update" : "Save"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowDeleteConfirm(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-card border border-border rounded-xl shadow-xl p-6 w-full max-w-md"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center">
                  <AlertCircle className="w-5 h-5 text-destructive" />
                </div>
                <h3 className="text-lg font-bold">Delete Location</h3>
              </div>
              <p className="text-muted-foreground mb-6">
                Are you sure you want to delete this location? This action cannot be undone.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(null)}
                  className="px-4 py-2 text-sm font-medium hover:bg-muted rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(showDeleteConfirm)}
                  className="px-4 py-2 bg-destructive text-destructive-foreground rounded-lg text-sm font-medium hover:bg-destructive/90 transition-colors"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
