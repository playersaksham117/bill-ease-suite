// Report Generation Utilities

export const generateProfitLoss = (ledgers, incomeHeads, expenseHeads, fromDate, toDate) => {
  const income = incomeHeads.reduce((sum, head) => {
    const ledger = ledgers.find(l => l.name === head.ledger)
    return sum + (ledger?.balance || 0)
  }, 0)

  const expenses = expenseHeads.reduce((sum, head) => {
    const ledger = ledgers.find(l => l.name === head.ledger)
    return sum + (ledger?.balance || 0)
  }, 0)

  return {
    income,
    expenses,
    netProfit: income - expenses,
    fromDate,
    toDate
  }
}

export const generateBalanceSheet = (ledgers, asOnDate) => {
  const assets = ledgers.filter(l => l.type === 'Asset').reduce((sum, l) => sum + (l.balance || 0), 0)
  const liabilities = ledgers.filter(l => l.type === 'Liability').reduce((sum, l) => sum + (l.balance || 0), 0)
  const equity = ledgers.filter(l => l.type === 'Equity').reduce((sum, l) => sum + (l.balance || 0), 0)

  return {
    assets,
    liabilities,
    equity,
    total: assets,
    asOnDate
  }
}

export const generateTrialBalance = (ledgers) => {
  return ledgers.map(ledger => ({
    name: ledger.name,
    debit: ledger.balance > 0 ? ledger.balance : 0,
    credit: ledger.balance < 0 ? Math.abs(ledger.balance) : 0
  }))
}

export const generateSalesReport = (sales, fromDate, toDate) => {
  const filteredSales = sales.filter(sale => {
    const saleDate = new Date(sale.date)
    return saleDate >= new Date(fromDate) && saleDate <= new Date(toDate)
  })

  const totalSales = filteredSales.reduce((sum, sale) => sum + (sale.total || 0), 0)
  const totalTax = filteredSales.reduce((sum, sale) => sum + (sale.tax || 0), 0)

  return {
    sales: filteredSales,
    totalSales,
    totalTax,
    count: filteredSales.length,
    fromDate,
    toDate
  }
}

export const generatePurchaseReport = (purchases, fromDate, toDate) => {
  const filteredPurchases = purchases.filter(purchase => {
    const purchaseDate = new Date(purchase.date)
    return purchaseDate >= new Date(fromDate) && purchaseDate <= new Date(toDate)
  })

  const totalPurchases = filteredPurchases.reduce((sum, p) => sum + (p.total || 0), 0)
  const totalTax = filteredPurchases.reduce((sum, p) => sum + (p.tax || 0), 0)

  return {
    purchases: filteredPurchases,
    totalPurchases,
    totalTax,
    count: filteredPurchases.length,
    fromDate,
    toDate
  }
}

export const generateAgedReceivables = (customers, sales, payments) => {
  return customers.map(customer => {
    const customerSales = sales.filter(s => s.customerName === customer.name)
    const customerPayments = payments.filter(p => p.entityName === customer.name && p.entityType === 'Customer')
    
    const totalSales = customerSales.reduce((sum, s) => sum + (s.total || 0), 0)
    const totalPayments = customerPayments.reduce((sum, p) => sum + (p.amount || 0), 0)
    const outstanding = totalSales - totalPayments

    const now = new Date()
    const aging = {
      current: 0,
      days30: 0,
      days60: 0,
      days90: 0,
      over90: 0
    }

    customerSales.forEach(sale => {
      const daysDiff = Math.floor((now - new Date(sale.date)) / (1000 * 60 * 60 * 24))
      const balance = sale.balance || sale.total
      
      if (daysDiff <= 30) aging.current += balance
      else if (daysDiff <= 60) aging.days30 += balance
      else if (daysDiff <= 90) aging.days60 += balance
      else if (daysDiff <= 120) aging.days90 += balance
      else aging.over90 += balance
    })

    return {
      customer: customer.name,
      totalSales,
      totalPayments,
      outstanding,
      aging
    }
  })
}

