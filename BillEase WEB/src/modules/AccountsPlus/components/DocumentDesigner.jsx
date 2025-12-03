import React, { useState } from 'react'
import { FileText, Image, Table, Type, Calendar, Hash, User, Building, DollarSign, Plus, Trash2, Save, Download, Eye, Grid, Layout } from 'lucide-react'
import './DocumentDesigner.css'

const DocumentDesigner = () => {
  const [selectedTemplate, setSelectedTemplate] = useState(null)
  const [documentFields, setDocumentFields] = useState([])
  const [draggedField, setDraggedField] = useState(null)
  const [selectedField, setSelectedField] = useState(null)

  const templates = [
    { id: 'invoice', name: 'Invoice', icon: FileText },
    { id: 'purchase-order', name: 'Purchase Order', icon: FileText },
    { id: 'quotation', name: 'Quotation', icon: FileText },
    { id: 'receipt', name: 'Receipt', icon: FileText },
    { id: 'delivery-challan', name: 'Delivery Challan', icon: FileText }
  ]

  const fieldTypes = [
    { id: 'text', name: 'Text Field', icon: Type, component: 'input' },
    { id: 'textarea', name: 'Text Area', icon: FileText, component: 'textarea' },
    { id: 'number', name: 'Number', icon: Hash, component: 'input' },
    { id: 'date', name: 'Date', icon: Calendar, component: 'input' },
    { id: 'image', name: 'Image', icon: Image, component: 'img' },
    { id: 'table', name: 'Table', icon: Table, component: 'table' },
    { id: 'customer-name', name: 'Customer Name', icon: User, component: 'text' },
    { id: 'company-name', name: 'Company Name', icon: Building, component: 'text' },
    { id: 'amount', name: 'Amount', icon: DollarSign, component: 'text' }
  ]

  const handleDragStart = (e, field) => {
    setDraggedField(field)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = (e) => {
    e.preventDefault()
    if (draggedField) {
      const newField = {
        id: Date.now(),
        type: draggedField.id,
        name: draggedField.name,
        component: draggedField.component,
        x: 0,
        y: 0,
        width: '100%',
        height: 'auto',
        properties: {}
      }
      setDocumentFields([...documentFields, newField])
      setDraggedField(null)
    }
  }

  const handleFieldClick = (field) => {
    setSelectedField(field)
  }

  const handleFieldDelete = (fieldId) => {
    setDocumentFields(documentFields.filter(f => f.id !== fieldId))
    if (selectedField?.id === fieldId) {
      setSelectedField(null)
    }
  }

  const handleFieldUpdate = (fieldId, updates) => {
    setDocumentFields(documentFields.map(f =>
      f.id === fieldId ? { ...f, ...updates } : f
    ))
    if (selectedField?.id === fieldId) {
      setSelectedField({ ...selectedField, ...updates })
    }
  }

  const renderPreviewField = (field) => {
    const baseStyle = {
      padding: '0.5rem',
      border: selectedField?.id === field.id ? '2px solid #007bff' : '1px dashed #dee2e6',
      borderRadius: '4px',
      marginBottom: '0.5rem',
      cursor: 'pointer',
      backgroundColor: selectedField?.id === field.id ? '#f0f7ff' : 'white'
    }

    switch (field.component) {
      case 'input':
        return (
          <div key={field.id} style={baseStyle} onClick={() => handleFieldClick(field)}>
            <input
              type={field.type === 'number' ? 'number' : field.type === 'date' ? 'date' : 'text'}
              placeholder={field.name}
              style={{ width: '100%', padding: '0.5rem', border: '1px solid #dee2e6', borderRadius: '4px' }}
            />
          </div>
        )
      case 'textarea':
        return (
          <div key={field.id} style={baseStyle} onClick={() => handleFieldClick(field)}>
            <textarea
              placeholder={field.name}
              rows="3"
              style={{ width: '100%', padding: '0.5rem', border: '1px solid #dee2e6', borderRadius: '4px' }}
            />
          </div>
        )
      case 'img':
        return (
          <div key={field.id} style={baseStyle} onClick={() => handleFieldClick(field)}>
            <div style={{ padding: '2rem', border: '1px dashed #dee2e6', textAlign: 'center', color: '#6c757d' }}>
              <Image size={24} />
              <p style={{ margin: '0.5rem 0 0 0' }}>Image Placeholder</p>
            </div>
          </div>
        )
      case 'table':
        return (
          <div key={field.id} style={baseStyle} onClick={() => handleFieldClick(field)}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={{ border: '1px solid #dee2e6', padding: '0.5rem' }}>Column 1</th>
                  <th style={{ border: '1px solid #dee2e6', padding: '0.5rem' }}>Column 2</th>
                  <th style={{ border: '1px solid #dee2e6', padding: '0.5rem' }}>Column 3</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ border: '1px solid #dee2e6', padding: '0.5rem' }}>Data 1</td>
                  <td style={{ border: '1px solid #dee2e6', padding: '0.5rem' }}>Data 2</td>
                  <td style={{ border: '1px solid #dee2e6', padding: '0.5rem' }}>Data 3</td>
                </tr>
              </tbody>
            </table>
          </div>
        )
      case 'text':
      default:
        return (
          <div key={field.id} style={baseStyle} onClick={() => handleFieldClick(field)}>
            <div style={{ padding: '0.5rem', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
              {field.name}
            </div>
          </div>
        )
    }
  }

  return (
    <div className="document-designer">
      <div className="designer-header">
        <h2>Document Designer</h2>
        <div className="header-actions">
          <button className="btn-secondary">
            <Eye size={18} />
            Preview
          </button>
          <button className="btn-secondary">
            <Save size={18} />
            Save Template
          </button>
          <button className="btn-primary">
            <Download size={18} />
            Export
          </button>
        </div>
      </div>

      {/* Templates Bar */}
      <div className="templates-bar">
        <div className="templates-scroll">
          {templates.map(template => (
            <button
              key={template.id}
              className={`template-btn ${selectedTemplate === template.id ? 'active' : ''}`}
              onClick={() => setSelectedTemplate(template.id)}
            >
              <template.icon size={20} />
              <span>{template.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="designer-content">
        {/* Left Panel - Fields */}
        <div className="fields-panel">
          <div className="panel-header">
            <h3>Fields</h3>
            <span className="panel-subtitle">Drag to add</span>
          </div>
          <div className="fields-list">
            {fieldTypes.map(field => (
              <div
                key={field.id}
                className="field-item"
                draggable
                onDragStart={(e) => handleDragStart(e, field)}
              >
                <field.icon size={18} />
                <span>{field.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Center Panel - Live Preview */}
        <div className="preview-panel">
          <div className="panel-header">
            <h3>Live Preview</h3>
            <div className="preview-controls">
              <button className="icon-btn" title="Grid View">
                <Grid size={16} />
              </button>
              <button className="icon-btn" title="Layout View">
                <Layout size={16} />
              </button>
            </div>
          </div>
          <div
            className="preview-area"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            {documentFields.length === 0 ? (
              <div className="empty-preview">
                <FileText size={48} />
                <p>Drag fields from the left panel to start designing</p>
              </div>
            ) : (
              <div className="preview-content">
                {documentFields.map(field => renderPreviewField(field))}
              </div>
            )}
          </div>
        </div>

        {/* Right Panel - Properties */}
        <div className="properties-panel">
          <div className="panel-header">
            <h3>Properties</h3>
          </div>
          {selectedField ? (
            <div className="properties-content">
              <div className="property-group">
                <label>Field Name</label>
                <input
                  type="text"
                  value={selectedField.name}
                  onChange={(e) => handleFieldUpdate(selectedField.id, { name: e.target.value })}
                />
              </div>
              <div className="property-group">
                <label>Width</label>
                <input
                  type="text"
                  value={selectedField.width}
                  onChange={(e) => handleFieldUpdate(selectedField.id, { width: e.target.value })}
                />
              </div>
              <div className="property-group">
                <label>Height</label>
                <input
                  type="text"
                  value={selectedField.height}
                  onChange={(e) => handleFieldUpdate(selectedField.id, { height: e.target.value })}
                />
              </div>
              <div className="property-actions">
                <button
                  className="btn-danger"
                  onClick={() => handleFieldDelete(selectedField.id)}
                >
                  <Trash2 size={16} />
                  Delete Field
                </button>
              </div>
            </div>
          ) : (
            <div className="no-selection">
              <p>Select a field to edit properties</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default DocumentDesigner

