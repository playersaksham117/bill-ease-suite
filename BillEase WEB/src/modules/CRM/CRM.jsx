import React, { useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Plus, Search, Mail, Phone, MapPin, Edit, Trash2, UserCheck, Calendar, MessageSquare, TrendingUp, Users, Building2, DollarSign, Clock, CheckCircle, XCircle, AlertCircle, BarChart3, FileText, X } from 'lucide-react'
import { crmAPI } from '../../utils/api'
import './CRM.css'

const CRM = () => {
  const [customers, setCustomers] = useState([])
  const [leads, setLeads] = useState([])
  const [activities, setActivities] = useState([])
  const [communications, setCommunications] = useState([])
  const [analytics, setAnalytics] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [showLeadModal, setShowLeadModal] = useState(false)
  const [showActivityModal, setShowActivityModal] = useState(false)
  const [showCommunicationModal, setShowCommunicationModal] = useState(false)
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', address: '', status: 'Active', company: '', notes: '' })
  const [formErrors, setFormErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [leadForm, setLeadForm] = useState({ name: '', email: '', phone: '', company: '', source: '', status: 'New', value: '', notes: '', assigned_to: '' })
  const [activityForm, setActivityForm] = useState({ customer_id: '', lead_id: '', type: 'call', title: '', description: '', date: new Date().toISOString().split('T')[0], time: '', status: 'Pending' })
  const [communicationForm, setCommunicationForm] = useState({ customer_id: '', lead_id: '', type: 'email', subject: '', content: '', date: new Date().toISOString().split('T')[0] })
  const [selectedCustomer, setSelectedCustomer] = useState(null)
  const [selectedLead, setSelectedLead] = useState(null)
  const [filter, setFilter] = useState('all')
  const [leadFilter, setLeadFilter] = useState('all')
  const [modalType, setModalType] = useState('add')

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    setError(null)
    try {
      const [customersData, leadsData, activitiesData, communicationsData, analyticsData] = await Promise.all([
        crmAPI.getCustomers().catch(() => []),
        crmAPI.getLeads().catch(() => []),
        crmAPI.getActivities().catch(() => []),
        crmAPI.getCommunications().catch(() => []),
        crmAPI.getAnalytics().catch(() => null)
      ])
      
      setCustomers(customersData)
      setLeads(leadsData)
      setActivities(activitiesData)
      setCommunications(communicationsData)
      setAnalytics(analyticsData)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const validateCustomerForm = () => {
    const errors = {}
    
    if (!formData.name || formData.name.trim() === '') {
      errors.name = 'Name is required'
    }
    
    if (formData.email && formData.email.trim() !== '') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(formData.email)) {
        errors.email = 'Invalid email format'
      }
    }
    
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (isSubmitting) return
    
    if (!validateCustomerForm()) {
      return
    }
    
    setIsSubmitting(true)
    setFormErrors({})
    
    try {
      const customerData = {
        name: formData.name.trim(),
        email: (formData.email || '').trim(),
        phone: (formData.phone || '').trim(),
        address: (formData.address || '').trim(),
        status: formData.status || 'Active',
        company: (formData.company || '').trim(),
        notes: (formData.notes || '').trim()
      }
      
      if (modalType === 'add') {
        await crmAPI.createCustomer(customerData)
      } else {
        if (!selectedCustomer || !selectedCustomer.id) {
          throw new Error('Invalid customer selected')
        }
        await crmAPI.updateCustomer(selectedCustomer.id, customerData)
      }
      await loadData()
      setShowModal(false)
      setFormData({ name: '', email: '', phone: '', address: '', status: 'Active', company: '', notes: '' })
      setFormErrors({})
      setSelectedCustomer(null)
      setModalType('add')
    } catch (err) {
      const errorMessage = err.message || 'Error saving customer'
      setFormErrors({ submit: errorMessage })
    } finally {
      setIsSubmitting(false)
    }
  }

  const validateLeadForm = () => {
    const errors = {}
    
    if (!leadForm.name || leadForm.name.trim() === '') {
      errors.name = 'Name is required'
    }
    
    if (leadForm.email && leadForm.email.trim() !== '') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(leadForm.email)) {
        errors.email = 'Invalid email format'
      }
    }
    
    if (leadForm.value && leadForm.value !== '') {
      const value = parseFloat(leadForm.value)
      if (isNaN(value) || value < 0) {
        errors.value = 'Value must be a positive number'
      }
    }
    
    return Object.keys(errors).length === 0
  }

  const handleLeadSubmit = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (!validateLeadForm()) {
      return
    }
    
    try {
      const leadData = {
        name: leadForm.name.trim(),
        email: (leadForm.email || '').trim(),
        phone: (leadForm.phone || '').trim(),
        company: (leadForm.company || '').trim(),
        source: (leadForm.source || '').trim(),
        status: leadForm.status || 'New',
        value: leadForm.value ? parseFloat(leadForm.value) || 0 : 0,
        notes: (leadForm.notes || '').trim(),
        assigned_to: (leadForm.assigned_to || '').trim()
      }
      
      if (modalType === 'add') {
        await crmAPI.createLead(leadData)
      } else {
        if (!selectedLead || !selectedLead.id) {
          throw new Error('Invalid lead selected')
        }
        await crmAPI.updateLead(selectedLead.id, leadData)
      }
      await loadData()
      setShowLeadModal(false)
      setLeadForm({ name: '', email: '', phone: '', company: '', source: '', status: 'New', value: '', notes: '', assigned_to: '' })
      setSelectedLead(null)
      setModalType('add')
    } catch (err) {
      alert('Error saving lead: ' + (err.message || 'Unknown error'))
    }
  }

  const handleActivitySubmit = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (!activityForm.title || activityForm.title.trim() === '') {
      alert('Title is required')
      return
    }
    
    if (!activityForm.date || activityForm.date === '') {
      alert('Date is required')
      return
    }
    
    try {
      const activityData = {
        customer_id: activityForm.customer_id || null,
        lead_id: activityForm.lead_id || null,
        type: activityForm.type || 'call',
        title: activityForm.title.trim(),
        description: (activityForm.description || '').trim(),
        date: activityForm.date,
        time: (activityForm.time || '').trim(),
        status: activityForm.status || 'Pending'
      }
      await crmAPI.createActivity(activityData)
      await loadData()
      setShowActivityModal(false)
      setActivityForm({ customer_id: '', lead_id: '', type: 'call', title: '', description: '', date: new Date().toISOString().split('T')[0], time: '', status: 'Pending' })
    } catch (err) {
      alert('Error saving activity: ' + (err.message || 'Unknown error'))
    }
  }

  const handleCommunicationSubmit = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (!communicationForm.content || communicationForm.content.trim() === '') {
      alert('Content is required')
      return
    }
    
    if (!communicationForm.date || communicationForm.date === '') {
      alert('Date is required')
      return
    }
    
    try {
      const commData = {
        customer_id: communicationForm.customer_id || null,
        lead_id: communicationForm.lead_id || null,
        type: communicationForm.type || 'email',
        subject: (communicationForm.subject || '').trim(),
        content: communicationForm.content.trim(),
        date: communicationForm.date
      }
      await crmAPI.createCommunication(commData)
      await loadData()
      setShowCommunicationModal(false)
      setCommunicationForm({ customer_id: '', lead_id: '', type: 'email', subject: '', content: '', date: new Date().toISOString().split('T')[0] })
    } catch (err) {
      alert('Error saving communication: ' + (err.message || 'Unknown error'))
    }
  }

  const handleEdit = (customer) => {
    setSelectedCustomer(customer)
    setFormData(customer)
    setModalType('edit')
    setShowModal(true)
  }

  const handleLeadEdit = (lead) => {
    setSelectedLead(lead)
    setLeadForm({ ...lead, value: lead.value?.toString() || '' })
    setModalType('edit')
    setShowLeadModal(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      try {
        await crmAPI.deleteCustomer(id)
        await loadData()
      } catch (err) {
        alert('Error deleting customer: ' + err.message)
      }
    }
  }

  const handleLeadDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this lead?')) {
      try {
        await crmAPI.deleteLead(id)
        await loadData()
      } catch (err) {
        alert('Error deleting lead: ' + err.message)
      }
    }
  }

  const handleConvertLead = async (lead) => {
    if (window.confirm('Convert this lead to a customer?')) {
      try {
        await crmAPI.createCustomer({
          name: lead.name,
          email: lead.email,
          phone: lead.phone,
          company: lead.company,
          status: 'Active',
          notes: lead.notes
        })
        await crmAPI.updateLead(lead.id, { ...lead, status: 'Converted' })
        await loadData()
      } catch (err) {
        alert('Error converting lead: ' + err.message)
      }
    }
  }

  const filteredCustomers = customers.filter(c => 
    (filter === 'all' || c.status === filter) &&
    (c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
     c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
     c.phone.includes(searchTerm))
  )

  const filteredLeads = leads.filter(l => 
    (leadFilter === 'all' || l.status === leadFilter) &&
    (l.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
     l.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
     l.company.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const CustomersView = () => {
    if (loading) {
      return <div className="crm-container"><div className="loading-state">Loading...</div></div>
    }

    if (error) {
      return <div className="crm-container"><div className="error-state">Error: {error}</div></div>
    }

    return (
      <div className="crm-container">
        <div className="crm-header">
          <div className="header-content">
            <h2>Customers</h2>
            <button className="add-customer-btn" onClick={() => { setModalType('add'); setFormData({ name: '', email: '', phone: '', address: '', status: 'Active', company: '', notes: '' }); setShowModal(true) }}>
              <Plus size={20} />
              Add Customer
            </button>
          </div>
          <div className="search-box">
            <Search size={20} />
            <input
              type="text"
              placeholder="Search customers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="filter-tabs">
            <button className={filter === 'all' ? 'active' : ''} onClick={() => setFilter('all')}>All</button>
            <button className={filter === 'Active' ? 'active' : ''} onClick={() => setFilter('Active')}>Active</button>
            <button className={filter === 'Inactive' ? 'active' : ''} onClick={() => setFilter('Inactive')}>Inactive</button>
          </div>
        </div>

        <div className="customers-grid">
          {filteredCustomers.map(customer => (
            <div key={customer.id} className="customer-card">
              <div className="customer-header">
                <div className="customer-avatar">
                  {customer.name.charAt(0)}
                </div>
                <div className="customer-status">
                  <span className={`status-badge ${customer.status.toLowerCase()}`}>
                    {customer.status}
                  </span>
                </div>
              </div>
              <div className="customer-info">
                <h3>{customer.name}</h3>
                {customer.company && <p className="company-name">{customer.company}</p>}
                <div className="customer-details">
                  {customer.email && (
                    <div className="detail-item">
                      <Mail size={16} />
                      <span>{customer.email}</span>
                    </div>
                  )}
                  {customer.phone && (
                    <div className="detail-item">
                      <Phone size={16} />
                      <span>{customer.phone}</span>
                    </div>
                  )}
                  {customer.address && (
                    <div className="detail-item">
                      <MapPin size={16} />
                      <span>{customer.address}</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="customer-actions">
                <button className="edit-btn" onClick={() => handleEdit(customer)}>
                  <Edit size={16} />
                  Edit
                </button>
                <button className="delete-btn" onClick={() => handleDelete(customer.id)}>
                  <Trash2 size={16} />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {showModal && (
          <div className="modal-overlay" onClick={() => { setShowModal(false); setFormData({ name: '', email: '', phone: '', address: '', status: 'Active', company: '', notes: '' }); setSelectedCustomer(null); setModalType('add') }}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header-content">
                <h3>{modalType === 'add' ? 'Add Customer' : 'Edit Customer'}</h3>
                <button className="close-btn" onClick={() => { setShowModal(false); setFormData({ name: '', email: '', phone: '', address: '', status: 'Active', company: '', notes: '' }); setSelectedCustomer(null); setModalType('add') }}>
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={handleSubmit}>
                {formErrors.submit && (
                  <div className="form-error-banner">
                    {formErrors.submit}
                  </div>
                )}
                <div className="form-group">
                  <label>Name *</label>
                  <input 
                    type="text" 
                    required 
                    value={formData.name} 
                    onChange={(e) => {
                      setFormData({ ...formData, name: e.target.value })
                      if (formErrors.name) {
                        setFormErrors({ ...formErrors, name: null })
                      }
                    }}
                    className={formErrors.name ? 'error' : ''}
                  />
                  {formErrors.name && (
                    <span className="error-message">{formErrors.name}</span>
                  )}
                </div>
                <div className="form-row">
                <div className="form-group">
                  <label>Email</label>
                  <input 
                    type="email" 
                    value={formData.email} 
                    onChange={(e) => {
                      setFormData({ ...formData, email: e.target.value })
                      if (formErrors.email) {
                        setFormErrors({ ...formErrors, email: null })
                      }
                    }}
                    className={formErrors.email ? 'error' : ''}
                  />
                  {formErrors.email && (
                    <span className="error-message">{formErrors.email}</span>
                  )}
                </div>
                  <div className="form-group">
                    <label>Phone</label>
                    <input type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
                  </div>
                </div>
                <div className="form-group">
                  <label>Company</label>
                  <input type="text" value={formData.company} onChange={(e) => setFormData({ ...formData, company: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Address</label>
                  <input type="text" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Status</label>
                  <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })}>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Notes</label>
                  <textarea rows="3" value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} />
                </div>
                <div className="form-actions">
                  <button 
                    type="button" 
                    onClick={() => { 
                      setShowModal(false); 
                      setFormData({ name: '', email: '', phone: '', address: '', status: 'Active', company: '', notes: '' }); 
                      setFormErrors({})
                      setSelectedCustomer(null); 
                      setModalType('add') 
                    }}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </button>
                  <button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Saving...' : 'Save'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    )
  }

  const LeadsView = () => {
    if (loading) return <div className="crm-container"><div className="loading-state">Loading...</div></div>
    if (error) return <div className="crm-container"><div className="error-state">Error: {error}</div></div>

    return (
      <div className="crm-container">
        <div className="crm-header">
          <div className="header-content">
            <h2>Leads</h2>
            <button className="add-customer-btn" onClick={() => { setModalType('add'); setLeadForm({ name: '', email: '', phone: '', company: '', source: '', status: 'New', value: '', notes: '', assigned_to: '' }); setShowLeadModal(true) }}>
              <Plus size={20} />
              Add Lead
            </button>
          </div>
          <div className="search-box">
            <Search size={20} />
            <input type="text" placeholder="Search leads..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
          <div className="filter-tabs">
            <button className={leadFilter === 'all' ? 'active' : ''} onClick={() => setLeadFilter('all')}>All</button>
            <button className={leadFilter === 'New' ? 'active' : ''} onClick={() => setLeadFilter('New')}>New</button>
            <button className={leadFilter === 'Contacted' ? 'active' : ''} onClick={() => setLeadFilter('Contacted')}>Contacted</button>
            <button className={leadFilter === 'Qualified' ? 'active' : ''} onClick={() => setLeadFilter('Qualified')}>Qualified</button>
            <button className={leadFilter === 'Converted' ? 'active' : ''} onClick={() => setLeadFilter('Converted')}>Converted</button>
          </div>
        </div>

        <div className="leads-list">
          {filteredLeads.map(lead => (
            <div key={lead.id} className="lead-card">
              <div className="lead-header">
                <div>
                  <h3>{lead.name}</h3>
                  {lead.company && <p className="company-name">{lead.company}</p>}
                </div>
                <span className={`status-badge lead-${lead.status.toLowerCase()}`}>{lead.status}</span>
              </div>
              <div className="lead-details">
                {lead.email && <div className="detail-item"><Mail size={14} /> {lead.email}</div>}
                {lead.phone && <div className="detail-item"><Phone size={14} /> {lead.phone}</div>}
                {lead.source && <div className="detail-item"><span>Source: {lead.source}</span></div>}
                {lead.value > 0 && <div className="detail-item"><DollarSign size={14} /> ₹{lead.value.toLocaleString()}</div>}
              </div>
              <div className="lead-actions">
                {lead.status !== 'Converted' && (
                  <button className="convert-btn" onClick={() => handleConvertLead(lead)}>
                    <CheckCircle size={16} />
                    Convert
                  </button>
                )}
                <button className="edit-btn" onClick={() => handleLeadEdit(lead)}>
                  <Edit size={16} />
                  Edit
                </button>
                <button className="delete-btn" onClick={() => handleLeadDelete(lead.id)}>
                  <Trash2 size={16} />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {showLeadModal && (
          <div className="modal-overlay" onClick={() => { setShowLeadModal(false); setLeadForm({ name: '', email: '', phone: '', company: '', source: '', status: 'New', value: '', notes: '', assigned_to: '' }); setSelectedLead(null); setModalType('add') }}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header-content">
                <h3>{modalType === 'add' ? 'Add Lead' : 'Edit Lead'}</h3>
                <button className="close-btn" onClick={() => { setShowLeadModal(false); setLeadForm({ name: '', email: '', phone: '', company: '', source: '', status: 'New', value: '', notes: '', assigned_to: '' }); setSelectedLead(null); setModalType('add') }}>
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={handleLeadSubmit}>
                <div className="form-group">
                  <label>Name *</label>
                  <input type="text" required value={leadForm.name} onChange={(e) => setLeadForm({ ...leadForm, name: e.target.value })} />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Email</label>
                    <input type="email" value={leadForm.email} onChange={(e) => setLeadForm({ ...leadForm, email: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label>Phone</label>
                    <input type="tel" value={leadForm.phone} onChange={(e) => setLeadForm({ ...leadForm, phone: e.target.value })} />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Company</label>
                    <input type="text" value={leadForm.company} onChange={(e) => setLeadForm({ ...leadForm, company: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label>Source</label>
                    <input type="text" value={leadForm.source} onChange={(e) => setLeadForm({ ...leadForm, source: e.target.value })} />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Status</label>
                    <select value={leadForm.status} onChange={(e) => setLeadForm({ ...leadForm, status: e.target.value })}>
                      <option value="New">New</option>
                      <option value="Contacted">Contacted</option>
                      <option value="Qualified">Qualified</option>
                      <option value="Converted">Converted</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Value (₹)</label>
                    <input type="number" value={leadForm.value} onChange={(e) => setLeadForm({ ...leadForm, value: e.target.value })} />
                  </div>
                </div>
                <div className="form-group">
                  <label>Assigned To</label>
                  <input type="text" value={leadForm.assigned_to} onChange={(e) => setLeadForm({ ...leadForm, assigned_to: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Notes</label>
                  <textarea rows="3" value={leadForm.notes} onChange={(e) => setLeadForm({ ...leadForm, notes: e.target.value })} />
                </div>
                <div className="form-actions">
                  <button type="button" onClick={() => { setShowLeadModal(false); setLeadForm({ name: '', email: '', phone: '', company: '', source: '', status: 'New', value: '', notes: '', assigned_to: '' }); setSelectedLead(null); setModalType('add') }}>Cancel</button>
                  <button type="submit">Save</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    )
  }

  const ActivitiesView = () => {
    if (loading) return <div className="crm-container"><div className="loading-state">Loading...</div></div>
    if (error) return <div className="crm-container"><div className="error-state">Error: {error}</div></div>

    return (
      <div className="crm-container">
        <div className="crm-header">
          <div className="header-content">
            <h2>Activities</h2>
            <button className="add-customer-btn" onClick={() => { setActivityForm({ customer_id: '', lead_id: '', type: 'call', title: '', description: '', date: new Date().toISOString().split('T')[0], time: '', status: 'Pending' }); setShowActivityModal(true) }}>
              <Plus size={20} />
              Add Activity
            </button>
          </div>
        </div>

        <div className="activities-list">
          {activities.map(activity => (
            <div key={activity.id} className="activity-card">
              <div className="activity-header">
                <div className="activity-type-icon">
                  {activity.type === 'call' && <Phone size={20} />}
                  {activity.type === 'meeting' && <Calendar size={20} />}
                  {activity.type === 'email' && <Mail size={20} />}
                  {activity.type === 'task' && <CheckCircle size={20} />}
                </div>
                <div className="activity-info">
                  <h3>{activity.title}</h3>
                  <p className="activity-meta">
                    {new Date(activity.date).toLocaleDateString()} {activity.time && `• ${activity.time}`}
                  </p>
                </div>
                <span className={`status-badge ${activity.status.toLowerCase()}`}>{activity.status}</span>
              </div>
              {activity.description && <p className="activity-description">{activity.description}</p>}
            </div>
          ))}
        </div>

        {showActivityModal && (
          <div className="modal-overlay" onClick={() => { setShowActivityModal(false); setActivityForm({ customer_id: '', lead_id: '', type: 'call', title: '', description: '', date: new Date().toISOString().split('T')[0], time: '', status: 'Pending' }) }}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header-content">
                <h3>Add Activity</h3>
                <button className="close-btn" onClick={() => { setShowActivityModal(false); setActivityForm({ customer_id: '', lead_id: '', type: 'call', title: '', description: '', date: new Date().toISOString().split('T')[0], time: '', status: 'Pending' }) }}>
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={handleActivitySubmit}>
                <div className="form-group">
                  <label>Type *</label>
                  <select value={activityForm.type} onChange={(e) => setActivityForm({ ...activityForm, type: e.target.value })}>
                    <option value="call">Call</option>
                    <option value="meeting">Meeting</option>
                    <option value="email">Email</option>
                    <option value="task">Task</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Title *</label>
                  <input type="text" required value={activityForm.title} onChange={(e) => setActivityForm({ ...activityForm, title: e.target.value })} />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Customer</label>
                    <select value={activityForm.customer_id || ''} onChange={(e) => setActivityForm({ ...activityForm, customer_id: e.target.value })}>
                      <option value="">Select customer</option>
                      {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Lead</label>
                    <select value={activityForm.lead_id || ''} onChange={(e) => setActivityForm({ ...activityForm, lead_id: e.target.value })}>
                      <option value="">Select lead</option>
                      {leads.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
                    </select>
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Date *</label>
                    <input type="date" required value={activityForm.date} onChange={(e) => setActivityForm({ ...activityForm, date: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label>Time</label>
                    <input type="time" value={activityForm.time} onChange={(e) => setActivityForm({ ...activityForm, time: e.target.value })} />
                  </div>
                </div>
                <div className="form-group">
                  <label>Status</label>
                  <select value={activityForm.status} onChange={(e) => setActivityForm({ ...activityForm, status: e.target.value })}>
                    <option value="Pending">Pending</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <textarea rows="3" value={activityForm.description} onChange={(e) => setActivityForm({ ...activityForm, description: e.target.value })} />
                </div>
                <div className="form-actions">
                  <button type="button" onClick={() => { setShowActivityModal(false); setActivityForm({ customer_id: '', lead_id: '', type: 'call', title: '', description: '', date: new Date().toISOString().split('T')[0], time: '', status: 'Pending' }) }}>Cancel</button>
                  <button type="submit">Save</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    )
  }

  const CommunicationsView = () => {
    if (loading) return <div className="crm-container"><div className="loading-state">Loading...</div></div>
    if (error) return <div className="crm-container"><div className="error-state">Error: {error}</div></div>

    return (
      <div className="crm-container">
        <div className="crm-header">
          <div className="header-content">
            <h2>Communications</h2>
            <button className="add-customer-btn" onClick={() => { setCommunicationForm({ customer_id: '', lead_id: '', type: 'email', subject: '', content: '', date: new Date().toISOString().split('T')[0] }); setShowCommunicationModal(true) }}>
              <Plus size={20} />
              Add Communication
            </button>
          </div>
        </div>

        <div className="communications-list">
          {communications.map(comm => (
            <div key={comm.id} className="communication-card">
              <div className="communication-header">
                <div className="comm-type-icon">
                  {comm.type === 'email' && <Mail size={20} />}
                  {comm.type === 'call' && <Phone size={20} />}
                  {comm.type === 'sms' && <MessageSquare size={20} />}
                </div>
                <div className="communication-info">
                  <h3>{comm.subject || 'No Subject'}</h3>
                  <p className="comm-meta">{new Date(comm.date).toLocaleDateString()} • {comm.type}</p>
                </div>
              </div>
              <p className="communication-content">{comm.content}</p>
            </div>
          ))}
        </div>

        {showCommunicationModal && (
          <div className="modal-overlay" onClick={() => { setShowCommunicationModal(false); setCommunicationForm({ customer_id: '', lead_id: '', type: 'email', subject: '', content: '', date: new Date().toISOString().split('T')[0] }) }}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header-content">
                <h3>Add Communication</h3>
                <button className="close-btn" onClick={() => { setShowCommunicationModal(false); setCommunicationForm({ customer_id: '', lead_id: '', type: 'email', subject: '', content: '', date: new Date().toISOString().split('T')[0] }) }}>
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={handleCommunicationSubmit}>
                <div className="form-group">
                  <label>Type *</label>
                  <select value={communicationForm.type} onChange={(e) => setCommunicationForm({ ...communicationForm, type: e.target.value })}>
                    <option value="email">Email</option>
                    <option value="call">Call</option>
                    <option value="sms">SMS</option>
                  </select>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Customer</label>
                    <select value={communicationForm.customer_id || ''} onChange={(e) => setCommunicationForm({ ...communicationForm, customer_id: e.target.value })}>
                      <option value="">Select customer</option>
                      {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Lead</label>
                    <select value={communicationForm.lead_id || ''} onChange={(e) => setCommunicationForm({ ...communicationForm, lead_id: e.target.value })}>
                      <option value="">Select lead</option>
                      {leads.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label>Subject</label>
                  <input type="text" value={communicationForm.subject} onChange={(e) => setCommunicationForm({ ...communicationForm, subject: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Content *</label>
                  <textarea rows="5" required value={communicationForm.content} onChange={(e) => setCommunicationForm({ ...communicationForm, content: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Date *</label>
                  <input type="date" required value={communicationForm.date} onChange={(e) => setCommunicationForm({ ...communicationForm, date: e.target.value })} />
                </div>
                <div className="form-actions">
                  <button type="button" onClick={() => { setShowCommunicationModal(false); setCommunicationForm({ customer_id: '', lead_id: '', type: 'email', subject: '', content: '', date: new Date().toISOString().split('T')[0] }) }}>Cancel</button>
                  <button type="submit">Save</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    )
  }

  const AnalyticsView = () => {
    if (loading) return <div className="crm-container"><div className="loading-state">Loading...</div></div>
    if (error) return <div className="crm-container"><div className="error-state">Error: {error}</div></div>
    if (!analytics) return <div className="crm-container"><div className="loading-state">No analytics data</div></div>

    return (
      <div className="crm-container">
        <div className="crm-header">
          <h2>CRM Analytics</h2>
        </div>
        <div className="analytics-grid">
          <div className="analytics-card">
            <Users size={24} />
            <h3>Total Customers</h3>
            <p className="analytics-value">{analytics.totalCustomers}</p>
            <p className="analytics-sub">Active: {analytics.activeCustomers}</p>
          </div>
          <div className="analytics-card">
            <UserCheck size={24} />
            <h3>Total Leads</h3>
            <p className="analytics-value">{analytics.totalLeads}</p>
            <p className="analytics-sub">Converted: {analytics.convertedLeads}</p>
          </div>
          <div className="analytics-card">
            <DollarSign size={24} />
            <h3>Total Value</h3>
            <p className="analytics-value">₹{analytics.totalValue.toLocaleString()}</p>
          </div>
          <div className="analytics-card">
            <AlertCircle size={24} />
            <h3>Pending Activities</h3>
            <p className="analytics-value">{analytics.pendingActivities}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <Routes>
      <Route path="/" element={<CustomersView />} />
      <Route path="/leads" element={<LeadsView />} />
      <Route path="/activities" element={<ActivitiesView />} />
      <Route path="/communications" element={<CommunicationsView />} />
      <Route path="/analytics" element={<AnalyticsView />} />
    </Routes>
  )
}

export default CRM
