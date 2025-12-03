import React, { useState } from 'react'
import { Building2, Plus, Edit, Trash2, Search, Users, Truck, X, Save } from 'lucide-react'
import { usePOS } from '../POS'
import ToastContainer from './ToastContainer'
import '../POS.css'

const Entities = () => {
  const { entities, addEntity, updateEntity, deleteEntity } = usePOS()
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('')
  const [showEntityModal, setShowEntityModal] = useState(false)
  const [editingEntity, setEditingEntity] = useState(null)
  const [toasts, setToasts] = useState([])

  const showToast = (message, type = 'success', duration = 3000) => {
    const id = Date.now()
    setToasts([...toasts, { id, message, type, duration }])
  }

  const removeToast = (id) => {
    setToasts(toasts.filter(toast => toast.id !== id))
  }
  const [entityForm, setEntityForm] = useState({
    name: '',
    type: 'Customer',
    address: '',
    state: '',
    pincode: '',
    gstin: '',
    phone: '',
    email: '',
    city: ''
  })

  const filteredEntities = entities.filter(entity => {
    const matchesSearch = entity.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entity.gstin?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entity.address?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = !filterType || entity.type === filterType
    return matchesSearch && matchesType
  })

  const customers = entities.filter(e => e.type === 'Customer')
  const suppliers = entities.filter(e => e.type === 'Supplier')

  const handleAddEntity = () => {
    setEditingEntity(null)
    setEntityForm({
      name: '',
      type: 'Customer',
      address: '',
      state: '',
      pincode: '',
      gstin: '',
      phone: '',
      email: '',
      city: ''
    })
    setShowEntityModal(true)
  }

  const handleEditEntity = (entity) => {
    setEditingEntity(entity)
    setEntityForm({
      name: entity.name || '',
      type: entity.type || 'Customer',
      address: entity.address || '',
      state: entity.state || '',
      pincode: entity.pincode || '',
      gstin: entity.gstin || '',
      phone: entity.phone || '',
      email: entity.email || '',
      city: entity.city || ''
    })
    setShowEntityModal(true)
  }

  const validateGSTIN = (gstin) => {
    if (!gstin) return true // GSTIN is optional
    // GSTIN format: 15 characters, alphanumeric
    const gstinRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/
    return gstinRegex.test(gstin.toUpperCase())
  }

  const validatePincode = (pincode) => {
    if (!pincode) return true // Pincode is optional
    // Indian pincode: 6 digits
    const pincodeRegex = /^[0-9]{6}$/
    return pincodeRegex.test(pincode)
  }

  const handleSaveEntity = () => {
    // Mandatory validation: Name is required
    if (!entityForm.name.trim()) {
      showToast('Entity name is mandatory. Please enter a name.', 'error')
      return
    }

    if (entityForm.gstin && !validateGSTIN(entityForm.gstin)) {
      showToast('Invalid GSTIN format. GSTIN should be 15 characters (e.g., 27ABCDE1234F1Z5)', 'error')
      return
    }

    if (entityForm.pincode && !validatePincode(entityForm.pincode)) {
      showToast('Invalid Pincode format. Pincode should be 6 digits', 'error')
      return
    }

    const entityData = {
      name: entityForm.name.trim(),
      type: entityForm.type,
      address: entityForm.address.trim() || '',
      state: entityForm.state.trim() || '',
      pincode: entityForm.pincode.trim() || '',
      gstin: entityForm.gstin.trim().toUpperCase() || '',
      phone: entityForm.phone.trim() || '',
      email: entityForm.email.trim() || '',
      city: entityForm.city.trim() || ''
    }

    if (editingEntity) {
      updateEntity(editingEntity.id, entityData)
      showToast('Entity updated successfully!', 'success')
    } else {
      addEntity(entityData)
      showToast('Entity added successfully!', 'success')
    }

    setShowEntityModal(false)
    setEntityForm({
      name: '',
      type: 'Customer',
      address: '',
      state: '',
      pincode: '',
      gstin: '',
      phone: '',
      email: '',
      city: ''
    })
  }

  const indianStates = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
    'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
    'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
    'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
    'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
    'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu',
    'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry'
  ]

  return (
    <div className="pos-container">
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      <div className="page-header">
        <h2>Entity Management</h2>
        <div className="header-actions">
          <button className="action-btn" onClick={handleAddEntity}>
            <Plus size={18} />
            Add Entity
          </button>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">
            <Users size={24} />
          </div>
          <div className="stat-label">Total Customers</div>
          <div className="stat-value">{customers.length}</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <Truck size={24} />
          </div>
          <div className="stat-label">Total Suppliers</div>
          <div className="stat-value">{suppliers.length}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Total Entities</div>
          <div className="stat-value">{entities.length}</div>
        </div>
      </div>

      <div className="filters-section">
        <div className="search-box">
          <Search size={20} />
          <input
            type="text"
            placeholder="Search by name, GSTIN, or address..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          className="filter-select"
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
        >
          <option value="">All Types</option>
          <option value="Customer">Customers</option>
          <option value="Supplier">Suppliers</option>
        </select>
      </div>

      <div className="table-container">
        {filteredEntities.length === 0 ? (
          <div className="empty-state">
            <Building2 size={48} />
            <p>No entities found</p>
            <button className="action-btn" onClick={handleAddEntity} style={{ marginTop: '1rem' }}>
              <Plus size={18} />
              Add Your First Entity
            </button>
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Type</th>
                <th>Address</th>
                <th>City</th>
                <th>State</th>
                <th>Pincode</th>
                <th>GSTIN</th>
                <th>Phone</th>
                <th>Email</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEntities.map(entity => (
                <tr key={entity.id}>
                  <td>
                    <strong>{entity.name}</strong>
                  </td>
                  <td>
                    <span className={`entity-type-badge ${entity.type.toLowerCase()}`}>
                      {entity.type === 'Customer' ? <Users size={14} /> : <Truck size={14} />}
                      {entity.type}
                    </span>
                  </td>
                  <td>{entity.address || 'N/A'}</td>
                  <td>{entity.city || 'N/A'}</td>
                  <td>{entity.state || 'N/A'}</td>
                  <td>{entity.pincode || 'N/A'}</td>
                  <td>
                    {entity.gstin ? (
                      <span className="gstin-text">{entity.gstin}</span>
                    ) : (
                      <span className="no-data">N/A</span>
                    )}
                  </td>
                  <td>{entity.phone || 'N/A'}</td>
                  <td>{entity.email || 'N/A'}</td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="icon-btn"
                        onClick={() => handleEditEntity(entity)}
                        title="Edit Entity"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        className="icon-btn"
                        onClick={() => {
                          if (window.confirm(`Are you sure you want to delete ${entity.name}?`)) {
                            deleteEntity(entity.id)
                            showToast('Entity deleted successfully!', 'success')
                          }
                        }}
                        title="Delete Entity"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showEntityModal && (
        <div className="modal-overlay" onClick={() => setShowEntityModal(false)}>
          <div className="modal-content entity-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingEntity ? 'Edit Entity' : 'Add New Entity'}</h3>
              <button className="close-btn" onClick={() => setShowEntityModal(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Entity Type *</label>
                <div className="entity-type-selector">
                  <button
                    type="button"
                    className={`entity-type-btn ${entityForm.type === 'Customer' ? 'active' : ''}`}
                    onClick={() => setEntityForm({...entityForm, type: 'Customer'})}
                  >
                    <Users size={18} />
                    Customer
                  </button>
                  <button
                    type="button"
                    className={`entity-type-btn ${entityForm.type === 'Supplier' ? 'active' : ''}`}
                    onClick={() => setEntityForm({...entityForm, type: 'Supplier'})}
                  >
                    <Truck size={18} />
                    Supplier
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label>Name *</label>
                <input
                  type="text"
                  value={entityForm.name}
                  onChange={(e) => setEntityForm({...entityForm, name: e.target.value})}
                  placeholder="Enter entity name"
                  required
                />
              </div>

              <div className="form-group">
                <label>Address</label>
                <textarea
                  value={entityForm.address}
                  onChange={(e) => setEntityForm({...entityForm, address: e.target.value})}
                  placeholder="Enter full address"
                  rows="3"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>City</label>
                  <input
                    type="text"
                    value={entityForm.city}
                    onChange={(e) => setEntityForm({...entityForm, city: e.target.value})}
                    placeholder="Enter city"
                  />
                </div>
                <div className="form-group">
                  <label>State</label>
                  <select
                    value={entityForm.state}
                    onChange={(e) => setEntityForm({...entityForm, state: e.target.value})}
                  >
                    <option value="">Select State</option>
                    {indianStates.map(state => (
                      <option key={state} value={state}>{state}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Pincode</label>
                  <input
                    type="text"
                    value={entityForm.pincode}
                    onChange={(e) => setEntityForm({...entityForm, pincode: e.target.value.replace(/\D/g, '')})}
                    placeholder="6 digits"
                    maxLength="6"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>GSTIN</label>
                <input
                  type="text"
                  value={entityForm.gstin}
                  onChange={(e) => setEntityForm({...entityForm, gstin: e.target.value.toUpperCase().replace(/[^0-9A-Z]/g, '')})}
                  placeholder="15 characters (e.g., 27ABCDE1234F1Z5)"
                  maxLength="15"
                />
                <small>Format: 15 characters alphanumeric</small>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Phone</label>
                  <input
                    type="tel"
                    value={entityForm.phone}
                    onChange={(e) => setEntityForm({...entityForm, phone: e.target.value.replace(/\D/g, '')})}
                    placeholder="10 digits"
                    maxLength="10"
                  />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    value={entityForm.email}
                    onChange={(e) => setEntityForm({...entityForm, email: e.target.value})}
                    placeholder="email@example.com"
                  />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="cancel-btn" onClick={() => setShowEntityModal(false)}>
                Cancel
              </button>
              <button className="confirm-btn" onClick={handleSaveEntity}>
                <Save size={18} />
                {editingEntity ? 'Update' : 'Add'} Entity
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Entities

