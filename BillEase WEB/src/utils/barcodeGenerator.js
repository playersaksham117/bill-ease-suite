/**
 * Utility functions for generating barcodes and QR codes
 */

/**
 * Generates a 13-digit EAN13 barcode
 * @returns {string} 13-digit barcode string
 */
export const generateBarcode = () => {
  // Generate a 13-digit barcode (EAN13 format)
  // First 12 digits are random, last digit is check digit
  const base = Math.floor(100000000000 + Math.random() * 900000000000).toString()
  
  // Calculate EAN13 check digit
  let sum = 0
  for (let i = 0; i < 12; i++) {
    const digit = parseInt(base[i])
    sum += i % 2 === 0 ? digit : digit * 3
  }
  const checkDigit = (10 - (sum % 10)) % 10
  
  return base + checkDigit.toString()
}

/**
 * Generates a unique barcode ensuring it doesn't conflict with existing barcodes
 * @param {Array} existingBarcodes - Array of existing barcode strings
 * @returns {string} Unique 13-digit barcode
 */
export const generateUniqueBarcode = (existingBarcodes = []) => {
  let barcode
  let attempts = 0
  const maxAttempts = 100
  
  do {
    barcode = generateBarcode()
    attempts++
    if (attempts > maxAttempts) {
      // Fallback: use timestamp-based barcode if too many conflicts
      const timestamp = Date.now().toString()
      barcode = timestamp.padStart(13, '0').substring(0, 13)
      break
    }
  } while (existingBarcodes.includes(barcode))
  
  return barcode
}

/**
 * Generates QR code data string for a product
 * @param {Object} product - Product object with id, name, sku, price, barcode
 * @returns {string} JSON string for QR code
 */
export const generateQRCodeData = (product) => {
  return JSON.stringify({
    id: product.id,
    name: product.name,
    sku: product.sku || '',
    price: product.price || 0,
    barcode: product.barcode || '',
    category: product.category || '',
    timestamp: new Date().toISOString()
  })
}

/**
 * Validates if a barcode is in correct EAN13 format
 * @param {string} barcode - Barcode string to validate
 * @returns {boolean} True if valid EAN13 format
 */
export const validateBarcode = (barcode) => {
  if (!barcode || typeof barcode !== 'string') return false
  if (barcode.length !== 13) return false
  if (!/^\d+$/.test(barcode)) return false
  
  // Validate check digit
  let sum = 0
  for (let i = 0; i < 12; i++) {
    const digit = parseInt(barcode[i])
    sum += i % 2 === 0 ? digit : digit * 3
  }
  const checkDigit = (10 - (sum % 10)) % 10
  return checkDigit === parseInt(barcode[12])
}

/**
 * Normalizes a barcode to 13 digits (pads or truncates)
 * @param {string} barcode - Barcode string to normalize
 * @returns {string} Normalized 13-digit barcode
 */
export const normalizeBarcode = (barcode) => {
  if (!barcode) return generateBarcode()
  
  const digits = barcode.replace(/\D/g, '') // Remove non-digits
  
  if (digits.length === 0) return generateBarcode()
  
  if (digits.length < 13) {
    // Pad with zeros
    return digits.padStart(13, '0')
  } else if (digits.length > 13) {
    // Truncate to 13 digits
    return digits.substring(0, 13)
  }
  
  return digits
}

