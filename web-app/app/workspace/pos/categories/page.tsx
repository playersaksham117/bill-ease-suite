"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Tag,
  Plus,
  Edit2,
  Trash2,
  X,
  Save,
  CheckCircle2,
  AlertCircle,
  Package,
  Folder,
  FolderOpen,
  GripVertical,
} from "lucide-react";

// Types
interface Category {
  id: string;
  name: string;
  description: string;
  productCount: number;
  color: string;
  isActive: boolean;
  parentId: string | null;
}

// Mock data
const mockCategories: Category[] = [
  { id: "1", name: "Grocery", description: "Daily essentials and staples", productCount: 45, color: "#22c55e", isActive: true, parentId: null },
  { id: "2", name: "Dairy", description: "Milk, butter, cheese, and dairy products", productCount: 18, color: "#3b82f6", isActive: true, parentId: null },
  { id: "3", name: "Instant Food", description: "Ready-to-eat and instant meals", productCount: 32, color: "#f59e0b", isActive: true, parentId: null },
  { id: "4", name: "Snacks", description: "Chips, namkeen, and munchies", productCount: 56, color: "#ef4444", isActive: true, parentId: null },
  { id: "5", name: "Household", description: "Cleaning and household items", productCount: 28, color: "#8b5cf6", isActive: true, parentId: null },
  { id: "6", name: "Beverages", description: "Drinks, juices, and soft drinks", productCount: 38, color: "#06b6d4", isActive: true, parentId: null },
  { id: "7", name: "Bakery", description: "Bread, cakes, and baked goods", productCount: 15, color: "#f97316", isActive: true, parentId: null },
  { id: "8", name: "Personal Care", description: "Soaps, shampoos, and toiletries", productCount: 42, color: "#ec4899", isActive: false, parentId: null },
  { id: "9", name: "Frozen Foods", description: "Ice cream and frozen items", productCount: 0, color: "#14b8a6", isActive: true, parentId: null },
];