export const generateAgedPayables = (suppliers, purchases, payments) => {
  return suppliers.map(supplier => {
    const supplierPurchases = purchases.filter(p => p.supplier === supplier.name)
    const supplierPayments = payments.filter(p => p.entityName === supplier.name && p.entityType === 'Supplier')
    
    const totalPurchases = supplierPurchases.reduce((sum, p) => sum + (p.total || 0), 0)
    const totalPayments = supplierPayments.reduce((sum, p) => sum + (p.amount || 0), 0)
    const outstanding = totalPurchases - totalPayments

    const now = new Date()
    const aging = {
      current: 0,
      days30: 0,
      days60: 0,
      days90: 0,
      over90: 0
    }

    supplierPurchases.forEach(purchase => {
      const daysDiff = Math.floor((now - new Date(purchase.date)) / (1000 * 60 * 60 * 24))
      const balance = purchase.balance || purchase.total
      
      if (daysDiff <= 30) aging.current += balance
      else if (daysDiff <= 60) aging.days30 += balance
      else if (daysDiff <= 90) aging.days60 += balance
      else if (daysDiff <= 120) aging.days90 += balance
      else aging.over90 += balance
    })

    return {
      supplier: supplier.name,
      totalPurchases,
      totalPayments,
      outstanding,
      aging
    }
  })
}

export const generateHSNReport = (sales, purchases) => {
  const hsnMap = {}

  sales.forEach(sale => {
    sale.items?.forEach(item => {
      const hsn = item.hsn || 'N/A'
      if (!hsnMap[hsn]) {
        hsnMap[hsn] = {
          hsn,
          description: item.name,
          salesQty: 0,
          salesValue: 0,
          salesTax: 0,
          purchaseQty: 0,
          purchaseValue: 0,
          purchaseTax: 0
        }
      }
      hsnMap[hsn].salesQty += item.quantity || 0
      hsnMap[hsn].salesValue += (item.quantity || 0) * (item.rate || 0)
      hsnMap[hsn].salesTax += (item.quantity || 0) * (item.rate || 0) * ((item.tax || 0) / 100)
    })
  })

  purchases.forEach(purchase => {
    purchase.items?.forEach(item => {
      const hsn = item.hsn || 'N/A'
      if (!hsnMap[hsn]) {
        hsnMap[hsn] = {
          hsn,
          description: item.name,
          salesQty: 0,
          salesValue: 0,
          salesTax: 0,
          purchaseQty: 0,
          purchaseValue: 0,
          purchaseTax: 0
        }
      }
      hsnMap[hsn].purchaseQty += item.quantity || 0
      hsnMap[hsn].purchaseValue += (item.quantity || 0) * (item.rate || 0)
      hsnMap[hsn].purchaseTax += (item.quantity || 0) * (item.rate || 0) * ((item.tax || 0) / 100)
    })
  })

  return Object.values(hsnMap)
}

export const generateInventoryValuation = (items, stockTransactions) => {
  return items.map(item => {
    const stockIn = stockTransactions
      .filter(t => t.itemId === item.id.toString() && t.type === 'in')
      .reduce((sum, t) => sum + t.quantity, 0)
    
    const stockOut = stockTransactions
      .filter(t => t.itemId === item.id.toString() && t.type === 'out')
      .reduce((sum, t) => sum + t.quantity, 0)
    
    const closingStock = item.openingStock + stockIn - stockOut
    const stockValue = closingStock * item.costPrice

    return {
      code: item.code,
      name: item.name,
      openingStock: item.openingStock,
      stockIn,
      stockOut,
      closingStock,
      costPrice: item.costPrice,
      stockValue
    }
  })
}

export const exportReportToCSV = (reportData, filename) => {
  if (!reportData || reportData.length === 0) {
    alert('No data to export')
    return
  }

  const headers = Object.keys(reportData[0])
  const csvContent = [
    headers.join(','),
    ...reportData.map(row => 
      headers.map(header => {
        const value = row[header]
        if (value === null || value === undefined) return ''
        const stringValue = String(value)
        if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
          return `"${stringValue.replace(/"/g, '""')}"`
        }
        return stringValue
      }).join(',')
    )
  ].join('\n')

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  link.setAttribute('href', url)
  link.setAttribute('download', filename)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

