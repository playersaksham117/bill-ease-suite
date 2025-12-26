import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom'
import { 
  Plus, 
  Package, 
  ArrowDown, 
  ArrowUp, 
  Search, 
  Edit, 
  Trash2, 
  Warehouse, 
  ClipboardList, 
  AlertCircle, 
  Download, 
  X,
  CheckCircle,
  TrendingUp,
  BarChart3,
  MapPin,
  Building2,
  Calendar,
  FileText,
  Upload,
  Link as LinkIcon,
  FileSpreadsheet,
  Printer,
  CheckSquare,
  Square
} from 'lucide-react'
import { inventoAPI, posAPI } from '../../utils/api'
import { generateUniqueBarcode, generateQRCodeData, normalizeBarcode } from '../../utils/barcodeGenerator'
import JsBarcode from 'jsbarcode'
import { printLabels, saveLabelsPDF } from '../../utils/labelPrinter'
import './Invento.css'

const Invento = () => {
  const location = useLocation()
  const navigate = useNavigate()

  // State management
  const [inventory, setInventory] = useState([])
  const [warehouses, setWarehouses] = useState([])
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  
  // Modal states
  const [showModal, setShowModal] = useState(false)
  const [showWarehouseModal, setShowWarehouseModal] = useState(false)
  const [showBulkImportModal, setShowBulkImportModal] = useState(false)
  const [showPOSLinkModal, setShowPOSLinkModal] = useState(false)
  const [modalType, setModalType] = useState('add') // 'add', 'edit', 'in', 'out'
  const [selectedItem, setSelectedItem] = useState(null)
  const [selectedWarehouse, setSelectedWarehouse] = useState(null)
  
  // Bulk import and POS link states
  const [csvFile, setCsvFile] = useState(null)
  const [importProgress, setImportProgress] = useState({ total: 0, success: 0, failed: 0 })
  const [posProducts, setPosProducts] = useState([])
  const [posLoading, setPosLoading] = useState(false)
  const [selectedPosProducts, setSelectedPosProducts] = useState([])
  const [showAddDropdown, setShowAddDropdown] = useState(false)
  const [selectedItems, setSelectedItems] = useState([])
  const barcodeRefs = useRef({})
  
  // Form states - using refs to persist data across renders
  const formDataRef = useRef({ 
    name: '', 
    sku: '', 
    quantity: '', 
    unit: 'pcs', 
    location: '', 
    minStock: '', 
    cost: '',
    category: '',
    description: '',
    hsn_code: '',
    barcode: ''
  })
  const [formData, setFormData] = useState(formDataRef.current)
  
  const warehouseFormRef = useRef({
    name: '', 
    address: '', 
    city: '', 
    state: '',
    pincode: '',
    capacity: '',
    manager: '',
    phone: ''
  })
  const [warehouseForm, setWarehouseForm] = useState(warehouseFormRef.current)
  
  const transactionFormRef = useRef({
    quantity: '',
    date: new Date().toISOString().split('T')[0],
    notes: '',
    reference: ''
  })
  const [transactionForm, setTransactionForm] = useState(transactionFormRef.current)
  
  // Track if modal is opening to prevent resets during transition
  const isModalOpeningRef = useRef(false)
  
  // Input refs for direct DOM access - PERMANENT SOLUTION
  const inputRefs = useRef({})
  const getInputRef = (name) => {
    if (!inputRefs.current[name]) {
      inputRefs.current[name] = React.createRef()
    }
    return inputRefs.current[name]
  }

  // Load data from API
  const loadData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      const results = await Promise.allSettled([
        inventoAPI.getItems(),
        inventoAPI.getWarehouses(),
        inventoAPI.getTransactions()
      ])
      
      const inventoryData = results[0].status === 'fulfilled' ? results[0].value : []
      const warehousesData = results[1].status === 'fulfilled' ? results[1].value : []
      const transactionsData = results[2].status === 'fulfilled' ? results[2].value : []
      
      setInventory(inventoryData || [])
      setWarehouses(warehousesData || [])
      setTransactions(transactionsData || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showAddDropdown && !event.target.closest('.add-item-dropdown')) {
        setShowAddDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [showAddDropdown])

  // Filtered inventory
  const filteredInventory = inventory.filter(item =>
    (item.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.sku || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.location || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.category || '').toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Low stock items
  const lowStockItems = inventory.filter(item => 
    (item.quantity || 0) <= (item.min_stock || item.minStock || 0)
  )

  // Stock status
  const getStockStatus = (quantity, minStock) => {
    if (quantity <= minStock) return 'low'
    if (quantity <= minStock * 2) return 'medium'
    return 'good'
  }

  // Reset form function - PERMANENT: Reset refs AND DOM inputs directly
  const resetItemForm = useCallback(() => {
    const emptyForm = { 
      name: '', 
      sku: '', 
      quantity: '', 
      unit: 'pcs', 
      location: '', 
      minStock: '', 
      cost: '',
      category: '',
      description: '',
      hsn_code: '',
      barcode: ''
    }
    formDataRef.current = emptyForm
    setFormData(emptyForm)
    
    // Reset all input DOM values directly
    Object.keys(emptyForm).forEach(key => {
      const inputRef = inputRefs.current[`form-${key}`]
      if (inputRef && inputRef.current) {
        inputRef.current.value = emptyForm[key] || ''
      }
    })
  }, [])

  // Item management - PERMANENT: Always read from refs, never from state
  const handleAddItem = useCallback(async (e) => {
    e.preventDefault()
    e.stopPropagation()
    
    // CRITICAL: Read from ref, not state (ref always has latest value)
    const currentFormData = formDataRef.current
    
    // Validate required fields
    if (!currentFormData.name || currentFormData.name.trim() === '') {
      alert('Item name is required')
      return
    }
    
    try {
      // Auto-generate barcode if not provided (for manual additions)
      const existingBarcodes = inventory.map(item => item.barcode).filter(Boolean)
      let barcode = currentFormData.barcode
      if (!barcode || barcode.trim() === '') {
        // Generate unique barcode for manual product addition
        barcode = generateUniqueBarcode(existingBarcodes)
      } else {
        // Normalize existing barcode to ensure it's 13 digits
        barcode = normalizeBarcode(barcode)
      }

      const newItem = {
        name: currentFormData.name.trim(),
        sku: (currentFormData.sku || '').trim(),
        quantity: parseInt(currentFormData.quantity) || 0,
        unit: currentFormData.unit || 'pcs',
        location: (currentFormData.location || '').trim(),
        min_stock: parseInt(currentFormData.minStock) || 0,
        cost: parseFloat(currentFormData.cost) || 0,
        category: (currentFormData.category || '').trim(),
        description: (currentFormData.description || '').trim(),
        hsn_code: (currentFormData.hsn_code || '').trim(),
        barcode: barcode
      }
      const result = await inventoAPI.createItem(newItem)
      if (result) {
        await loadData()
      } else {
        const tempItem = { ...newItem, id: Date.now() }
        setInventory(prev => [...prev, tempItem])
      }
      // Reset and close after successful add
      resetItemForm()
      setShowModal(false)
      setSelectedItem(null)
      setModalType('add')
    } catch (err) {
      console.warn('Error adding item:', err.message)
      // Don't close modal on error so user can fix and retry
    }
  }, [inventory, loadData, resetItemForm])

  const handleEditItem = useCallback((item) => {
    const editFormData = {
      name: item.name || '',
      sku: item.sku || '',
      quantity: item.quantity || '',
      unit: item.unit || 'pcs',
      location: item.location || '',
      minStock: item.min_stock || item.minStock || '',
      cost: item.cost || '',
      category: item.category || '',
      description: item.description || '',
      hsn_code: item.hsn_code || '',
      barcode: item.barcode || ''
    }
    
    // Update ref first (persists immediately)
    formDataRef.current = editFormData
    // Update state for display
    setFormData(editFormData)
    setSelectedItem(item)
    setModalType('edit')
    
    // Update input values directly via refs after modal opens
    setTimeout(() => {
      Object.keys(editFormData).forEach(key => {
        const inputRef = inputRefs.current[`form-${key}`]
        if (inputRef && inputRef.current) {
          inputRef.current.value = editFormData[key] || ''
        }
      })
    }, 50)
    
    setShowModal(true)
  }, [])

  const handleUpdateItem = useCallback(async (e) => {
    e.preventDefault()
    e.stopPropagation()
    
    // CRITICAL: Read from ref, not state
    const currentFormData = formDataRef.current
    
    if (!currentFormData.name || currentFormData.name.trim() === '') {
      alert('Item name is required')
      return
    }
    
    if (!selectedItem || !selectedItem.id) {
      alert('Invalid item selected')
      return
    }
    
    try {
      // Normalize barcode if provided, otherwise keep existing
      let barcode = currentFormData.barcode
      if (barcode && barcode.trim() !== '') {
        barcode = normalizeBarcode(barcode)
      } else if (selectedItem.barcode) {
        barcode = selectedItem.barcode
      } else {
        // Generate new barcode if none exists
        const existingBarcodes = inventory.map(item => item.barcode).filter(Boolean)
        barcode = generateUniqueBarcode(existingBarcodes)
      }

      const updatedItem = {
        name: currentFormData.name.trim(),
        sku: (currentFormData.sku || '').trim(),
        quantity: parseInt(currentFormData.quantity) || 0,
        unit: currentFormData.unit || 'pcs',
        location: (currentFormData.location || '').trim(),
        min_stock: parseInt(currentFormData.minStock) || 0,
        cost: parseFloat(currentFormData.cost) || 0,
        category: (currentFormData.category || '').trim(),
        description: (currentFormData.description || '').trim(),
        hsn_code: (currentFormData.hsn_code || '').trim(),
        barcode: barcode
      }
      const result = await inventoAPI.updateItem(selectedItem.id, updatedItem)
      if (result) {
        await loadData()
      } else {
        setInventory(prev => prev.map(item => 
          item.id === selectedItem.id ? { ...item, ...updatedItem } : item
        ))
      }
      // Reset and close after successful update
      resetItemForm()
      setSelectedItem(null)
      setModalType('add')
      setShowModal(false)
    } catch (err) {
      console.warn('Error updating item:', err.message)
      // Don't close modal on error so user can fix and retry
    }
  }, [selectedItem, inventory, loadData, resetItemForm])

  const handleDeleteItem = useCallback(async (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        const result = await inventoAPI.deleteItem(id)
        if (result !== false) {
          await loadData()
        } else {
          setInventory(prev => prev.filter(item => item.id !== id))
        }
      } catch (err) {
        console.warn('Error deleting item:', err.message)
        setInventory(prev => prev.filter(item => item.id !== id))
      }
    }
  }, [loadData])

  // PERMANENT SOLUTION: Direct ref updates - NO STATE UPDATES that could cause resets
  const handleFormDataChange = useCallback((field, value) => {
    // CRITICAL: Update ref immediately (persists across ALL renders, never resets)
    formDataRef.current[field] = value
    // Update DOM input directly if ref exists (prevents any React re-render issues)
    const inputRef = inputRefs.current[`form-${field}`]
    if (inputRef && inputRef.current && inputRef.current.value !== value) {
      inputRef.current.value = value
    }
    // NEVER update state during typing - state is only for initial display
  }, [])

  const handleWarehouseFormChange = useCallback((field, value) => {
    warehouseFormRef.current[field] = value
    const inputRef = inputRefs.current[`warehouse-${field}`]
    if (inputRef && inputRef.current) {
      inputRef.current.value = value
    }
  }, [])

  const handleTransactionFormChange = useCallback((field, value) => {
    transactionFormRef.current[field] = value
    const inputRef = inputRefs.current[`transaction-${field}`]
    if (inputRef && inputRef.current) {
      inputRef.current.value = value
    }
  }, [])

  // PERMANENT: Stable modal handlers - only reset on explicit close
  const handleCloseModal = useCallback(() => {
    // Only reset if NOT opening (prevent reset during opening transition)
    if (!isModalOpeningRef.current) {
      resetItemForm()
      const emptyTransaction = { quantity: '', date: new Date().toISOString().split('T')[0], notes: '', reference: '' }
      transactionFormRef.current = emptyTransaction
      setTransactionForm(emptyTransaction)
    }
    setSelectedItem(null)
    setModalType('add')
    setShowModal(false)
    setShowAddDropdown(false)
    isModalOpeningRef.current = false
  }, [resetItemForm])

  const handleModalOverlayClick = useCallback((e) => {
    // Only close if clicking directly on overlay, not on modal content
    if (e.target === e.currentTarget) {
      handleCloseModal()
    }
  }, [handleCloseModal])

  const handleCloseWarehouseModal = useCallback(() => {
    resetWarehouseForm()
    setShowWarehouseModal(false)
  }, [])

  const handleCloseBulkImportModal = useCallback(() => {
    setCsvFile(null)
    setImportProgress({ total: 0, success: 0, failed: 0 })
    setShowBulkImportModal(false)
    setShowAddDropdown(false)
  }, [])

  const handleClosePOSLinkModal = useCallback(() => {
    setSelectedPosProducts([])
    setPosProducts([])
    setShowPOSLinkModal(false)
    setShowAddDropdown(false)
  }, [])

  // CSV Import Handler - Improved to handle Excel formats
  const handleCSVImport = async (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = async (e) => {
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
            reject(new Error('CSV file must have at least a header row and one data row'))
            return
          }
          
          const headers = parseCSVLine(lines[0]).map(h => h.trim().toLowerCase().replace(/"/g, ''))
          
          // Normalize header names for better matching
          const normalizeHeader = (header) => {
            const normalized = header.toLowerCase().replace(/[_\s]/g, '')
            
            if (normalized.includes('name') && !normalized.includes('file')) return 'name'
            if (normalized.includes('sku') || normalized.includes('productcode') || normalized.includes('itemcode')) return 'sku'
            if (normalized.includes('stock') || normalized.includes('quantity') || normalized.includes('qty')) return 'quantity'
            if (normalized.includes('unit') || normalized.includes('uom')) return 'unit'
            if (normalized.includes('location') || normalized.includes('warehouse')) return 'location'
            if (normalized.includes('minstock') || normalized.includes('minimumstock') || normalized.includes('reorder')) return 'min_stock'
            if (normalized.includes('cost') || normalized.includes('costprice') || normalized.includes('rate')) return 'cost'
            if (normalized.includes('category') || normalized.includes('cate')) return 'category'
            if (normalized.includes('description') || normalized.includes('desc')) return 'description'
            if (normalized.includes('hsn') || normalized.includes('hsncode')) return 'hsn_code'
            if (normalized.includes('barcode') || normalized.includes('barcodes')) return 'barcode'
            
            // Ignore columns we don't need
            if (normalized.includes('keyword') || normalized.includes('text') || normalized.includes('bulkdeal') || 
                normalized.includes('warranty') || normalized.includes('image') || normalized.includes('length') ||
                normalized.includes('width') || normalized.includes('height') || normalized.includes('weight') ||
                normalized.includes('saleprice') || normalized.includes('brand')) {
              return null
            }
            
            return normalized
          }
          
          const normalizedHeaders = headers.map(normalizeHeader)
          const items = []
          
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
                case 'quantity':
                  item.quantity = parseInt(value) || 0
                  break
                case 'unit':
                  item.unit = value.toUpperCase() || 'PCS'
                  break
                case 'location':
                  item.location = value
                  break
                case 'min_stock':
                  item.min_stock = parseInt(value) || 0
                  break
                case 'cost':
                  item.cost = parseFloat(value.replace(/[₹,]/g, '')) || 0
                  break
                case 'category':
                  item.category = value
                  break
                case 'description':
                  item.description = value
                  break
                case 'hsn_code':
                  item.hsn_code = value
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
              // Generate barcode for CSV imports only if not provided
              if (!item.barcode) {
                const existingBarcodes = items.map(i => i.barcode).filter(Boolean)
                item.barcode = generateUniqueBarcode(existingBarcodes)
              }
              // Set defaults
              if (!item.quantity && item.quantity !== 0) item.quantity = 0
              if (!item.unit) item.unit = 'PCS'
              if (!item.category) item.category = 'Uncategorized'
              items.push(item)
            }
          }
          
          resolve(items)
        } catch (error) {
          reject(error)
        }
      }
      reader.onerror = reject
      reader.readAsText(file)
    })
  }

  const processBulkImport = async () => {
    if (!csvFile) {
      alert('Please select a CSV file')
      return
    }

    try {
      setImportProgress({ total: 0, success: 0, failed: 0 })
      const items = await handleCSVImport(csvFile)
      
      setImportProgress({ total: items.length, success: 0, failed: 0 })
      
      let success = 0
      let failed = 0
      
      for (const item of items) {
        try {
          const result = await inventoAPI.createItem({
            name: item.name,
            sku: item.sku || '',
            quantity: item.quantity || 0,
            unit: item.unit || 'pcs',
            location: item.location || '',
            min_stock: item.min_stock || 0,
            cost: item.cost || 0,
            category: item.category || '',
            description: item.description || '',
            hsn_code: item.hsn_code || '',
            barcode: item.barcode || ''
          })
          if (result) {
            success++
          } else {
            failed++
          }
        } catch (err) {
          failed++
        }
        setImportProgress({ total: items.length, success, failed })
      }
      
      await loadData()
      setShowBulkImportModal(false)
      setCsvFile(null)
      alert(`Import completed! Success: ${success}, Failed: ${failed}`)
    } catch (error) {
      alert('Error importing CSV: ' + error.message)
    }
  }

  // Load POS Products
  const loadPOSProducts = async () => {
    try {
      setPosLoading(true)
      const products = await posAPI.getProducts()
      setPosProducts(products || [])
    } catch (error) {
      console.warn('Error loading POS products:', error)
      setPosProducts([])
    } finally {
      setPosLoading(false)
    }
  }

  // Link POS Products
  const handleLinkPOSProducts = async () => {
    if (selectedPosProducts.length === 0) {
      alert('Please select at least one product to link')
      return
    }

    try {
      let success = 0
      let failed = 0

      for (const posProduct of selectedPosProducts) {
        try {
          const result = await inventoAPI.createItem({
            name: posProduct.name || '',
            sku: posProduct.sku || posProduct.barcode || '',
            quantity: posProduct.stock || 0,
            unit: 'pcs',
            location: warehouses.length > 0 ? warehouses[0].name : '',
            min_stock: 0,
            cost: posProduct.price || 0,
            category: posProduct.category || '',
            description: posProduct.description || '',
            hsn_code: posProduct.hsn_code || ''
          })
          if (result) {
            success++
          } else {
            failed++
          }
        } catch (err) {
          failed++
        }
      }

      await loadData()
      setShowPOSLinkModal(false)
      setSelectedPosProducts([])
      alert(`Linked ${success} product(s) successfully! Failed: ${failed}`)
    } catch (error) {
      alert('Error linking products: ' + error.message)
    }
  }

  // Stock In/Out - PERMANENT: Read from refs, not state
  const handleStockIn = useCallback(async (e) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (!selectedItem || !selectedItem.id) {
      alert('Invalid item selected')
      return
    }
    
    // CRITICAL: Read from ref, not state
    const currentTransaction = transactionFormRef.current
    const quantity = parseInt(currentTransaction.quantity)
    if (!quantity || quantity <= 0) {
      alert('Quantity must be a positive number')
      return
    }
    
    if (!currentTransaction.date || currentTransaction.date === '') {
      alert('Date is required')
      return
    }
    
    try {
      const result = await inventoAPI.createTransaction({
        item_id: selectedItem.id,
        type: 'in',
        quantity: parseInt(currentTransaction.quantity),
        date: currentTransaction.date,
        location: selectedItem.location,
        notes: currentTransaction.notes,
        reference: currentTransaction.reference
      })
      if (result) {
        await loadData()
      } else {
        setInventory(prev => prev.map(item => 
          item.id === selectedItem.id 
            ? { ...item, quantity: (item.quantity || 0) + parseInt(transactionForm.quantity) }
            : item
        ))
      }
      // Reset and close after successful stock in
      const emptyTransaction = { quantity: '', date: new Date().toISOString().split('T')[0], notes: '', reference: '' }
      transactionFormRef.current = emptyTransaction
      setTransactionForm(emptyTransaction)
      setSelectedItem(null)
      setModalType('add')
      setShowModal(false)
    } catch (err) {
      console.warn('Error processing stock in:', err.message)
      // Don't close modal on error so user can fix and retry
    }
  }, [selectedItem, loadData])

  const handleStockOut = useCallback(async (e) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (!selectedItem || !selectedItem.id) {
      alert('Invalid item selected')
      return
    }
    
    // CRITICAL: Read from ref, not state
    const currentTransaction = transactionFormRef.current
    const quantity = parseInt(currentTransaction.quantity)
    if (!quantity || quantity <= 0) {
      alert('Quantity must be a positive number')
      return
    }
    
    if (quantity > (selectedItem.quantity || 0)) {
      alert('Insufficient stock!')
      return
    }
    
    if (!currentTransaction.date || currentTransaction.date === '') {
      alert('Date is required')
      return
    }
    
    try {
      const result = await inventoAPI.createTransaction({
        item_id: selectedItem.id,
        type: 'out',
        quantity: quantity,
        date: currentTransaction.date,
        location: selectedItem.location,
        notes: currentTransaction.notes,
        reference: currentTransaction.reference
      })
      if (result) {
        await loadData()
      } else {
        setInventory(prev => prev.map(item => 
          item.id === selectedItem.id 
            ? { ...item, quantity: Math.max(0, (item.quantity || 0) - quantity) }
            : item
        ))
      }
      // Reset and close after successful stock out
      const emptyTransaction = { quantity: '', date: new Date().toISOString().split('T')[0], notes: '', reference: '' }
      transactionFormRef.current = emptyTransaction
      setTransactionForm(emptyTransaction)
      setSelectedItem(null)
      setModalType('add')
      setShowModal(false)
    } catch (err) {
      console.warn('Error processing stock out:', err.message)
      // Don't close modal on error so user can fix and retry
    }
  }, [selectedItem, loadData])

  // Warehouse management
  const handleAddWarehouse = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    
    // Read from ref, not state
    const currentWarehouseForm = warehouseFormRef.current
    
    if (!currentWarehouseForm.name || currentWarehouseForm.name.trim() === '') {
      alert('Warehouse name is required')
      return
    }
    
    if (!currentWarehouseForm.address || currentWarehouseForm.address.trim() === '') {
      alert('Address is required')
      return
    }
    
    if (!currentWarehouseForm.city || currentWarehouseForm.city.trim() === '') {
      alert('City is required')
      return
    }
    
    if (!currentWarehouseForm.state || currentWarehouseForm.state.trim() === '') {
      alert('State is required')
      return
    }
    
    try {
      const result = await inventoAPI.createWarehouse({
        name: currentWarehouseForm.name.trim(),
        address: currentWarehouseForm.address.trim(),
        city: currentWarehouseForm.city.trim(),
        state: currentWarehouseForm.state.trim(),
        pincode: (currentWarehouseForm.pincode || '').trim(),
        capacity: parseInt(currentWarehouseForm.capacity) || 0,
        manager: (currentWarehouseForm.manager || '').trim(),
        phone: (currentWarehouseForm.phone || '').trim()
      })
      if (result) {
        await loadData()
      } else {
        const tempWarehouse = {
          id: Date.now(),
          ...currentWarehouseForm,
          capacity: parseInt(currentWarehouseForm.capacity) || 0
        }
        setWarehouses(prev => [...prev, tempWarehouse])
      }
      // Reset and close after successful add
      resetWarehouseForm()
      setShowWarehouseModal(false)
    } catch (err) {
      console.warn('Error adding warehouse:', err.message)
      // Don't close modal on error so user can fix and retry
    }
  }

  const handleDeleteWarehouse = async (id) => {
    if (window.confirm('Are you sure you want to delete this warehouse?')) {
      try {
        const result = await inventoAPI.deleteWarehouse(id)
        if (result !== false) {
          await loadData()
        } else {
          setWarehouses(prev => prev.filter(wh => wh.id !== id))
        }
      } catch (err) {
        console.warn('Error deleting warehouse:', err.message)
        setWarehouses(prev => prev.filter(wh => wh.id !== id))
      }
    }
  }

  const resetWarehouseForm = () => {
    const emptyWarehouse = {
      name: '', 
      address: '', 
      city: '', 
      state: '',
      pincode: '',
      capacity: '',
      manager: '',
      phone: ''
    }
    warehouseFormRef.current = emptyWarehouse
    setWarehouseForm(emptyWarehouse)
  }

  // Export data
  const exportInventory = () => {
    if (inventory.length === 0) {
      alert('No inventory data to export')
      return
    }
    const reportData = inventory.map(item => ({
      'Item Name': item.name,
      'SKU': item.sku,
      'HSN Code': item.hsn_code || '',
      'Quantity': item.quantity,
      'Unit': item.unit,
      'Location': item.location,
      'Min Stock': item.min_stock || item.minStock,
      'Cost': item.cost,
      'Category': item.category,
      'Status': getStockStatus(item.quantity, item.min_stock || item.minStock)
    }))
    
    const csv = [
      Object.keys(reportData[0]).join(','),
      ...reportData.map(row => Object.values(row).join(','))
    ].join('\n')
    
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `inventory_report_${new Date().toISOString().split('T')[0]}.csv`
    a.click()
  }

  // Main Inventory View
  const InventoryView = () => {
    if (loading) {
      return (
        <div className="invento-container">
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading inventory...</p>
          </div>
        </div>
      )
    }

    if (error) {
      return (
        <div className="invento-container">
          <div className="error-state">
            <AlertCircle size={48} />
            <p>{error}</p>
            <button onClick={loadData} className="retry-btn">Retry</button>
          </div>
        </div>
      )
    }

    return (
      <div className="invento-container">
        <div className="invento-header">
          <div className="header-top">
            <div>
              <h2>Inventory Management</h2>
              <p className="subtitle">Track and manage your warehouse stock levels</p>
            </div>
            <div className="header-actions">
              {selectedItems.length > 0 && (
                <>
                  <button onClick={handlePrintLabels} className="export-btn" style={{ background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)', color: 'white' }}>
                    <Printer size={18} />
                    Print Labels ({selectedItems.length})
                  </button>
                  <button onClick={handleSaveLabels} className="export-btn" style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)', color: 'white' }}>
                    <Download size={18} />
                    Save Labels PDF
                  </button>
                </>
              )}
              <button onClick={exportInventory} className="export-btn">
                <Download size={18} />
                Export
              </button>
              <div className="add-item-dropdown">
                <button 
                  onClick={() => setShowAddDropdown(!showAddDropdown)}
                  className="add-btn"
                >
                  <Plus size={18} />
                  Add Item
                </button>
                {showAddDropdown && (
                  <div className="dropdown-menu">
                    <button 
                      onClick={() => {
                        isModalOpeningRef.current = true
                        resetItemForm()
                        setSelectedItem(null)
                        setModalType('add')
                        setShowAddDropdown(false)
                        setShowModal(true)
                        setTimeout(() => {
                          isModalOpeningRef.current = false
                        }, 100)
                      }}
                      className="dropdown-item"
                    >
                      <Plus size={16} />
                      Add Single Item
                    </button>
                    <button 
                      onClick={() => {
                        setCsvFile(null)
                        setShowBulkImportModal(true)
                        setShowAddDropdown(false)
                      }}
                      className="dropdown-item"
                    >
                      <Upload size={16} />
                      Bulk Import from CSV
                    </button>
                    <button 
                      onClick={() => {
                        loadPOSProducts()
                        setShowPOSLinkModal(true)
                        setShowAddDropdown(false)
                      }}
                      className="dropdown-item"
                    >
                      <LinkIcon size={16} />
                      Link from BillEase POS
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="search-bar">
            <Search size={20} />
            <label htmlFor="invento-search" className="sr-only">Search inventory</label>
            <input
              id="invento-search"
              name="invento-search"
              type="text"
              placeholder="Search by name, SKU, location, or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Stats Cards */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon blue">
                <Package size={24} />
              </div>
              <div className="stat-content">
                <p className="stat-label">Total Items</p>
                <p className="stat-value">{inventory.length}</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon green">
                <CheckCircle size={24} />
              </div>
              <div className="stat-content">
                <p className="stat-label">In Stock</p>
                <p className="stat-value">{inventory.filter(i => (i.quantity || 0) > 0).length}</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon orange">
                <AlertCircle size={24} />
              </div>
              <div className="stat-content">
                <p className="stat-label">Low Stock</p>
                <p className="stat-value">{lowStockItems.length}</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon purple">
                <TrendingUp size={24} />
              </div>
              <div className="stat-content">
                <p className="stat-label">Total Value</p>
                <p className="stat-value">₹{inventory.reduce((sum, item) => sum + ((item.quantity || 0) * (item.cost || 0)), 0).toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Low Stock Alert */}
        {lowStockItems.length > 0 && (
          <div className="alert-banner">
            <AlertCircle size={20} />
            <span>{lowStockItems.length} item(s) are running low on stock</span>
            <button onClick={() => navigate('/invento/alerts')}>View Alerts</button>
          </div>
        )}

        {/* Inventory Grid */}
        <div className="inventory-grid">
          {filteredInventory.length === 0 ? (
            <div className="empty-state">
              <Package size={64} />
              <h3>No items found</h3>
              <p>{searchTerm ? 'Try adjusting your search' : 'Get started by adding your first inventory item'}</p>
              {!searchTerm && (
                <button 
                  onClick={() => {
                    isModalOpeningRef.current = true
                    resetItemForm()
                    setSelectedItem(null)
                    setModalType('add')
                    setShowModal(true)
                    setTimeout(() => {
                      isModalOpeningRef.current = false
                    }, 100)
                  }} 
                  className="add-btn"
                >
                  <Plus size={18} />
                  Add First Item
                </button>
              )}
            </div>
          ) : (
            filteredInventory.map(item => {
              const status = getStockStatus(item.quantity || 0, item.min_stock || item.minStock || 0)
              return (
                <div key={item.id} className={`inventory-card ${status}`}>
                  <div className="card-header">
                    <div className="item-info">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <button 
                          className="select-checkbox-btn"
                          onClick={() => toggleItemSelection(item.id)}
                          title={selectedItems.includes(item.id) ? 'Deselect' : 'Select'}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.25rem', color: 'var(--primary)' }}
                        >
                          {selectedItems.includes(item.id) ? <CheckSquare size={16} /> : <Square size={16} />}
                        </button>
                        <h3>{item.name}</h3>
                      </div>
                      <span className="sku">SKU: {item.sku || 'N/A'}</span>
                    </div>
                    <div className="card-actions">
                      <button 
                        onClick={() => {
                          isModalOpeningRef.current = true
                          setSelectedItem(item)
                          setModalType('in')
                          const emptyTransaction = { quantity: '', date: new Date().toISOString().split('T')[0], notes: '', reference: '' }
                          transactionFormRef.current = emptyTransaction
                          setTransactionForm(emptyTransaction)
                          setShowModal(true)
                          setTimeout(() => {
                            isModalOpeningRef.current = false
                          }, 100)
                        }}
                        className="icon-btn stock-in"
                        title="Stock In"
                      >
                        <ArrowUp size={18} />
                      </button>
                      <button 
                        onClick={() => {
                          isModalOpeningRef.current = true
                          setSelectedItem(item)
                          setModalType('out')
                          const emptyTransaction = { quantity: '', date: new Date().toISOString().split('T')[0], notes: '', reference: '' }
                          transactionFormRef.current = emptyTransaction
                          setTransactionForm(emptyTransaction)
                          setShowModal(true)
                          setTimeout(() => {
                            isModalOpeningRef.current = false
                          }, 100)
                        }}
                        className="icon-btn stock-out"
                        title="Stock Out"
                      >
                        <ArrowDown size={18} />
                      </button>
                      <button 
                        onClick={() => handleEditItem(item)}
                        className="icon-btn edit"
                        title="Edit"
                      >
                        <Edit size={18} />
                      </button>
                      <button 
                        onClick={() => handleDeleteItem(item.id)}
                        className="icon-btn delete"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                  <div className="card-body">
                    <div className="quantity-section">
                      <div className="quantity-display">
                        <span className="quantity-value">{item.quantity || 0}</span>
                        <span className="quantity-unit">{item.unit || 'pcs'}</span>
                      </div>
                      <div className="stock-info">
                        <span className={`status-badge ${status}`}>
                          {status === 'low' ? 'Low Stock' : status === 'medium' ? 'Medium' : 'In Stock'}
                        </span>
                        <span className="min-stock">Min: {item.min_stock || item.minStock || 0}</span>
                      </div>
                    </div>
                    <div className="item-details">
                      <div className="detail-item">
                        <MapPin size={16} />
                        <span>{item.location || 'No location'}</span>
                      </div>
                      {item.category && (
                        <div className="detail-item">
                          <Package size={16} />
                          <span>{item.category}</span>
                        </div>
                      )}
                      {item.cost > 0 && (
                        <div className="detail-item">
                          <TrendingUp size={16} />
                          <span>₹{item.cost.toLocaleString()} per {item.unit || 'pcs'}</span>
                        </div>
                      )}
                      {item.barcode && (
                        <div className="detail-item" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '0.25rem', width: '100%' }}>
                          <div className="barcode-display-inline">
                            <canvas 
                              ref={el => {
                                if (el && barcodeRefs.current[item.id]) {
                                  const ctx = el.getContext('2d')
                                  const sourceCanvas = barcodeRefs.current[item.id]
                                  el.width = sourceCanvas.width
                                  el.height = sourceCanvas.height
                                  ctx.drawImage(sourceCanvas, 0, 0)
                                }
                              }}
                              style={{ maxWidth: '150px', height: 'auto', display: 'block' }}
                            />
                            <span className="barcode-text-small">{item.barcode}</span>
                          </div>
                        </div>
                      )}
                    </div>
                    {item.description && (
                      <p className="item-description">{item.description}</p>
                    )}
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>
    )
  }

  // Warehouses View
  const WarehousesView = () => {
    return (
      <div className="invento-container">
        <div className="invento-header">
          <div className="header-top">
            <div>
              <h2>Warehouses & Branches</h2>
              <p className="subtitle">Manage your warehouse and branch locations</p>
            </div>
            <button 
              onClick={() => {
                resetWarehouseForm()
                setShowWarehouseModal(true)
              }} 
              className="add-btn"
            >
              <Plus size={18} />
              Add Warehouse
            </button>
          </div>
        </div>

        <div className="warehouses-grid">
          {warehouses.length === 0 ? (
            <div className="empty-state">
              <Warehouse size={64} />
              <h3>No warehouses found</h3>
              <p>Add your first warehouse or branch location</p>
              <button 
                onClick={() => {
                  resetWarehouseForm()
                  // Use setTimeout to ensure state is set before opening modal
                  setTimeout(() => {
                    setShowWarehouseModal(true)
                  }, 0)
                }} 
                className="add-btn"
              >
                <Plus size={18} />
                Add Warehouse
              </button>
            </div>
          ) : (
            warehouses.map(warehouse => (
              <div key={warehouse.id} className="warehouse-card">
                <div className="warehouse-header">
                  <div className="warehouse-icon">
                    <Building2 size={24} />
                  </div>
                  <div className="warehouse-info">
                    <h3>{warehouse.name}</h3>
                    {warehouse.manager && <p className="manager">Manager: {warehouse.manager}</p>}
                  </div>
                  <button 
                    onClick={() => handleDeleteWarehouse(warehouse.id)}
                    className="icon-btn delete"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
                <div className="warehouse-body">
                  <div className="warehouse-detail">
                    <MapPin size={16} />
                    <div>
                      <p>{warehouse.address}</p>
                      <p>{warehouse.city}, {warehouse.state} {warehouse.pincode}</p>
                    </div>
                  </div>
                  {warehouse.phone && (
                    <div className="warehouse-detail">
                      <FileText size={16} />
                      <span>{warehouse.phone}</span>
                    </div>
                  )}
                  <div className="warehouse-stats">
                    <div className="stat">
                      <span className="stat-label">Capacity</span>
                      <span className="stat-value">{warehouse.capacity || 'N/A'}</span>
                    </div>
                    <div className="stat">
                      <span className="stat-label">Items</span>
                      <span className="stat-value">{inventory.filter(item => (item.location || '') === warehouse.name).length}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    )
  }

  // Stock Reports View
  const ReportsView = () => {
    const recentTransactions = transactions.slice(0, 50).reverse()
    
    return (
      <div className="invento-container">
        <div className="invento-header">
          <div className="header-top">
            <div>
              <h2>Stock Reports</h2>
              <p className="subtitle">View stock transactions and movement history</p>
            </div>
            <button onClick={exportInventory} className="export-btn">
              <Download size={18} />
              Export Report
            </button>
          </div>
        </div>

        <div className="reports-content">
          <div className="transactions-table">
            <div className="table-header">
              <h3>Recent Transactions</h3>
            </div>
            {recentTransactions.length === 0 ? (
              <div className="empty-state">
                <ClipboardList size={48} />
                <p>No transactions found</p>
              </div>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Item</th>
                    <th>Type</th>
                    <th>Quantity</th>
                    <th>Location</th>
                    <th>Reference</th>
                  </tr>
                </thead>
                <tbody>
                  {recentTransactions.map(trans => {
                    const item = inventory.find(i => i.id === trans.item_id)
                    return (
                      <tr key={trans.id}>
                        <td>{new Date(trans.date).toLocaleDateString()}</td>
                        <td>{item?.name || 'Unknown'}</td>
                        <td>
                          <span className={`transaction-type ${trans.type}`}>
                            {trans.type === 'in' ? 'Stock In' : 'Stock Out'}
                          </span>
                        </td>
                        <td>{trans.quantity}</td>
                        <td>{trans.location || 'N/A'}</td>
                        <td>{trans.reference || '-'}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    )
  }

  // Alerts View
  const AlertsView = () => {
    return (
      <div className="invento-container">
        <div className="invento-header">
          <div className="header-top">
            <div>
              <h2>Low Stock Alerts</h2>
              <p className="subtitle">Items that need immediate attention</p>
            </div>
          </div>
        </div>

        {lowStockItems.length === 0 ? (
          <div className="empty-state">
            <CheckCircle size={64} />
            <h3>All items are well stocked</h3>
            <p>No low stock alerts at this time</p>
          </div>
        ) : (
          <div className="alerts-list">
            {lowStockItems.map(item => (
              <div key={item.id} className="alert-card">
                <div className="alert-icon">
                  <AlertCircle size={24} />
                </div>
                <div className="alert-content">
                  <h3>{item.name}</h3>
                  <p className="alert-details">
                    Current: {item.quantity || 0} {item.unit || 'pcs'} | 
                    Minimum: {item.min_stock || item.minStock || 0} {item.unit || 'pcs'} | 
                    Location: {item.location || 'N/A'}
                  </p>
                </div>
                <div className="alert-actions">
                  <button 
                    className="stock-in-btn"
                    onClick={() => {
                      isModalOpeningRef.current = true
                      setSelectedItem(item)
                      setModalType('in')
                      const emptyTransaction = { quantity: '', date: new Date().toISOString().split('T')[0], notes: '', reference: '' }
                      transactionFormRef.current = emptyTransaction
                      setTransactionForm(emptyTransaction)
                      setShowModal(true)
                      setTimeout(() => {
                        isModalOpeningRef.current = false
                      }, 100)
                    }}
                  >
                    <ArrowUp size={18} />
                    Stock In
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }

  // Handle Escape key for modal
  useEffect(() => {
    if (!showModal && !showWarehouseModal && !showBulkImportModal && !showPOSLinkModal) return
    
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        // Only close if focus is not on an input/textarea/select
        const activeElement = document.activeElement
        const isInputFocused = activeElement && (
          activeElement.tagName === 'INPUT' ||
          activeElement.tagName === 'TEXTAREA' ||
          activeElement.tagName === 'SELECT'
        )
        if (!isInputFocused) {
          if (showModal) handleCloseModal()
          if (showWarehouseModal) handleCloseWarehouseModal()
          if (showBulkImportModal) handleCloseBulkImportModal()
          if (showPOSLinkModal) handleClosePOSLinkModal()
        }
      }
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [showModal, showWarehouseModal, showBulkImportModal, showPOSLinkModal, handleCloseModal, handleCloseWarehouseModal, handleCloseBulkImportModal, handleClosePOSLinkModal])

  // Don't auto-reset forms - only reset on explicit close or successful submit

  // Item Modal - Stable form submit handler
  const handleFormSubmit = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (modalType === 'add') {
      handleAddItem(e)
    } else if (modalType === 'edit') {
      handleUpdateItem(e)
    } else if (modalType === 'in') {
      handleStockIn(e)
    } else if (modalType === 'out') {
      handleStockOut(e)
    }
  }, [modalType, handleAddItem, handleUpdateItem, handleStockIn, handleStockOut])

  // Item Modal - PERMANENT: Uncontrolled inputs prevent resets
  const ItemModal = () => {
    if (!showModal) return null

    return (
      <div 
        className="modal-overlay" 
        onClick={handleModalOverlayClick}
        onKeyDown={(e) => {
          if (e.key === 'Escape' && e.target === e.currentTarget) {
            handleCloseModal()
          }
        }}
      >
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h3>
              {modalType === 'add' && 'Add New Item'}
              {modalType === 'edit' && 'Edit Item'}
              {modalType === 'in' && 'Stock In'}
              {modalType === 'out' && 'Stock Out'}
            </h3>
            <button 
              type="button"
              onClick={handleCloseModal} 
              className="close-btn"
              aria-label="Close modal"
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleFormSubmit} noValidate>
            {modalType === 'add' || modalType === 'edit' ? (
              <>
                <div className="form-group">
                  <label htmlFor="item-name-input">Item Name *</label>
                  <input
                    id="item-name-input"
                    name="item-name"
                    type="text"
                    ref={getInputRef('form-name')}
                    defaultValue={formDataRef.current.name}
                    onChange={(e) => {
                      // ONLY update ref - NO state updates that could cause resets
                      formDataRef.current.name = e.target.value
                    }}
                    required
                    placeholder="Enter item name"
                    autoComplete="off"
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="item-sku-input">SKU</label>
                    <input
                      id="item-sku-input"
                      name="item-sku"
                      type="text"
                      ref={getInputRef('form-sku')}
                      defaultValue={formDataRef.current.sku}
                    onChange={(e) => {
                      formDataRef.current.sku = e.target.value
                    }}
                    placeholder="Enter SKU"
                    autoComplete="off"
                  />
                  </div>
                  <div className="form-group">
                    <label htmlFor="item-hsn-input">HSN Code</label>
                    <input
                      id="item-hsn-input"
                      name="item-hsn"
                      type="text"
                      ref={getInputRef('form-hsn_code')}
                      defaultValue={formDataRef.current.hsn_code}
                    onChange={(e) => {
                      formDataRef.current.hsn_code = e.target.value
                    }}
                    placeholder="Enter HSN code"
                    autoComplete="off"
                  />
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="item-category-input">Category</label>
                  <input
                    id="item-category-input"
                    name="item-category"
                    type="text"
                    ref={getInputRef('form-category')}
                    defaultValue={formDataRef.current.category}
                    onChange={(e) => {
                      formDataRef.current.category = e.target.value
                    }}
                    placeholder="Enter category"
                    autoComplete="off"
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="item-quantity-input">Quantity *</label>
                    <input
                      id="item-quantity-input"
                      name="item-quantity"
                      type="number"
                      ref={getInputRef('form-quantity')}
                      defaultValue={formDataRef.current.quantity}
                    onChange={(e) => {
                      formDataRef.current.quantity = e.target.value
                    }}
                    required
                    min="0"
                    placeholder="0"
                    autoComplete="off"
                  />
                  </div>
                  <div className="form-group">
                    <label htmlFor="item-unit-select">Unit</label>
                    <select
                      id="item-unit-select"
                      name="item-unit"
                    ref={getInputRef('form-unit')}
                    defaultValue={formDataRef.current.unit}
                    onChange={(e) => {
                      formDataRef.current.unit = e.target.value
                    }}
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
                <div className="form-group">
                  <label htmlFor="item-location-select">Location/Warehouse *</label>
                  <select
                    id="item-location-select"
                    name="item-location"
                    ref={getInputRef('form-location')}
                    defaultValue={formDataRef.current.location}
                    onChange={(e) => {
                      formDataRef.current.location = e.target.value
                    }}
                    required
                  >
                    <option value="">Select location</option>
                    {warehouses.map(wh => (
                      <option key={wh.id} value={wh.name}>{wh.name}</option>
                    ))}
                  </select>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="item-minstock-input">Minimum Stock</label>
                    <input
                      id="item-minstock-input"
                      name="item-minstock"
                      type="number"
                      ref={getInputRef('form-minStock')}
                      defaultValue={formDataRef.current.minStock}
                    onChange={(e) => {
                      formDataRef.current.minStock = e.target.value
                    }}
                    min="0"
                    placeholder="0"
                    autoComplete="off"
                  />
                  </div>
                  <div className="form-group">
                    <label htmlFor="item-cost-input">Cost per Unit (₹)</label>
                    <input
                      id="item-cost-input"
                      name="item-cost"
                      type="number"
                      ref={getInputRef('form-cost')}
                      defaultValue={formDataRef.current.cost}
                    onChange={(e) => {
                      formDataRef.current.cost = e.target.value
                    }}
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    autoComplete="off"
                  />
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="item-description-textarea">Description</label>
                  <textarea
                    id="item-description-textarea"
                    name="item-description"
                    ref={getInputRef('form-description')}
                    defaultValue={formDataRef.current.description}
                    onChange={(e) => {
                      formDataRef.current.description = e.target.value
                    }}
                    rows="3"
                    placeholder="Enter item description"
                    autoComplete="off"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="item-barcode-input">Barcode</label>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <input
                      id="item-barcode-input"
                      name="item-barcode"
                      type="text"
                      ref={getInputRef('form-barcode')}
                      defaultValue={formDataRef.current.barcode}
                      onChange={(e) => {
                        formDataRef.current.barcode = e.target.value
                      }}
                      placeholder="Auto-generated if empty"
                      maxLength="13"
                      autoComplete="off"
                      style={{ flex: 1 }}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const existingBarcodes = inventory.map(item => item.barcode).filter(Boolean)
                        const newBarcode = generateUniqueBarcode(existingBarcodes)
                        handleFormDataChange('barcode', newBarcode)
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
              </>
            ) : (
              <>
                <div className="form-group">
                  <label htmlFor="transaction-item-input">Item</label>
                  <input id="transaction-item-input" name="transaction-item" type="text" value={selectedItem?.name || ''} disabled />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="transaction-current-stock-input">Current Stock</label>
                    <input id="transaction-current-stock-input" name="transaction-current-stock" type="text" value={`${selectedItem?.quantity || 0} ${selectedItem?.unit || 'pcs'}`} disabled />
                  </div>
                  <div className="form-group">
                    <label htmlFor="transaction-location-input">Location</label>
                    <input id="transaction-location-input" name="transaction-location" type="text" value={selectedItem?.location || ''} disabled />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="transaction-quantity-input">Quantity *</label>
                    <input
                      id="transaction-quantity-input"
                      name="transaction-quantity"
                      type="number"
                      defaultValue={transactionFormRef.current.quantity || transactionForm.quantity}
                    onChange={(e) => {
                      transactionFormRef.current.quantity = e.target.value
                    }}
                      required
                      min="1"
                      max={modalType === 'out' ? selectedItem?.quantity : undefined}
                      placeholder="Enter quantity"
                      autoComplete="off"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="transaction-date-input">Date *</label>
                    <input
                      id="transaction-date-input"
                      name="transaction-date"
                      type="date"
                      defaultValue={transactionFormRef.current.date || transactionForm.date}
                    onChange={(e) => {
                      transactionFormRef.current.date = e.target.value
                    }}
                      required
                      autoComplete="off"
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="transaction-reference-input">Reference Number</label>
                  <input
                    id="transaction-reference-input"
                    name="transaction-reference"
                    type="text"
                    defaultValue={transactionFormRef.current.reference || transactionForm.reference}
                    onChange={(e) => {
                      transactionFormRef.current.reference = e.target.value
                    }}
                    placeholder="Invoice/PO number, etc."
                    autoComplete="off"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="transaction-notes-textarea">Notes</label>
                  <textarea
                    id="transaction-notes-textarea"
                    name="transaction-notes"
                    defaultValue={transactionFormRef.current.notes || transactionForm.notes}
                    onChange={(e) => {
                      transactionFormRef.current.notes = e.target.value
                    }}
                    rows="3"
                    placeholder="Additional notes"
                    autoComplete="off"
                  />
                </div>
              </>
            )}
            <div className="modal-actions">
              <button type="button" onClick={handleCloseModal} className="cancel-btn">
                Cancel
              </button>
              <button type="submit" className="submit-btn">
                {modalType === 'add' && 'Add Item'}
                {modalType === 'edit' && 'Update Item'}
                {modalType === 'in' && 'Stock In'}
                {modalType === 'out' && 'Stock Out'}
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  }

  // Warehouse Modal - Stable form submit handler
  const handleWarehouseFormSubmit = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    handleAddWarehouse(e)
  }, [warehouseForm, warehouses])

  // Warehouse Modal
  const WarehouseModal = () => {
    if (!showWarehouseModal) return null

    return (
      <div 
        className="modal-overlay" 
        tabIndex={-1}
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            handleCloseWarehouseModal()
          }
        }}
        onKeyDown={(e) => {
          if (e.key === 'Escape') {
            handleCloseWarehouseModal()
          }
        }}
      >
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h3>Add Warehouse/Branch</h3>
            <button 
              type="button"
              onClick={handleCloseWarehouseModal} 
              className="close-btn"
              aria-label="Close modal"
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleAddWarehouse} noValidate>
            <div className="form-group">
              <label htmlFor="warehouse-name-input">Warehouse/Branch Name *</label>
              <input
                id="warehouse-name-input"
                name="warehouse-name"
                type="text"
                defaultValue={warehouseFormRef.current.name}
                onChange={(e) => {
                  warehouseFormRef.current.name = e.target.value
                }}
                required
                placeholder="Enter warehouse name"
                autoComplete="off"
              />
            </div>
            <div className="form-group">
              <label htmlFor="warehouse-address-textarea">Address *</label>
              <textarea
                id="warehouse-address-textarea"
                name="warehouse-address"
                defaultValue={warehouseFormRef.current.address}
                onChange={(e) => {
                  warehouseFormRef.current.address = e.target.value
                }}
                required
                rows="2"
                placeholder="Enter address"
                autoComplete="off"
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="warehouse-city-input">City *</label>
                <input
                  id="warehouse-city-input"
                  name="warehouse-city"
                  type="text"
                  defaultValue={warehouseFormRef.current.city}
                  onChange={(e) => {
                    warehouseFormRef.current.city = e.target.value
                  }}
                  required
                  placeholder="Enter city"
                  autoComplete="off"
                />
              </div>
              <div className="form-group">
                <label htmlFor="warehouse-state-input">State *</label>
                <input
                  id="warehouse-state-input"
                  name="warehouse-state"
                  type="text"
                  defaultValue={warehouseFormRef.current.state}
                  onChange={(e) => {
                    warehouseFormRef.current.state = e.target.value
                  }}
                  required
                  placeholder="Enter state"
                  autoComplete="off"
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="warehouse-pincode-input">Pincode</label>
                <input
                  id="warehouse-pincode-input"
                  name="warehouse-pincode"
                  type="text"
                  defaultValue={warehouseFormRef.current.pincode}
                  onChange={(e) => {
                    warehouseFormRef.current.pincode = e.target.value
                  }}
                  placeholder="Enter pincode"
                  autoComplete="off"
                />
              </div>
              <div className="form-group">
                <label htmlFor="warehouse-capacity-input">Capacity</label>
                <input
                  id="warehouse-capacity-input"
                  name="warehouse-capacity"
                  type="number"
                  defaultValue={warehouseFormRef.current.capacity}
                  onChange={(e) => {
                    warehouseFormRef.current.capacity = e.target.value
                  }}
                  min="0"
                  placeholder="Enter capacity"
                  autoComplete="off"
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="warehouse-manager-input">Manager Name</label>
                <input
                  id="warehouse-manager-input"
                  name="warehouse-manager"
                  type="text"
                  defaultValue={warehouseFormRef.current.manager}
                  onChange={(e) => {
                    warehouseFormRef.current.manager = e.target.value
                  }}
                  placeholder="Enter manager name"
                  autoComplete="off"
                />
              </div>
              <div className="form-group">
                <label htmlFor="warehouse-phone-input">Phone</label>
                <input
                  id="warehouse-phone-input"
                  name="warehouse-phone"
                  type="tel"
                  defaultValue={warehouseFormRef.current.phone}
                  onChange={(e) => {
                    warehouseFormRef.current.phone = e.target.value
                  }}
                  placeholder="Enter phone number"
                  autoComplete="off"
                />
              </div>
            </div>
            <div className="modal-actions">
              <button type="button" onClick={handleCloseWarehouseModal} className="cancel-btn">
                Cancel
              </button>
              <button type="submit" className="submit-btn">
                Add Warehouse
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  }

  // Bulk Import Modal
  const BulkImportModal = () => {
    if (!showBulkImportModal) return null

    return (
      <div 
        className="modal-overlay" 
        tabIndex={-1}
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            handleCloseBulkImportModal()
          }
        }}
        onKeyDown={(e) => {
          if (e.key === 'Escape') {
            handleCloseBulkImportModal()
          }
        }}
      >
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h3>Bulk Import from CSV</h3>
            <button 
              type="button"
              onClick={handleCloseBulkImportModal} 
              className="close-btn"
              aria-label="Close modal"
            >
              <X size={20} />
            </button>
          </div>

          <div className="modal-body">
            <div className="import-instructions">
              <h4>CSV Format:</h4>
              <p>Your CSV file should include the following columns:</p>
              <ul>
                <li><strong>name</strong> (required) - Item name</li>
                <li><strong>sku</strong> - SKU code</li>
                <li><strong>quantity</strong> - Stock quantity</li>
                <li><strong>unit</strong> - Unit (pcs, kg, etc.)</li>
                <li><strong>location</strong> - Warehouse location</li>
                <li><strong>min_stock</strong> - Minimum stock level</li>
                <li><strong>cost</strong> - Cost per unit</li>
                <li><strong>category</strong> - Item category</li>
                <li><strong>description</strong> - Item description</li>
                <li><strong>hsn_code</strong> - HSN code</li>
              </ul>
            </div>

            <div className="form-group">
              <label htmlFor="csv-file-input">Select CSV File</label>
              <div className="file-input-wrapper">
                <input
                  id="csv-file-input"
                  name="csv-file"
                  type="file"
                  accept=".csv"
                  onChange={(e) => setCsvFile(e.target.files[0])}
                  className="file-input"
                />
                <div className="file-input-display">
                  {csvFile ? (
                    <div className="file-selected">
                      <FileSpreadsheet size={20} />
                      <span>{csvFile.name}</span>
                    </div>
                  ) : (
                    <div className="file-placeholder">
                      <Upload size={20} />
                      <span>Click to select CSV file</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {importProgress.total > 0 && (
              <div className="import-progress">
                <p>Importing: {importProgress.success + importProgress.failed} / {importProgress.total}</p>
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${((importProgress.success + importProgress.failed) / importProgress.total) * 100}%` }}
                  />
                </div>
                <div className="progress-stats">
                  <span className="success">Success: {importProgress.success}</span>
                  <span className="failed">Failed: {importProgress.failed}</span>
                </div>
              </div>
            )}

            <div className="modal-actions">
              <button type="button" onClick={handleCloseBulkImportModal} className="cancel-btn">
                Cancel
              </button>
              <button 
                type="button" 
                onClick={processBulkImport} 
                className="submit-btn"
                disabled={!csvFile}
              >
                <Upload size={18} />
                Import Items
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // POS Link Modal
  const POSLinkModal = () => {
    if (!showPOSLinkModal) return null

    return (
      <div 
        className="modal-overlay" 
        tabIndex={-1}
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            handleClosePOSLinkModal()
          }
        }}
        onKeyDown={(e) => {
          if (e.key === 'Escape') {
            handleClosePOSLinkModal()
          }
        }}
      >
        <div className="modal-content large-modal" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h3>Link Products from BillEase POS</h3>
            <button 
              type="button"
              onClick={handleClosePOSLinkModal} 
              className="close-btn"
              aria-label="Close modal"
            >
              <X size={20} />
            </button>
          </div>

          <div className="modal-body">
            {posLoading ? (
              <div className="loading-state">
                <div className="spinner"></div>
                <p>Loading POS products...</p>
              </div>
            ) : posProducts.length === 0 ? (
              <div className="empty-state">
                <Package size={48} />
                <p>No products found in BillEase POS</p>
              </div>
            ) : (
              <>
                <div className="pos-products-header">
                  <p>Select products to link to inventory:</p>
                  <div className="selection-info">
                    {selectedPosProducts.length > 0 && (
                      <span>{selectedPosProducts.length} product(s) selected</span>
                    )}
                  </div>
                </div>
                <div className="pos-products-list">
                  {posProducts.map(product => {
                    const isSelected = selectedPosProducts.some(p => p.id === product.id)
                    return (
                      <div 
                        key={product.id} 
                        className={`pos-product-item ${isSelected ? 'selected' : ''}`}
                        onClick={() => {
                          if (isSelected) {
                            setSelectedPosProducts(prev => prev.filter(p => p.id !== product.id))
                          } else {
                            setSelectedPosProducts(prev => [...prev, product])
                          }
                        }}
                      >
                        <label htmlFor={`pos-product-checkbox-${product.id}`} className="sr-only">Select {product.name}</label>
                        <input
                          id={`pos-product-checkbox-${product.id}`}
                          name={`pos-product-${product.id}`}
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => {}}
                        />
                        <div className="product-info">
                          <h4>{product.name}</h4>
                          <div className="product-details">
                            {product.sku && <span>SKU: {product.sku}</span>}
                            {product.category && <span>Category: {product.category}</span>}
                            <span>Price: ₹{product.price || 0}</span>
                            <span>Stock: {product.stock || 0}</span>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </>
            )}

            <div className="modal-actions">
              <button type="button" onClick={handleClosePOSLinkModal} className="cancel-btn">
                Cancel
              </button>
              <button 
                type="button" 
                onClick={handleLinkPOSProducts} 
                className="submit-btn"
                disabled={selectedPosProducts.length === 0 || posLoading}
              >
                <LinkIcon size={18} />
                Link Selected ({selectedPosProducts.length})
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <Routes>
        <Route path="/" element={<InventoryView />} />
        <Route path="/warehouses" element={<WarehousesView />} />
        <Route path="/reports" element={<ReportsView />} />
        <Route path="/alerts" element={<AlertsView />} />
      </Routes>
      <ItemModal />
      <WarehouseModal />
      <BulkImportModal />
      <POSLinkModal />
    </>
  )
}

export default Invento

