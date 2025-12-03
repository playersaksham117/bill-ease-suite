// PDF Generator Utility for POS Invoices
import jsPDF from 'jspdf'

/**
 * Generate PDF from invoice/sale data
 * @param {Object} sale - Sale/invoice data object
 * @returns {jsPDF} - PDF document object
 */
export const generateInvoicePDF = (sale) => {
  const doc = new jsPDF()
  const pageWidth = doc.internal.pageSize.getWidth()
  const margin = 15
  let yPos = margin

  // Helper function to add text with word wrap
  const addText = (text, x, y, maxWidth, fontSize = 10, align = 'left') => {
    doc.setFontSize(fontSize)
    const lines = doc.splitTextToSize(text, maxWidth)
    doc.text(lines, x, y, { align })
    return y + (lines.length * fontSize * 0.4)
  }

  // Header
  doc.setFontSize(20)
  doc.setFont('helvetica', 'bold')
  doc.text('BillEase Suite', pageWidth / 2, yPos, { align: 'center' })
  yPos += 8

  doc.setFontSize(12)
  doc.setFont('helvetica', 'normal')
  doc.text('Invoice/Bill', pageWidth / 2, yPos, { align: 'center' })
  yPos += 10

  // Invoice Details
  doc.setFontSize(10)
  doc.setFont('helvetica', 'bold')
  doc.text(`Invoice No: ${sale.invoiceNumber || `#${sale.id}`}`, margin, yPos)
  yPos += 6

  const invoiceDate = new Date(sale.date).toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
  doc.setFont('helvetica', 'normal')
  doc.text(`Date: ${invoiceDate}`, margin, yPos)
  yPos += 6

  doc.text(`Type: ${sale.entityType === 'Supplier' ? 'Purchase Invoice' : 'Sales Invoice'}`, margin, yPos)
  yPos += 6

  doc.text(`Invoice Type: ${(sale.invoiceType || 'cash').toUpperCase()}`, margin, yPos)
  yPos += 6

  doc.text(`Payment Method: ${(sale.paymentMethod || 'cash').toUpperCase()}`, margin, yPos)
  yPos += 8

  // Customer/Supplier Information
  doc.setFont('helvetica', 'bold')
  doc.text(`${sale.entityType === 'Supplier' ? 'Supplier' : 'Customer'} Information:`, margin, yPos)
  yPos += 6

  doc.setFont('helvetica', 'normal')
  yPos = addText(`Name: ${sale.customerName || 'N/A'}`, margin, yPos, pageWidth - 2 * margin, 10)
  yPos += 2

  if (sale.entityDetails) {
    if (sale.entityDetails.email) {
      yPos = addText(`Email: ${sale.entityDetails.email}`, margin, yPos, pageWidth - 2 * margin, 10)
      yPos += 2
    }
    if (sale.entityDetails.phone) {
      yPos = addText(`Phone: ${sale.entityDetails.phone}`, margin, yPos, pageWidth - 2 * margin, 10)
      yPos += 2
    }
    if (sale.entityDetails.address) {
      yPos = addText(`Address: ${sale.entityDetails.address}`, margin, yPos, pageWidth - 2 * margin, 10)
      yPos += 2
    }
  }
  yPos += 5

  // Items Table Header
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(10)
  doc.text('Items:', margin, yPos)
  yPos += 6

  // Table Header
  const tableTop = yPos
  doc.setFontSize(9)
  doc.text('Product', margin, yPos)
  doc.text('Price', margin + 60, yPos)
  doc.text('Qty', margin + 90, yPos)
  doc.text('Subtotal', margin + 110, yPos, { align: 'right' })
  yPos += 5

  // Draw line
  doc.setLineWidth(0.5)
  doc.line(margin, yPos, pageWidth - margin, yPos)
  yPos += 3

  // Items
  doc.setFont('helvetica', 'normal')
  sale.items.forEach((item) => {
    if (yPos > 250) {
      doc.addPage()
      yPos = margin
    }
    doc.text(item.name.substring(0, 25), margin, yPos)
    doc.text(`₹${item.price.toFixed(2)}`, margin + 60, yPos)
    doc.text(item.quantity.toString(), margin + 90, yPos)
    doc.text(`₹${item.subtotal.toFixed(2)}`, margin + 110, yPos, { align: 'right' })
    yPos += 6
  })

  yPos += 3
  doc.setLineWidth(0.5)
  doc.line(margin, yPos, pageWidth - margin, yPos)
  yPos += 8

  // Summary
  doc.setFont('helvetica', 'normal')
  doc.text(`Subtotal:`, pageWidth - margin - 50, yPos, { align: 'right' })
  doc.text(`₹${(sale.subtotal || 0).toFixed(2)}`, pageWidth - margin, yPos, { align: 'right' })
  yPos += 6

  doc.text(`Tax (18%):`, pageWidth - margin - 50, yPos, { align: 'right' })
  doc.text(`₹${(sale.tax || 0).toFixed(2)}`, pageWidth - margin, yPos, { align: 'right' })
  yPos += 6

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(12)
  doc.text(`Total:`, pageWidth - margin - 50, yPos, { align: 'right' })
  doc.text(`₹${(sale.total || 0).toFixed(2)}`, pageWidth - margin, yPos, { align: 'right' })
  yPos += 8

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10)
  doc.text(`Amount Paid:`, pageWidth - margin - 50, yPos, { align: 'right' })
  doc.text(`₹${(sale.amountPaid || 0).toFixed(2)}`, pageWidth - margin, yPos, { align: 'right' })
  yPos += 6

  if (sale.change > 0) {
    doc.text(`Change:`, pageWidth - margin - 50, yPos, { align: 'right' })
    doc.text(`₹${sale.change.toFixed(2)}`, pageWidth - margin, yPos, { align: 'right' })
    yPos += 6
  }

  if (sale.balance > 0) {
    doc.setFont('helvetica', 'bold')
    doc.text(`Balance:`, pageWidth - margin - 50, yPos, { align: 'right' })
    doc.text(`₹${sale.balance.toFixed(2)}`, pageWidth - margin, yPos, { align: 'right' })
  }

  // Footer
  const totalPages = doc.internal.pages.length - 1
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i)
    doc.setFontSize(8)
    doc.setFont('helvetica', 'italic')
    doc.text(
      `Page ${i} of ${totalPages} - Generated by BillEase Suite`,
      pageWidth / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: 'center' }
    )
  }

  return doc
}

