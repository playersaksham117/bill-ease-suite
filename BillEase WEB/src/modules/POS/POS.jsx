import React, { useState, createContext, useContext } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import NewSale from './components/NewSale'
import ProductsInventory from './components/ProductsInventory'
import Entities from './components/Entities'
import Quotation from './components/Quotation'
import SalesHistory from './components/SalesHistory'
import Payments from './components/Payments'
import ReturnsRefunds from './components/ReturnsRefunds'
import SalesReports from './components/SalesReports'
import Reports from './components/Reports'
import POSSettings from './components/POSSettings'

// Create context for sharing sales data across components
export const POSContext = createContext()

export const usePOS = () => {
  const context = useContext(POSContext)
  if (!context) {
    throw new Error('usePOS must be used within POSProvider')
  }
  return context
}

const POS = () => {
  // Shared state for sales, payments, returns
  const [sales, setSales] = useState(() => {
    // Load from localStorage if available
    const saved = localStorage.getItem('pos_sales')
    return saved ? JSON.parse(saved) : []
  })
  
  const [payments, setPayments] = useState(() => {
    const saved = localStorage.getItem('pos_payments')
    return saved ? JSON.parse(saved) : []
  })
  
  const [returns, setReturns] = useState(() => {
    const saved = localStorage.getItem('pos_returns')
    return saved ? JSON.parse(saved) : []
  })
  
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem('pos_products')
    if (saved) {
      return JSON.parse(saved)
    }
    return [
      { id: 1, name: 'Product A', price: 100, stock: 50, category: 'Electronics', sku: 'PRD001', barcode: '123456789012', description: '' },
      { id: 2, name: 'Product B', price: 250, stock: 30, category: 'Clothing', sku: 'PRD002', barcode: '123456789013', description: '' },
      { id: 3, name: 'Product C', price: 500, stock: 20, category: 'Electronics', sku: 'PRD003', barcode: '123456789014', description: '' },
      { id: 4, name: 'Product D', price: 750, stock: 15, category: 'Home', sku: 'PRD004', barcode: '123456789015', description: '' },
      { id: 5, name: 'Product E', price: 1000, stock: 10, category: 'Electronics', sku: 'PRD005', barcode: '123456789016', description: '' },
      { id: 6, name: 'Product F', price: 150, stock: 40, category: 'Clothing', sku: 'PRD006', barcode: '123456789017', description: '' },
      { id: 7, name: 'Product G', price: 300, stock: 25, category: 'Home', sku: 'PRD007', barcode: '123456789018', description: '' },
      { id: 8, name: 'Product H', price: 600, stock: 18, category: 'Electronics', sku: 'PRD008', barcode: '123456789019', description: '' },
    ]
  })

  const [entities, setEntities] = useState(() => {
    const saved = localStorage.getItem('pos_entities')
    return saved ? JSON.parse(saved) : []
  })

  const [quotations, setQuotations] = useState(() => {
    const saved = localStorage.getItem('pos_quotations')
    return saved ? JSON.parse(saved) : []
  })

  // Save to localStorage whenever sales change
  React.useEffect(() => {
    localStorage.setItem('pos_sales', JSON.stringify(sales))
  }, [sales])

  React.useEffect(() => {
    localStorage.setItem('pos_payments', JSON.stringify(payments))
  }, [payments])

  React.useEffect(() => {
    localStorage.setItem('pos_returns', JSON.stringify(returns))
  }, [returns])

  React.useEffect(() => {
    localStorage.setItem('pos_products', JSON.stringify(products))
  }, [products])

  React.useEffect(() => {
    localStorage.setItem('pos_entities', JSON.stringify(entities))
  }, [entities])

  React.useEffect(() => {
    localStorage.setItem('pos_quotations', JSON.stringify(quotations))
  }, [quotations])

  // Generate invoice number in format BEP/0000/25-26
  const generateInvoiceNumber = () => {
    const currentYear = new Date().getFullYear()
    const financialYear = currentYear.toString().slice(-2) + '-' + (currentYear + 1).toString().slice(-2)
    
    // Get the last invoice number from sales
    const lastSale = sales.length > 0 ? sales[0] : null
    let nextNumber = 1
    
    if (lastSale && lastSale.invoiceNumber) {
      // Extract number from last invoice (BEP/0001/25-26 -> 1)
      const match = lastSale.invoiceNumber.match(/BEP\/(\d+)\/\d{2}-\d{2}/)
      if (match) {
        nextNumber = parseInt(match[1]) + 1
      }
    }
    
    // Get invoice counter from localStorage
    const savedCounter = localStorage.getItem('pos_invoice_counter')
    if (savedCounter) {
      const counterData = JSON.parse(savedCounter)
      if (counterData.financialYear === financialYear) {
        nextNumber = counterData.counter + 1
      }
    }
    
    // Save counter
    localStorage.setItem('pos_invoice_counter', JSON.stringify({
      financialYear,
      counter: nextNumber
    }))
    
    return `BEP/${String(nextNumber).padStart(4, '0')}/${financialYear}`
  }

  const addSale = (saleData) => {
    const invoiceNumber = generateInvoiceNumber()
    const newSale = {
      id: Date.now(),
      ...saleData,
      invoiceNumber,
      date: new Date().toISOString(),
      status: 'completed'
    }
    setSales([newSale, ...sales])
    return newSale
  }

  const addPayment = (paymentData) => {
    const newPayment = {
      id: Date.now(),
      ...paymentData,
      date: new Date().toISOString(),
      status: 'completed'
    }
    setPayments([newPayment, ...payments])
    return newPayment
  }

  const addReturn = (returnData) => {
    const newReturn = {
      id: Date.now(),
      ...returnData,
      date: new Date().toISOString(),
      status: 'processed'
    }
    setReturns([newReturn, ...returns])
    return newReturn
  }

  const updateProductStock = (productId, quantity) => {
    setProducts(products.map(p => 
      p.id === productId ? { ...p, stock: Math.max(0, quantity) } : p
    ))
  }

  const addProduct = (productData) => {
    const newProduct = {
      id: Date.now(),
      ...productData,
      stock: productData.stock || 0
    }
    setProducts([...products, newProduct])
    return newProduct
  }

  const updateProduct = (productId, productData) => {
    setProducts(products.map(p => 
      p.id === productId ? { ...p, ...productData } : p
    ))
  }

  const deleteProduct = (productId) => {
    setProducts(products.filter(p => p.id !== productId))
  }

  const bulkImportProducts = (importedProducts) => {
    const newProducts = importedProducts.map(product => ({
      ...product,
      id: product.id || Date.now() + Math.random()
    }))
    setProducts([...products, ...newProducts])
  }

  const addEntity = (entityData) => {
    const newEntity = {
      id: Date.now(),
      ...entityData,
      createdAt: new Date().toISOString()
    }
    setEntities([...entities, newEntity])
    return newEntity
  }

  const updateEntity = (entityId, entityData) => {
    setEntities(entities.map(e => 
      e.id === entityId ? { ...e, ...entityData, updatedAt: new Date().toISOString() } : e
    ))
  }

  const deleteEntity = (entityId) => {
    setEntities(entities.filter(e => e.id !== entityId))
  }

  // Generate quotation number
  const generateQuotationNumber = () => {
    const currentYear = new Date().getFullYear()
    const financialYear = currentYear.toString().slice(-2) + '-' + (currentYear + 1).toString().slice(-2)
    
    const lastQuotation = quotations.length > 0 ? quotations[0] : null
    let nextNumber = 1
    
    if (lastQuotation && lastQuotation.quotationNumber) {
      const match = lastQuotation.quotationNumber.match(/QUO\/(\d+)\/\d{2}-\d{2}/)
      if (match) {
        nextNumber = parseInt(match[1]) + 1
      }
    }
    
    const savedCounter = localStorage.getItem('pos_quotation_counter')
    if (savedCounter) {
      const counterData = JSON.parse(savedCounter)
      if (counterData.financialYear === financialYear) {
        nextNumber = counterData.counter + 1
      }
    }
    
    localStorage.setItem('pos_quotation_counter', JSON.stringify({
      financialYear,
      counter: nextNumber
    }))
    
    return `QUO/${String(nextNumber).padStart(4, '0')}/${financialYear}`
  }

  const addQuotation = (quotationData) => {
    const quotationNumber = generateQuotationNumber()
    const newQuotation = {
      id: Date.now(),
      ...quotationData,
      quotationNumber,
      date: new Date().toISOString(),
      status: 'draft'
    }
    setQuotations([newQuotation, ...quotations])
    return newQuotation
  }

  const updateQuotation = (quotationId, quotationData) => {
    setQuotations(quotations.map(q => 
      q.id === quotationId ? { ...q, ...quotationData, updatedAt: new Date().toISOString() } : q
    ))
  }

  const deleteQuotation = (quotationId) => {
    setQuotations(quotations.filter(q => q.id !== quotationId))
  }

  const updateSale = (saleId, saleData) => {
    setSales(sales.map(s => 
      s.id === saleId ? { ...s, ...saleData, updatedAt: new Date().toISOString() } : s
    ))
  }

  const value = {
    sales,
    payments,
    returns,
    products,
    entities,
    quotations,
    addSale,
    updateSale,
    addPayment,
    addReturn,
    updateProductStock,
    addProduct,
    updateProduct,
    deleteProduct,
    bulkImportProducts,
    addEntity,
    updateEntity,
    deleteEntity,
    addQuotation,
    updateQuotation,
    deleteQuotation
  }

  return (
    <POSContext.Provider value={value}>
      <Routes>
        <Route path="/" element={<NewSale />} />
        <Route path="/products" element={<ProductsInventory />} />
        <Route path="/entities" element={<Entities />} />
        <Route path="/quotation" element={<Quotation />} />
        <Route path="/sales" element={<SalesHistory />} />
        <Route path="/payments" element={<Payments />} />
        <Route path="/returns" element={<ReturnsRefunds />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/sales-reports" element={<SalesReports />} />
        <Route path="/settings" element={<POSSettings />} />
        <Route path="*" element={<Navigate to="/pos" replace />} />
      </Routes>
    </POSContext.Provider>
  )
}

export default POS
