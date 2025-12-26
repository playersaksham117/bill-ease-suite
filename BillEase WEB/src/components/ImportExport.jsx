import React, { useState } from 'react'
import { Upload, Download, FileText, X, CheckCircle, AlertCircle } from 'lucide-react'
import { importFromCSV, exportToCSV, importFromExcel, exportToExcel } from '../utils/importExport'
import './ImportExport.css'

const ImportExport = ({ 
  data = [], 
  onImport, 
  onExport, 
  filename = 'export',
  importFields = [],
  exportFields = [],
  title = 'Import/Export Data'
}) => {
  const [importFile, setImportFile] = useState(null)
  const [importStatus, setImportStatus] = useState(null)
  const [isImporting, setIsImporting] = useState(false)

  const handleFileSelect = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImportFile(file)
      setImportStatus(null)
    }
  }

  const handleImport = async () => {
    if (!importFile) {
      setImportStatus({ type: 'error', message: 'Please select a file' })
      return
    }

    setIsImporting(true)
    setImportStatus(null)

    try {
      let importedData
      const fileExtension = importFile.name.split('.').pop().toLowerCase()
      
      if (fileExtension === 'csv') {
        importedData = await importFromCSV(importFile)
      } else if (['xlsx', 'xls'].includes(fileExtension)) {
        importedData = await importFromExcel(importFile)
      } else {
        throw new Error('Unsupported file format. Please use CSV or Excel files.')
      }

      if (onImport) {
        onImport(importedData)
      }
      
      setImportStatus({ 
        type: 'success', 
        message: `Successfully imported ${importedData.length} records` 
      })
      setImportFile(null)
      e.target.value = '' // Reset file input
    } catch (error) {
      setImportStatus({ 
        type: 'error', 
        message: error.message || 'Failed to import file' 
      })
    } finally {
      setIsImporting(false)
    }
  }

  const handleExport = (format = 'csv') => {
    try {
      const exportData = onExport ? onExport() : data
      
      if (!exportData || exportData.length === 0) {
        setImportStatus({ type: 'error', message: 'No data to export' })
        return
      }

      if (format === 'csv') {
        exportToCSV(exportData, `${filename}.csv`)
      } else {
        exportToExcel(exportData, `${filename}.xlsx`)
      }
      
      setImportStatus({ 
        type: 'success', 
        message: `Successfully exported ${exportData.length} records` 
      })
    } catch (error) {
      setImportStatus({ 
        type: 'error', 
        message: error.message || 'Failed to export data' 
      })
    }
  }

  return (
    <div className="import-export-container">
      <h4>{title}</h4>
      
      <div className="import-export-actions">
        {/* Import Section */}
        <div className="import-section">
          <label className="import-label">
            <Upload size={18} />
            Import Data
          </label>
          <div className="import-controls">
            <input
              type="file"
              accept=".csv,.xlsx,.xls"
              onChange={handleFileSelect}
              className="file-input"
              id={`import-file-${filename}`}
            />
            <label htmlFor={`import-file-${filename}`} className="file-input-label">
              {importFile ? importFile.name : 'Choose File'}
            </label>
            {importFile && (
              <button 
                className="remove-file-btn"
                onClick={() => {
                  setImportFile(null)
                  setImportStatus(null)
                  document.getElementById(`import-file-${filename}`).value = ''
                }}
              >
                <X size={16} />
              </button>
            )}
            <button 
              className="import-btn"
              onClick={handleImport}
              disabled={!importFile || isImporting}
            >
              {isImporting ? 'Importing...' : 'Import'}
            </button>
          </div>
          {importFields.length > 0 && (
            <div className="import-fields-info">
              <p><strong>Expected Fields:</strong></p>
              <div className="fields-list">
                {importFields.map((field, idx) => (
                  <span key={idx} className="field-tag">{field}</span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Export Section */}
        <div className="export-section">
          <label className="export-label">
            <Download size={18} />
            Export Data
          </label>
          <div className="export-controls">
            <button 
              className="export-btn csv"
              onClick={() => handleExport('csv')}
              disabled={(!data || data.length === 0) && !onExport}
            >
              <FileText size={16} />
              Export CSV
            </button>
            <button 
              className="export-btn excel"
              onClick={() => handleExport('excel')}
              disabled={(!data || data.length === 0) && !onExport}
            >
              <FileText size={16} />
              Export Excel
            </button>
          </div>
          {exportFields.length > 0 && (
            <div className="export-fields-info">
              <p><strong>Export Fields:</strong></p>
              <div className="fields-list">
                {exportFields.map((field, idx) => (
                  <span key={idx} className="field-tag">{field}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Status Message */}
      {importStatus && (
        <div className={`import-status ${importStatus.type}`}>
          {importStatus.type === 'success' ? (
            <CheckCircle size={16} />
          ) : (
            <AlertCircle size={16} />
          )}
          <span>{importStatus.message}</span>
        </div>
      )}
    </div>
  )
}

export default ImportExport

