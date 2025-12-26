import React, { useState } from 'react'
import { Search, Filter, Package, AlertTriangle, Calendar, Hash, TrendingDown, Plus, Edit, Trash2, Download, Upload, X, Save, FileText, ScanLine, Link as LinkIcon } from 'lucide-react'
import { generateUniqueBarcode, generateQRCodeData, normalizeBarcode } from '../../../utils/barcodeGenerator'
import { QRCodeSVG } from 'qrcode.react'
import JsBarcode from 'jsbarcode'
import { posAPI } from '../../../utils/api'
import './Inventory.css'

const Inventory = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState('all')
  const [filterStock, setFilterStock] = useState('all')
  const [sortBy, setSortBy] = useState('name')
  const [sortOrder, setSortOrder] = useState('asc')
  const [showModal, setShowModal] = useState(false)
  const [showBarcodeModal, setShowBarcodeModal] = useState(null)
  const [editingItem, setEditingItem] = useState(null)
  const [csvFile, setCsvFile] = useState(null)
  const [showPOSLinkModal, setShowPOSLinkModal] = useState(false)
  const [showInventoLinkModal, setShowInventoLinkModal] = useState(false)
  const [posProducts, setPosProducts] = useState([])
  const [inventoItems, setInventoItems] = useState([])
  const [selectedPOSProducts, setSelectedPOSProducts] = useState([])
  const [selectedInventoItems, setSelectedInventoItems] = useState([])
  const [posLoading, setPosLoading] = useState(false)
  const [inventoLoading, setInventoLoading] = useState(false)

  // Inventory data - now stateful
  const [inventory, setInventory] = useState(() => {
    const saved = localStorage.getItem('accounts_plus_inventory')
    if (saved) {
      return JSON.parse(saved)
    }
    return [
      {
        id: 1,
        name: 'Product A',
        sku: 'PRD-A-001',
        category: 'Electronics',
        stock: 150,
        minStock: 100,
        maxStock: 500,
        unit: 'pcs',
        price: 2500,
        batchNumber: 'BATCH-2024-001',
        expiryDate: '2025-12-31',
        location: 'Warehouse A',
        barcode: '1234567890123',
        lowStock: false
      },
      {
        id: 2,
        name: 'Product B',
        sku: 'PRD-B-002',
        category: 'Electronics',
        stock: 45,
        minStock: 100,
        maxStock: 500,
        unit: 'pcs',
        price: 1800,
        batchNumber: 'BATCH-2024-002',
        expiryDate: '2025-06-30',
        location: 'Warehouse B',
        barcode: '1234567890124',
        lowStock: true
      },
      {
        id: 3,
        name: 'Product C',
        sku: 'PRD-C-003',
        category: 'Furniture',
        stock: 25,
        minStock: 50,
        maxStock: 200,
        unit: 'pcs',
        price: 8500,
        batchNumber: null,
        expiryDate: null,
        location: 'Warehouse A',
        barcode: '1234567890125',
        lowStock: true
      },
      {
        id: 4,
        name: 'Product D',
        sku: 'PRD-D-004',
        category: 'Electronics',
        stock: 300,
        minStock: 100,
        maxStock: 500,
        unit: 'pcs',
        price: 1200,
        batchNumber: 'BATCH-2024-003',
        expiryDate: '2026-03-15',
        location: 'Warehouse C',
        barcode: '1234567890126',
        lowStock: false
      },
      {
        id: 5,
        name: 'Product E',
        sku: 'PRD-E-005',
        category: 'Furniture',
        stock: 8,
        minStock: 20,
        maxStock: 100,
        unit: 'pcs',
        price: 15000,
        batchNumber: null,
        expiryDate: null,
        location: 'Warehouse B',
        barcode: '1234567890127',
        lowStock: true
      }
    ]
  })

  // Save to localStorage
  React.useEffect(() => {
    localStorage.setItem('accounts_plus_inventory', JSON.stringify(inventory))
  }, [inventory])

  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    category: '',
    stock: '',
    minStock: '',
    maxStock: '',
    unit: 'pcs',
    price: '',
    batchNumber: '',
    expiryDate: '',
    location: '',
    barcode: ''
  })

  const categories = ['all', ...new Set(inventory.map(item => item.category))]

  const filteredInventory = inventory
    .filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (item.barcode && item.barcode.includes(searchTerm))
      const matchesCategory = filterCategory === 'all' || item.category === filterCategory
      const matchesStock = filterStock === 'all' ||
                          (filterStock === 'low' && item.lowStock) ||
                          (filterStock === 'normal' && !item.lowStock)
      return matchesSearch && matchesCategory && matchesStock
    })
    .sort((a, b) => {
      let aVal = a[sortBy]
      let bVal = b[sortBy]
      
      if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase()
        bVal = bVal.toLowerCase()
      }
      
      if (sortOrder === 'asc') {
        return aVal > bVal ? 1 : -1
      } else {
        return aVal < bVal ? 1 : -1
      }
    })

  const lowStockCount = inventory.filter(item => item.lowStock).length

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(field)
      setSortOrder('asc')
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return '-'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
  }

  const isExpiringSoon = (expiryDate) => {
    if (!expiryDate) return false
    const expiry = new Date(expiryDate)
    const today = new Date()
    const daysUntilExpiry = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24))
    return daysUntilExpiry <= 90 && daysUntilExpiry > 0
  }

  const handleAddItem = () => {
    setEditingItem(null)
    setFormData({
      name: '',
      sku: '',
      category: '',
      stock: '',
      minStock: '',
      maxStock: '',
      unit: 'pcs',
      price: '',
      batchNumber: '',
      expiryDate: '',
      location: '',
      barcode: ''
    })
    setShowModal(true)
  }

  const handleEditItem = (item) => {
    setEditingItem(item)
    setFormData({
      name: item.name || '',
      sku: item.sku || '',
      category: item.category || '',
      stock: item.stock || '',
      minStock: item.minStock || '',
      maxStock: item.maxStock || '',
      unit: item.unit || 'pcs',
      price: item.price || '',
      batchNumber: item.batchNumber || '',
      expiryDate: item.expiryDate || '',
      location: item.location || '',
      barcode: item.barcode || ''
    })
    setShowModal(true)
  }

  const handleDeleteItem = (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      setInventory(inventory.filter(item => item.id !== id))
    }
  }

  const handleSaveItem = () => {
    if (!formData.name || !formData.price) {
      alert('Please fill in required fields (Name and Price)')
      return
    }

    // Auto-generate barcode if not provided (for manual additions)
    const existingBarcodes = inventory.map(item => item.barcode).filter(Boolean)
    let barcode = formData.barcode
    if (!barcode || barcode.trim() === '') {
      // Generate unique barcode for manual product addition
      barcode = generateUniqueBarcode(existingBarcodes)
    } else {
      // Normalize existing barcode to ensure it's 13 digits
      barcode = normalizeBarcode(barcode)
    }

    const stock = parseInt(formData.stock) || 0
    const minStock = parseInt(formData.minStock) || 0
    const maxStock = parseInt(formData.maxStock) || 0
    const lowStock = stock <= minStock

    const itemData = {
      name: formData.name,
      sku: formData.sku || `SKU-${Date.now()}`,
      category: formData.category || 'Uncategorized',
      stock: stock,
      minStock: minStock,
      maxStock: maxStock,
      unit: formData.unit,
      price: parseFloat(formData.price),
      batchNumber: formData.batchNumber || null,
      expiryDate: formData.expiryDate || null,
      location: formData.location || '',
      barcode: barcode,
      lowStock: lowStock
    }

    if (editingItem) {
      setInventory(inventory.map(item => 
        item.id === editingItem.id ? { ...item, ...itemData } : item
      ))
    } else {
      const newItem = {
        id: Date.now(),
        ...itemData
      }
      setInventory([...inventory, newItem])
    }

    setShowModal(false)
    setEditingItem(null)
  }

  const handleCSVImport = (event) => {
    const file = event.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const text = e.target.result
        
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
        
        const lines = text.split(/\r?\n/).filter(line => line.trim())
        
        if (lines.length < 2) {
          alert('CSV file must have at least a header row and one data row')
          return
        }

        const headers = parseCSVLine(lines[0]).map(h => h.trim().toLowerCase().replace(/"/g, ''))
        
        // Normalize header names for better matching
        const normalizeHeader = (header) => {
          const normalized = header.toLowerCase().replace(/[_\s]/g, '')
          
          if (normalized.includes('name') && !normalized.includes('file')) return 'name'
          if (normalized.includes('sku') || normalized.includes('productcode') || normalized.includes('itemcode')) return 'sku'
          if (normalized.includes('stock') || normalized.includes('quantity') || normalized.includes('qty')) return 'stock'
          if (normalized.includes('minstock') || normalized.includes('minimumstock') || normalized.includes('reorder')) return 'minStock'
          if (normalized.includes('maxstock') || normalized.includes('maximumstock')) return 'maxStock'
          if (normalized.includes('unit') || normalized.includes('uom')) return 'unit'
          if (normalized.includes('saleprice') || normalized.includes('sellingprice') || normalized.includes('sale_price')) return 'price'
          if (normalized.includes('rate') && !normalized.includes('deal')) return 'price'
          if (normalized.includes('price') && !normalized.includes('cost')) return 'price'
          if (normalized.includes('category') || normalized.includes('cate')) return 'category'
          if (normalized.includes('subcategory') || normalized.includes('sub_category')) return 'subCategory'
          if (normalized.includes('description') || normalized.includes('desc')) return 'description'
          if (normalized.includes('batchnumber') || normalized.includes('batch_number')) return 'batchNumber'
          if (normalized.includes('expirydate') || normalized.includes('expiry_date')) return 'expiryDate'
          if (normalized.includes('location') || normalized.includes('warehouse')) return 'location'
          if (normalized.includes('barcode') || normalized.includes('barcodes')) return 'barcode'
          
          // Ignore columns we don't need
          if (normalized.includes('keyword') || normalized.includes('text') || normalized.includes('bulkdeal') || 
              normalized.includes('warranty') || normalized.includes('image') || normalized.includes('length') ||
              normalized.includes('width') || normalized.includes('height') || normalized.includes('weight') ||
              normalized.includes('brand')) {
            return null
          }
          
          return normalized
        }
        
        const normalizedHeaders = headers.map(normalizeHeader)
        const existingBarcodes = inventory.map(item => item.barcode).filter(Boolean)
        const importedItems = []
        const errors = []

        for (let i = 1; i < lines.length; i++) {
          const values = parseCSVLine(lines[i]).map(v => v.replace(/^"|"$/g, '').trim())
          if (values.length === 0 || !values[0]) continue

          const item = {}
          normalizedHeaders.forEach((header, index) => {
            if (header === null) return // Skip ignored columns
            
            const value = values[index] || ''
            if (!value || value.trim() === '') return
            
            switch(header) {
              case 'name':
                item.name = value
                break
              case 'sku':
                item.sku = value
                break
              case 'category':
                item.category = value
                break
              case 'subCategory':
                if (item.category && value) {
                  item.category = `${item.category} > ${value}`
                }
                break
              case 'stock':
                item.stock = parseInt(value) || 0
                break
              case 'minStock':
                item.minStock = parseInt(value) || 0
                break
              case 'maxStock':
                item.maxStock = parseInt(value) || 0
                break
              case 'unit':
                item.unit = value.toUpperCase() || 'PCS'
                break
              case 'price':
                const price = parseFloat(value.replace(/[₹,]/g, ''))
                if (price > 0) {
                  item.price = price
                }
                break
              case 'batchNumber':
                item.batchNumber = value || null
                break
              case 'expiryDate':
                item.expiryDate = value || null
                break
              case 'location':
                item.location = value
                break
              case 'barcode':
                // Extract numeric barcode from visual barcode
                const barcodeDigits = value.replace(/\D/g, '')
                if (barcodeDigits.length > 0) {
                  item.barcode = normalizeBarcode(barcodeDigits)
                }
                break
            }
          })

          if (item.name) {
            // Use rate as price if sale_price not found
            if (!item.price || item.price <= 0) {
              errors.push(`Row ${i + 1}: Missing price (need sale_price or rate)`)
              continue
            }
            
            // Generate barcode if not provided
            if (!item.barcode) {
              item.barcode = generateUniqueBarcode([...existingBarcodes, ...importedItems.map(i => i.barcode).filter(Boolean)])
            }
            item.sku = item.sku || `SKU-${Date.now()}-${i}`
            item.category = item.category || 'Uncategorized'
            item.stock = item.stock || 0
            item.minStock = item.minStock || 0
            item.maxStock = item.maxStock || 1000
            item.unit = item.unit || 'PCS'
            item.lowStock = (item.stock || 0) <= (item.minStock || 0)
            importedItems.push(item)
          }
        }

        if (importedItems.length > 0) {
          const newItems = importedItems.map(item => ({
            id: Date.now() + Math.random(),
            ...item
          }))
          setInventory([...inventory, ...newItems])
          const successMsg = `Successfully imported ${importedItems.length} item(s)!`
          const errorMsg = errors.length > 0 ? `\n\nErrors:\n${errors.slice(0, 5).join('\n')}${errors.length > 5 ? `\n... and ${errors.length - 5} more` : ''}` : ''
          alert(successMsg + errorMsg)
        } else {
          alert('No valid items found in CSV file. Please check the format.\n\nRequired: name and price (sale_price or rate)')
        }
      } catch (error) {
        console.error('CSV import error:', error)
        alert(`Error importing CSV: ${error.message}`)
      }
    }
    
    reader.onerror = () => {
      alert('Error reading file. Please try again.')
    }
    
    reader.readAsText(file)
    event.target.value = ''
  }

  const handleExportCSV = () => {
    const headers = ['Name', 'SKU', 'Category', 'Stock', 'Min Stock', 'Max Stock', 'Unit', 'Price', 'Batch Number', 'Expiry Date', 'Location', 'Barcode']
    const rows = inventory.map(item => [
      item.name,
      item.sku || '',
      item.category || '',
      item.stock || 0,
      item.minStock || 0,
      item.maxStock || 0,
      item.unit || 'pcs',
      item.price || 0,
      item.batchNumber || '',
      item.expiryDate || '',
      item.location || '',
      item.barcode || ''
    ])

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
    a.download = `inventory_${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const barcodeCanvasRef = React.useRef(null)

  React.useEffect(() => {
    if (showBarcodeModal && barcodeCanvasRef.current) {
      const item = inventory.find(i => i.id === showBarcodeModal)
      if (item && item.barcode) {
        try {
          JsBarcode(barcodeCanvasRef.current, item.barcode, {
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
  }, [showBarcodeModal, inventory])

  return (
    <div className="inventory-page">
      <div className="inventory-header">
        <div className="header-left">
          <h2>Inventory Management</h2>
          <div className="inventory-stats">
            <div className="stat-badge">
              <Package size={16} />
              <span>Total Items: {inventory.length}</span>
            </div>
            {lowStockCount > 0 && (
              <div className="stat-badge warning">
                <AlertTriangle size={16} />
                <span>Low Stock: {lowStockCount}</span>
              </div>
            )}
          </div>
        </div>
        <div className="header-actions">
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <button 
              className="btn-secondary" 
              onClick={async () => {
                setPosLoading(true)
                try {
                  const products = await posAPI.getProducts()
                  setPosProducts(products || [])
                  setShowPOSLinkModal(true)
                } catch (error) {
                  console.warn('Error loading POS products:', error)
                  alert('Could not load POS products. Make sure POS module has products.')
                } finally {
                  setPosLoading(false)
                }
              }}
              title="Link products from BillEase POS"
            >
              <LinkIcon size={18} />
              Link from POS
            </button>
            <button 
              className="btn-secondary" 
              onClick={async () => {
                setInventoLoading(true)
                try {
                  const { inventoAPI } = await import('../../../utils/api')
                  const items = await inventoAPI.getItems()
                  setInventoItems(items || [])
                  setShowInventoLinkModal(true)
                } catch (error) {
                  console.warn('Error loading Invento items:', error)
                  alert('Could not load Invento items. Make sure Invento module has items.')
                } finally {
                  setInventoLoading(false)
                }
              }}
              title="Link items from Invento"
            >
              <LinkIcon size={18} />
              Link from Invento
            </button>
          </div>
          <label className="btn-secondary" style={{ cursor: 'pointer' }}>
            <Upload size={18} />
            Import
            <input
              type="file"
              accept=".csv"
              onChange={handleCSVImport}
              style={{ display: 'none' }}
            />
          </label>
          <button className="btn-secondary" onClick={handleExportCSV}>
            <Download size={18} />
            Export
          </button>
          <button className="btn-primary" onClick={handleAddItem}>
            <Plus size={18} />
            Add Item
          </button>
        </div>
      </div>

      <div className="inventory-filters">
        <div className="filter-group">
          <div className="search-box">
            <Search size={18} />
            <input
              type="text"
              placeholder="Search by name, SKU, or barcode..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="filter-group">
          <Filter size={18} />
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>
                {cat === 'all' ? 'All Categories' : cat}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <select
            value={filterStock}
            onChange={(e) => setFilterStock(e.target.value)}
          >
            <option value="all">All Stock Levels</option>
            <option value="low">Low Stock Only</option>
            <option value="normal">Normal Stock</option>
          </select>
        </div>
      </div>

      <div className="inventory-table-container">
        <table className="inventory-table">
          <thead>
            <tr>
              <th onClick={() => handleSort('name')} className="sortable">
                Item Name
                {sortBy === 'name' && (sortOrder === 'asc' ? ' ↑' : ' ↓')}
              </th>
              <th onClick={() => handleSort('sku')} className="sortable">
                SKU
                {sortBy === 'sku' && (sortOrder === 'asc' ? ' ↑' : ' ↓')}
              </th>
              <th onClick={() => handleSort('category')} className="sortable">
                Category
                {sortBy === 'category' && (sortOrder === 'asc' ? ' ↑' : ' ↓')}
              </th>
              <th onClick={() => handleSort('stock')} className="sortable">
                Stock
                {sortBy === 'stock' && (sortOrder === 'asc' ? ' ↑' : ' ↓')}
              </th>
              <th>Batch/Expiry</th>
              <th onClick={() => handleSort('location')} className="sortable">
                Location
                {sortBy === 'location' && (sortOrder === 'asc' ? ' ↑' : ' ↓')}
              </th>
              <th onClick={() => handleSort('price')} className="sortable">
                Price
                {sortBy === 'price' && (sortOrder === 'asc' ? ' ↑' : ' ↓')}
              </th>
              <th>Barcode</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredInventory.length === 0 ? (
              <tr>
                <td colSpan="9" className="empty-state">
                  No items found matching your filters.
                </td>
              </tr>
            ) : (
              filteredInventory.map(item => (
                <tr key={item.id} className={item.lowStock ? 'low-stock-row' : ''}>
                  <td>
                    <div className="item-name-cell">
                      <Package size={16} />
                      <span>{item.name}</span>
                      {item.lowStock && (
                        <span className="low-stock-badge">
                          <AlertTriangle size={12} />
                          Low Stock
                        </span>
                      )}
                    </div>
                  </td>
                  <td>
                    <code className="sku-code">{item.sku}</code>
                  </td>
                  <td>{item.category}</td>
                  <td>
                    <div className="stock-cell">
                      <span className={item.lowStock ? 'stock-low' : 'stock-normal'}>
                        {item.stock} {item.unit}
                      </span>
                      <div className="stock-bar">
                        <div
                          className={`stock-fill ${item.lowStock ? 'fill-low' : 'fill-normal'}`}
                          style={{
                            width: `${Math.min((item.stock / item.maxStock) * 100, 100)}%`
                          }}
                        />
                      </div>
                      <span className="stock-range">
                        Min: {item.minStock} | Max: {item.maxStock}
                      </span>
                    </div>
                  </td>
                  <td>
                    <div className="batch-expiry-cell">
                      {item.batchNumber && (
                        <div className="batch-info">
                          <Hash size={14} />
                          <span>{item.batchNumber}</span>
                        </div>
                      )}
                      {item.expiryDate && (
                        <div className={`expiry-info ${isExpiringSoon(item.expiryDate) ? 'expiring-soon' : ''}`}>
                          <Calendar size={14} />
                          <span>{formatDate(item.expiryDate)}</span>
                          {isExpiringSoon(item.expiryDate) && (
                            <AlertTriangle size={12} className="expiry-warning" />
                          )}
                        </div>
                      )}
                      {!item.batchNumber && !item.expiryDate && (
                        <span className="no-batch-expiry">-</span>
                      )}
                    </div>
                  </td>
                  <td>{item.location}</td>
                  <td>₹{item.price.toLocaleString()}</td>
                  <td>
                    {item.barcode ? (
                      <span style={{ fontSize: '0.75rem', fontFamily: 'monospace' }}>
                        {item.barcode}
                      </span>
                    ) : (
                      <span style={{ color: '#9ca3af' }}>-</span>
                    )}
                  </td>
                  <td>
                    <div className="action-buttons">
                      {item.barcode && (
                        <button 
                          className="icon-btn" 
                          title="View Barcode/QR Code"
                          onClick={() => setShowBarcodeModal(item.id)}
                        >
                          <ScanLine size={16} />
                        </button>
                      )}
                      <button 
                        className="icon-btn" 
                        title="Edit"
                        onClick={() => handleEditItem(item)}
                      >
                        <Edit size={16} />
                      </button>
                      <button 
                        className="icon-btn danger" 
                        title="Delete"
                        onClick={() => handleDeleteItem(item.id)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div className="modal-header">
              <h3>{editingItem ? 'Edit Item' : 'Add New Item'}</h3>
              <button className="close-btn" onClick={() => setShowModal(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Item Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Enter item name"
                  required
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>SKU</label>
                  <input
                    type="text"
                    value={formData.sku}
                    onChange={(e) => setFormData({...formData, sku: e.target.value})}
                    placeholder="Auto-generated if empty"
                  />
                </div>
                <div className="form-group">
                  <label>Category</label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    placeholder="e.g., Electronics"
                    list="categories"
                  />
                  <datalist id="categories">
                    {categories.filter(c => c !== 'all').map(cat => <option key={cat} value={cat} />)}
                  </datalist>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Stock Quantity</label>
                  <input
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({...formData, stock: e.target.value})}
                    min="0"
                    placeholder="0"
                  />
                </div>
                <div className="form-group">
                  <label>Unit</label>
                  <select
                    value={formData.unit}
                    onChange={(e) => setFormData({...formData, unit: e.target.value})}
                  >
                    <option value="pcs">Pieces</option>
                    <option value="kg">Kilograms</option>
                    <option value="g">Grams</option>
                    <option value="l">Liters</option>
                    <option value="ml">Milliliters</option>
                    <option value="m">Meters</option>
                    <option value="cm">Centimeters</option>
                    <option value="box">Box</option>
                    <option value="pack">Pack</option>
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Min Stock</label>
                  <input
                    type="number"
                    value={formData.minStock}
                    onChange={(e) => setFormData({...formData, minStock: e.target.value})}
                    min="0"
                    placeholder="0"
                  />
                </div>
                <div className="form-group">
                  <label>Max Stock</label>
                  <input
                    type="number"
                    value={formData.maxStock}
                    onChange={(e) => setFormData({...formData, maxStock: e.target.value})}
                    min="0"
                    placeholder="0"
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Price (₹) *</label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Location</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    placeholder="Warehouse name"
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Batch Number</label>
                  <input
                    type="text"
                    value={formData.batchNumber}
                    onChange={(e) => setFormData({...formData, batchNumber: e.target.value})}
                    placeholder="Optional"
                  />
                </div>
                <div className="form-group">
                  <label>Expiry Date</label>
                  <input
                    type="date"
                    value={formData.expiryDate}
                    onChange={(e) => setFormData({...formData, expiryDate: e.target.value})}
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Barcode</label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input
                    type="text"
                    value={formData.barcode}
                    onChange={(e) => setFormData({...formData, barcode: e.target.value})}
                    placeholder="Auto-generated if empty"
                    maxLength="13"
                    style={{ flex: 1 }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const existingBarcodes = inventory.map(item => item.barcode).filter(Boolean)
                      const newBarcode = generateUniqueBarcode(existingBarcodes)
                      setFormData({...formData, barcode: newBarcode})
                    }}
                    style={{
                      padding: '0.5rem 1rem',
                      background: '#3b82f6',
                      color: 'white',
                      border: 'none',
                      borderRadius: '0.375rem',
                      cursor: 'pointer',
                      fontSize: '0.875rem'
                    }}
                  >
                    Generate
                  </button>
                </div>
                <small style={{ color: '#6b7280', fontSize: '0.75rem', marginTop: '0.25rem', display: 'block' }}>
                  Leave empty to auto-generate a unique 13-digit barcode
                </small>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setShowModal(false)}>
                Cancel
              </button>
              <button className="btn-primary" onClick={handleSaveItem}>
                <Save size={18} />
                {editingItem ? 'Update' : 'Add'} Item
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Barcode/QR Code Modal */}
      {showBarcodeModal && (
        <div className="modal-overlay" onClick={() => setShowBarcodeModal(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '500px' }}>
            <div className="modal-header">
              <h3>Barcode & QR Code</h3>
              <button className="close-btn" onClick={() => setShowBarcodeModal(null)}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              {(() => {
                const item = inventory.find(i => i.id === showBarcodeModal)
                if (!item) return null
                return (
                  <>
                    <div style={{ marginBottom: '1rem', padding: '1rem', background: '#f3f4f6', borderRadius: '0.5rem' }}>
                      <h4>{item.name}</h4>
                      <p>SKU: {item.sku || 'N/A'} | Price: ₹{item.price.toFixed(2)}</p>
                    </div>
                    {item.barcode && (
                      <div style={{ marginBottom: '1.5rem' }}>
                        <h4>Barcode</h4>
                        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '0.5rem' }}>
                          <canvas ref={barcodeCanvasRef}></canvas>
                        </div>
                        <p style={{ textAlign: 'center', marginTop: '0.5rem', fontFamily: 'monospace', fontSize: '0.875rem' }}>
                          {item.barcode}
                        </p>
                      </div>
                    )}
                    <div>
                      <h4>QR Code</h4>
                      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '0.5rem' }}>
                        <QRCodeSVG
                          value={generateQRCodeData(item)}
                          size={200}
                        />
                      </div>
                    </div>
                  </>
                )
              })()}
            </div>
          </div>
        </div>
      )}

      {/* Link from POS Modal */}
      {showPOSLinkModal && (
        <div className="modal-overlay" onClick={() => setShowPOSLinkModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '700px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div className="modal-header">
              <h3>Link Products from BillEase POS</h3>
              <button className="close-btn" onClick={() => setShowPOSLinkModal(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              {posLoading ? (
                <div style={{ textAlign: 'center', padding: '2rem' }}>
                  <div className="spinner" style={{ margin: '0 auto', width: '40px', height: '40px', border: '4px solid #f3f3f3', borderTop: '4px solid #3b82f6', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                  <p>Loading POS products...</p>
                </div>
              ) : posProducts.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2rem' }}>
                  <Package size={48} style={{ opacity: 0.5, marginBottom: '1rem' }} />
                  <p>No products found in BillEase POS</p>
                </div>
              ) : (
                <>
                  <div style={{ marginBottom: '1rem', padding: '0.75rem', background: '#f3f4f6', borderRadius: '0.5rem' }}>
                    <p style={{ margin: 0, fontSize: '0.875rem' }}>
                      Select products to link to Accounts+ Inventory. {selectedPOSProducts.length > 0 && (
                        <strong>{selectedPOSProducts.length} product(s) selected</strong>
                      )}
                    </p>
                  </div>
                  <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                    {posProducts.map(product => {
                      const isSelected = selectedPOSProducts.some(p => p.id === product.id)
                      return (
                        <div 
                          key={product.id} 
                          onClick={() => {
                            if (isSelected) {
                              setSelectedPOSProducts(prev => prev.filter(p => p.id !== product.id))
                            } else {
                              setSelectedPOSProducts(prev => [...prev, product])
                            }
                          }}
                          style={{
                            padding: '1rem',
                            border: `2px solid ${isSelected ? '#3b82f6' : '#e5e7eb'}`,
                            borderRadius: '0.5rem',
                            marginBottom: '0.5rem',
                            cursor: 'pointer',
                            background: isSelected ? '#eff6ff' : 'white',
                            transition: 'all 0.2s'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => {}}
                              style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                            />
                            <div style={{ flex: 1 }}>
                              <h4 style={{ margin: 0, marginBottom: '0.25rem' }}>{product.name}</h4>
                              <div style={{ display: 'flex', gap: '1rem', fontSize: '0.875rem', color: '#6b7280' }}>
                                {product.sku && <span>SKU: {product.sku}</span>}
                                {product.category && <span>Category: {product.category}</span>}
                                <span>Price: ₹{product.price || 0}</span>
                                <span>Stock: {product.stock || 0}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </>
              )}
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => {
                setShowPOSLinkModal(false)
                setSelectedPOSProducts([])
              }}>
                Cancel
              </button>
              <button 
                className="btn-primary" 
                onClick={() => {
                  if (selectedPOSProducts.length === 0) {
                    alert('Please select at least one product to link')
                    return
                  }
                  
                  const existingBarcodes = inventory.map(item => item.barcode).filter(Boolean)
                  let success = 0
                  let failed = 0
                  
                  selectedPOSProducts.forEach(posProduct => {
                    try {
                      // Check if product already exists (by name or SKU)
                      const exists = inventory.some(item => 
                        item.name === posProduct.name || 
                        (posProduct.sku && item.sku === posProduct.sku)
                      )
                      
                      if (exists) {
                        failed++
                        return
                      }
                      
                      // Generate barcode if not provided
                      let barcode = posProduct.barcode
                      if (!barcode) {
                        barcode = generateUniqueBarcode(existingBarcodes)
                        existingBarcodes.push(barcode)
                      } else {
                        barcode = normalizeBarcode(barcode)
                      }
                      
                      const newItem = {
                        id: Date.now() + Math.random(),
                        name: posProduct.name || '',
                        sku: posProduct.sku || `SKU-${Date.now()}`,
                        category: posProduct.category || 'Uncategorized',
                        stock: posProduct.stock || 0,
                        minStock: 0,
                        maxStock: 1000,
                        unit: 'pcs',
                        price: posProduct.price || 0,
                        batchNumber: null,
                        expiryDate: null,
                        location: '',
                        barcode: barcode,
                        lowStock: (posProduct.stock || 0) <= 0
                      }
                      
                      setInventory(prev => [...prev, newItem])
                      success++
                    } catch (err) {
                      failed++
                    }
                  })
                  
                  setShowPOSLinkModal(false)
                  setSelectedPOSProducts([])
                  alert(`Linked ${success} product(s) successfully! ${failed > 0 ? `Failed: ${failed} (may already exist)` : ''}`)
                }}
                disabled={selectedPOSProducts.length === 0 || posLoading}
              >
                <LinkIcon size={18} />
                Link Selected ({selectedPOSProducts.length})
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Link from Invento Modal */}
      {showInventoLinkModal && (
        <div className="modal-overlay" onClick={() => setShowInventoLinkModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '700px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div className="modal-header">
              <h3>Link Items from Invento</h3>
              <button className="close-btn" onClick={() => setShowInventoLinkModal(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              {inventoLoading ? (
                <div style={{ textAlign: 'center', padding: '2rem' }}>
                  <div className="spinner" style={{ margin: '0 auto', width: '40px', height: '40px', border: '4px solid #f3f3f3', borderTop: '4px solid #3b82f6', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                  <p>Loading Invento items...</p>
                </div>
              ) : inventoItems.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2rem' }}>
                  <Package size={48} style={{ opacity: 0.5, marginBottom: '1rem' }} />
                  <p>No items found in Invento</p>
                </div>
              ) : (
                <>
                  <div style={{ marginBottom: '1rem', padding: '0.75rem', background: '#f3f4f6', borderRadius: '0.5rem' }}>
                    <p style={{ margin: 0, fontSize: '0.875rem' }}>
                      Select items to link to Accounts+ Inventory. {selectedInventoItems.length > 0 && (
                        <strong>{selectedInventoItems.length} item(s) selected</strong>
                      )}
                    </p>
                  </div>
                  <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                    {inventoItems.map(item => {
                      const isSelected = selectedInventoItems.some(i => i.id === item.id)
                      return (
                        <div 
                          key={item.id} 
                          onClick={() => {
                            if (isSelected) {
                              setSelectedInventoItems(prev => prev.filter(i => i.id !== item.id))
                            } else {
                              setSelectedInventoItems(prev => [...prev, item])
                            }
                          }}
                          style={{
                            padding: '1rem',
                            border: `2px solid ${isSelected ? '#3b82f6' : '#e5e7eb'}`,
                            borderRadius: '0.5rem',
                            marginBottom: '0.5rem',
                            cursor: 'pointer',
                            background: isSelected ? '#eff6ff' : 'white',
                            transition: 'all 0.2s'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => {}}
                              style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                            />
                            <div style={{ flex: 1 }}>
                              <h4 style={{ margin: 0, marginBottom: '0.25rem' }}>{item.name}</h4>
                              <div style={{ display: 'flex', gap: '1rem', fontSize: '0.875rem', color: '#6b7280' }}>
                                {item.sku && <span>SKU: {item.sku}</span>}
                                {item.category && <span>Category: {item.category}</span>}
                                <span>Cost: ₹{item.cost || 0}</span>
                                <span>Stock: {item.quantity || 0} {item.unit || 'pcs'}</span>
                                {item.location && <span>Location: {item.location}</span>}
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </>
              )}
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => {
                setShowInventoLinkModal(false)
                setSelectedInventoItems([])
              }}>
                Cancel
              </button>
              <button 
                className="btn-primary" 
                onClick={() => {
                  if (selectedInventoItems.length === 0) {
                    alert('Please select at least one item to link')
                    return
                  }
                  
                  const existingBarcodes = inventory.map(item => item.barcode).filter(Boolean)
                  let success = 0
                  let failed = 0
                  
                  selectedInventoItems.forEach(inventoItem => {
                    try {
                      // Check if item already exists (by name or SKU)
                      const exists = inventory.some(item => 
                        item.name === inventoItem.name || 
                        (inventoItem.sku && item.sku === inventoItem.sku)
                      )
                      
                      if (exists) {
                        failed++
                        return
                      }
                      
                      // Generate barcode if not provided
                      let barcode = inventoItem.barcode
                      if (!barcode) {
                        barcode = generateUniqueBarcode(existingBarcodes)
                        existingBarcodes.push(barcode)
                      } else {
                        barcode = normalizeBarcode(barcode)
                      }
                      
                      const newItem = {
                        id: Date.now() + Math.random(),
                        name: inventoItem.name || '',
                        sku: inventoItem.sku || `SKU-${Date.now()}`,
                        category: inventoItem.category || 'Uncategorized',
                        stock: inventoItem.quantity || 0,
                        minStock: inventoItem.min_stock || inventoItem.minStock || 0,
                        maxStock: 1000,
                        unit: inventoItem.unit || 'pcs',
                        price: inventoItem.cost || 0,
                        batchNumber: null,
                        expiryDate: null,
                        location: inventoItem.location || '',
                        barcode: barcode,
                        lowStock: (inventoItem.quantity || 0) <= (inventoItem.min_stock || inventoItem.minStock || 0)
                      }
                      
                      setInventory(prev => [...prev, newItem])
                      success++
                    } catch (err) {
                      failed++
                    }
                  })
                  
                  setShowInventoLinkModal(false)
                  setSelectedInventoItems([])
                  alert(`Linked ${success} item(s) successfully! ${failed > 0 ? `Failed: ${failed} (may already exist)` : ''}`)
                }}
                disabled={selectedInventoItems.length === 0 || inventoLoading}
              >
                <LinkIcon size={18} />
                Link Selected ({selectedInventoItems.length})
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Inventory
