// Label Printing Utility for Products and Inventory
import jsPDF from 'jspdf'
import JsBarcode from 'jsbarcode'

/**
 * Generate product label PDF
 * @param {Array} items - Array of product/inventory items
 * @param {Object} options - Label options (size, layout, etc.)
 * @returns {jsPDF} - PDF document with labels
 */
export const generateLabelPDF = (items, options = {}) => {
  const {
    labelWidth = 100, // mm
    labelHeight = 50, // mm
    labelsPerRow = 2,
    fontSize = 10,
    showBarcode = true,
    showQRCode = false,
    showPrice = true,
    showStock = false,
    showSKU = true
  } = options

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  })

  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()
  const margin = 10
  const spacing = 5

  let currentRow = 0
  let currentCol = 0
  let yPos = margin

  items.forEach((item, index) => {
    // Check if we need a new page
    if (yPos + labelHeight > pageHeight - margin) {
      doc.addPage()
      currentRow = 0
      currentCol = 0
      yPos = margin
    }

    const xPos = margin + (currentCol * (labelWidth + spacing))
    
    // Draw label border
    doc.setDrawColor(200, 200, 200)
    doc.setLineWidth(0.5)
    doc.rect(xPos, yPos, labelWidth, labelHeight)

    // Product Name
    doc.setFontSize(fontSize)
    doc.setFont('helvetica', 'bold')
    const nameLines = doc.splitTextToSize(item.name || 'N/A', labelWidth - 4)
    doc.text(nameLines, xPos + 2, yPos + 5)

    let textY = yPos + 8

    // SKU
    if (showSKU && item.sku) {
      doc.setFontSize(fontSize - 2)
      doc.setFont('helvetica', 'normal')
      doc.text(`SKU: ${item.sku}`, xPos + 2, textY)
      textY += 4
    }

    // Price
    if (showPrice && item.price !== undefined) {
      doc.setFontSize(fontSize - 1)
      doc.setFont('helvetica', 'bold')
      doc.text(`₹${parseFloat(item.price).toFixed(2)}`, xPos + 2, textY)
      textY += 4
    }

    // Stock
    if (showStock && item.stock !== undefined) {
      doc.setFontSize(fontSize - 2)
      doc.setFont('helvetica', 'normal')
      doc.text(`Stock: ${item.stock}`, xPos + 2, textY)
      textY += 4
    }

    // Barcode
    if (showBarcode && item.barcode) {
      try {
        // Create temporary canvas for barcode
        const canvas = document.createElement('canvas')
        JsBarcode(canvas, item.barcode, {
          format: 'EAN13',
          width: 1.5,
          height: 20,
          displayValue: true,
          fontSize: 10
        })

        // Convert canvas to image and add to PDF
        const imgData = canvas.toDataURL('image/png')
        const imgWidth = labelWidth - 4
        const imgHeight = (canvas.height / canvas.width) * imgWidth
        
        // Position barcode at bottom of label
        const barcodeY = yPos + labelHeight - imgHeight - 2
        doc.addImage(imgData, 'PNG', xPos + 2, barcodeY, imgWidth, imgHeight)
      } catch (e) {
        console.error('Barcode generation error:', e)
        // Fallback to text
        doc.setFontSize(fontSize - 3)
        doc.setFont('helvetica', 'normal')
        doc.text(item.barcode, xPos + 2, yPos + labelHeight - 3)
      }
    }

    // Move to next label position
    currentCol++
    if (currentCol >= labelsPerRow) {
      currentCol = 0
      currentRow++
      yPos += labelHeight + spacing
    }
  })

  return doc
}

/**
 * Print labels for selected items
 * @param {Array} items - Array of items to print labels for
 * @param {Object} options - Label options
 */
export const printLabels = (items, options = {}) => {
  if (!items || items.length === 0) {
    alert('No items selected for label printing')
    return
  }

  const doc = generateLabelPDF(items, options)
  doc.autoPrint()
  doc.output('dataurlnewwindow')
}

/**
 * Save labels PDF
 * @param {Array} items - Array of items
 * @param {Object} options - Label options
 * @param {String} filename - Optional filename
 */
export const saveLabelsPDF = (items, options = {}, filename = null) => {
  if (!items || items.length === 0) {
    alert('No items selected for label printing')
    return
  }

  const doc = generateLabelPDF(items, options)
  const defaultFilename = filename || `Product_Labels_${new Date().toISOString().split('T')[0]}.pdf`
  doc.save(defaultFilename)
}

/**
 * Generate single product label
 * @param {Object} item - Product/inventory item
 * @param {Object} options - Label options
 * @returns {jsPDF} - PDF document
 */
export const generateSingleLabelPDF = (item, options = {}) => {
  return generateLabelPDF([item], {
    labelWidth: 100,
    labelHeight: 60,
    labelsPerRow: 1,
    ...options
  })
}

