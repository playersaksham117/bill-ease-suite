// Excel/CSV Import/Export Utilities

export const exportToCSV = (data, filename = 'export.csv') => {
  if (!data || data.length === 0) {
    alert('No data to export')
    return
  }

  // Get headers from first object
  const headers = Object.keys(data[0])
  
  // Create CSV content
  const csvContent = [
    headers.join(','), // Header row
    ...data.map(row => 
      headers.map(header => {
        const value = row[header]
        // Handle values with commas, quotes, or newlines
        if (value === null || value === undefined) return ''
        const stringValue = String(value)
        if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
          return `"${stringValue.replace(/"/g, '""')}"`
        }
        return stringValue
      }).join(',')
    )
  ].join('\n')

  // Create blob and download
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

export const importFromCSV = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    
    reader.onload = (e) => {
      try {
        const text = e.target.result
        const lines = text.split('\n').filter(line => line.trim())
        
        if (lines.length === 0) {
          reject(new Error('File is empty'))
          return
        }

        // Parse header
        const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''))
        
        // Parse data rows
        const data = lines.slice(1).map(line => {
          const values = []
          let currentValue = ''
          let inQuotes = false
          
          for (let i = 0; i < line.length; i++) {
            const char = line[i]
            
            if (char === '"') {
              if (inQuotes && line[i + 1] === '"') {
                currentValue += '"'
                i++ // Skip next quote
              } else {
                inQuotes = !inQuotes
              }
            } else if (char === ',' && !inQuotes) {
              values.push(currentValue.trim())
              currentValue = ''
            } else {
              currentValue += char
            }
          }
          values.push(currentValue.trim()) // Add last value
          
          const row = {}
          headers.forEach((header, index) => {
            row[header] = values[index] || ''
          })
          return row
        })
        
        resolve(data)
      } catch (error) {
        reject(error)
      }
    }
    
    reader.onerror = () => reject(new Error('Failed to read file'))
    reader.readAsText(file)
  })
}

export const exportToExcel = (data, filename = 'export.xlsx', sheetName = 'Sheet1') => {
  // For Excel export, we'll use CSV format (which Excel can open)
  // In a production app, you'd use a library like xlsx or exceljs
  exportToCSV(data, filename.replace('.xlsx', '.csv'))
}

export const importFromExcel = (file) => {
  // For Excel import, we'll treat it as CSV for now
  // In a production app, you'd use a library like xlsx or exceljs
  return importFromCSV(file)
}

// Template generators for common imports
export const generateImportTemplate = (fields, filename = 'import_template.csv') => {
  const template = [fields.join(',')]
  exportToCSV([{}], filename)
}