const colorOptions = [
  "#22c55e", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6",
  "#06b6d4", "#f97316", "#ec4899", "#14b8a6", "#6366f1",
];

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>(mockCategories);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    color: "#22c55e",
    isActive: true,
  });

  // Stats
  const totalCategories = categories.length;
  const activeCategories = categories.filter((c) => c.isActive).length;
  const totalProducts = categories.reduce((sum, c) => sum + c.productCount, 0);

  // Handle form submit
  const handleSubmit = () => {
    if (editingCategory) {
      setCategories((prev) =>
        prev.map((c) =>
          c.id === editingCategory.id ? { ...c, ...formData } : c
        )
      );
      setShowSuccess("Category updated successfully!");
    } else {
      const newCategory: Category = {
        id: Date.now().toString(),
        ...formData,
        productCount: 0,
        parentId: null,
      };
      setCategories((prev) => [...prev, newCategory]);
      setShowSuccess("Category added successfully!");
    }

    setShowAddModal(false);
    setEditingCategory(null);
    resetForm();
    setTimeout(() => setShowSuccess(null), 3000);
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      color: "#22c55e",
      isActive: true,
    });
  };

  // Open edit modal
  const openEditModal = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description,
      color: category.color,
      isActive: category.isActive,
    });
    setShowAddModal(true);
  };

  // Delete category
  const deleteCategory = (id: string) => {
    const category = categories.find((c) => c.id === id);
    if (category && category.productCount > 0) {
      // Can't delete if has products
      setShowDeleteConfirm(null);
      return;
    }
    setCategories((prev) => prev.filter((c) => c.id !== id));
    setShowDeleteConfirm(null);
    setShowSuccess("Category deleted successfully!");
    setTimeout(() => setShowSuccess(null), 3000);
  };

  // Toggle active status
  const toggleActive = (id: string) => {
    setCategories((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, isActive: !c.isActive } : c
      )
    );
  };

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0 h-14 bg-card border-b border-border flex items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <Tag className="w-5 h-5 text-primary" />
          <h1 className="text-lg font-bold">Product Categories</h1>
        </div>
        <button
          onClick={() => {
            resetForm();
            setEditingCategory(null);
            setShowAddModal(true);
          }}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Category
        </button>
      </div>

      {/* Stats */}
      <div className="flex-shrink-0 p-4 border-b border-border">
        <div className="grid grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
            <div className="text-sm text-muted-foreground">Total Categories</div>
            <div className="text-2xl font-bold text-primary mt-1">{totalCategories}</div>
          </div>
          <div className="p-4 rounded-xl bg-success/5 border border-success/20">
            <div className="text-sm text-muted-foreground">Active Categories</div>
            <div className="text-2xl font-bold text-success mt-1">{activeCategories}</div>
          </div>
          <div className="p-4 rounded-xl bg-muted border border-border">
            <div className="text-sm text-muted-foreground">Total Products</div>
            <div className="text-2xl font-bold mt-1">{totalProducts}</div>
          </div>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="grid grid-cols-3 gap-4">
          {categories.map((category) => (
            <motion.div
              key={category.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`p-5 rounded-xl border-2 transition-all ${
                category.isActive
                  ? "bg-card border-border hover:border-primary/50"
                  : "bg-muted/30 border-muted opacity-60"
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: `${category.color}20` }}
                >
                  <Folder
                    className="w-6 h-6"
                    style={{ color: category.color }}
                  />
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openEditModal(category)}
                    className="p-2 rounded-lg hover:bg-muted transition-colors"
                  >
                    <Edit2 className="w-4 h-4 text-muted-foreground" />
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm(category.id)}
                    className="p-2 rounded-lg hover:bg-destructive/10 hover:text-destructive transition-colors"
                    disabled={category.productCount > 0}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <h3 className="text-lg font-bold mb-1">{category.name}</h3>
              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                {category.description || "No description"}
              </p>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm">
                  <Package className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium">{category.productCount}</span>
                  <span className="text-muted-foreground">products</span>
                </div>
                <button
                  onClick={() => toggleActive(category.id)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    category.isActive
                      ? "bg-success/10 text-success hover:bg-success/20"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  {category.isActive ? "Active" : "Inactive"}
                </button>
              </div>
            </motion.div>
          ))}

          {/* Add New Card */}
          <button
            onClick={() => {
              resetForm();
              setEditingCategory(null);
              setShowAddModal(true);
            }}
            className="p-5 rounded-xl border-2 border-dashed border-border hover:border-primary hover:bg-primary/5 transition-all flex flex-col items-center justify-center min-h-[200px] group"
          >
            <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center mb-3 group-hover:bg-primary/10 transition-colors">
              <Plus className="w-6 h-6 text-muted-foreground group-hover:text-primary" />
            </div>
            <span className="text-sm font-medium text-muted-foreground group-hover:text-primary">
              Add New Category
            </span>
          </button>
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
              setEditingCategory(null);
            }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-md bg-card rounded-2xl shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-border flex items-center justify-between">
                <h2 className="text-xl font-bold">
                  {editingCategory ? "Edit Category" : "Add New Category"}
                </h2>
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingCategory(null);
                  }}
                  className="p-2 rounded-lg hover:bg-muted transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-4">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium mb-2">Category Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter category name"
                    className="w-full h-11 px-4 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                    placeholder="Brief description of this category"
                    rows={3}
                    className="w-full px-4 py-3 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  />
                </div>

                {/* Color */}
                <div>
                  <label className="block text-sm font-medium mb-2">Color</label>
                  <div className="flex gap-2 flex-wrap">
                    {colorOptions.map((color) => (
                      <button
                        key={color}
                        onClick={() => setFormData((prev) => ({ ...prev, color }))}
                        className={`w-10 h-10 rounded-lg border-2 transition-all ${
                          formData.color === color ? "border-foreground scale-110" : "border-transparent"
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>

                {/* Status */}
                <div>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => setFormData((prev) => ({ ...prev, isActive: e.target.checked }))}
                      className="w-5 h-5 rounded border-input text-primary focus:ring-primary"
                    />
                    <span className="font-medium">Active Category</span>
                  </label>
                </div>
              </div>

              <div className="p-6 bg-muted/30 border-t border-border flex gap-3">
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingCategory(null);
                  }}
                  className="flex-1 h-11 rounded-lg border border-border font-medium hover:bg-muted transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={!formData.name}
                  className="flex-1 h-11 rounded-lg bg-primary text-primary-foreground font-medium flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  {editingCategory ? "Update" : "Add Category"}
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
                    <h2 className="text-xl font-bold">Delete Category?</h2>
                    <p className="text-sm text-muted-foreground">
                      {categories.find((c) => c.id === showDeleteConfirm)?.productCount ? (
                        <span className="text-destructive">
                          Cannot delete - category has products
                        </span>
                      ) : (
                        "This action cannot be undone"
                      )}
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
                  onClick={() => deleteCategory(showDeleteConfirm)}
                  disabled={
                    (categories.find((c) => c.id === showDeleteConfirm)?.productCount || 0) > 0
                  }
                  className="flex-1 h-11 rounded-lg bg-destructive text-destructive-foreground font-medium hover:bg-destructive/90 transition-colors disabled:opacity-50"
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