/**
 * Save PDF to file
 * @param {Object} sale - Sale/invoice data
 * @param {String} filename - Optional filename
 */
export const saveInvoicePDF = (sale, filename = null) => {
  const doc = generateInvoicePDF(sale)
  const invoiceNumber = sale.invoiceNumber || `INV-${sale.id}`
  const defaultFilename = filename || `Invoice_${invoiceNumber}_${new Date().toISOString().split('T')[0]}.pdf`
  doc.save(defaultFilename)
}

/**
 * Print PDF
 * @param {Object} sale - Sale/invoice data
 */
export const printInvoicePDF = (sale) => {
  const doc = generateInvoicePDF(sale)
  doc.autoPrint()
  doc.output('dataurlnewwindow')
}

/**
 * Get PDF as Blob for sharing
 * @param {Object} sale - Sale/invoice data
 * @returns {Promise<Blob>} - PDF blob
 */
export const getInvoicePDFBlob = (sale) => {
  return new Promise((resolve) => {
    const doc = generateInvoicePDF(sale)
    const pdfBlob = doc.output('blob')
    resolve(pdfBlob)
  })
}

/**
 * Share PDF via Email
 * @param {Object} sale - Sale/invoice data
 * @param {String} email - Recipient email
 */
export const shareInvoiceViaEmail = async (sale, email = null) => {
  const invoiceNumber = sale.invoiceNumber || `INV-${sale.id}`
  const subject = encodeURIComponent(`Invoice ${invoiceNumber} from BillEase Suite`)
  const body = encodeURIComponent(
    `Please find attached the invoice ${invoiceNumber}.\n\n` +
    `Invoice Details:\n` +
    `- Invoice Number: ${invoiceNumber}\n` +
    `- Date: ${new Date(sale.date).toLocaleDateString()}\n` +
    `- Total Amount: ₹${sale.total.toFixed(2)}\n\n` +
    `Thank you for your business!`
  )

  // Generate PDF blob
  const pdfBlob = await getInvoicePDFBlob(sale)
  const pdfUrl = URL.createObjectURL(pdfBlob)

  // Create mailto link with attachment (note: attachments don't work in mailto, so we'll use a different approach)
  // For email sharing, we'll provide download link or use a service
  const mailtoLink = `mailto:${email || ''}?subject=${subject}&body=${body}`
  
  // Open email client
  window.location.href = mailtoLink

  // Also download PDF for user to attach manually
  setTimeout(() => {
    saveInvoicePDF(sale)
  }, 500)
}

/**
 * Share PDF via WhatsApp
 * @param {Object} sale - Sale/invoice data
 * @param {String} phoneNumber - Recipient phone number (optional)
 */
export const shareInvoiceViaWhatsApp = async (sale, phoneNumber = null) => {
  const invoiceNumber = sale.invoiceNumber || `INV-${sale.id}`
  const message = encodeURIComponent(
    `Invoice ${invoiceNumber} from BillEase Suite\n\n` +
    `Invoice Details:\n` +
    `- Invoice Number: ${invoiceNumber}\n` +
    `- Date: ${new Date(sale.date).toLocaleDateString()}\n` +
    `- Total Amount: ₹${sale.total.toFixed(2)}\n\n` +
    `Please find the PDF attached.`
  )

  // Generate PDF and create download link
  const pdfBlob = await getInvoicePDFBlob(sale)
  const pdfUrl = URL.createObjectURL(pdfBlob)
  
  // Create download link first
  const link = document.createElement('a')
  link.href = pdfUrl
  link.download = `Invoice_${invoiceNumber}.pdf`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(pdfUrl)

  // Open WhatsApp
  const whatsappUrl = phoneNumber
    ? `https://wa.me/${phoneNumber.replace(/[^0-9]/g, '')}?text=${message}`
    : `https://web.whatsapp.com/send?text=${message}`
  
  window.open(whatsappUrl, '_blank')
}

