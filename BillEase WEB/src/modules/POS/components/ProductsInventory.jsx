import React, { useState, useRef, useEffect } from 'react'
import { PackageSearch, Plus, Edit, Trash2, Search, AlertCircle, Upload, Download, QrCode, ScanLine, X, Save, FileText, Printer, CheckSquare, Square } from 'lucide-react'
import { usePOS } from '../POS'
import { QRCodeSVG } from 'qrcode.react'
import JsBarcode from 'jsbarcode'
import { generateUniqueBarcode, generateQRCodeData, normalizeBarcode } from '../../../utils/barcodeGenerator'
import { printLabels, saveLabelsPDF } from '../../../utils/labelPrinter'
import '../POS.css'

const ProductsInventory = () => {
  const { products, addProduct, updateProduct, deleteProduct, bulkImportProducts } = usePOS()
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState('')
  const [showLowStock, setShowLowStock] = useState(false)
  const [showProductModal, setShowProductModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [showBarcodeModal, setShowBarcodeModal] = useState(null)
  const [productForm, setProductForm] = useState({
    name: '',
    sku: '',
    price: '',
    stock: '',
    category: '',
    description: '',
    barcode: '',
    costPrice: ''
  })
  const [lowStockThreshold, setLowStockThreshold] = useState(() => {
    const saved = localStorage.getItem('pos_low_stock_threshold')
    return saved ? parseInt(saved) : 10
  })
  const barcodeCanvasRef = useRef(null)
  const [selectedProducts, setSelectedProducts] = useState([])
  const [showLabelPrintModal, setShowLabelPrintModal] = useState(false)
  const barcodeRefs = useRef({})

  const categories = [...new Set(products.map(p => p.category))]

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.sku?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.barcode?.includes(searchTerm)
    const matchesCategory = !filterCategory || product.category === filterCategory
    const matchesLowStock = !showLowStock || product.stock <= lowStockThreshold
    return matchesSearch && matchesCategory && matchesLowStock
  })

  const lowStockProducts = products.filter(p => p.stock <= lowStockThreshold)

  // Generate visual barcodes for table display
  useEffect(() => {
    filteredProducts.forEach(product => {
      if (product.barcode && !barcodeRefs.current[product.id]) {
        const canvas = document.createElement('canvas')
        barcodeRefs.current[product.id] = canvas
        try {
          JsBarcode(canvas, product.barcode, {
            format: "EAN13",
            width: 1,
            height: 30,
            displayValue: false
          })
        } catch (e) {
          console.error('Barcode generation error:', e)
        }
      }
    })
  }, [filteredProducts])

  useEffect(() => {
    if (showBarcodeModal && barcodeCanvasRef.current) {
      const product = products.find(p => p.id === showBarcodeModal)
      if (product && product.barcode) {
        try {
          JsBarcode(barcodeCanvasRef.current, product.barcode, {
            format: "EAN13",
            width: 2,
            height: 50,
            displayValue: true
          })
        } catch (e) {
          console.error('Barcode generation error:', e)
        }
      }
    }
  }, [showBarcodeModal, products])

  const toggleProductSelection = (productId) => {
    setSelectedProducts(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    )
  }

  const toggleSelectAll = () => {
    if (selectedProducts.length === filteredProducts.length) {
      setSelectedProducts([])
    } else {
      setSelectedProducts(filteredProducts.map(p => p.id))
    }
  }

  const handlePrintLabels = () => {
    const selectedItems = products.filter(p => selectedProducts.includes(p.id))
    if (selectedItems.length === 0) {
      alert('Please select at least one product to print labels')
      return
    }
    printLabels(selectedItems, {
      showPrice: true,
      showStock: true,
      showSKU: true
    })
  }

  const handleSaveLabels = () => {
    const selectedItems = products.filter(p => selectedProducts.includes(p.id))
    if (selectedItems.length === 0) {
      alert('Please select at least one product to save labels')
      return
    }
    saveLabelsPDF(selectedItems, {
      showPrice: true,
      showStock: true,
      showSKU: true
    })
  }

  const handleAddProduct = () => {
    setEditingProduct(null)
    setProductForm({
      name: '',
      sku: '',
      price: '',
      stock: '',
      category: '',
      description: '',
      barcode: '',
      costPrice: ''
    })
    setShowProductModal(true)
  }

  const handleEditProduct = (product) => {
    setEditingProduct(product)
    setProductForm({
      name: product.name || '',
      sku: product.sku || '',
      price: product.price || '',
      stock: product.stock || '',
      category: product.category || '',
      description: product.description || '',
      barcode: product.barcode || '',
      costPrice: product.costPrice || ''
    })
    setShowProductModal(true)
  }

  const handleSaveProduct = () => {
    if (!productForm.name || !productForm.price) {
      alert('Please fill in required fields (Name and Price)')
      return
    }

    // Get existing barcodes to ensure uniqueness
    const existingBarcodes = products.map(p => p.barcode).filter(Boolean)
    
    // Auto-generate barcode if not provided (only for manual adds, not CSV imports)
    let barcode = productForm.barcode
    if (!barcode || barcode.trim() === '') {
      // Generate unique barcode for manual product addition
      barcode = generateUniqueBarcode(existingBarcodes)
    } else {
      // Normalize existing barcode to ensure it's 13 digits
      barcode = normalizeBarcode(barcode)
    }

    const productData = {
      name: productForm.name,
      sku: productForm.sku || `SKU-${Date.now()}`,
      price: parseFloat(productForm.price),
      stock: parseInt(productForm.stock) || 0,
      category: productForm.category || 'Uncategorized',
      description: productForm.description || '',
      barcode: barcode,
      costPrice: productForm.costPrice ? parseFloat(productForm.costPrice) : null
    }

    if (editingProduct) {
      updateProduct(editingProduct.id, productData)
    } else {
      addProduct(productData)
    }

    setShowProductModal(false)
    setProductForm({
      name: '',
      sku: '',
      price: '',
      stock: '',
      category: '',
      description: '',
      barcode: '',
      costPrice: ''
    })
  }

  const handleGenerateBarcode = () => {
    const existingBarcodes = products.map(p => p.barcode).filter(Boolean)
    const newBarcode = generateUniqueBarcode(existingBarcodes)
    setProductForm({ ...productForm, barcode: newBarcode })
  }

  // Improved CSV parser that handles quoted values
  const parseCSVLine = (line) => {
    const result = []
    let current = ''
    let inQuotes = false
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i]
      
      if (char === '"') {
        inQuotes = !inQuotes
      } else if (char === ',' && !inQuotes) {
        result.push(current.trim())
        current = ''
      } else {
        current += char
      }
    }
    result.push(current.trim())
    return result
  }

  const handleCSVImport = (event) => {
    const file = event.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const text = e.target.result
        const lines = text.split(/\r?\n/).filter(line => line.trim())
        
        if (lines.length < 2) {
          alert('CSV file must have at least a header row and one data row')
          return
        }

        // Parse header row
        const headers = parseCSVLine(lines[0]).map(h => h.trim().toLowerCase().replace(/"/g, ''))
        
        // Normalize header names for better matching - handles various Excel column formats
        const normalizeHeader = (header) => {
          const normalized = header.toLowerCase().replace(/[_\s]/g, '')
          
          // Name variations
          if (normalized.includes('name') && !normalized.includes('file')) return 'name'
          
          // SKU variations (sku_id, sku, code, productcode, etc.)
          if (normalized.includes('sku') || normalized.includes('productcode') || normalized.includes('itemcode')) return 'sku'
          
          // Price variations - prioritize sale_price over rate
          if (normalized.includes('saleprice') || normalized.includes('sellingprice') || normalized.includes('sale_price')) return 'price'
          if (normalized.includes('rate') && !normalized.includes('deal')) return 'rate'
          if (normalized.includes('price') && !normalized.includes('cost') && !normalized.includes('sale')) return 'price'
          
          // Stock/Quantity variations
          if (normalized.includes('stock') || normalized.includes('quantity') || normalized.includes('qty')) return 'stock'
          
          // Category variations
          if (normalized.includes('category') || normalized.includes('cate')) return 'category'
          if (normalized.includes('subcategory') || normalized.includes('sub_category')) return 'subCategory'
          
          // Description variations
          if (normalized.includes('description') || normalized.includes('desc')) return 'description'
          
          // Barcode variations (handles visual barcodes column)
          if (normalized.includes('barcode') || normalized.includes('barcodes')) return 'barcode'
          if (normalized.includes('qrcode') || normalized.includes('qr')) return 'qrcode'
          
          // Cost price variations
          if (normalized.includes('costprice') || normalized.includes('cost_price') || normalized.includes('purchaseprice')) return 'costPrice'
          
          // Unit variations
          if (normalized.includes('unit') || normalized.includes('uom')) return 'unit'
          
          // Brand
          if (normalized.includes('brand')) return 'brand'
          
          // Image URL
          if (normalized.includes('image') || normalized.includes('img') || normalized.includes('photo')) return 'image'
          
          // Dimensions (optional)
          if (normalized.includes('length')) return 'length'
          if (normalized.includes('width')) return 'width'
          if (normalized.includes('height')) return 'height'
          if (normalized.includes('weight')) return 'weight'
          
          // Return null for columns we want to ignore (keywords, text, bulk deals, etc.)
          if (normalized.includes('keyword') || normalized.includes('text') || normalized.includes('bulkdeal') || normalized.includes('warranty')) {
            return null // Ignore these columns
          }
          
          return normalized
        }

        const normalizedHeaders = headers.map(normalizeHeader)
        
        const importedProducts = []
        const errors = []
        
        for (let i = 1; i < lines.length; i++) {
          const values = parseCSVLine(lines[i]).map(v => v.replace(/^"|"$/g, '').trim())
          
          if (values.length === 0 || !values[0]) continue
          
          const product = {}
          
          normalizedHeaders.forEach((header, index) => {
            // Skip ignored columns
            if (header === null) return
            
            const value = values[index] || ''
            if (!value || value.trim() === '') return // Skip empty values
            
            switch (header) {
              case 'name':
                product.name = value
                break
              case 'sku':
                product.sku = value
                break
              case 'price':
                // Sale price - this is the selling price
                const salePrice = parseFloat(value.replace(/[₹,]/g, ''))
                if (salePrice > 0) {
                  product.price = salePrice
                }
                break
              case 'rate':
                // Rate is typically cost/purchase price
                const rate = parseFloat(value.replace(/[₹,]/g, ''))
                if (rate > 0) {
                  product.costPrice = rate
                  // If no sale_price found, use rate as price
                  if (!product.price) {
                    product.price = rate
                  }
                }
                break
              case 'stock':
                product.stock = parseInt(value) || 0
                break
              case 'category':
                product.category = value || 'Uncategorized'
                break
              case 'subCategory':
                // Store subcategory in description or as part of category
                if (product.category && value) {
                  product.category = `${product.category} > ${value}`
                }
                break
              case 'description':
                product.description = value
                break
              case 'barcode':
                // Extract numeric barcode from visual barcode (might contain * or other chars)
                // Remove non-numeric characters except digits
                const barcodeDigits = value.replace(/\D/g, '')
                if (barcodeDigits.length > 0) {
                  product.barcode = normalizeBarcode(barcodeDigits)
                }
                break
              case 'qrcode':
                // QR code can be used as barcode if barcode column is empty
                if (!product.barcode && value) {
                  const qrDigits = value.replace(/\D/g, '')
                  if (qrDigits.length > 0) {
                    product.barcode = normalizeBarcode(qrDigits)
                  }
                }
                break
              case 'costprice':
                product.costPrice = parseFloat(value.replace(/[₹,]/g, '')) || null
                break
              case 'unit':
                product.unit = value.toUpperCase() || 'PCS'
                break
              case 'brand':
                // Store brand in description or as metadata
                if (value && !product.description) {
                  product.description = `Brand: ${value}`
                } else if (value && product.description) {
                  product.description = `${product.description}\nBrand: ${value}`
                }
                break
              case 'image':
                // Store image URL if needed (can be added to product object)
                product.imageUrl = value
                break
            }
          })
          
          // Validate required fields
          if (!product.name || !product.name.trim()) {
            errors.push(`Row ${i + 1}: Missing product name`)
            continue
          }
          
          // Use rate as price if sale_price not found
          if (!product.price || product.price <= 0) {
            if (product.costPrice && product.costPrice > 0) {
              product.price = product.costPrice
            } else {
              errors.push(`Row ${i + 1}: Invalid or missing price (need sale_price or rate)`)
              continue
            }
          }
          
          // Generate SKU if not provided (use sku_id or generate)
          if (!product.sku || product.sku.trim() === '') {
            // Try to use first part of name as SKU
            const nameParts = product.name.split(' ').slice(0, 3).join('').toUpperCase().substring(0, 10)
            product.sku = nameParts || `SKU-${Date.now()}-${i}`
          }
          
          // Set default category if not provided
          if (!product.category || product.category.trim() === '') {
            product.category = 'Uncategorized'
          }
          
          // Set default stock if not provided
          if (!product.stock && product.stock !== 0) {
            product.stock = 0
          }
          
          // Generate barcode if not provided (for CSV imports)
          if (!product.barcode) {
            const existingBarcodes = importedProducts.map(p => p.barcode).filter(Boolean)
            product.barcode = generateUniqueBarcode(existingBarcodes)
          } else {
            // Normalize barcode to ensure it's 13 digits
            product.barcode = normalizeBarcode(product.barcode)
          }
          
          importedProducts.push(product)
        }

        if (importedProducts.length > 0) {
          bulkImportProducts(importedProducts)
          const successMsg = `Successfully imported ${importedProducts.length} product(s)!`
          const errorMsg = errors.length > 0 ? `\n\nErrors:\n${errors.slice(0, 5).join('\n')}${errors.length > 5 ? `\n... and ${errors.length - 5} more` : ''}` : ''
          alert(successMsg + errorMsg)
        } else {
          alert('No valid products found in CSV file. Please check the format.\n\nSupported columns: name, sku_id/sku, sale_price/rate, stock, category, description, barcodes, unit, brand, etc.\n\nRequired: name and price (sale_price or rate)')
        }
      } catch (error) {
        console.error('CSV import error:', error)
        alert(`Error importing CSV: ${error.message}\n\nPlease ensure the CSV file is properly formatted.`)
      }
    }
    
    reader.onerror = () => {
      alert('Error reading file. Please try again.')
    }
    
    reader.readAsText(file)
    event.target.value = ''
  }

  const handleExportCSV = () => {
    const headers = ['Name', 'SKU', 'Price', 'Stock', 'Category', 'Description', 'Barcode', 'QR Code', 'Cost Price']
    const rows = products.map(p => [
      p.name,
      p.sku || '',
      p.price,
      p.stock,
      p.category || '',
      p.description || '',
      p.barcode || '',
      p.barcode || '', // QR Code same as barcode for reference
      p.costPrice || ''
    ])

    // Escape cells that contain commas or quotes
    const escapeCSV = (cell) => {
      if (cell === null || cell === undefined) return ''
      const str = String(cell)
      if (str.includes(',') || str.includes('"') || str.includes('\n')) {
        return `"${str.replace(/"/g, '""')}"`
      }
      return str
    }

    const csvContent = [
      headers.map(escapeCSV).join(','),
      ...rows.map(row => row.map(escapeCSV).join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `products_${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const downloadBarcode = (productId) => {
    const product = products.find(p => p.id === productId)
    if (!product || !product.barcode) return

    const canvas = document.createElement('canvas')
    JsBarcode(canvas, product.barcode, {
      format: "EAN13",
      width: 2,
      height: 50,
      displayValue: true
    })

    canvas.toBlob((blob) => {
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${product.name}_barcode.png`
      a.click()
      window.URL.revokeObjectURL(url)
    })
  }

  const downloadQRCode = (productId) => {
    const product = products.find(p => p.id === productId)
    if (!product) return

    const svg = document.querySelector(`#qrcode-${productId} svg`)
    if (!svg) return

    const svgData = new XMLSerializer().serializeToString(svg)
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()
    
    img.onload = () => {
      canvas.width = img.width
      canvas.height = img.height
      ctx.drawImage(img, 0, 0)
      canvas.toBlob((blob) => {
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `${product.name}_qrcode.png`
        a.click()
        window.URL.revokeObjectURL(url)
      })
    }
    
    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)))
  }

  return (
    <div className="pos-container">
      <div className="page-header">
        <h2>Products & Inventory</h2>
        <div className="header-actions">
          <button className="action-btn" onClick={() => {
            const template = 'Name,SKU,Price,Stock,Category,Description,Barcode,Cost Price\n"Sample Product","SKU001",100,50,"Electronics","Product description","1234567890123",80'
            const blob = new Blob([template], { type: 'text/csv' })
            const url = window.URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = 'product_import_template.csv'
            a.click()
            window.URL.revokeObjectURL(url)
          }}>
            <FileText size={18} />
            Download Template
          </button>
          <label className="action-btn" style={{ cursor: 'pointer' }}>
            <Upload size={18} />
            Import CSV
            <input
              type="file"
              accept=".csv"
              onChange={handleCSVImport}
              style={{ display: 'none' }}
            />
          </label>
          <button className="action-btn" onClick={handleExportCSV}>
            <Download size={18} />
            Export CSV
          </button>
          <button className="action-btn" onClick={handleAddProduct}>
            <Plus size={18} />
            Add Product
          </button>
          {selectedProducts.length > 0 && (
            <>
              <button className="action-btn" onClick={handlePrintLabels} style={{ background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)', color: 'white' }}>
                <Printer size={18} />
                Print Labels ({selectedProducts.length})
              </button>
              <button className="action-btn" onClick={handleSaveLabels} style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)', color: 'white' }}>
                <Download size={18} />
                Save Labels PDF
              </button>
            </>
          )}
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Total Products</div>
          <div className="stat-value">{products.length}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Low Stock Items</div>
          <div className="stat-value" style={{ color: lowStockProducts.length > 0 ? '#ef4444' : 'inherit' }}>
            {lowStockProducts.length}
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Total Stock Value</div>
          <div className="stat-value">
            ₹{products.reduce((sum, p) => sum + (p.price * p.stock), 0).toFixed(2)}
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Categories</div>
          <div className="stat-value">{categories.length}</div>
        </div>
      </div>

      <div className="csv-info-banner" style={{ 
        background: '#eff6ff', 
        border: '1px solid #3b82f6', 
        borderRadius: '0.5rem', 
        padding: '0.75rem 1rem', 
        marginBottom: '1rem',
        fontSize: '0.875rem',
        color: '#1e40af'
      }}>
        <strong>CSV Import Format:</strong> Name, SKU, Price, Stock, Category, Description, Barcode, Cost Price. 
        Barcode can be 13 digits (EAN13 format) or will be auto-generated. Download template for example.
      </div>

      <div className="filters-section">
        <div className="search-box">
          <Search size={20} />
          <input
            type="text"
            placeholder="Search products by name, SKU, or barcode..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          className="filter-select"
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        <label className="checkbox-label" style={{ margin: 0 }}>
          <input
            type="checkbox"
            checked={showLowStock}
            onChange={(e) => setShowLowStock(e.target.checked)}
          />
          Show Low Stock Only
        </label>
        <div className="threshold-input">
          <label>Low Stock Threshold:</label>
          <input
            type="number"
            value={lowStockThreshold}
            onChange={(e) => {
              const val = parseInt(e.target.value) || 0
              setLowStockThreshold(val)
              localStorage.setItem('pos_low_stock_threshold', val.toString())
            }}
            min="0"
            style={{ width: '80px', marginLeft: '0.5rem' }}
          />
        </div>
      </div>

      {lowStockProducts.length > 0 && !showLowStock && (
        <div className="alert-banner">
          <AlertCircle size={20} />
          <span>{lowStockProducts.length} product(s) are running low on stock</span>
          <button onClick={() => setShowLowStock(true)}>View Low Stock</button>
        </div>
      )}

      <div className="table-container">
        {filteredProducts.length === 0 ? (
          <div className="empty-state">
            <PackageSearch size={48} />
            <p>No products found</p>
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th style={{ width: '40px' }}>
                  <button 
                    className="select-all-btn" 
                    onClick={toggleSelectAll}
                    title={selectedProducts.length === filteredProducts.length ? 'Deselect All' : 'Select All'}
                  >
                    {selectedProducts.length === filteredProducts.length ? <CheckSquare size={18} /> : <Square size={18} />}
                  </button>
                </th>
                <th>Name</th>
                <th>SKU</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Barcode</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map(product => (
                <tr key={product.id} className={product.stock <= lowStockThreshold ? 'low-stock-row' : ''}>
                  <td>
                    <button 
                      className="select-checkbox-btn"
                      onClick={() => toggleProductSelection(product.id)}
                      title={selectedProducts.includes(product.id) ? 'Deselect' : 'Select'}
                    >
                      {selectedProducts.includes(product.id) ? <CheckSquare size={16} /> : <Square size={16} />}
                    </button>
                  </td>
                  <td>
                    <div className="product-name-cell">
                      <strong>{product.name}</strong>
                      {product.stock <= lowStockThreshold && (
                        <span className="low-stock-badge">
                          <AlertCircle size={14} />
                          Low Stock
                        </span>
                      )}
                    </div>
                  </td>
                  <td>{product.sku || 'N/A'}</td>
                  <td>{product.category || 'Uncategorized'}</td>
                  <td className="amount-cell">₹{product.price.toFixed(2)}</td>
                  <td>
                    <span className={product.stock <= lowStockThreshold ? 'low-stock-value' : ''}>
                      {product.stock}
                    </span>
                  </td>
                  <td>
                    <div className="barcode-cell">
                      {product.barcode ? (
                        <div className="barcode-display-inline">
                          <canvas 
                            ref={el => {
                              if (el && barcodeRefs.current[product.id]) {
                                const ctx = el.getContext('2d')
                                const sourceCanvas = barcodeRefs.current[product.id]
                                el.width = sourceCanvas.width
                                el.height = sourceCanvas.height
                                ctx.drawImage(sourceCanvas, 0, 0)
                              }
                            }}
                            style={{ maxWidth: '120px', height: 'auto', display: 'block' }}
                          />
                          <span className="barcode-text-small">{product.barcode}</span>
                        </div>
                      ) : (
                        <span className="no-barcode">No barcode</span>
                      )}
                    </div>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="icon-btn"
                        onClick={() => setShowBarcodeModal(product.id)}
                        title="View Barcode/QR Code"
                      >
                        <ScanLine size={16} />
                      </button>
                      <button
                        className="icon-btn"
                        onClick={() => handleEditProduct(product)}
                        title="Edit Product"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        className="icon-btn"
                        onClick={() => {
                          if (window.confirm(`Are you sure you want to delete ${product.name}?`)) {
                            deleteProduct(product.id)
                          }
                        }}
                        title="Delete Product"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showProductModal && (
        <div className="modal-overlay" onClick={() => setShowProductModal(false)}>
          <div className="modal-content product-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingProduct ? 'Edit Product' : 'Add New Product'}</h3>
              <button className="close-btn" onClick={() => setShowProductModal(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Product Name *</label>
                <input
                  type="text"
                  value={productForm.name}
                  onChange={(e) => setProductForm({...productForm, name: e.target.value})}
                  placeholder="Enter product name"
                  required
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>SKU</label>
                  <input
                    type="text"
                    value={productForm.sku}
                    onChange={(e) => setProductForm({...productForm, sku: e.target.value})}
                    placeholder="Auto-generated if empty"
                  />
                </div>
                <div className="form-group">
                  <label>Category</label>
                  <input
                    type="text"
                    value={productForm.category}
                    onChange={(e) => setProductForm({...productForm, category: e.target.value})}
                    placeholder="e.g., Electronics"
                    list="categories"
                  />
                  <datalist id="categories">
                    {categories.map(cat => <option key={cat} value={cat} />)}
                  </datalist>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Price (₹) *</label>
                  <input
                    type="number"
                    value={productForm.price}
                    onChange={(e) => setProductForm({...productForm, price: e.target.value})}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Cost Price (₹)</label>
                  <input
                    type="number"
                    value={productForm.costPrice}
                    onChange={(e) => setProductForm({...productForm, costPrice: e.target.value})}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                  />
                </div>
                <div className="form-group">
                  <label>Stock Quantity</label>
                  <input
                    type="number"
                    value={productForm.stock}
                    onChange={(e) => setProductForm({...productForm, stock: e.target.value})}
                    placeholder="0"
                    min="0"
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Barcode</label>
                <div className="barcode-input-group">
                  <input
                    type="text"
                    value={productForm.barcode}
                    onChange={(e) => setProductForm({...productForm, barcode: e.target.value})}
                    placeholder="13-digit barcode"
                    maxLength="13"
                  />
                  <button
                    type="button"
                    className="generate-btn"
                    onClick={handleGenerateBarcode}
                  >
                    Generate
                  </button>
                </div>
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={productForm.description}
                  onChange={(e) => setProductForm({...productForm, description: e.target.value})}
                  placeholder="Product description"
                  rows="3"
                />
              </div>
            </div>
            <div className="modal-footer">
              <button className="cancel-btn" onClick={() => setShowProductModal(false)}>
                Cancel
              </button>
              <button className="confirm-btn" onClick={handleSaveProduct}>
                <Save size={18} />
                {editingProduct ? 'Update' : 'Add'} Product
              </button>
            </div>
          </div>
        </div>
      )}

      {showBarcodeModal && (
        <div className="modal-overlay" onClick={() => setShowBarcodeModal(null)}>
          <div className="modal-content barcode-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Barcode & QR Code</h3>
              <button className="close-btn" onClick={() => setShowBarcodeModal(null)}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              {(() => {
                const product = products.find(p => p.id === showBarcodeModal)
                if (!product) return null
                return (
                  <>
                    <div className="product-info-banner">
                      <h4>{product.name}</h4>
                      <p>SKU: {product.sku || 'N/A'} | Price: ₹{product.price.toFixed(2)}</p>
                    </div>
                    {product.barcode && (
                      <div className="barcode-section">
                        <h4>Barcode</h4>
                        <div className="barcode-display">
                          <canvas ref={barcodeCanvasRef}></canvas>
                        </div>
                        <button className="download-btn" onClick={() => downloadBarcode(product.id)}>
                          <Download size={18} />
                          Download Barcode
                        </button>
                      </div>
                    )}
                    <div className="qrcode-section">
                      <h4>QR Code</h4>
                      <div className="qrcode-display" id={`qrcode-${product.id}`}>
                        <QRCodeSVG
                          value={generateQRCodeData(product)}
                          size={200}
                        />
                      </div>
                      <button className="download-btn" onClick={() => downloadQRCode(product.id)}>
                        <Download size={18} />
                        Download QR Code
                      </button>
                    </div>
                  </>
                )
              })()}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProductsInventory

